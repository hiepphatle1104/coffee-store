package handler

import (
	"api/internal/common/dto"
	"api/internal/model"
	"api/internal/service"
	"encoding/json"
	"net/http"
)

type TransactionHandler struct {
	service *service.TransactionService
	manager *WSManager
}

func NewTransactionHandler(service *service.TransactionService, manager *WSManager) *TransactionHandler {
	return &TransactionHandler{
		service: service,
		manager: manager,
	}
}

func (h *TransactionHandler) NewTransaction(w http.ResponseWriter, r *http.Request) {
	var trans model.Transaction
	json.NewDecoder(r.Body).Decode(&trans)

	newTrans, err := h.service.NewTransaction(trans.OrderID, trans.Method)
	if err != nil {
		res := dto.NewResponse(err.Error(), http.StatusBadRequest)
		res.Send(w)
		return
	}

	broadcast := dto.NewBroadCast("update", "transactions")
	h.manager.Broadcast <- broadcast

	res := dto.NewResponse("Tao transaction thanh cong", http.StatusCreated)
	res.Data = newTrans
	res.Send(w)
}

func (h *TransactionHandler) GetTransactions(w http.ResponseWriter, r *http.Request) {
	trans, err := h.service.GetTransactions()
	if err != nil {
		res := dto.NewResponse(err.Error(), http.StatusBadRequest)
		res.Send(w)
		return
	}

	res := dto.NewResponse("danh sách transaction", http.StatusOK)
	res.Data = trans
	res.Send(w)
	return
}
