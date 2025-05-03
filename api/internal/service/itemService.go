package service

import (
	"api/internal/model"
	"api/internal/repository"
	"context"
	"fmt"

	"github.com/google/uuid"
)

type ItemService struct {
	repo *repository.ItemRepo
}

func NewItemService(r *repository.ItemRepo) *ItemService {
	return &ItemService{
		repo: r,
	}
}

func (s *ItemService) NewItem(item *model.Item) error {
	ctx := context.Background()

	// Check exist item
	existItem, _ := s.repo.FindItemByName(ctx, item.Name)
	if existItem != nil {
		return fmt.Errorf("đã có món này trong hệ thống")
	}

	// Create new item
	var newItem *model.Item = item
	newItem.ID = uuid.NewString()

	err := s.repo.NewItem(ctx, newItem)
	if err != nil {
		return err
	}

	return nil
}

func (s *ItemService) GetItems() (*[]model.Item, error) {
	ctx := context.Background()
	items, err := s.repo.FindItems(ctx)
	if err != nil {
		return nil, err
	}

	if len(*items) == 0 {
		return nil, fmt.Errorf("không tìm thấy món nào")
	}

	return items, err
}

func (s *ItemService) DeleteItem(itemID string) error {
	ctx := context.Background()
	err := s.repo.DeleteItem(ctx, itemID)
	if err != nil {
		return err
	}

	return nil
}
