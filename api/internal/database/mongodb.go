package database

import (
	"context"
	"fmt"
	"log"
	"os"

	_ "github.com/joho/godotenv/autoload"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Database struct {
	Client *mongo.Client
	DB     *mongo.Database
}

var (
	host     = os.Getenv("DB_HOST")
	port     = os.Getenv("DB_PORT")
	database = os.Getenv("DB_DATABASE")

	collections = []string{
		"orders",
		"items",
		"transactions",
	}
)

func NewConnection() *Database {
	url := fmt.Sprintf("mongodb://%s:%s", host, port)
	client, err := mongo.Connect(options.Client().ApplyURI(url))
	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(context.TODO(), nil)
	if err != nil {
		panic(err)
	}

	fmt.Println("đã kết nối database")
	db := client.Database(database)

	ensureCollections(db, collections)

	return &Database{
		Client: client,
		DB:     db,
	}
}

func ensureCollections(db *mongo.Database, collections []string) {
	for _, collName := range collections {
		if !collectionExists(db, collName) {
			db.CreateCollection(context.Background(), collName)
		}
	}
}

func collectionExists(db *mongo.Database, collName string) bool {
	collections, _ := db.ListCollectionNames(context.Background(), bson.M{"name": collName})
	return len(collections) > 0
}
