package handler

import (
	"api/internal/common/dto"
	"api/internal/model"
	"api/internal/service"
	"encoding/json"
	"net/http"
)

type OrderHandler struct {
	service *service.OrderService
	manager *WSManager
}

func NewOrderHandler(s *service.OrderService, manager *WSManager) *OrderHandler {
	return &OrderHandler{
		service: s,
		manager: manager,
	}
}

func (h *OrderHandler) NewOrder(w http.ResponseWriter, r *http.Request) {
	var order model.Order
	json.NewDecoder(r.Body).Decode(&order)

	// Validate Data
	if order.Status == "" || len(order.Items) == 0 {
		res := dto.NewResponse("lỗi dữ liệu", http.StatusBadRequest)
		res.Send(w)
		return
	}

	err := h.service.NewOrder(&order)
	if err != nil {
		res := dto.NewResponse(err.Error(), http.StatusInternalServerError)
		res.Send(w)
		return
	}

	broadcast := dto.NewBroadCast("update", "database")
	h.manager.Broadcast <- broadcast

	res := dto.NewResponse("tạo order thành công", http.StatusCreated)
	res.Send(w)
	return
}

func (h *OrderHandler) GetOrders(w http.ResponseWriter, r *http.Request) {
	orders, err := h.service.GetOrders()
	if err != nil {
		res := dto.NewResponse(err.Error(), http.StatusInternalServerError)
		res.Send(w)
		return
	}

	res := dto.NewResponse("danh sách các orders", http.StatusOK)
	res.Data = orders
	res.Send(w)
	return
}
