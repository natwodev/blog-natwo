/**
 * Cấu hình Firebase web CÔNG KHAI (apiKey web là định danh, an toàn để nhúng client).
 * Dùng để đếm lượt truy cập blog qua Firestore của project 'tracnghiem-visits'.
 *
 * Có default sẵn để CI/CD (Vercel) chạy được ngay mà không cần set env; muốn đổi
 * sang project khác thì đặt các biến VITE_FIREBASE_* rồi build lại.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDo4k8KHarhgVyyYzN-VBapNU8XRkqYH0Y',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'tracnghiem-visits.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'tracnghiem-visits',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:34839690453:web:ff983dc535e7890a84765c',
}

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

// Firestore named DB: console tạo DB tên 'default' (không phải '(default)' cổ điển) —
// phải chỉ đúng ID nếu không sẽ lỗi "client is offline". Trùng với cấu hình bên csharp.
export const FIREBASE_DATABASE_ID = import.meta.env.VITE_FIREBASE_DB_ID || 'default'

export { firebaseConfig }
