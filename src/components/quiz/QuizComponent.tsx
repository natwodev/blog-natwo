import { useState, useEffect, useRef, useCallback } from 'react'
import type { QuizData } from '../../data/quiz'
import { useLanguage } from '../../hooks/useLanguage'

interface QuizComponentProps {
  readonly quizData: QuizData
  onComplete: (score: number, total: number, answers: number[]) => void
}

export default function QuizComponent({ quizData, onComplete }: QuizComponentProps) {
  const { lang } = useLanguage()
  const t = (vi: string, en: string) => (lang === 'vi' ? vi : en)
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [timeRemaining, setTimeRemaining] = useState(quizData.timeLimit)
  const [isFinished, setIsFinished] = useState(false)
  const selectedAnswersRef = useRef<number[]>([])
  
  // Sync ref with state
  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers
  }, [selectedAnswers])

  const handleFinish = useCallback(() => {
    if (isFinished) return
    setIsFinished(true)
    let score = 0
    const answers = selectedAnswersRef.current
    const questions = quizData.questions
    for (let index = 0; index < questions.length; index++) {
      if (answers[index] === questions[index].correctAnswer) {
        score++
      }
    }
    onComplete(score, questions.length, answers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished, onComplete])

  useEffect(() => {
    if (isFinished) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isFinished])

  // Check if time is up
  useEffect(() => {
    if (timeRemaining === 0 && !isFinished) {
      handleFinish()
    }
  }, [timeRemaining, isFinished, handleFinish])

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      handleFinish()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100

  if (isFinished) return null

  const currentQuestion = quizData.questions[currentQuestionIndex]

  // Safety check
  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 text-center text-white">
        <p>Error: Question not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-2xl font-bold text-white">
            {t('Câu hỏi', 'Question')} {currentQuestionIndex + 1} / {quizData.questions.length}
          </h2>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-white/80 text-xs sm:text-sm">
              {t('Thời gian còn lại:', 'Time remaining:')} <span className="font-bold text-brand-cyan">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2">
          <div
            className="bg-gradient-to-r from-brand-cyan to-brand-purple h-1.5 sm:h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10 mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-4 sm:mb-6">
          {currentQuestion.question}
        </h3>

        <div className="space-y-2 sm:space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestionIndex] === index
            return (
              <button
                key={`option-${currentQuestion.id}-${index}`}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-brand-cyan bg-brand-cyan/20 text-white'
                    : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/10 active:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'border-brand-cyan bg-brand-cyan'
                        : 'border-white/40'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="font-medium text-sm sm:text-base break-words">{option}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-4">
        {/* Question Number Buttons - Scrollable on mobile */}
        <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 min-w-max sm:min-w-0 sm:justify-center">
            {quizData.questions.map((question, index) => {
              const isCurrent = index === currentQuestionIndex
              const isAnswered = selectedAnswers[index] !== undefined
              let buttonClass = 'bg-white/10 text-white/60 hover:bg-white/20 active:bg-white/20'
              if (isCurrent) {
                buttonClass = 'bg-brand-cyan text-white'
              } else if (isAnswered) {
                buttonClass = 'bg-brand-purple/50 text-white'
              }
              
              return (
                <button
                  key={`question-${question.id}`}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition flex-shrink-0 text-xs sm:text-sm font-medium ${buttonClass}`}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>
        </div>

        {/* Previous/Next Buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition text-sm sm:text-base flex-1 sm:flex-none ${
              currentQuestionIndex === 0
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-white/20 active:bg-white/20'
            }`}
          >
            {t('Trước', 'Previous')}
          </button>

          <button
            onClick={handleNext}
            className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium bg-gradient-to-r from-brand-cyan to-brand-purple text-white hover:opacity-90 active:opacity-80 transition text-sm sm:text-base flex-1 sm:flex-none"
          >
            {currentQuestionIndex === quizData.questions.length - 1
              ? t('Hoàn thành', 'Finish')
              : t('Tiếp theo', 'Next')}
          </button>
        </div>
      </div>
    </div>
  )
}

