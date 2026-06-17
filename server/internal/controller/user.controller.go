package controller

import (
	"errors"
	"net/http"

	"github.com/L1mus/short-link-app/server/internal/appError"
	"github.com/L1mus/short-link-app/server/internal/dto"
	"github.com/L1mus/short-link-app/server/internal/response"
	"github.com/L1mus/short-link-app/server/internal/service"
	"github.com/L1mus/short-link-app/server/pkg"
	"github.com/gin-gonic/gin"
)

type UserController struct {
	userService *service.UserService
}

func NewUserController(userService *service.UserService) *UserController {
	return &UserController{
		userService: userService,
	}
}

// GetUserProfile
//
// @Summary      Get user Profile
// @Description  Get authenticated user's profile details
// @Tags         users
// @Accept       json
// @Produce      json
// @Security	 APIKeyAuth
// @Success      200  {object}  dto.ResponseSuccess{data=dto.GetUserProfileDTO}
// @Failure      401  {object}  dto.ResponseError "Unauthorized"
// @Failure      404  {object}  dto.ResponseError "User Not Found"
// @Failure      500  {object}  dto.ResponseError "Internal Server Error"
// @Router       /users/profile [get]
func (c *UserController) GetUserProfile(ctx *gin.Context) {
	token, _ := ctx.Get("claims")
	claims := token.(pkg.Claims)
	res, err := c.userService.GetUserProfile(ctx.Request.Context(), claims.Id)
	if err != nil {
		if errors.Is(err, appError.UserNotFound) {
			response.Error(ctx, 404, err.Error())
			return
		}
		response.Error(ctx, 500, err.Error())
		return
	}
	response.Success(ctx, 200, "Get data success", res)
}

// UpdateProfile
//
// @Summary      Update User Profile
// @Description  Update full name, phone number, and avatar image simultaneously using multipart/form-data
// @Tags         users
// @Accept       multipart/form-data
// @Produce      json
// @Security     APIKeyAuth
// @Param        full_name  formData  string  false  "Full Name"
// @Param        picture    formData  file    false  "Avatar profile image (jpg, png, max 2MB)"
// @Success      200        {object}  dto.ResponseSuccess
// @Failure      400        {object}  dto.ResponseError "Bad Request / Invalid Format"
// @Failure      401        {object}  dto.ResponseError "Unauthorized"
// @Failure      422        {object}  dto.ResponseError "File to large || File type not allowed"
// @Failure      500        {object}  dto.ResponseError "Internal Server Error"
// @Router       /users/profile [patch]
func (c *UserController) UpdateProfile(ctx *gin.Context) {
	token, _ := ctx.Get("claims")
	claims := token.(pkg.Claims)

	var req dto.EditProfileRequest
	if err := ctx.ShouldBind(&req); err != nil {
		response.Error(ctx, http.StatusBadRequest, err.Error())
		return
	}

	fileHeader, err := ctx.FormFile("profile_picture_url")
	if err != nil && !errors.Is(err, http.ErrMissingFile) {
		response.Error(ctx, http.StatusBadRequest, "Invalid Format")
		return
	}

	err = c.userService.EditProfile(ctx.Request.Context(), claims.Id, req, fileHeader)
	if err != nil {
		if errors.Is(err, appError.FileTooLarge) || errors.Is(err, appError.FileTypeNotAllowed) {
			response.Error(ctx, 422, err.Error())
			return
		}
		response.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(ctx, http.StatusOK, "Profile successfully updated", nil)
}
