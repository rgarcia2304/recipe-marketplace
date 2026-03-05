FROM golang:1.22-alpine AS builder
WORKDIR /app

COPY go.work go.work.sum ./

COPY commons/ commons/
COPY proto/ proto/
COPY orders/ orders/

RUN go work sync
WORKDIR /app/orders
RUN go build -o orders .

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/orders/orders .
EXPOSE 9001
CMD ["./orders"]
