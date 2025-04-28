package service

import (
	"api/internal/model"
	"api/internal/repository"
	"context"
	"fmt"

	"github.com/google/uuid"
)

type TransactionService struct {
	repo *repository.TransactionRepo
}

func NewTransactionService(r *repository.TransactionRepo) *TransactionService {
	return &TransactionService{
		repo: r,
	}
}

func (s *TransactionService) NewTransaction(orderID, method string) (*model.Transaction, error) {
	ctx := context.Background()

	var newTrans model.Transaction
	newTrans.ID = uuid.NewString()
	newTrans.Method = method
	newTrans.OrderID = orderID

	err := s.repo.CreateTransaction(ctx, &newTrans)
	if err != nil {
		return nil, err
	}

	return &newTrans, nil
}

func (s *TransactionService) GetTransactions() (*[]model.Transaction, error) {
	ctx := context.Background()
	trans, err := s.repo.FindTransaction(ctx)
	if err != nil {
		return nil, err
	}

	if len(*trans) == 0 {
		return nil, fmt.Errorf("không tìm thấy")
	}

	return trans, err
}
