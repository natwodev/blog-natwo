import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001
const DATA_FILE = path.join(__dirname, 'views.json')

// Middleware
app.use(cors({
  origin: '*', // Cho phép tất cả origins (có thể giới hạn sau)
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}))
app.use(express.json())

// Đảm bảo file views.json tồn tại
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE)
  } catch {
    // File không tồn tại, tạo file mới với giá trị mặc định
    await fs.writeFile(DATA_FILE, JSON.stringify({ count: 0 }, null, 2))
  }
}

// Đọc lượt truy cập từ file
async function readViews() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading views file:', error)
    return { count: 0 }
  }
}

// Ghi lượt truy cập vào file
async function writeViews(views) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(views, null, 2))
  } catch (error) {
    console.error('Error writing views file:', error)
    throw error
  }
}

// API: Lấy lượt truy cập hiện tại
app.get('/api/views', async (req, res) => {
  try {
    const views = await readViews()
    res.json({ count: views.count })
  } catch (error) {
    console.error('Error getting views:', error)
    res.status(500).json({ error: 'Failed to get views' })
  }
})

// API: Tăng lượt truy cập
app.post('/api/views/increment', async (req, res) => {
  try {
    const views = await readViews()
    views.count += 1
    await writeViews(views)
    res.json({ count: views.count })
  } catch (error) {
    console.error('Error incrementing views:', error)
    res.status(500).json({ error: 'Failed to increment views' })
  }
})

// API: Tăng và trả về lượt truy cập (hit endpoint)
app.get('/api/views/hit', async (req, res) => {
  try {
    const views = await readViews()
    views.count += 1
    await writeViews(views)
    res.json({ count: views.count })
  } catch (error) {
    console.error('Error hitting views:', error)
    res.status(500).json({ error: 'Failed to hit views' })
  }
})

// Khởi động server
async function startServer() {
  await ensureDataFile()
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`Views data file: ${DATA_FILE}`)
  })
}

startServer().catch(console.error)

