package handler

import (
	"api/internal/common/dto"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true }, // Allow all connections
}

type WSManager struct {
	Clients    map[*websocket.Conn]bool
	Mutex      sync.Mutex
	Broadcast  chan *dto.BroadCast
	Register   chan *websocket.Conn
	Unregister chan *websocket.Conn
}

func NewWSManager() *WSManager {
	return &WSManager{
		Clients:    make(map[*websocket.Conn]bool),
		Broadcast:  make(chan *dto.BroadCast),
		Register:   make(chan *websocket.Conn),
		Unregister: make(chan *websocket.Conn),
	}
}

func (wsm *WSManager) Run() {
	for {
		select {
		case client := <-wsm.Register:
			wsm.Mutex.Lock()
			wsm.Clients[client] = true
			wsm.Mutex.Unlock()
			fmt.Printf("New client: %s\n", client.RemoteAddr().String())

		case client := <-wsm.Unregister:
			wsm.Mutex.Lock()
			_, ok := wsm.Clients[client]
			if ok {
				delete(wsm.Clients, client)
				client.Close()
			}
			wsm.Mutex.Unlock()
			fmt.Println(client.NetConn().RemoteAddr(), "has disconnected")

		case message := <-wsm.Broadcast:
			wsm.Mutex.Lock()
			for client := range wsm.Clients {
				err := client.WriteJSON(&message)
				if err != nil {
					log.Printf("Lỗi gửi tin nhắn: %v", err)
					delete(wsm.Clients, client)
					client.Close()
				}
			}

			wsm.Mutex.Unlock()
		}
	}
}

func (wsm *WSManager) HandleConnection(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Lỗi khi nâng cấp kết nối:", err)
		return
	}

	// Register new client
	wsm.Register <- conn

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			wsm.Unregister <- conn
			return
		}
	}
}
