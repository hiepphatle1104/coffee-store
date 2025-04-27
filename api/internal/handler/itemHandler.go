package handler

import (
	"api/internal/common/dto"
	"api/internal/model"
	"api/internal/service"
	"encoding/json"
	"net/http"
)

type ItemHandler struct {
	service *service.ItemService
	manager *WSManager
}

func NewItemHandler(s *service.ItemService, manager *WSManager) *ItemHandler {
	return &ItemHandler{
		service: s,
		manager: manager,
	}
}

func (h *ItemHandler) NewItem(w http.ResponseWriter, r *http.Request) {
	var item model.Item
	json.NewDecoder(r.Body).Decode(&item)

	// Validate Data
	if item.Name == "" || item.Price == 0 || len(item.Tags) == 0 {
		res := dto.NewResponse("lỗi dữ liệu", http.StatusBadRequest)
		res.Send(w)
		return
	}

	err := h.service.NewItem(&item)
	if err != nil {
		res := dto.NewResponse(err.Error(), http.StatusInternalServerError)
		res.Send(w)
		return
	}

	broadcast := dto.NewBroadCast("update", "database")
	h.manager.Broadcast <- broadcast

	res := dto.NewResponse("món mới đã được thêm thành công", http.StatusCreated)
	res.Send(w)
	return
}

func (h *ItemHandler) GetItems(w http.ResponseWriter, r *http.Request) {
	items, err := h.service.GetItems()
	if err != nil {
		res := dto.NewResponse(err.Error(), http.StatusInternalServerError)
		res.Send(w)
		return
	}

	res := dto.NewResponse("danh sách các món", http.StatusOK)
	res.Data = items
	res.Send(w)
	return
}
