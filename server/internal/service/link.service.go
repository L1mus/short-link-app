package service

import (
	"context"
	"fmt"
	"math"
	"strconv"

	"github.com/L1mus/short-link-app/server/internal/dto"
	"github.com/L1mus/short-link-app/server/internal/repository"
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
			UserId:      link.UserId,
			ShortLink:   link.ShortLink,
			OriginalURL: link.OriginalURL,
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
