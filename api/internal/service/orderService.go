package service

import (
	"api/internal/model"
	"api/internal/repository"
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type OrderService struct {
	repo     *repository.OrderRepo
	itemRepo *repository.ItemRepo
}

func NewOrderService(r *repository.OrderRepo, itemRepo *repository.ItemRepo) *OrderService {
	return &OrderService{
		repo:     r,
		itemRepo: itemRepo,
	}
}

func (s *OrderService) NewOrder(order *model.Order) error {
	ctx := context.Background()

	// Total
	var total float64 = 0
	var foundItems []model.CartItem

	// Check valid items
	for _, item := range order.Items {
		existItem, _ := s.itemRepo.FindItemByName(ctx, item.Name)
		if existItem == nil {
			return fmt.Errorf("không tìm thấy item")
		}

		total = total + (existItem.Price * float64(item.Quantity))
		cartItem := model.CartItem{
			Item:     *existItem,
			Quantity: item.Quantity,
		}
		foundItems = append(foundItems, cartItem)

	}

	// Create new order
	var newOrder *model.Order = order
	newOrder.ID = uuid.NewString()
	newOrder.CreatedAt = time.Now().Local().String()
	newOrder.Total = total
	newOrder.Items = foundItems

	err := s.repo.NewOrder(ctx, newOrder)
	if err != nil {
		return err
	}

	return nil
}

func (s *OrderService) GetOrders() (*[]model.Order, error) {
	ctx := context.Background()
	orders, err := s.repo.FindOrders(ctx)
	if err != nil {
		return nil, err
	}

	if len(*orders) == 0 {
		return nil, fmt.Errorf("không tìm thấy order")
	}

	return orders, err
}
