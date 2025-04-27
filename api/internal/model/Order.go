package model

type Order struct {
	ID        string     `json:"id" bson:"_id"`
	Items     []CartItem `json:"items" bson:"items"`
	CreatedAt string     `json:"created_at" bson:"created_at"`
	Total     float64    `json:"total" bson:"total"`
	Status    string     `json:"status" bson:"status"`
}
