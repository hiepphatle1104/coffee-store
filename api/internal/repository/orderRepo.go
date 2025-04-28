package repository

import (
	"api/internal/database"
	"api/internal/model"
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type OrderRepo struct {
	db         *mongo.Client
	collection *mongo.Collection
}

func NewOrderRepo(db *database.Database) *OrderRepo {
	return &OrderRepo{
		db:         db.Client,
		collection: db.DB.Collection("orders"),
	}
}

func (r *OrderRepo) NewOrder(ctx context.Context, order *model.Order) error {
	_, err := r.collection.InsertOne(ctx, order)
	if err != nil {
		return err
	}

	return nil
}

func (r *OrderRepo) FindOrderById(ctx context.Context, id string) (*model.Order, error) {
	filter := bson.M{"id": id}

	var order model.Order
	err := r.collection.FindOne(ctx, filter).Decode(&order)
	if err != nil {
		return nil, err
	}

	return &order, nil
}

func (r *OrderRepo) FindOrders(ctx context.Context) (*[]model.Order, error) {
	var orders []model.Order
	filter := bson.M{}

	result, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	err = result.All(ctx, &orders)
	if err != nil {
		return nil, err
	}

	return &orders, nil
}

func (r *OrderRepo) UpdateOrder(ctx context.Context, orderId string, updateFields bson.M) error {
	update := bson.M{
		"$set": updateFields,
	}
	result, err := r.collection.UpdateByID(ctx, orderId, update)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		return fmt.Errorf("khong tim thay order")
	}

	return err
}

func (r *OrderRepo) DeleteOrder(ctx context.Context, orderId string) error {
	filter := bson.M{"_id": orderId}

	_, err := r.collection.DeleteOne(ctx, filter)
	if err != nil {
		return err
	}

	return err
}
