package controller

import (
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/L1mus/short-link-app/server/internal/appError"
	"github.com/L1mus/short-link-app/server/internal/dto"
	"github.com/L1mus/short-link-app/server/internal/response"
	"github.com/L1mus/short-link-app/server/internal/service"
	"github.com/L1mus/short-link-app/server/pkg"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type LinkController struct {
	linkService *service.LinkService
}

func NewLinkController(linkService *service.LinkService) *LinkController {
	return &LinkController{
		linkService: linkService,
	}
}

func (c *LinkController) GetAllLinks(ctx *gin.Context) {
	// bentuk url links?search=&page
	// binding request query
	var req dto.PageQuery
	if err := ctx.ShouldBindQuery(&req); err != nil {
		response.Error(ctx, http.StatusBadRequest, "bad request")
		return
	}
	// default page jika request page tidak string kosong
	// get all data, get total pages
	// ambil seluruh data dengan mengirim request sebagai params
	// inisialisasi nextpage dan prevpage
	// format page string dengan Sprintf(/links?search=&page=%d%s)
	// response metadata

	token, _ := ctx.Get("claims")
	claims := token.(pkg.Claims)

	res, metaData, err := c.linkService.GetAllLink(ctx.Request.Context(), claims.Id, req)
	if err != nil {
		response.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	response.SuccessWithMetaData(ctx, http.StatusOK, "Get data success", res, metaData)
}

func (c *LinkController) CreateShortLink(ctx *gin.Context) {
	token, _ := ctx.Get("claims")
	claims := token.(pkg.Claims)

	var payload dto.CreateShortLinkRequest

	if err := ctx.ShouldBindWith(&payload, binding.JSON); err != nil {
		response.Error(ctx, http.StatusBadRequest, "bad request")
		return
	}
	res, err := c.linkService.CreateShortLink(ctx.Request.Context(), claims.Id, payload)
	if err != nil {
		if errors.Is(err, appError.LinkAlreadyExists) {
			response.Error(ctx, http.StatusConflict, err.Error())
			return
		}
		response.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(ctx, http.StatusCreated, "Link created successfully", res)
}

func (c *LinkController) DeleteShortLink(ctx *gin.Context) {
	_, exist := ctx.Get("claims")
	if !exist {
		response.Error(ctx, http.StatusUnauthorized, "unauthorized")
	}

	linkIdStr := ctx.Param("id")
	linkId, err := strconv.Atoi(linkIdStr)
	if err != nil {
		log.Println("failed to conversion")
	}
	err = c.linkService.DeleteLink(ctx, linkId)
	if err != nil {
		if errors.Is(err, appError.LinkNotFound) {
			response.Error(ctx, http.StatusUnprocessableEntity, err.Error())
			return
		}
		response.Error(ctx, http.StatusInternalServerError, "internal server error")
		return
	}
	response.Success(ctx, http.StatusOK, "delete success", nil)
}
