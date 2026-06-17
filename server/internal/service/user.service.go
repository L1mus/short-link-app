package service

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/L1mus/short-link-app/server/internal/appError"
	"github.com/L1mus/short-link-app/server/internal/cache"
	"github.com/L1mus/short-link-app/server/internal/dto"
	"github.com/L1mus/short-link-app/server/internal/repository"
	"github.com/jackc/pgx/v5"
	"github.com/redis/go-redis/v9"
)

type UserService struct {
	userRepository *repository.UserRepository
	rdb            *redis.Client
}

func NewUserService(userRepository *repository.UserRepository, rdb *redis.Client) *UserService {
	return &UserService{
		userRepository: userRepository,
		rdb:            rdb,
	}
}

func (s *UserService) GetUserProfile(ctx context.Context, id int) (dto.GetUserProfileDTO, error) {
	rkey := fmt.Sprintf("user:profile:%d", id)

	var cachedProfile dto.GetUserProfileDTO

	found, err := cache.GetFromCache(ctx, s.rdb, rkey, &cachedProfile)
	if err == nil && found {
		log.Printf("Cache HIT for key: %s Retrieving data from Redis...", rkey)
		return cachedProfile, nil
	}
	if err != nil {
		log.Printf("Redis error while retrieving cache: %v", err)
	}

	log.Printf("Cache MISS for key: %s Fetching data from DB...", rkey)

	data, err := s.userRepository.GetUserProfile(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return dto.GetUserProfileDTO{}, appError.UserNotFound
		}
		return dto.GetUserProfileDTO{}, err
	}

	profileDTO := dto.GetUserProfileDTO{
		Id:                data.Id,
		FullName:          data.FullName,
		Email:             data.Email,
		ProfilePictureURL: data.ProfilePictureURL,
	}

	cacheTTL := 1 * time.Hour
	err = cache.SaveToCache(ctx, s.rdb, rkey, profileDTO, cacheTTL)
	if err != nil {
		log.Printf("Failed to save data: %v", err)
	}

	return profileDTO, nil
}

func (s *UserService) EditProfile(ctx context.Context, id int, req dto.EditProfileRequest, fileHeader *multipart.FileHeader) error {
	newProfileURL := req.ProfilePictureURL
	if fileHeader != nil {
		/*
			validasi ukuran
			buat format file apa saja yang bisa di unggah
			cek format content
			hapus source lama
			buat format penamaan file yang di unggah dan
			save ke folder yang dibuat
			buat file path gambar
		*/
		if fileHeader.Size > 2*1024*1024 {
			return appError.FileTooLarge
		}

		file, err := fileHeader.Open()
		if err != nil {
			return err
		}
		defer func(file multipart.File) {
			_ = file.Close()
		}(file)

		buf := make([]byte, 512)
		if _, err := file.Read(buf); err != nil {
			return err
		}
		mimeType := http.DetectContentType(buf)

		allowedTypes := map[string]string{
			"image/jpeg": ".jpg",
			"image/png":  ".png",
			"image/webp": ".webp",
		}
		ext, allowed := allowedTypes[mimeType]
		if !allowed {
			return appError.FileTypeNotAllowed
		}

		oldProfile, err := s.userRepository.GetUserProfile(ctx, id)
		if err == nil && oldProfile.ProfilePictureURL != nil && *oldProfile.ProfilePictureURL != "" {
			oldPath := filepath.Join("public", *oldProfile.ProfilePictureURL)
			_ = os.Remove(oldPath)
		}

		filename := fmt.Sprintf("user_%d_%d%s", id, time.Now().UnixNano(), ext)
		savePath := filepath.Join("public", "img", filename)

		if _, err := file.Seek(0, io.SeekStart); err != nil {
			return err
		}

		dst, err := os.Create(savePath)
		if err != nil {
			return err
		}
		defer func(dst *os.File) {
			_ = dst.Close()
		}(dst)

		if _, err := io.Copy(dst, file); err != nil {
			return err
		}

		newProfileURL = new(fmt.Sprintf("/img/%s", filename))
	}

	req.ProfilePictureURL = newProfileURL

	err := s.userRepository.UpdateProfile(ctx, id, req)
	if err != nil {
		return err
	}

	cacheKey := fmt.Sprintf("user:profile:%d", id)
	_ = cache.DelFromCache(ctx, s.rdb, cacheKey)

	return nil
}
