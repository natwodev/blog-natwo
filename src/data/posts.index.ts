export type PostIndex = {
  id: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  image?: string
}

export const postsIndex: PostIndex[] = [
  {
    id: 'javascript-tong-quan-cho-nguoi-moi-bat-dau',
    title: 'JavaScript Tổng Quan: Hành Trình Khám Phá Ngôn Ngữ Lập Trình Phổ Biến Nhất Thế Giới',
    excerpt: 'Khám phá JavaScript từ góc độ tổng quan: lịch sử, ưu nhược điểm, và tại sao nó trở thành ngôn ngữ lập trình phổ biến nhất hiện nay.',
    date: '2025-09-15',
    tags: ['JavaScript', 'Programming', 'Web Development'],
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'javascript-bien-va-khai-bao',
    title: 'JavaScript Biến và Khai Báo: Từ Cơ Bản Đến Nâng Cao',
    excerpt: 'Khám phá cách sử dụng biến trong JavaScript: khai báo, khởi tạo, thay đổi giá trị và hiểu về scope của biến.',
    date: '2025-09-22',
    tags: ['JavaScript', 'Variables', 'Programming'],
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'built-in-objects-javascript',
    title: 'Built-in Objects trong JavaScript: Khám Phá Các Đối Tượng Có Sẵn',
    excerpt: 'Tìm hiểu về các built-in objects trong JavaScript - những đối tượng có sẵn giúp bạn làm việc hiệu quả hơn với dữ liệu và thực hiện các tác vụ phổ biến.',
    date: '2025-09-29',
    tags: ['JavaScript', 'Built-in Objects', 'Programming', 'Web Development'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'conditional-statements-javascript',
    title: 'Conditional Statements trong JavaScript: Điều Khiển Luồng Thực Thi',
    excerpt: 'Tìm hiểu về các câu lệnh điều kiện trong JavaScript - từ if/else cơ bản đến switch/case và toán tử ternary, giúp tạo ra các ứng dụng linh hoạt và phản ứng.',
    date: '2025-10-06',
    tags: ['JavaScript', 'Conditional Statements', 'Control Flow', 'Programming'],
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'functions-javascript',
    title: 'Functions trong JavaScript: Tạo và Sử Dụng Hàm Hiệu Quả',
    excerpt: 'Khám phá cách tạo và sử dụng functions trong JavaScript - từ khai báo cơ bản đến parameters, return values và local variables. Học cách tổ chức code thành các module logic độc lập.',
    date: '2025-10-13',
    tags: ['JavaScript', 'Functions', 'Programming', 'Code Organization'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'errors-exceptions-javascript',
    title: 'Errors và Exceptions trong JavaScript: Xử Lý Lỗi Hiệu Quả',
    excerpt: 'Tìm hiểu về các loại lỗi trong JavaScript - từ syntax errors đến logical errors. Học cách sử dụng try-catch để xử lý exceptions và viết code robust hơn.',
    date: '2025-10-20',
    tags: ['JavaScript', 'Error Handling', 'Exceptions', 'Debugging', 'Programming'],
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'javascript-data-types-primitive-complex',
    title: 'JavaScript Data Types: Từ Primitive đến Complex Types',
    excerpt: 'Khám phá các kiểu dữ liệu trong JavaScript: primitive types (number, boolean, string) và complex types (array, object). Hiểu cách sử dụng typeof và làm việc với dữ liệu.',
    date: '2025-10-26',
    tags: ['JavaScript', 'Data Types', 'Programming', 'Fundamentals'],
    image: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1600&auto=format&fit=crop'
  }
]


