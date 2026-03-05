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
RUN go work sync && cd orders && go mod download

WORKDIR /app/orders
RUN go build -o orders .

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/orders/orders .
EXPOSE 9001
CMD ["./orders"]
