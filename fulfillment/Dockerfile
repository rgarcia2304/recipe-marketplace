FROM golang:1.25-alpine AS builder
WORKDIR /app

COPY go.work go.work.sum ./

COPY commons/ commons/
COPY proto/ proto/
COPY orders/ orders/
COPY gateway/ gateway/
COPY stock/ stock/
COPY fulfillment/ fulfillment/


RUN go work sync
RUN go work sync && cd fulfillment && go mod download

WORKDIR /app/fulfillment
RUN go build -o fulfillment .

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/fulfillment/fulfillment .
CMD ["./fulfillment"]
