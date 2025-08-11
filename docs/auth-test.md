# Ruby on Rails API Authentication

### 入力

curl -X POST http://localhost:3000/api/login \
 -H "Content-Type: application/json" \
 -d '{
"email": "test@example.com",
"password": "123456"
}'

### 出力

{"user":{"id":2,"name":"testuser","email":"test@example.com"},"token":"eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyLCJleHAiOjE3NTQ5OTA4MDF9.cWXrYUh3Yp7S6anam86Hvpr2EkHLV9cRNwv0irM7bwM"}%

### 入力

curl -X GET http://localhost:3000/api/me \
 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyLCJleHAiOjE3NTQ5OTA3MzB9.-Q6rBwONWYZ5JwqxCMK2Tyfk93rlYZQhZp5jPV9RRF0"

### 出力

{"user":{"id":2,"name":"testuser","email":"test@example.com"}}%

### 入力

curl -X GET http://localhost:3000/api/me \
 -H "Authorization: Bearer invalid_token"

### 出力

{"error":"Unauthorized"}%

o.seiya@MacBook-Pro backend % curl -X POST http://localhost:3000/api/login \
 -H "Content-Type: application/json" \
 -d '{
"email": "test@example.com",
"password": "123456"
}'
{"user":{"id":2,"name":"testuser","email":"test@example.com"},"token":"eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyLCJleHAiOjE3NTUwMDI3NjB9.M1LspJZV-bdNY-8CPKYMs8MP5U78ouU5jtjZk9hrF6g"}%
