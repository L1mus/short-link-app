package service

import (
	"context"
	"errors"
	"fmt"
	"log"
	"math"
	"strconv"

	"github.com/L1mus/short-link-app/server/internal/appError"
	"github.com/L1mus/short-link-app/server/internal/dto"
	"github.com/L1mus/short-link-app/server/internal/repository"
	"github.com/L1mus/short-link-app/server/pkg"
	"github.com/jackc/pgx/v5"
)

type LinkService struct {
	linkRepository *repository.LinkRepository
}

func NewLinkService(linkRepository *repository.LinkRepository) *LinkService {
	return &LinkService{
		linkRepository: linkRepository,
	}
}

func (s *LinkService) GetAllLink(ctx context.Context, id int, req dto.PageQuery) ([]dto.GetAllLinkResponse, dto.PaginationMetaData, error) {
	data, err := s.linkRepository.GetAllLink(ctx, id, req)
	if err != nil {
		return nil, dto.PaginationMetaData{}, err
	}

	if len(data) == 0 {
		return []dto.GetAllLinkResponse{}, dto.PaginationMetaData{}, nil
	}

	totalData := data[0].TotalCount
	limit := 10
	totalPage := int(math.Ceil(float64(totalData) / float64(limit)))
	page := 1

	if req.Page != "" {
		if p, err := strconv.Atoi(req.Page); err == nil && p > 0 {
			page = p
		}
	}

	prevLink := ""
	nextLink := ""
	if page > 1 {
		prevLink = fmt.Sprintf("http://localhost:8080/links?search=%s&page=%d", req.Search, page-1)
	}
	if page < totalPage {
		nextLink = fmt.Sprintf("http://localhost:8080/links?search=%s&page=%d", req.Search, page+1)
	}
	var links []dto.GetAllLinkResponse
	for _, link := range data {
		links = append(links, dto.GetAllLinkResponse{
			ID:          link.ID,
			UserId:      link.UserId,
			ShortLink:   link.ShortLink,
			OriginalURL: link.OriginalURL,
			Slug:        link.Slug,
			ClickCount:  link.ClickCount,
			CreatedAt:   link.CreatedAt,
		})
	}
	metaDataPAgination := dto.PaginationMetaData{
		TotalPages: totalPage,
		TotalData:  totalData,
		NextLink:   nextLink,
		PrevLink:   prevLink,
	}
	return links, metaDataPAgination, nil
}

func (s *LinkService) CreateShortLink(ctx context.Context, userID int, req dto.CreateShortLinkRequest) (dto.CreateLinkResponse, error) {
	if req.OptionalSlug != "" {
		if err := pkg.ValidateCustomSlug(req.OptionalSlug); err != nil {
			return dto.CreateLinkResponse{}, err
		}

		exist, err := s.linkRepository.CheckLink(ctx, req.OptionalSlug)
		if err != nil {
			return dto.CreateLinkResponse{}, err
		}
		if exist {
			return dto.CreateLinkResponse{}, appError.LinkAlreadyExists
		}

		link, err := s.linkRepository.CreateShortLink(ctx, userID, req.OptionalSlug, req.OriginalUrl)
		if err != nil {
			return dto.CreateLinkResponse{}, err
		}
		return dto.CreateLinkResponse{
			ID:          link.ID,
			OriginalURL: link.OriginalURL,
			Slug:        link.Slug,
			ShortURL:    fmt.Sprintf("short.link/%s", link.Slug),
		}, nil
	}

	slug, err := pkg.GenSlug()
	if err != nil {
		return dto.CreateLinkResponse{}, err
	}
	exist, err := s.linkRepository.CheckLink(ctx, slug)
	if err != nil {
		return dto.CreateLinkResponse{}, err
	}
	if exist {
		return dto.CreateLinkResponse{}, appError.LinkAlreadyExists
	}
	link, err := s.linkRepository.CreateShortLink(ctx, userID, slug, req.OriginalUrl)
	if err != nil {
		return dto.CreateLinkResponse{}, err
	}
	return dto.CreateLinkResponse{
		ID:          link.ID,
		OriginalURL: link.OriginalURL,
		Slug:        link.Slug,
		ShortURL:    fmt.Sprintf("short.link/%s", link.Slug),
	}, nil
}

func (s *LinkService) DeleteLink(ctx context.Context, linkID int) error {
	err := s.linkRepository.CheckDeletedLinkById(ctx, linkID)
	if errors.Is(err, pgx.ErrNoRows) {
		return appError.LinkNotFound
	}
	if err != nil {
		return err
	}

	err = s.linkRepository.DeleteLinkById(ctx, linkID)
	if err != nil {
		return err
	}

	return nil
}

func (s *LinkService) RedirectLink(ctx context.Context, slug string) (string, error) {
	data, err := s.linkRepository.CheckOriginalLink(ctx, slug)
	if err != nil {
		return "", appError.SlugNotFound
	}
	if data.OriginalURL == "" {
		return "", appError.OriginalLinkNotFound
	}

	// background process
	go func() {
		err := s.linkRepository.ClickCountIncrement(context.Background(), slug)
		if err != nil {
			log.Printf("Failed to increment click count for slug %s: %v\n", slug, err)
		}
	}()

	return data.OriginalURL, nil
}
