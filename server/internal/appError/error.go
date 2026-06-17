package appError

import "errors"

var (
	EmailAlreadyExists          = errors.New("email already exists")
	InvalidEmailFormat          = errors.New("invalid email format")
	EmailOrPassWrong            = errors.New("wrong email or password")
	UserNotFound                = errors.New("profile not found")
	TokenDoesntExpired          = errors.New("token does not have expiration claim")
	InvalidateSession           = errors.New("failed to invalidate session")
	ForgotPasswordTokenNotFound = errors.New("token not found")
	ForgotPasswordTokenExpired  = errors.New("token has expired")
	ForgotPasswordTokenUsed     = errors.New("token has already been used")
)
