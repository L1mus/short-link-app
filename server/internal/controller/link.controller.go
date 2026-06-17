package controller

import (
	"github.com/L1mus/short-link-app/server/internal/dto"
	"github.com/L1mus/short-link-app/server/internal/response"
	"github.com/L1mus/short-link-app/server/internal/service"
	"github.com/L1mus/short-link-app/server/pkg"
	"github.com/gin-gonic/gin"
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
		response.Error(ctx, 400, "bad request")
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
		response.Error(ctx, 500, err.Error())
		return
	}

	response.SuccessWithMetaData(ctx, 200, "Get data success", res, metaData)
}
