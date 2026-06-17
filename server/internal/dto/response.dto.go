package dto

import (
	"time"
)

type ResponseSuccess struct {
	Success string `json:"Success" example:"true"`
	Message string `json:"message" example:"Login success"`
}

type ResponseError struct {
	Status  string `json:"status" example:"error"`
	Message string `json:"message" example:"Failed get data/internal server error"`
	Error   string `json:"error" example:"internal server error/bad request"`
}

type RegisterResponse struct {
	ResponseSuccess
	Data RegisterDTO
}

type LoginResponse struct {
	ResponseSuccess
	Data LoginDTO
}

type GetUserProfileResponse struct {
	ResponseSuccess
	Data GetUserProfileDTO
}

type RegisterDTO struct {
	Id        int       `json:"id" example:"101"`
	FullName  *string   `json:"full_name" example:"John Doe"`
	Email     string    `json:"email" example:"example@mail.com"`
	CreatedAt time.Time `json:"created-at" example:"2026-05-19T23:35:11.88652Z"`
}

type LoginDTO struct {
	Email string `json:"email" example:"John.Doe@mail.com"`
	Token string `json:"token"`
}

type GetUserProfileDTO struct {
	Id                int     `json:"id" example:"1"`
	FullName          *string `json:"full_name" example:"John Doe"`
	Email             string  `json:"email" example:"example@mail.com"`
	ProfilePictureURL *string `json:"profile_picture_url" example:"https://example.com"`
}

type PaginationMetaData struct {
	TotalPages int    `json:"total-page,omitempty"`
	TotalData  int    `json:"total_data,omitempty"`
	PageSize   int    `json:"page_size,omitempty"`
	NextLink   string `json:"next_page,omitempty"`
	PrevLink   string `json:"prev_page,omitempty"`
}

type ForgotPasswordDTO struct {
	Token     string    `json:"token"`
	ExpiredAt time.Time `json:"expired_at"`
}

type GetAllLinkResponse struct {
	UserId      int       `json:"user_id"`
	ShortLink   string    `json:"short_link"`
	OriginalURL string    `json:"original_link"`
	ClickCount  int       `json:"click_count"`
	CreatedAt   time.Time `json:"created_at"`
}
