export type TimelineItem = {
  id: string
  year: string
  title: string
  desc: string
}

export const timeline: TimelineItem[] = [
  { id: 'hs', year: '2022', title: 'Bắt đầu học lập trình', desc: 'Học tại Hutech University, làm quen với C/C++ cơ bản.' },
  { id: 'uni', year: '2023', title: 'Nền tảng lập trình & Mạng máy tính', desc: 'Cấu trúc dữ liệu, giải thuật, OOP, hệ điều hành, mạng máy tính và cơ sở dữ liệu.' },
  { id: 'proj', year: '2024', title: 'Chuyên sâu & Dự án thực tế', desc: 'Bảo mật thông tin, AI, lập trình Web, công nghệ phần mềm và đồ án cơ sở.' },
  { id: 'intern', year: '2025', title: 'Chuyên ngành & Thực tập', desc: 'Lập trình mạng máy tính, quản lý dự án IT, lập trình mobile và thực tập Web.' },
]

export const skills = [
  { name: 'JavaScript' },
  { name: 'TypeScript' },
  { name: 'React' },
  { name: 'Tailwind CSS' },
  { name: 'Three.js' },
  { name: 'Python' },
  { name: 'C#' },
  { name: '.NET' },
  { name: 'Flutter' },
  { name: 'Dart' },
  { name: 'Blazor' },
  { name: 'Redis' },
  { name: 'RabbitMQ' },
  { name: 'Docker' },
  { name: 'Git' },
  { name: 'GitHub' },
]

export const certifications = [
  { issuer: 'Cisco', name: 'CCNA: Introduction to Networks' },
  { issuer: 'Cisco', name: 'CCNA: Switching, Routing, and Wireless Essentials' },
  { issuer: 'Cisco', name: 'CCNA: Enterprise Networking, Security, and Automation' },
]

