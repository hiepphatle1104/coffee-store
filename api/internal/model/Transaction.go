package model

type Transaction struct {
	ID      string `json:"id" bson:"_id"`
	Method  string `json:"method" bson:"method"`
	OrderID string `json:"order_id" bson:"order_id"`
}
