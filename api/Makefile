build-win:
	@echo "Building..."

	@GOOS=windows GOARCH=amd64 go build cmd/api/main.go

build:
	@echo "Building..."
	
	
	@go build -o main cmd/api/main.go

run:
	@go run cmd/api/main.go

socket:
	@go run cmd/socket/main.go

docker-run:
	@docker compose up -d

docker-down:
	@docker compose down

.PHONY: build run build-win docker-run docker-down
