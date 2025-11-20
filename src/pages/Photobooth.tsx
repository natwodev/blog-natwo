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

type MaxPhotosCount = 1 | 2 | 4 | 6

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
  const videoTrackRef = useRef<MediaStreamTrack | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  // Track if camera permission requested
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [maxZoom, setMaxZoom] = useState(1)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [selectedPresetId, setSelectedPresetId] = useState<string>(stripPresets[0].id)
  const [customPresetOverrides, setCustomPresetOverrides] = useState<Record<string, Partial<StripPreset>>>({})
  const [maxPhotos, setMaxPhotos] = useState<MaxPhotosCount>(6)
  const [isPortrait, setIsPortrait] = useState(false) // For 2 and 6 photos
  const [timerDuration, setTimerDuration] = useState<0 | 3 | 5 | 10>(0) // Timer duration in seconds (0 = no timer)
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [countdownValue, setCountdownValue] = useState(0)
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasCapturedRef = useRef(false) // Track if photo has been captured to prevent double capture
  const isCapturingRef = useRef(false) // Track if currently capturing to prevent multiple simultaneous captures
  const [flashEnabled, setFlashEnabled] = useState(false) // Flash on/off
  const [showFlash, setShowFlash] = useState(false) // Show flash effect
  const FLASH_DURATION_MS = 800

  // Trigger flash visual effect (independent from actual capture logic)
  const triggerFlash = () => {
    if (!flashEnabled) return
    setShowFlash(true)
    setTimeout(() => {
      setShowFlash(false)
    }, FLASH_DURATION_MS)
  }

  const mergePreset = (preset: StripPreset): StripPreset => ({
    ...preset,
    ...customPresetOverrides[preset.id]
  })

  const selectedPresetBase = stripPresets.find(preset => preset.id === selectedPresetId) ?? stripPresets[0]
  const selectedPreset = mergePreset(selectedPresetBase)
  const translate = (text?: LocalizedText) => (text ? t(text.vi, text.en) : '')
  
  const getGridColsClass = (count: MaxPhotosCount): string => {
    if (count === 1) return 'grid-cols-1'
    if (count === 2) return isPortrait ? 'grid-cols-1' : 'grid-cols-2'
    if (count === 4) return 'grid-cols-2'
    // 6 photos
    return isPortrait ? 'grid-cols-2' : 'grid-cols-3'
  }
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
  const startCamera = async (cameraFacingMode: 'user' | 'environment' = facingMode) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      // Get video track and check zoom capabilities
      const videoTrack = mediaStream.getVideoTracks()[0]
      videoTrackRef.current = videoTrack
      
      // Check if zoom is supported
      const capabilities = videoTrack.getCapabilities() as MediaTrackCapabilities & { zoom?: { min: number; max: number; step: number } }
      if (capabilities.zoom) {
        setMaxZoom(capabilities.zoom.max || 1)
        setZoomLevel(capabilities.zoom.min || 1)
      } else {
        // Fallback: use CSS transform for zoom (max 3x)
        setMaxZoom(3)
        setZoomLevel(1)
      }
      
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

  // Switch camera (front/back)
  const switchCamera = async () => {
    if (!stream || isLoading) return
    
    const currentStream = stream // Save reference before clearing
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(newFacingMode)
    
    // Stop current stream tracks
    for (const track of currentStream.getTracks()) {
      track.stop()
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
      videoRef.current.style.transform = ''
    }
    videoTrackRef.current = null
    setStream(null)
    
    // Reset zoom
    setZoomLevel(1)
    
    // Start new camera with opposite facing mode
    await startCamera(newFacingMode)
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
      videoRef.current.style.transform = ''
    }
    videoTrackRef.current = null
    setZoomLevel(1)
  }

  // Apply zoom level (shared function for buttons and slider)
  const applyZoom = async (newZoom: number) => {
    if (!videoTrackRef.current) return
    
    // Clamp zoom level
    const clampedZoom = Math.max(1, Math.min(newZoom, maxZoom))
    setZoomLevel(clampedZoom)
    
    const capabilities = videoTrackRef.current.getCapabilities() as MediaTrackCapabilities & { zoom?: { min: number; max: number; step: number } }
    if (capabilities.zoom) {
      // Hardware zoom
      try {
        await videoTrackRef.current.applyConstraints({
          advanced: [{ zoom: clampedZoom } as MediaTrackConstraints]
        })
      } catch (err) {
        console.error('Error applying zoom:', err)
      }
      return
    }
    // CSS transform zoom (fallback) - combine with mirror effect for front camera only
    if (videoRef.current) {
      const mirrorTransform = facingMode === 'user' ? 'scaleX(-1) ' : ''
      if (clampedZoom === 1) {
        videoRef.current.style.transform = facingMode === 'user' ? 'scaleX(-1)' : 'none'
      } else {
        videoRef.current.style.transform = `${mirrorTransform}scale(${clampedZoom})`
        videoRef.current.style.transformOrigin = 'center center'
      }
    }
  }

  // Zoom in
  const zoomIn = async () => {
    if (zoomLevel >= maxZoom) return
    await applyZoom(zoomLevel + 0.1)
  }

  // Zoom out
  const zoomOut = async () => {
    if (zoomLevel <= 1) return
    await applyZoom(zoomLevel - 0.1)
  }

  // Actual photo capture logic (no flash timing here)
  const doCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    // Prevent multiple simultaneous captures
    if (isCapturingRef.current) return
    isCapturingRef.current = true

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) {
      isCapturingRef.current = false
      return
    }

    const videoWidth = video.videoWidth
    const videoHeight = video.videoHeight
    
    // Check if using hardware zoom or CSS zoom
    let isHardwareZoom = false
    if (videoTrackRef.current) {
      const capabilities = videoTrackRef.current.getCapabilities() as MediaTrackCapabilities & { zoom?: { min: number; max: number; step: number } }
      isHardwareZoom = Boolean(capabilities.zoom)
    }
    
    // Calculate crop to match what's displayed in preview
    // With object-cover in a square container, the displayed area is a square from the center
    // Crop square from center of video source
    const baseSize = Math.min(videoWidth, videoHeight)
    let cropSize = baseSize
    let sourceX = (videoWidth - baseSize) / 2
    let sourceY = (videoHeight - baseSize) / 2
    
    // Apply zoom if using CSS zoom (fallback)
    if (!isHardwareZoom && zoomLevel > 1) {
      // CSS zoom: crop the zoomed area from center
      cropSize = baseSize / zoomLevel
      sourceX = (videoWidth - cropSize) / 2
      sourceY = (videoHeight - cropSize) / 2
    }
    
    // Set canvas to square
    canvas.width = baseSize
    canvas.height = baseSize

    // Flip horizontally only for front camera (mirror effect)
    // Back camera doesn't need flipping
    if (facingMode === 'user') {
      context.translate(canvas.width, 0)
      context.scale(-1, 1)
    }
    
    // Draw video frame to canvas (cropped to square, with zoom applied)
    context.drawImage(
      video,
      sourceX, sourceY, cropSize, cropSize, // Source: crop square from center (with zoom)
      0, 0, baseSize, baseSize // Destination: full canvas
    )

    // Reset transform
    context.setTransform(1, 0, 0, 1, 0, 0)

    // Convert to image
    const imageData = canvas.toDataURL('image/png')
    // Add to captured images array and keep camera running
    setCapturedImages(prev => {
      const newImages = [...prev, imageData]
      // Limit to maxPhotos
      return newImages.slice(0, maxPhotos)
    })
    
    // Reset capture flag after a short delay to allow state update
    setTimeout(() => {
      isCapturingRef.current = false
    }, 100)
  }

  // Capture photo with optional timer
  const capturePhoto = () => {
    if (isCountingDown || capturedImages.length >= maxPhotos || isCapturingRef.current) return

    // If no timer, trigger flash and capture immediately
    if (timerDuration === 0) {
      triggerFlash()
      doCapturePhoto()
      return
    }

    // Reset capture flags
    hasCapturedRef.current = false
    isCapturingRef.current = false

    // Start countdown
    setIsCountingDown(true)
    setCountdownValue(timerDuration)

    // Clear any existing interval
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }

    // Start countdown interval
    countdownIntervalRef.current = setInterval(() => {
      setCountdownValue(prev => {
        const newValue = prev - 1
        if (newValue <= 0) {
          // Countdown finished, capture photo (only once)
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current)
            countdownIntervalRef.current = null
          }
          setIsCountingDown(false)
          // Only capture if we haven't captured yet
          if (!hasCapturedRef.current) {
            hasCapturedRef.current = true
            triggerFlash()
            doCapturePhoto()
          }
          return 0
        }
        return newValue
      })
    }, 1000)
  }

  // Cleanup countdown on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [])

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
    // Calculate grid based on maxPhotos: 1 photo = 1x1, 2 photos = 2x1 (or 1x2 portrait), 4 photos = 2x2, 6 photos = 3x2 (or 2x3 portrait)
    let photosPerRow: number
    let rows: number
    if (maxPhotos === 1) {
      photosPerRow = 1
      rows = 1
    } else if (maxPhotos === 2) {
      if (isPortrait) {
        photosPerRow = 1
        rows = 2
      } else {
        photosPerRow = 2
        rows = 1
      }
    } else if (maxPhotos === 4) {
      photosPerRow = 2
      rows = 2
    } else if (maxPhotos === 6) {
      // 6 photos
      if (isPortrait) {
        photosPerRow = 2
        rows = 3
      } else {
        photosPerRow = 3
        rows = 2
      }
    } else {
      // Fallback (should not happen)
      photosPerRow = 3
      rows = 2
    }
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

    // Draw date/time at top left
    ctx.textAlign = 'left'
    const now = new Date()
    const dateTimeStr = now.toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    ctx.fillStyle = selectedPreset.headerColor ?? '#000000'
    ctx.font = `400 20px ${selectedPreset.fontFamily ?? 'Arial'}`
    ctx.fillText(dateTimeStr, borderWidth + padding, borderWidth + padding + 24)

    // Draw logo at top right
    ctx.textAlign = 'right'
    const headerText = translate(selectedPreset.headerText)
    if (headerText) {
      ctx.fillStyle = selectedPreset.headerColor ?? '#000000'
      ctx.font = `600 32px ${selectedPreset.fontFamily ?? 'Arial'}`
      ctx.fillText(headerText, stripWidth - borderWidth - padding, borderWidth + padding + 24)
    }

    // Draw photos
    const startX = borderWidth + padding
    const startY = borderWidth + padding + (headerText ? 90 : 60)

    // Load all images first
    const images = await Promise.all(capturedImages.slice(0, maxPhotos).map(loadImage))

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
    <>
      <style>{`
        @keyframes flash {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
      <div className="h-screen w-screen bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden flex flex-col relative">
        {/* Full screen flash effect */}
        {showFlash && (
          <div className="fixed inset-0 bg-white z-50 pointer-events-none animate-[flash_0.8s_ease-out]" />
        )}
        <div className="h-full w-full flex flex-col space-y-2 p-2 min-h-0">
        {error && (
          <div className="bg-red-500/15 border border-red-500/40 text-red-100 rounded-2xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

      

        <div className="bg-[#0f1118] text-white rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col flex-1 min-h-0">
          {/* Window header */}
          <div className="flex items-center gap-3 px-4 py-2 bg-[#191d24] border-b border-white/5 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="font-semibold text-white/90">Photo Booth</span>
            {/* Mobile: Stop Camera button above the window header, compact sizing */}
        {isMobileDevice && stream && (
          <div className="flex justify-center -mb-2">
            <button
              onClick={stopCamera}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition"
            >
              {t('Tắt camera', 'Stop Camera')}
            </button>
          </div>
        )}
            <span className="ml-auto text-sm text-white/50">
              {capturedImages.length}/{maxPhotos}
            </span>
              
            {/* Download button for desktop: only show on desktop, not mobile, and only if ready */}
            {!isMobileDevice && capturedImages.length === maxPhotos && (
              <button
                onClick={downloadStrip}
                className="ml-4 px-2 py-1 rounded-lg text-[11px] font-semibold bg-gradient-to-r from-brand-cyan to-brand-purple text-white hover:opacity-90 transition"
              >
                {t('Tải strip', 'Download strip')}
              </button>
            )}
          </div>

          <div className="grid lg:grid-cols-[3fr_2fr] flex-1 min-h-0 overflow-hidden">
            {/* Preview column */}
            <div className={`relative bg-[#090b11] p-3 ${isMobileDevice ? 'flex flex-col' : 'flex flex-col min-h-0 overflow-hidden'}`}>
              <div className={`relative rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner ${isMobileDevice ? 'aspect-square w-full flex-shrink-0' : 'flex-1 min-h-0'}`}>
                <div className="w-full h-full">
                  {stream ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                        style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
                      />
                      {/* Countdown overlay - transparent so camera is still visible */}
                      {isCountingDown && countdownValue > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                          <div className="text-center">
                            <div className="text-9xl font-bold text-white drop-shadow-2xl animate-pulse" style={{ textShadow: '0 0 30px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.6)' }}>
                              {countdownValue}
                            </div>
                            <p className="text-white text-lg mt-4 font-semibold drop-shadow-lg" style={{ textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>
                              {t('Chuẩn bị...', 'Get ready...')}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center gap-2 text-center px-4">
                      <p className="text-white text-base font-semibold">
                        {t('Sẵn sàng chụp ảnh', 'Ready to capture')}
                      </p>
                      <p className="text-white/70 text-xs">
                        {t('Nhấn "Bắt đầu camera" để cho phép quyền và bắt đầu stream.', 'Tap "Start Camera" to grant permission and open the stream.')}
                      </p>
                    </div>
                  )}
                </div>
                {/* Zoom controls and camera switch - positioned absolutely over video */}
                {stream && (
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                    <button
                      onClick={zoomIn}
                      disabled={zoomLevel >= maxZoom}
                      className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-lg font-bold transition disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-sm border border-white/20"
                      aria-label={t('Phóng to', 'Zoom in')}
                      title={t('Phóng to', 'Zoom in')}
                    >
                      +
                    </button>
                    <button
                      onClick={zoomOut}
                      disabled={zoomLevel <= 1}
                      className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-lg font-bold transition disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-sm border border-white/20"
                      aria-label={t('Thu nhỏ', 'Zoom out')}
                      title={t('Thu nhỏ', 'Zoom out')}
                    >
                      −
                    </button>
                    {/* Camera switch button - only show on mobile */}
                    {isMobileDevice && (
                      <button
                        onClick={switchCamera}
                        disabled={isLoading}
                        className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-sm border border-white/20"
                        aria-label={t('Đổi camera', 'Switch camera')}
                        title={t('Đổi camera', 'Switch camera')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {stream && (
                <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-2 flex-shrink-0">
                  <button
                    onClick={capturePhoto}
                    disabled={capturedImages.length >= maxPhotos || isCountingDown}
                    className={`relative ${isMobileDevice ? 'w-20 h-20' : 'w-14 h-14'} rounded-full border-[5px] border-white/15 transition hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed`}
                    aria-label={t('Chụp ảnh', 'Capture photo')}
                  >
                    <span className={`absolute ${isMobileDevice ? 'inset-[9px]' : 'inset-[6px]'} rounded-full bg-gradient-to-r from-brand-cyan to-brand-purple`} />
                    <span className={`absolute ${isMobileDevice ? 'inset-[15px]' : 'inset-[11px]'} rounded-full bg-white`} />
                    <span className="sr-only">{t('Chụp ảnh', 'Capture photo')}</span>
                  </button>
                  {/* Desktop: Show Stop Camera button next to capture on desktop only */}
                  {!isMobileDevice && (
                    <button
                      onClick={stopCamera}
                      className="px-6 py-3 rounded-full font-semibold bg-white/10 text-white hover:bg-white/20 transition"
                    >
                      {t('Tắt camera', 'Stop Camera')}
                    </button>
                  )}
                </div>
              )}

              {!stream && (
                <div className="mt-2 flex flex-col items-center gap-2 text-center flex-shrink-0">
                  <button
                    onClick={handleStartCamera}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-brand-cyan to-brand-purple text-white hover:opacity-90 active:opacity-80 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? t('Đang mở camera...', 'Opening camera...') : t('Bắt đầu camera', 'Start Camera')}
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="bg-[#111421] border-t border-white/5 lg:border-t-0 lg:border-l p-3 space-y-3 text-sm text-white/80 overflow-y-auto min-h-0">
              
              <div className="bg-white/5 rounded-2xl p-4">
                <div
                  className="border-4 rounded-2xl p-3 text-black"
                  style={{ borderColor: selectedPreset.outerBorderColor, ...getPreviewBackgroundStyle() }}
                >
                  {/* Header with date/time and photobooth text */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs font-normal" style={{ color: selectedPreset.headerColor ?? '#000000' }}>
                      {new Date().toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </div>
                    <div className="text-sm font-semibold" style={{ color: selectedPreset.headerColor ?? '#000000' }}>
                      {translate(selectedPreset.headerText) || 'photobooth'}
                    </div>
                  </div>
                  
                  <div className={`grid gap-2 ${getGridColsClass(maxPhotos)}`}>
                    {Array.from({ length: maxPhotos }).map((_, index) => {
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
                          className="relative aspect-square bg-gray-100 overflow-hidden"
                        >
                          {content}
                        </div>
                      )
                    })}
                  </div>
                  <div className="text-center mt-2 text-xs font-medium" style={{ color: selectedPreset.footerColor }}>
                    {translate(selectedPreset.footerText)}
                  </div>
                </div>
              </div>
              {/* Download button for mobile: place below strip preview, big size, only show when ready (above style selector) */}
              {isMobileDevice && capturedImages.length === maxPhotos && (
                <div className="w-full flex justify-center my-5">
                  <button
                    onClick={downloadStrip}
                    className="px-6 py-3 rounded-lg text-base font-bold bg-gradient-to-r from-brand-cyan to-brand-purple text-white shadow-lg hover:opacity-90 transition"
                  >
                    {t('Tải strip', 'Download strip')}
                  </button>
                </div>
              )}

{/* Photo count selector */}
<div className="bg-white/5 rounded-2xl p-4">
                <p className="text-white text-xs font-semibold uppercase tracking-wide mb-3">
                  {t('Số lượng ảnh', 'Number of photos')}
                </p>
                <select
                  value={maxPhotos}
                  onChange={(e) => {
                    const newCount = Number.parseInt(e.target.value) as MaxPhotosCount
                    setMaxPhotos(newCount)
                    if (capturedImages.length > newCount) {
                      setCapturedImages(prev => prev.slice(0, newCount))
                    }
                    // Reset portrait mode if switching to 1 or 4 photos
                    if (newCount === 1 || newCount === 4) {
                      setIsPortrait(false)
                    }
                  }}
                  className="w-full px-4 py-2 rounded-lg font-semibold bg-white/10 text-white border border-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-brand-cyan transition"
                >
                  <option value={1} className="bg-[#111421] text-white">1 {t('ảnh', 'photo')}</option>
                  <option value={2} className="bg-[#111421] text-white">2 {t('ảnh', 'photos')}</option>
                  <option value={4} className="bg-[#111421] text-white">4 {t('ảnh', 'photos')}</option>
                  <option value={6} className="bg-[#111421] text-white">6 {t('ảnh', 'photos')}</option>
                </select>
                {/* Portrait/Landscape toggle for 2 and 6 photos */}
                {(maxPhotos === 2 || maxPhotos === 6) && (
                  <button
                    type="button"
                    onClick={() => setIsPortrait(!isPortrait)}
                    className="w-full mt-3 px-4 py-2 rounded-lg font-semibold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform ${isPortrait ? 'rotate-90' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span>{isPortrait ? t('Xoay ngang', 'Landscape') : t('Xoay dọc', 'Portrait')}</span>
                  </button>
                )}
              </div>

              {/* Timer selector */}
              <div className="bg-white/5 rounded-2xl p-4">
                <p className="text-white text-xs font-semibold uppercase tracking-wide mb-3">
                  {t('Thời gian chụp', 'Capture timer')}
                </p>
                <select
                  value={timerDuration}
                  onChange={(e) => {
                    const newDuration = Number.parseInt(e.target.value) as 0 | 3 | 5 | 10
                    setTimerDuration(newDuration)
                    // Cancel any ongoing countdown
                    if (countdownIntervalRef.current) {
                      clearInterval(countdownIntervalRef.current)
                      countdownIntervalRef.current = null
                    }
                    setIsCountingDown(false)
                    setCountdownValue(0)
                    hasCapturedRef.current = false // Reset capture flag
                    isCapturingRef.current = false // Reset capturing flag
                  }}
                  disabled={isCountingDown}
                  className="w-full px-4 py-2 rounded-lg font-semibold bg-white/10 text-white border border-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-brand-cyan transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value={0} className="bg-[#111421] text-white">{t('Không hẹn giờ', 'No timer')}</option>
                  <option value={3} className="bg-[#111421] text-white">3 {t('giây', 'seconds')}</option>
                  <option value={5} className="bg-[#111421] text-white">5 {t('giây', 'seconds')}</option>
                  <option value={10} className="bg-[#111421] text-white">10 {t('giây', 'seconds')}</option>
                </select>
              </div>

              {/* Flash toggle */}
              <div className="bg-white/5 rounded-2xl p-4">
                <p className="text-white text-xs font-semibold uppercase tracking-wide mb-3">
                  {t('Đèn flash', 'Flash')}
                </p>
                <button
                  type="button"
                  onClick={() => setFlashEnabled(!flashEnabled)}
                  className={`w-full px-4 py-3 rounded-lg font-semibold border transition flex items-center justify-center gap-2 ${
                    flashEnabled
                      ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${flashEnabled ? 'text-yellow-300' : 'text-white/60'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>{flashEnabled ? t('Bật', 'On') : t('Tắt', 'Off')}</span>
                </button>
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
    </>
  )
}


