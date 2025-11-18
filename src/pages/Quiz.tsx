import { useState } from 'react'
import { quizData } from '../data/quiz'
import QuizComponent from '../components/quiz/QuizComponent'
import QuizResults from '../components/quiz/QuizResults'
import { useLanguage } from '../hooks/useLanguage'

export default function Quiz() {
  const { lang } = useLanguage()
  const t = (vi: string, en: string) => (lang === 'vi' ? vi : en)
  
  const [isStarted, setIsStarted] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [results, setResults] = useState<{
    score: number
    total: number
    answers: number[]
  } | null>(null)

  const handleStart = () => {
    setIsStarted(true)
    setIsFinished(false)
    setResults(null)
  }

  const handleComplete = (score: number, total: number, answers: number[]) => {
    setIsFinished(true)
    setResults({ score, total, answers })
  }

  const handleRestart = () => {
    setIsStarted(false)
    setIsFinished(false)
    setResults(null)
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">
              {quizData.title}
            </h1>
            <p className="text-white/80 mb-8 text-lg">
              {quizData.description}
            </p>

            <div className="bg-white/5 rounded-xl p-6 mb-8 text-left">
              <h3 className="text-white font-semibold mb-4">
                {t('Thông tin bài thi:', 'Quiz Information:')}
              </h3>
              <div className="space-y-3 text-white/80">
                <div className="flex items-center justify-between">
                  <span>{t('Số câu hỏi:', 'Number of questions:')}</span>
                  <span className="font-semibold text-brand-cyan">{quizData.questions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t('Thời gian:', 'Time limit:')}</span>
                  <span className="font-semibold text-brand-purple">
                    {Math.floor(quizData.timeLimit / 60)} {t('phút', 'minutes')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t('Điểm tối đa:', 'Maximum score:')}</span>
                  <span className="font-semibold text-white">{quizData.questions.length}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="px-8 py-4 rounded-lg font-medium text-lg bg-gradient-to-r from-brand-cyan to-brand-purple text-white hover:opacity-90 transition transform hover:scale-105"
            >
              {t('Bắt đầu làm bài', 'Start Quiz')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isFinished && results) {
    return (
      <div className="min-h-screen py-12">
        <QuizResults
          quizData={quizData}
          score={results.score}
          total={results.total}
          answers={results.answers}
          onRestart={handleRestart}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">
          {quizData.title}
        </h1>
      </div>
      <QuizComponent quizData={quizData} onComplete={handleComplete} />
    </div>
  )
}

