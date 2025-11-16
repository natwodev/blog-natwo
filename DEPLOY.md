# Hướng dẫn Deploy Blog Natwo

## Vấn đề hiện tại

Sau khi build frontend, bạn cần chạy **backend server** riêng để API hoạt động. Frontend sẽ gọi API để lấy và tăng lượt truy cập.

## Các bước deploy

### 1. Build Frontend (đã làm)

```bash
cd ~/blog-natwo
rm -rf node_modules dist .vite .turbo .next .cache .parcel-cache
npm cache clean --force
cd ~
rm -rf blog-natwo
git clone https://github.com/natwodev/blog-natwo.git
cd blog-natwo
npm install
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### 2. Cấu hình Environment Variable cho Frontend

Trước khi build, tạo file `.env.production` hoặc set biến môi trường:

```bash
# Thay YOUR_DOMAIN bằng domain thực tế của bạn
# Ví dụ: https://api.yourdomain.com hoặc https://yourdomain.com/api
VITE_API_BASE_URL=https://yourdomain.com/api
```

Sau đó build lại:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### 3. Cài đặt PM2 (Process Manager)

```bash
npm install -g pm2
```

### 4. Chạy Backend Server với PM2

```bash
cd ~/blog-natwo
pm2 start ecosystem.config.cjs
pm2 save  # Lưu để tự động restart khi server reboot
pm2 startup  # Tạo startup script (chạy lệnh mà nó hiển thị)
```

### 5. Kiểm tra Backend Server

```bash
# Xem status
pm2 status

# Xem logs
pm2 logs blog-natwo-api

# Test API
curl http://localhost:3001/api/views
```

### 6. Cấu hình Nginx (nếu dùng)

Nếu bạn dùng Nginx để serve frontend, cần thêm reverse proxy cho API:

```nginx
# Serve frontend static files
location / {
    root /home/user/blog-natwo/dist;
    try_files $uri $uri/ /index.html;
}

# Proxy API requests to backend
location /api {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

### 7. Các lệnh PM2 hữu ích

```bash
# Xem status
pm2 status

# Xem logs realtime
pm2 logs blog-natwo-api

# Restart server
pm2 restart blog-natwo-api

# Stop server
pm2 stop blog-natwo-api

# Xem thông tin chi tiết
pm2 info blog-natwo-api

# Monitor
pm2 monit
```

## Lưu ý quan trọng

1. **File `server/views.json`**: File này lưu số lượt truy cập, đảm bảo có quyền ghi
2. **Port 3001**: Backend chạy trên port 3001, đảm bảo port này không bị block bởi firewall
3. **CORS**: Backend đã có CORS enabled, nên có thể gọi từ domain khác
4. **Environment Variable**: Nếu không set `VITE_API_BASE_URL`, frontend sẽ dùng `http://localhost:3001` (sẽ lỗi trên production)

## Troubleshooting

### API không hoạt động
- Kiểm tra backend server có đang chạy: `pm2 status`
- Kiểm tra logs: `pm2 logs blog-natwo-api`
- Test API trực tiếp: `curl http://localhost:3001/api/views`

### Frontend không kết nối được API
- Kiểm tra `VITE_API_BASE_URL` đã được set đúng chưa
- Kiểm tra CORS trên backend
- Kiểm tra network tab trong browser console

