export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number // index of correct answer (0-based)
  explanation?: string
}

export interface QuizData {
  title: string
  description: string
  timeLimit: number // in seconds
  questions: QuizQuestion[]
}

export const quizData: QuizData = {
  title: 'Kiến thức lập trình cơ bản',
  description: 'Bài thi trắc nghiệm về các kiến thức lập trình cơ bản',
  timeLimit: 600, // 10 minutes
  questions: [
    {
      id: 1,
      question: 'JavaScript là ngôn ngữ lập trình gì?',
      options: [
        'Ngôn ngữ biên dịch',
        'Ngôn ngữ thông dịch',
        'Ngôn ngữ đánh dấu',
        'Ngôn ngữ kiểu dữ liệu tĩnh'
      ],
      correctAnswer: 1,
      explanation: 'JavaScript là ngôn ngữ thông dịch, được thực thi trực tiếp bởi trình duyệt mà không cần biên dịch trước.'
    },
    {
      id: 2,
      question: 'React là gì?',
      options: [
        'Một ngôn ngữ lập trình',
        'Một framework JavaScript',
        'Một thư viện JavaScript',
        'Một database'
      ],
      correctAnswer: 2,
      explanation: 'React là một thư viện JavaScript mã nguồn mở được phát triển bởi Facebook để xây dựng giao diện người dùng.'
    },
    {
      id: 3,
      question: 'Trong React, hook nào được sử dụng để quản lý state?',
      options: [
        'useEffect',
        'useState',
        'useContext',
        'useReducer'
      ],
      correctAnswer: 1,
      explanation: 'useState là hook được sử dụng để quản lý state trong functional components của React.'
    },
    {
      id: 4,
      question: 'CSS là viết tắt của?',
      options: [
        'Computer Style Sheets',
        'Creative Style Sheets',
        'Cascading Style Sheets',
        'Colorful Style Sheets'
      ],
      correctAnswer: 2,
      explanation: 'CSS là viết tắt của Cascading Style Sheets, được sử dụng để định dạng và tạo kiểu cho các trang web.'
    },
    {
      id: 5,
      question: 'API là viết tắt của?',
      options: [
        'Application Programming Interface',
        'Advanced Programming Interface',
        'Automated Programming Interface',
        'Application Process Integration'
      ],
      correctAnswer: 0,
      explanation: 'API là viết tắt của Application Programming Interface - giao diện lập trình ứng dụng.'
    },
    {
      id: 6,
      question: 'Trong JavaScript, phương thức nào dùng để thêm phần tử vào cuối mảng?',
      options: [
        'push()',
        'pop()',
        'shift()',
        'unshift()'
      ],
      correctAnswer: 0,
      explanation: 'Phương thức push() được sử dụng để thêm một hoặc nhiều phần tử vào cuối mảng.'
    },
    {
      id: 7,
      question: 'HTTP status code 404 có nghĩa là gì?',
      options: [
        'OK',
        'Not Found',
        'Server Error',
        'Forbidden'
      ],
      correctAnswer: 1,
      explanation: 'HTTP status code 404 có nghĩa là Not Found - tài nguyên được yêu cầu không tìm thấy.'
    },
    {
      id: 8,
      question: 'Git là gì?',
      options: [
        'Một ngôn ngữ lập trình',
        'Một hệ thống quản lý phiên bản',
        'Một framework',
        'Một database'
      ],
      correctAnswer: 1,
      explanation: 'Git là một hệ thống quản lý phiên bản phân tán, được sử dụng để theo dõi các thay đổi trong mã nguồn.'
    },
    {
      id: 9,
      question: 'Trong HTML, thẻ nào được sử dụng để tạo một liên kết?',
      options: [
        '<link>',
        '<a>',
        '<href>',
        '<url>'
      ],
      correctAnswer: 1,
      explanation: 'Thẻ <a> (anchor) được sử dụng để tạo các liên kết trong HTML.'
    },
    {
      id: 10,
      question: 'TypeScript là gì?',
      options: [
        'Một framework JavaScript',
        'Một superset của JavaScript',
        'Một database',
        'Một CSS framework'
      ],
      correctAnswer: 1,
      explanation: 'TypeScript là một superset của JavaScript, thêm kiểu dữ liệu tĩnh vào JavaScript.'
    }
  ]
}

