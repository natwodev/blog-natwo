import type { QuizData } from '../../data/quiz'
import { useLanguage } from '../../hooks/useLanguage'

interface QuizResultsProps {
  readonly quizData: QuizData
  readonly score: number
  readonly total: number
  readonly answers: number[]
  onRestart: () => void
}

export default function QuizResults({ quizData, score, total, answers, onRestart }: QuizResultsProps) {
  const { lang } = useLanguage()
  const t = (vi: string, en: string) => (lang === 'vi' ? vi : en)
  
  const percentage = Math.round((score / total) * 100)
  const getGrade = () => {
    if (percentage >= 90) return { text: t('Xuất sắc', 'Excellent'), color: 'text-green-400' }
    if (percentage >= 70) return { text: t('Tốt', 'Good'), color: 'text-blue-400' }
    if (percentage >= 50) return { text: t('Trung bình', 'Average'), color: 'text-yellow-400' }
    return { text: t('Cần cải thiện', 'Needs Improvement'), color: 'text-red-400' }
  }

  const grade = getGrade()

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Results Summary */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          {t('Kết quả bài thi', 'Quiz Results')}
        </h2>
        
        <div className="mb-6">
          <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">
            {percentage}%
          </div>
          <div className={`text-xl font-semibold ${grade.color}`}>
            {grade.text}
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-cyan">{score}</div>
            <div className="text-white/60 text-sm">{t('Câu đúng', 'Correct')}</div>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{total}</div>
            <div className="text-white/60 text-sm">{t('Tổng số câu', 'Total Questions')}</div>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-purple">{total - score}</div>
            <div className="text-white/60 text-sm">{t('Câu sai', 'Incorrect')}</div>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="px-8 py-3 rounded-lg font-medium bg-gradient-to-r from-brand-cyan to-brand-purple text-white hover:opacity-90 transition"
        >
          {t('Làm lại', 'Restart Quiz')}
        </button>
      </div>

      {/* Detailed Results */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white mb-4">
          {t('Chi tiết câu trả lời', 'Answer Details')}
        </h3>
        
        {quizData.questions.map((question, index) => {
          const userAnswer = answers[index]
          const isCorrect = userAnswer === question.correctAnswer
          
          return (
            <div
              key={question.id}
              className={`bg-white/5 backdrop-blur-sm rounded-xl p-6 border-2 ${
                isCorrect ? 'border-green-500/50' : 'border-red-500/50'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    isCorrect
                      ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50'
                      : 'bg-red-500/20 text-red-400 border-2 border-red-500/50'
                  }`}
                >
                  {isCorrect ? '✓' : '✗'}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-2">
                    {t('Câu', 'Question')} {index + 1}: {question.question}
                  </h4>
                  
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => {
                      const isUserAnswer = optIndex === userAnswer
                      const isCorrectAnswer = optIndex === question.correctAnswer
                      
                      return (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg ${
                            isCorrectAnswer
                              ? 'bg-green-500/20 border border-green-500/50'
                              : isUserAnswer && !isCorrect
                              ? 'bg-red-500/20 border border-red-500/50'
                              : 'bg-white/5 border border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isCorrectAnswer && (
                              <span className="text-green-400 font-bold">✓</span>
                            )}
                            {isUserAnswer && !isCorrect && (
                              <span className="text-red-400 font-bold">✗</span>
                            )}
                            <span
                              className={
                                isCorrectAnswer
                                  ? 'text-green-300 font-medium'
                                  : isUserAnswer && !isCorrect
                                  ? 'text-red-300'
                                  : 'text-white/60'
                              }
                            >
                              {option}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {question.explanation && (
                    <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="text-blue-300 text-sm font-medium mb-1">
                        {t('Giải thích:', 'Explanation:')}
                      </div>
                      <div className="text-white/80 text-sm">{question.explanation}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

