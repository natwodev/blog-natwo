import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useLanguage } from '../hooks/useLanguage'

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

export default function Photobooth() {
  const { lang } = useLanguage()
  const t = (vi: string, en: string) => (lang === 'vi' ? vi : en)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stripCanvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  // Track if camera permission requested
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const MAX_PHOTOS = 6
  const handleStartCamera = () => {
    startCamera()
  }


  // Start camera
  const startCamera = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Front camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError(t(
        'Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.',
        'Unable to access camera. Please check permissions.'
      ))
    } finally {
      setIsLoading(false)
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      for (const track of stream.getTracks()) {
        track.stop()
      }
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Calculate square dimensions (use the smaller dimension)
    const videoWidth = video.videoWidth
    const videoHeight = video.videoHeight
    const size = Math.min(videoWidth, videoHeight)
    
    // Set canvas to square
    canvas.width = size
    canvas.height = size

    // Calculate source crop position (center crop)
    const sourceX = (videoWidth - size) / 2
    const sourceY = (videoHeight - size) / 2

    // Flip horizontally to compensate for video mirror effect
    context.translate(canvas.width, 0)
    context.scale(-1, 1)
    
    // Draw video frame to canvas (cropped to square)
    context.drawImage(
      video,
      sourceX, sourceY, size, size, // Source: crop square from center
      0, 0, size, size // Destination: full canvas
    )

    // Reset transform
    context.setTransform(1, 0, 0, 1, 0, 0)

    // Convert to image
    const imageData = canvas.toDataURL('image/png')
    // Add to captured images array and keep camera running
    setCapturedImages(prev => {
      const newImages = [...prev, imageData]
      // Limit to MAX_PHOTOS
      return newImages.slice(0, MAX_PHOTOS)
    })
  }

  // Generate photobooth strip
  const generateStrip = async (): Promise<string | null> => {
    if (capturedImages.length === 0 || !stripCanvasRef.current) return null

    const canvas = stripCanvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Strip dimensions
    const borderWidth = 20
    const padding = 30
    const photoSpacing = 10
    const photoWidth = 400
    const photoHeight = 400 // Square photos
    const photosPerRow = 3
    const rows = 2
    
    const stripWidth = photoWidth * photosPerRow + photoSpacing * (photosPerRow - 1) + padding * 2 + borderWidth * 2
    const stripHeight = photoHeight * rows + photoSpacing * (rows - 1) + padding * 2 + borderWidth * 2 + 120 // Extra space for logo and text
    
    canvas.width = stripWidth
    canvas.height = stripHeight

    // Fill with pink border
    ctx.fillStyle = '#FFB6C1'
    ctx.fillRect(0, 0, stripWidth, stripHeight)

    // Inner white area
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(borderWidth, borderWidth, stripWidth - borderWidth * 2, stripHeight - borderWidth * 2)

    // Draw logo at top
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 36px Arial'
    ctx.textAlign = 'center'

    // Draw photos
    const startX = borderWidth + padding
    const startY = borderWidth + padding + 60

    // Load all images first
    const images = await Promise.all(capturedImages.slice(0, MAX_PHOTOS).map(loadImage))

    // Draw all photos
    for (let i = 0; i < images.length; i++) {
      const row = Math.floor(i / photosPerRow)
      const col = i % photosPerRow
      
      const x = startX + col * (photoWidth + photoSpacing)
      const y = startY + row * (photoHeight + photoSpacing)

      // Draw photo border
      ctx.strokeStyle = '#E0E0E0'
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, photoWidth, photoHeight)

      // Draw photo (crop to square to avoid stretching)
      const img = images[i]
      const minSide = Math.min(img.width, img.height)
      const cropX = (img.width - minSide) / 2
      const cropY = (img.height - minSide) / 2
      
      ctx.drawImage(
        img,
        cropX,
        cropY,
        minSide,
        minSide,
        x,
        y,
        photoWidth,
        photoHeight
      )
    }

    // Draw bottom text
    ctx.fillStyle = '#888888'
    ctx.font = '24px Arial'
    ctx.fillText('natwodev', stripWidth / 2, stripHeight - borderWidth - 20)

    return canvas.toDataURL('image/png')
  }

  // Download strip
  const downloadStrip = async () => {
    const stripData = await generateStrip()
    if (!stripData) return

    const link = document.createElement('a')
    link.download = `photobooth-strip-${Date.now()}.png`
    link.href = stripData
    link.click()
  }

  // Clear all photos
  const clearAllPhotos = () => {
    setCapturedImages([])
  }

  // Delete a specific photo
  const deletePhoto = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index))
  }

  // Detect mobile device for better camera permission guidance
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMobileDevice(/android|iphone|ipad|ipod|mobi/i.test(navigator.userAgent))
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Ensure video element gets stream when it changes position
  useEffect(() => {
    if (stream && videoRef.current) {
      if (videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream
      }
      // Ensure video plays when stream is set
      videoRef.current.play().catch(console.error)
    }
  }, [stream, capturedImages.length]) // Re-run when capturedImages changes to update video position

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">
            {t('Photobooth', 'Photobooth')}
          </h1>
        </div>

        {error && (
          <div className="bg-red-500/15 border border-red-500/40 text-red-100 rounded-2xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="bg-[#0f1118] text-white rounded-[32px] border border-white/10 shadow-2xl overflow-hidden">
          {/* Window header */}
          <div className="flex items-center gap-3 px-6 py-4 bg-[#191d24] border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="font-semibold text-white/90">Photo Booth</span>
            <span className="ml-auto text-sm text-white/50">
              {capturedImages.length}/{MAX_PHOTOS}
            </span>
          </div>

          <div className="grid lg:grid-cols-[3fr_2fr]">
            {/* Preview column */}
            <div className="relative bg-[#090b11] p-6">
              <div className="relative rounded-3xl overflow-hidden bg-black border border-white/10 shadow-inner">
                <div className="aspect-[4/3] w-full h-full">
                  {stream ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center gap-3 text-center px-6">
                      <p className="text-white text-lg font-semibold">
                        {t('Sẵn sàng chụp ảnh', 'Ready to capture')}
                      </p>
                      <p className="text-white/70 text-sm">
                        {t('Nhấn "Bắt đầu camera" để cho phép quyền và bắt đầu stream.', 'Tap "Start Camera" to grant permission and open the stream.')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {stream && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={capturePhoto}
                    disabled={capturedImages.length >= MAX_PHOTOS}
                    className="relative w-20 h-20 rounded-full border-8 border-white/15 transition hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label={t('Chụp ảnh', 'Capture photo')}
                  >
                    <span className="absolute inset-3 rounded-full bg-gradient-to-r from-brand-cyan to-brand-purple" />
                    <span className="absolute inset-5 rounded-full bg-white" />
                    <span className="sr-only">{t('Chụp ảnh', 'Capture photo')}</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-6 py-3 rounded-full font-semibold bg-white/10 text-white hover:bg-white/20 transition"
                  >
                    {t('Tắt camera', 'Stop Camera')}
                  </button>
                </div>
              )}

              {!stream && (
                <div className="mt-5 flex flex-col items-center gap-3 text-center">
                  <button
                    onClick={handleStartCamera}
                    disabled={isLoading}
                    className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-brand-cyan to-brand-purple text-white hover:opacity-90 active:opacity-80 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? t('Đang mở camera...', 'Opening camera...') : t('Bắt đầu camera', 'Start Camera')}
                  </button>
                  <p className="text-white/70 text-xs sm:text-sm max-w-sm">
                    {t(
                      'Nếu chưa thấy hộp thoại cho phép camera, hãy tải lại trang hoặc kiểm tra phần Cài đặt > Quyền riêng tư.',
                      'If you still do not see a permission prompt, reload the page or check Settings > Privacy.'
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="bg-[#111421] border-t border-white/5 lg:border-t-0 lg:border-l p-6 space-y-5 text-sm text-white/80">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-white font-semibold text-base">{t('Photobooth Strip', 'Photobooth Strip')}</p>
                  <p className="text-white/60 text-xs">
                    {t('Chụp đủ 6 ảnh để tải strip với phong cách Mac.', 'Capture 6 shots to download a Mac-style strip.')}
                  </p>
                </div>
                <div className="flex gap-2">
                  {capturedImages.length > 0 && capturedImages.length < MAX_PHOTOS && (
                    <button
                      onClick={clearAllPhotos}
                      className="px-3 py-2 rounded-lg text-xs font-semibold bg-red-500/20 text-red-200 hover:bg-red-500/30 transition"
                    >
                      {t('Xóa', 'Clear')}
                    </button>
                  )}
                  {capturedImages.length === MAX_PHOTOS && (
                    <button
                      onClick={downloadStrip}
                      className="px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-brand-cyan to-brand-purple text-white hover:opacity-90 transition"
                    >
                      {t('Tải strip', 'Download strip')}
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4">
                <div className="border-4 border-pink-300 rounded-2xl p-3 bg-white text-black">
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: MAX_PHOTOS }).map((_, index) => {
                      const imageSrc = capturedImages[index]
                      const photoId = imageSrc ? `photo-${index}-${imageSrc.slice(0, 20)}` : `empty-${index}`
                      let content: ReactNode
                      if (imageSrc) {
                        content = (
                          <>
                            <img src={imageSrc} alt={`${t('Ảnh', 'Photo')} ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => deletePhoto(index)}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center text-xs transition z-10"
                              title={t('Xóa', 'Delete')}
                            >
                              ×
                            </button>
                          </>
                        )
                      } else {
                        content = <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">{index + 1}</div>
                      }

                      return (
                        <div key={photoId} className="relative aspect-square bg-gray-100 border-2 border-gray-300 rounded-xl overflow-hidden">
                          {content}
                        </div>
                      )
                    })}
                  </div>
                  <div className="text-center mt-2 text-gray-500 text-xs">photobooth</div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 space-y-2 text-xs sm:text-sm">
                <p className="font-semibold text-white">{t('Mẹo xin quyền camera', 'Camera permission tips')}</p>
                <ul className="space-y-1 list-disc list-inside marker:text-brand-cyan">
                  <li>{t('Nhấn "Bắt đầu camera" và chấp nhận hộp thoại cho phép.', 'Tap "Start Camera" and accept the permission prompt.')}</li>
                  <li>{t('Kiểm tra phần cài đặt của trình duyệt nếu bị chặn camera trước đó.', 'Check your browser settings if you previously blocked camera access.')}</li>
                  {isMobileDevice && (
                    <li>{t('Trên iPhone/iPad, hãy mở trang bằng HTTPS trong Safari.', 'On iPhone/iPad, open the page via HTTPS in Safari for best results.')}</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Controls bar */}
    
        </div>

        {/* Hidden canvas for capturing and strip generation */}
        <canvas ref={canvasRef} className="hidden" />
        <canvas ref={stripCanvasRef} className="hidden" />
      </div>
    </div>
  )
}

