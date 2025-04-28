package repository

import (
	"api/internal/database"
	"api/internal/model"
	"context"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type TransactionRepo struct {
	db         *mongo.Client
	collection *mongo.Collection
}

func NewTransactionRepo(db *database.Database) *TransactionRepo {
	return &TransactionRepo{
		db:         db.Client,
		collection: db.DB.Collection("transactions"),
	}
}

func (r *TransactionRepo) CreateTransaction(ctx context.Context, transaction *model.Transaction) error {
	_, err := r.collection.InsertOne(ctx, transaction)
	if err != nil {
		return err
	}

	return nil
}

func (r *TransactionRepo) FindTransaction(ctx context.Context) (*[]model.Transaction, error) {
	var transactions []model.Transaction
	result, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	err = result.All(ctx, &transactions)
	if err != nil {
		return nil, err
	}

	return &transactions, nil
}
