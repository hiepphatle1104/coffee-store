package main

import (
	"api/internal/database"
	"api/internal/handler"
	"api/internal/repository"
	"api/internal/service"
	"context"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
)

func main() {
	// Database
	database := database.NewConnection()
	defer func() {
		if err := database.Client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	r := chi.NewRouter()
	manager := handler.NewWSManager()
	go manager.Run()

	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// InititalServer
	itemRepo := repository.NewItemRepo(database)
	itemService := service.NewItemService(itemRepo)
	itemHandler := handler.NewItemHandler(itemService, manager)

	orderRepo := repository.NewOrderRepo(database)
	orderService := service.NewOrderService(orderRepo, itemRepo)
	orderHandler := handler.NewOrderHandler(orderService, manager)

	r.Route("/v1", func(r chi.Router) {
		r.Route("/orders", func(r chi.Router) {
			r.Post("/", orderHandler.NewOrder)
			r.Get("/", orderHandler.GetOrders)
		})

		r.Route("/items", func(r chi.Router) {
			r.Post("/", itemHandler.NewItem)
			r.Get("/", itemHandler.GetItems)
		})

		r.Get("/ws", manager.HandleConnection)
	})

	fmt.Println("Server đang chạy ở port 8080")
	http.ListenAndServe(":8080", r)
}
