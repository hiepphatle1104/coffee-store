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

	transactionRepo := repository.NewTransactionRepo(database)
	transactionService := service.NewTransactionService(transactionRepo)
	transactionHandler := handler.NewTransactionHandler(transactionService, manager)

	r.Route("/v1", func(r chi.Router) {
		r.Route("/orders", func(r chi.Router) {
			r.Post("/", orderHandler.NewOrder)
			r.Route("/{orderID}", func(r chi.Router) {
				r.Use(OrderCtx)
				r.Put("/update", orderHandler.UpdateOrderStatus)
				r.Delete("/", orderHandler.DeleteOrder)
			})
			r.Get("/", orderHandler.GetOrders)
		})

		r.Route("/items", func(r chi.Router) {
			r.Post("/", itemHandler.NewItem)
			r.Get("/", itemHandler.GetItems)
			r.Route("/{itemID}", func(r chi.Router) {
				r.Use(ItemCtx)
				r.Delete("/", itemHandler.DeleteItem)
			})
		})

		r.Post("/payments", transactionHandler.NewTransaction)
		r.Get("/payments", transactionHandler.GetTransactions)

		r.Get("/ws", manager.HandleConnection)
	})

	fmt.Println("Server đang chạy ở port 8080")
	http.ListenAndServe(":8080", r)
}

func OrderCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		orderID := chi.URLParam(r, "orderID")

		ctx := context.WithValue(r.Context(), "orderID", orderID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func ItemCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		itemID := chi.URLParam(r, "itemID")

		ctx := context.WithValue(r.Context(), "itemID", itemID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
