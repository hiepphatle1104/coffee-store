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

func (h *OrderHandler) UpdateOrderStatus(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	orderID, ok := ctx.Value("orderID").(string)
	if !ok {
		res := dto.NewResponse("lỗi dữ liệu", http.StatusBadRequest)
		res.Send(w)
		return
	}

	var order *model.Order
	json.NewDecoder(r.Body).Decode(&order)

	err := h.service.UpdateOrder(orderID, order)
	if err != nil {
		res := dto.NewResponse(err.Error(), http.StatusBadRequest)
		res.Send(w)
		return
	}

	broadcast := dto.NewBroadCast("update", "orders")
	h.manager.Broadcast <- broadcast

	res := dto.NewResponse("updated", http.StatusOK)
	res.Send(w)
	return
}

func (h *OrderHandler) NewOrder(w http.ResponseWriter, r *http.Request) {
	var order model.Order
	json.NewDecoder(r.Body).Decode(&order)

	// Validate Data
	if len(order.Items) == 0 {
		res := dto.NewResponse("lỗi dữ liệu", http.StatusBadRequest)
		res.Send(w)
		return
	}

	result, err := h.service.NewOrder(&order)
	if err != nil {
		res := dto.NewResponse(err.Error(), http.StatusInternalServerError)
		res.Send(w)
		return
	}

	broadcast := dto.NewBroadCast("update", "orders")
	h.manager.Broadcast <- broadcast

	res := dto.NewResponse("tạo order thành công", http.StatusCreated)
	res.Data = result
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

func (h *OrderHandler) DeleteOrder(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	orderID, ok := ctx.Value("orderID").(string)
	if !ok {
		res := dto.NewResponse("lỗi dữ liệu", http.StatusBadRequest)
		res.Send(w)
		return
	}

	err := h.service.DeleteOrder(orderID)
	if err != nil {
		res := dto.NewResponse(err.Error(), http.StatusInternalServerError)
		res.Send(w)
		return
	}

	res := dto.NewResponse("Ok", http.StatusOK)
	res.Send(w)
}
