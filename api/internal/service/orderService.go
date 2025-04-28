package service

import (
	"api/internal/model"
	"api/internal/repository"
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/v2/bson"
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

func (s *OrderService) NewOrder(order *model.Order) (*model.Order, error) {
	ctx := context.Background()

	// Total
	var total float64 = 0
	var foundItems []model.CartItem

	// Check valid items
	for _, item := range order.Items {
		existItem, _ := s.itemRepo.FindItemByName(ctx, item.Name)
		if existItem == nil {
			return nil, fmt.Errorf("không tìm thấy item")
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
	newOrder.Status = "pending"

	err := s.repo.NewOrder(ctx, newOrder)
	if err != nil {
		return nil, err
	}

	return newOrder, nil
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

func (s *OrderService) GetOrderByID(orderID string) (*model.Order, error) {
	ctx := context.Background()

	order, err := s.repo.FindOrderById(ctx, orderID)
	if err != nil {
		return nil, err
	}

	return order, nil
}

func (s *OrderService) UpdateOrder(orderID string, order *model.Order) error {
	ctx := context.Background()

	updateFields := bson.M{}
	if order.Status != "" {
		updateFields["status"] = order.Status
	}

	if len(updateFields) == 0 {
		return fmt.Errorf("loi data")
	}

	err := s.repo.UpdateOrder(ctx, orderID, updateFields)
	if err != nil {
		return err
	}

	return nil
}

func (s *OrderService) DeleteOrder(orderID string) error {
	ctx := context.Background()
	err := s.repo.DeleteOrder(ctx, orderID)
	if err != nil {
		return err
	}

	return nil
}
