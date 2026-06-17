package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	_ "github.com/L1mus/short-link-app/server/docs"
	"github.com/L1mus/short-link-app/server/internal/config"
	"github.com/L1mus/short-link-app/server/internal/router"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// @title           SHORT-LINK API
// @version         1.0
// @description     This is a backend project for a web application called SHORT-LINK .

// @contact.name   Ali Mustadji
// @contact.url    https://github.com/L1mus
// @contact.email  limustadji@gmail.com

// @license.name  MIT

// @host      localhost:80/api
// @BasePath  /

// @securityDefinitions.apiKey  ApiKeyAuth
// @in header
// @name Authorization
// @description Bearer token used for authorization
func main() {
	router := gin.Default()
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	router.Run() // listens on 0.0.0.0:8080 by default
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading env. \ncause: %s", err.Error())
	}
	if err := os.MkdirAll(filepath.Join("public", "img"), os.ModePerm); err != nil {
		log.Fatalf("Failed to create upload directory: %s", err.Error())
	}
	// inisialisasi
	app := gin.Default()
	// run
	app.Run(fmt.Sprintf("%s:%s", os.Getenv("APP_HOST"), os.Getenv("APP_PORT")))
}
