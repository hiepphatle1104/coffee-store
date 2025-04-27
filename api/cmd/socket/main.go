package main

import (
	"api/internal/handler"
	"log"
	"net/http"
)

func main() {
	manager := handler.NewWSManager()
	go manager.Run()

	http.HandleFunc("/ws", manager.HandleConnection)

	log.Println("Websocket is running in port 8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Lỗi khi chạy server:", err)
	}
}
