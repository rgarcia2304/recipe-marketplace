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
RUN go work sync && cd gateway && go mod download

WORKDIR /app/gateway
RUN go build -o gateway .

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/gateway/gateway .
EXPOSE 8080
CMD ["./gateway"]
