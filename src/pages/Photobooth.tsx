import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../hooks/useLanguage'

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
  const MAX_PHOTOS = 6

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
    ctx.fillText('NATWO PHOTOBOOTH', stripWidth / 2, borderWidth + 40)

    // Draw photos
    const startX = borderWidth + padding
    const startY = borderWidth + padding + 60

    // Load all images first
    const imagePromises = capturedImages.slice(0, MAX_PHOTOS).map((imageSrc) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = imageSrc
      })
    })

    const images = await Promise.all(imagePromises)

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

  // Auto-start camera on mount
  useEffect(() => {
    startCamera()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">
            {t('Photobooth', 'Photobooth')}
          </h1>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-200 text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Main content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Photobooth Strip with Camera */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                {t('Photobooth Strip', 'Photobooth Strip')}
              </h2>
              <div className="flex gap-2">
                {capturedImages.length > 0 && capturedImages.length < MAX_PHOTOS && (
                  <button
                    onClick={clearAllPhotos}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
                  >
                    {t('Xóa tất cả', 'Clear All')}
                  </button>
                )}
                {capturedImages.length === MAX_PHOTOS && (
                  <button
                    onClick={downloadStrip}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-cyan to-brand-purple text-white hover:opacity-90 transition"
                  >
                    {t('Tải xuống Strip', 'Download Strip')}
                  </button>
                )}
              </div>
            </div>

            {/* Strip Preview with Camera */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="border-4 border-pink-300 rounded-lg p-2 bg-white">
                {/* Logo */}
                <div className="text-center mb-2">
                  <h3 className="text-2xl sm:text-3xl font-bold text-black">NATWO PHOTOBOOTH</h3>
                </div>
                
                {/* Photo Grid with Camera */}
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: MAX_PHOTOS }).map((_, index) => {
                    const photoId = capturedImages[index] ? `photo-${index}-${capturedImages[index].slice(0, 20)}` : `empty-${index}`
                    const isCameraPosition = index === capturedImages.length && stream && !isLoading
                    
                    return (
                      <div
                        key={photoId}
                        className="relative aspect-square bg-gray-100 border-2 border-gray-300 rounded overflow-hidden"
                      >
                        {capturedImages[index] ? (
                          <>
                            <img
                              src={capturedImages[index]}
                              alt={`${t('Ảnh', 'Photo')} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => deletePhoto(index)}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center text-xs transition z-10"
                              title={t('Xóa', 'Delete')}
                            >
                              ×
                            </button>
                          </>
                        ) : isCameraPosition ? (
                          <div className="w-full h-full bg-black relative">
                            {index === capturedImages.length && (
                              <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                                style={{ transform: 'scaleX(-1)' }} // Mirror effect
                              />
                            )}
                            {isLoading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <div className="text-white text-xs">
                                  {t('Đang tải...', 'Loading...')}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            {index + 1}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                
                {/* Bottom text */}
                <div className="text-center mt-2">
                  <p className="text-gray-500 text-sm">natwodev</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            {capturedImages.length < MAX_PHOTOS && (
              <div className="flex flex-col sm:flex-row gap-3">
                {!stream ? (
                  <button
                    onClick={startCamera}
                    className="flex-1 px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-brand-cyan to-brand-purple text-white hover:opacity-90 active:opacity-80 transition"
                  >
                    {t('Bắt đầu camera', 'Start Camera')}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={capturePhoto}
                      disabled={capturedImages.length >= MAX_PHOTOS}
                      className="flex-1 px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-brand-cyan to-brand-purple text-white hover:opacity-90 active:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('Chụp ảnh', 'Capture Photo')} ({capturedImages.length}/{MAX_PHOTOS})
                    </button>
                    <button
                      onClick={stopCamera}
                      className="flex-1 px-6 py-3 rounded-lg font-medium bg-white/10 text-white hover:bg-white/20 active:bg-white/20 transition"
                    >
                      {t('Tắt camera', 'Stop Camera')}
                    </button>
                  </>
                )}
              </div>
            )}

            {capturedImages.length === MAX_PHOTOS && (
              <div className="text-center text-white/80 text-sm">
                {t('Đã chụp đủ 6 ảnh! Nhấn "Tải xuống Strip" để tải về.', 'All 6 photos captured! Click "Download Strip" to download.')}
              </div>
            )}
          </div>
        </div>

        {/* Hidden canvas for capturing and strip generation */}
        <canvas ref={canvasRef} className="hidden" />
        <canvas ref={stripCanvasRef} className="hidden" />
      </div>
    </div>
  )
}

