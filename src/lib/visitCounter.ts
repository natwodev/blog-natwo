import type { Firestore } from 'firebase/firestore'
import { firebaseConfig, firebaseEnabled, FIREBASE_DATABASE_ID } from '../config/firebaseEnv'

/**
 * Bộ đếm lượt truy cập lưu trên Firestore (project 'tracnghiem-visits').
 *
 * Mỗi bộ đếm là một document trong collection 'stats' với field 'count'.
 * Blog dùng doc riêng (vd 'blog-natwo_site') để KHÔNG lẫn vào số của tracnghiem.online
 * (doc 'stats/visits').
 *
 * SDK Firebase (~168 KB gzip) được nạp bằng import() động để không phình gói chính —
 * bộ đếm chỉ chạy ở footer, không chặn màn hình đầu.
 */
type FirestoreApi = typeof import('firebase/firestore')
type Bundle = { db: Firestore; api: FirestoreApi }

let bundlePromise: Promise<Bundle | null> | null = null

async function loadFirestore(): Promise<Bundle | null> {
  if (!firebaseEnabled) return null
  if (!bundlePromise) {
    bundlePromise = (async () => {
      try {
        const [{ initializeApp, getApps, getApp }, api] = await Promise.all([
          import('firebase/app'),
          import('firebase/firestore'),
        ])
        const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
        const db = api.getFirestore(app, FIREBASE_DATABASE_ID)
        return { db, api }
      } catch (error) {
        bundlePromise = null // lỗi nạp SDK → cho phép thử lại lần sau
        console.error('Không nạp được Firebase SDK:', error)
        return null
      }
    })()
  }
  return bundlePromise
}

// Collection riêng cho blog để tách khỏi bộ đếm của tracnghiem.online (stats/visits).
const COLLECTION = 'blog_pageviews'

/** Đọc lượt truy cập hiện tại. Trả null nếu Firebase chưa sẵn sàng. */
export async function readVisitCount(docId: string): Promise<number | null> {
  const fb = await loadFirestore()
  if (!fb) return null
  const snap = await fb.api.getDoc(fb.api.doc(fb.db, COLLECTION, docId))
  return snap.data()?.count ?? 0
}

/**
 * Tăng lượt truy cập lên 1 rồi trả về tổng mới.
 * merge + increment: tự tạo doc nếu chưa có, chỉ đụng field 'count'.
 */
export async function incrementVisitCount(docId: string): Promise<number | null> {
  const fb = await loadFirestore()
  if (!fb) return null
  const { doc, setDoc, getDoc, increment } = fb.api
  const ref = doc(fb.db, COLLECTION, docId)
  await setDoc(ref, { count: increment(1) }, { merge: true })
  const snap = await getDoc(ref)
  return snap.data()?.count ?? 0
}
