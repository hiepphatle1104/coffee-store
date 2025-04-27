package model

type CartItem struct {
	Item
	Quantity uint8 `json:"quantity" bson:"quantity"`
}
