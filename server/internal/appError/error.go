package appError

import "errors"

var (
	EmailAlreadyExists          = errors.New("email already exists")
	InvalidEmailFormat          = errors.New("invalid email format")
	EmailOrPassWrong            = errors.New("wrong email or password")
	UserNotFound                = errors.New("profile not found")
	FileTooLarge                = errors.New("file size exceeds 2MB limit")
	FileTypeNotAllowed          = errors.New("only jpg, png, and webp are allowed")
	TokenDoesntExpired          = errors.New("token does not have expiration claim")
	InvalidateSession           = errors.New("failed to invalidate session")
	ForgotPasswordTokenNotFound = errors.New("token not found")
	ForgotPasswordTokenExpired  = errors.New("token has expired")
	ForgotPasswordTokenUsed     = errors.New("token has already been used")
	LinkAlreadyExists           = errors.New("link already exists")
	LinkNotFound                = errors.New("link not found or already deleted")
	OriginalLinkNotFound        = errors.New("original link not found")
	SlugNotFound                = errors.New("slug not found")
	MinimumSlugLength           = errors.New("custom slug minimum 3 characters")
	MaximumSlugLength           = errors.New("custom slug maximum 50 characters")
	InvalidSlug                 = errors.New("custom slug can only contain letters, numbers, and hyphens")
	UsingReserveWord            = errors.New("slug is reserved and cannot be used")
)
