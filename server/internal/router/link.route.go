package router

import (
	"github.com/L1mus/short-link-app/server/internal/controller"
	"github.com/L1mus/short-link-app/server/internal/middleware"
	"github.com/L1mus/short-link-app/server/internal/repository"
	"github.com/L1mus/short-link-app/server/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

func LinkRouter(router *gin.RouterGroup, db *pgxpool.Pool, rdb *redis.Client) {
	linkRouter := router.Group("/links")
	linkRouter.Use(middleware.VerifyToken, middleware.CheckBlacklist(rdb))

	linkRepository := repository.NewLinkRepository(db)
	linkService := service.NewLinkService(linkRepository)
	linkController := controller.NewLinkController(linkService)

	linkRouter.GET("/", linkController.GetAllLinks)
	linkRouter.POST("/", linkController.CreateShortLink)
	linkRouter.DELETE("/:id", linkController.DeleteShortLink)
}
