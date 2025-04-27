package dto

type BroadCast struct {
	Event    string `json:"event"`
	Category string `json:"category"`
}

func NewBroadCast(event, category string) *BroadCast {
	return &BroadCast{
		Event:    event,
		Category: category,
	}
}
