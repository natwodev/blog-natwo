import { useState, useRef, useEffect } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import { useLanguage } from '../hooks/useLanguage'

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

type LocalizedText = {
  vi: string
  en: string
}

type StripPreset = {
  id: string
  name: LocalizedText
  description: LocalizedText
  footerText: LocalizedText
  headerText?: LocalizedText
  outerBorderColor: string
  innerBackgroundColor?: string
  innerBackgroundGradient?: { from: string; to: string }
  photoBorderColor: string
  footerColor: string
  headerColor?: string
  previewColors: string[]
  borderWidth?: number
  padding?: number
  photoSpacing?: number
  photoSize?: number
  extraSpace?: number
  fontFamily?: string
}

const stripPresets: StripPreset[] = [
  {
    id: 'mac',
    name: { vi: 'Mac Pastel', en: 'Mac Pastel' },
    description: {
      vi: 'Viền hồng mềm mại, cảm hứng macOS.',
      en: 'Soft pink frame inspired by macOS.'
    },
    headerText: { vi: 'photobooth', en: 'photobooth' },
    footerText: { vi: 'natwodev', en: 'natwodev' },
    outerBorderColor: '#FFB6C1',
    innerBackgroundColor: '#FFFFFF',
    photoBorderColor: '#E0E0E0',
    footerColor: '#8E8EA0',
    headerColor: '#8E8EA0',
    previewColors: ['#FFB6C1', '#FFFFFF', '#E0E0E0'],
    fontFamily: 'Arial'
  }
]

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
  const [selectedPresetId, setSelectedPresetId] = useState<string>(stripPresets[0].id)
  const [customPresetOverrides, setCustomPresetOverrides] = useState<Record<string, Partial<StripPreset>>>({})
  const MAX_PHOTOS = 6

  const mergePreset = (preset: StripPreset): StripPreset => ({
    ...preset,
    ...customPresetOverrides[preset.id]
  })

  const selectedPresetBase = stripPresets.find(preset => preset.id === selectedPresetId) ?? stripPresets[0]
  const selectedPreset = mergePreset(selectedPresetBase)
  const translate = (text?: LocalizedText) => (text ? t(text.vi, text.en) : '')
  type PresetColorKey = 'outerBorderColor' | 'innerBackgroundColor' | 'photoBorderColor'

  const editableColors: { key: PresetColorKey; label: LocalizedText }[] = [
    { key: 'outerBorderColor', label: { vi: 'Viền ngoài', en: 'Outer border' } },
    { key: 'innerBackgroundColor', label: { vi: 'Nền trong', en: 'Inner background' } },
    { key: 'photoBorderColor', label: { vi: 'Viền ảnh', en: 'Photo border' } }
  ]

  const getPresetColorValue = (preset: StripPreset, key: PresetColorKey) => {
    switch (key) {
      case 'innerBackgroundColor':
        if (preset.innerBackgroundColor) return preset.innerBackgroundColor
        if (preset.innerBackgroundGradient) return preset.innerBackgroundGradient.from
        return '#FFFFFF'
      case 'outerBorderColor':
        return preset.outerBorderColor
      case 'photoBorderColor':
        return preset.photoBorderColor
      default:
        return '#FFFFFF'
    }
  }

  const handlePresetColorChange = (presetId: string, key: PresetColorKey, value: string) => {
    setCustomPresetOverrides(prev => {
      const current = prev[presetId] ?? {}
      const updated: Partial<StripPreset> = {
        ...current,
        [key]: value
      }

      if (key === 'innerBackgroundColor') {
        updated.innerBackgroundGradient = undefined
      }

      return {
        ...prev,
        [presetId]: updated
      }
    })
  }

  const handleResetPreset = (presetId: string) => {
    setCustomPresetOverrides(prev => {
      if (!prev[presetId]) return prev
      const next = { ...prev }
      delete next[presetId]
      return next
    })
  }

  const getPreviewBackgroundStyle = (): CSSProperties => {
    if (selectedPreset.innerBackgroundGradient) {
      return {
        backgroundImage: `linear-gradient(135deg, ${selectedPreset.innerBackgroundGradient.from}, ${selectedPreset.innerBackgroundGradient.to})`
      }
    }

    return {
      backgroundColor: selectedPreset.innerBackgroundColor ?? '#FFFFFF'
    }
  }

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
    const borderWidth = selectedPreset.borderWidth ?? 20
    const padding = selectedPreset.padding ?? 30
    const photoSpacing = selectedPreset.photoSpacing ?? 10
    const photoWidth = selectedPreset.photoSize ?? 400
    const photoHeight = selectedPreset.photoSize ?? 400 // Square photos
    const photosPerRow = 3
    const rows = 2
    const extraSpace = selectedPreset.extraSpace ?? 120
    
    const stripWidth = photoWidth * photosPerRow + photoSpacing * (photosPerRow - 1) + padding * 2 + borderWidth * 2
    const stripHeight = photoHeight * rows + photoSpacing * (rows - 1) + padding * 2 + borderWidth * 2 + extraSpace // Extra space for logo and text
    
    canvas.width = stripWidth
    canvas.height = stripHeight

    // Fill with pink border
    ctx.fillStyle = selectedPreset.outerBorderColor
    ctx.fillRect(0, 0, stripWidth, stripHeight)

    // Inner white area
    if (selectedPreset.innerBackgroundGradient) {
      const gradient = ctx.createLinearGradient(0, borderWidth, stripWidth, stripHeight - borderWidth)
      gradient.addColorStop(0, selectedPreset.innerBackgroundGradient.from)
      gradient.addColorStop(1, selectedPreset.innerBackgroundGradient.to)
      ctx.fillStyle = gradient
    } else {
      ctx.fillStyle = selectedPreset.innerBackgroundColor ?? '#FFFFFF'
    }
    ctx.fillRect(borderWidth, borderWidth, stripWidth - borderWidth * 2, stripHeight - borderWidth * 2)

    // Draw logo at top
    ctx.textAlign = 'center'
    const headerText = translate(selectedPreset.headerText)
    if (headerText) {
      ctx.fillStyle = selectedPreset.headerColor ?? '#000000'
      ctx.font = `600 32px ${selectedPreset.fontFamily ?? 'Arial'}`
      ctx.fillText(headerText, stripWidth / 2, borderWidth + padding + 24)
    }

    // Draw photos
    const startX = borderWidth + padding
    const startY = borderWidth + padding + (headerText ? 90 : 60)

    // Load all images first
    const images = await Promise.all(capturedImages.slice(0, MAX_PHOTOS).map(loadImage))

    // Draw all photos
    for (let i = 0; i < images.length; i++) {
      const row = Math.floor(i / photosPerRow)
      const col = i % photosPerRow
      
      const x = startX + col * (photoWidth + photoSpacing)
      const y = startY + row * (photoHeight + photoSpacing)

      // Draw photo border
      ctx.strokeStyle = selectedPreset.photoBorderColor
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
    ctx.fillStyle = selectedPreset.footerColor
    ctx.font = `24px ${selectedPreset.fontFamily ?? 'Arial'}`
    ctx.fillText(translate(selectedPreset.footerText), stripWidth / 2, stripHeight - borderWidth - 20)

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
            {/* Download button for desktop: only show on desktop, not mobile, and only if ready */}
            {!isMobileDevice && capturedImages.length === MAX_PHOTOS && (
              <button
                onClick={downloadStrip}
                className="ml-4 px-2 py-1 rounded-lg text-[11px] font-semibold bg-gradient-to-r from-brand-cyan to-brand-purple text-white hover:opacity-90 transition"
              >
                {t('Tải strip', 'Download strip')}
              </button>
            )}
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
                    className="relative w-14 h-14 rounded-full border-[5px] border-white/15 transition hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label={t('Chụp ảnh', 'Capture photo')}
                  >
                    <span className="absolute inset-[6px] rounded-full bg-gradient-to-r from-brand-cyan to-brand-purple" />
                    <span className="absolute inset-[11px] rounded-full bg-white" />
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
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="bg-[#111421] border-t border-white/5 lg:border-t-0 lg:border-l p-6 space-y-5 text-sm text-white/80">
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-2">
                  {/* Show download button under strip on mobile only */}
                  {isMobileDevice && capturedImages.length === MAX_PHOTOS && (
                    <button
                      onClick={downloadStrip}
                      className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-gradient-to-r from-brand-cyan to-brand-purple text-white hover:opacity-90 transition"
                    >
                      {t('Tải strip', 'Download strip')}
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4">
                <div
                  className="border-4 rounded-2xl p-3 text-black"
                  style={{ borderColor: selectedPreset.outerBorderColor, ...getPreviewBackgroundStyle() }}
                >
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
                        <div
                          key={photoId}
                          className="relative aspect-square bg-gray-100 border-2 rounded-xl overflow-hidden"
                          style={{ borderColor: selectedPreset.photoBorderColor }}
                        >
                          {content}
                        </div>
                      )
                    })}
                  </div>
                  <div className="text-center mt-2 text-xs font-medium" style={{ color: selectedPreset.footerColor }}>
                    photobooth
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/5 p-4 space-y-3">
                <p className="text-white text-xs font-semibold uppercase tracking-wide">
                  {t('Chọn phong cách strip', 'Choose your strip style')}
                </p>
                <div className="space-y-3">
                  {stripPresets.map(preset => {
                    const mergedPreset = mergePreset(preset)
                    const isActive = mergedPreset.id === selectedPresetId
                    const hasOverrides = Boolean(customPresetOverrides[mergedPreset.id])
                    return (
                      <div
                        key={mergedPreset.id}
                        className={`w-full rounded-2xl border px-4 py-3 transition bg-white/5 hover:bg-white/10 ${
                          isActive ? 'border-white/70 shadow-lg' : 'border-white/10'
                        }`}
                        style={{ borderColor: isActive ? mergedPreset.outerBorderColor : undefined }}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedPresetId(mergedPreset.id)}
                          className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-xl px-1 py-0.5"
                        >
                          <div className="flex items-center justify-between text-sm font-semibold text-white">
                            <span className="flex items-center gap-2">
                              {t(mergedPreset.name.vi, mergedPreset.name.en)}
                              {isActive && hasOverrides && (
                                <button
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleResetPreset(mergedPreset.id);
                                  }}
                                  className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/30 focus:outline-none transition"
                                  style={{ marginTop: '-2px' }}
                                  title={t('Reset màu', 'Reset colors')}
                                >
                                  <span aria-hidden className="text-xs leading-none">↺</span>
                                  <span className="sr-only">{t('Reset màu', 'Reset colors')}</span>
                                </button>
                              )}
                            </span>
                          </div>
                          <p className="text-xs text-white/60 mt-1">
                            {t(mergedPreset.description.vi, mergedPreset.description.en)}
                          </p>
                        </button>
                        <div className="flex gap-2 mt-3 px-1">
                          {editableColors.map(color => {
                            const value = getPresetColorValue(mergedPreset, color.key)
                            return (
                              <label key={`${mergedPreset.id}-${color.key}`} className="relative cursor-pointer">
                                <input
                                  type="color"
                                  value={value}
                                  onChange={event => handlePresetColorChange(mergedPreset.id, color.key, event.target.value)}
                                  aria-label={`${t('Đổi màu', 'Change color')} ${t(color.label.vi, color.label.en)}`}
                                  className="sr-only"
                                />
                                <span
                                  className="h-5 w-8 rounded-full border border-white/20 inline-flex items-center justify-center shadow-sm"
                                  style={{ backgroundColor: value }}
                                  title={t(color.label.vi, color.label.en)}
                                >
                                  <span className="sr-only">
                                    {t('Đổi màu', 'Change color')} {t(color.label.vi, color.label.en)}
                                  </span>
                                </span>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
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


