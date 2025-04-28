package repository

import (
	"api/internal/database"
	"api/internal/model"
	"context"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type ItemRepo struct {
	db         *mongo.Client
	collection *mongo.Collection
}

func NewItemRepo(db *database.Database) *ItemRepo {
	return &ItemRepo{
		db:         db.Client,
		collection: db.DB.Collection("items"),
	}
}

func (r *ItemRepo) NewItem(ctx context.Context, item *model.Item) error {
	_, err := r.collection.InsertOne(ctx, item)
	if err != nil {
		return err
	}

	return nil
}

func (r *ItemRepo) FindItemByName(ctx context.Context, name string) (*model.Item, error) {
	filter := bson.M{"name": name}

	var item model.Item
	err := r.collection.FindOne(ctx, filter).Decode(&item)
	if err != nil {
		return nil, err
	}

	return &item, nil
}

func (r *ItemRepo) FindItems(ctx context.Context) (*[]model.Item, error) {
	var items []model.Item
	result, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	err = result.All(ctx, &items)
	if err != nil {
		return nil, err
	}

	return &items, nil
}

func (r *ItemRepo) UpdateItem(ctx context.Context, itemID string, item *model.Item) error {
	_, err := r.collection.UpdateByID(ctx, itemID, &item)
	if err != nil {
		return err
	}

	return nil
}

func (r *ItemRepo) DeleteItem(ctx context.Context, itemID string) error {
	_, err := r.collection.DeleteOne(ctx, bson.M{"_id": itemID})
	if err != nil {
		return err
	}

	return nil
}
