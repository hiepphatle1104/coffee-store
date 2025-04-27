package model

type Item struct {
	ID    string   `json:"id" bson:"_id"`
	Name  string   `json:"name" bson:"name"`
	Price float64  `json:"price" bson:"price"`
	Tags  []string `json:"tags" bson:"tags"`
	Image string   `json:"image" bson:"image"`
}
