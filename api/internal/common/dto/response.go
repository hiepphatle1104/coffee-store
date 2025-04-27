package dto

import (
	"encoding/json"
	"net/http"
)

type Response struct {
	Message     string `json:"message"`
	StatusCode  int    `json:"status_code"`
	Ok          bool   `json:"ok"`
	AccessToken string `json:"access_token,omitempty"`
	Data        any    `json:"data,omitempty"`
}

func NewResponse(message string, code int) *Response {
	ok := code == 200 || code == 201
	return &Response{
		Message:    message,
		StatusCode: code,
		Ok:         ok,
	}
}

func (res *Response) Send(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(res.StatusCode)

	json.NewEncoder(w).Encode(&res)
}
