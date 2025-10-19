# Code Journey Blog

Một blog cá nhân được xây dựng bằng React + TypeScript + Vite với các tính năng hiện đại như 3D animations, đa ngôn ngữ, và responsive design.

## 🚀 Tính năng chính

- **3D Animations**: Sử dụng Three.js và React Three Fiber
- **Đa ngôn ngữ**: Hỗ trợ tiếng Việt và tiếng Anh
- **Responsive Design**: Tối ưu cho mọi thiết bị
- **Dark/Light Theme**: Chuyển đổi giao diện
- **Blog System**: Quản lý bài viết với Markdown
- **Portfolio**: Showcase các dự án cá nhân
- **Contact Form**: Liên hệ qua EmailJS

## 📋 Yêu cầu hệ thống

- Node.js >= 18.0.0
- npm >= 8.0.0 hoặc yarn >= 1.22.0

## 🛠️ Cài đặt và chạy dự án

### 1. Clone repository

```bash
git clone <repository-url>
cd blog-natwo
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Chạy dự án ở chế độ development

```bash
npm run dev
```

Dự án sẽ chạy tại: `http://localhost:5173`

### 4. Build dự án cho production

```bash
npm run build
```

### 5. Preview build production

```bash
npm run preview
```

### 6. Kiểm tra code với ESLint

```bash
npm run lint
```

## 📁 Cấu trúc dự án

```
src/
├── components/          # Các component React
│   ├── about/          # Component về trang About
│   ├── blog/           # Component blog
│   ├── common/         # Component chung
│   ├── contact/        # Component liên hệ
│   ├── home/           # Component trang chủ
│   └── projects/       # Component dự án
├── context/            # React Context
├── data/               # Dữ liệu tĩnh
├── hooks/              # Custom hooks
├── i18n/               # Đa ngôn ngữ
├── pages/              # Các trang chính
├── styles/             # SCSS styles
└── three/              # 3D components
```

## 🎨 Công nghệ sử dụng

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, SCSS
- **3D Graphics**: Three.js, React Three Fiber
- **Animations**: Framer Motion, GSAP
- **Routing**: React Router DOM
- **Internationalization**: i18next
- **Email**: EmailJS
- **Icons**: React Icons

## 🌐 Cấu hình môi trường

Tạo file `.env` trong thư mục gốc với các biến môi trường cần thiết:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## 📝 Scripts có sẵn

- `npm run dev`: Chạy development server
- `npm run build`: Build dự án cho production
- `npm run preview`: Preview build production
- `npm run lint`: Kiểm tra code với ESLint

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phân phối dưới MIT License.
