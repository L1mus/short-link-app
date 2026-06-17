package dto

type RegisterRequest struct {
	Email           string `json:"email" binding:"required,email" example:"example@mail.com"`
	Password        string `json:"password" binding:"required,min=8" example:"example123"`
	ConfirmPassword string `json:"confirm_password" binding:"required,eqfield=Password" example:"example123"`
}

type LoginRequest struct {
	Email    string `json:"email"  binding:"required,email" example:"example@mail.com"`
	Password string `json:"password" binding:"required" example:"example123"`
}

type PageQuery struct {
	Page   string `form:"page" default:"1" example:"1"`
	Search string `form:"search" example:"John Doe"`
}

type EditProfileRequest struct {
	FullName          string  `json:"full_name"           form:"full_name"`
	Phone             *string `json:"phone"               form:"phone"`
	ProfilePictureURL *string `json:"profile_picture_url" form:"profile_picture_url"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token"            binding:"required"`
	NewPassword string `json:"new_password"     binding:"required,min=8"`
}

type CreateShortLinkRequest struct {
	OriginalUrl  string `json:"original_url" binding:"required,min=10"`
	OptionalSlug string `json:"optional_slug" binding:"omitempty,min=6"`
}
