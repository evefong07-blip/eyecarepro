import React, { useState, useEffect } from 'react'
import { ArrowLeft, Clock, Target, Eye } from 'lucide-react'
import { TestResult } from '../types'

interface PressureTestProps {
  onComplete: (result: TestResult) => void
  onBack: () => void
}

const PressureTest: React.FC<PressureTestProps> = ({ onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [startTime] = useState(Date.now())
  const [questions, setQuestions] = useState<Array<{
    pattern: 'concentric' | 'radial' | 'grid' | 'wave'
    correctAnswer: 'normal' | 'elevated' | 'high'
    intensity: number
  }>>([])

  const totalQuestions = 8

  useEffect(() => {
    generateQuestions()
  }, [])

  const generateQuestions = () => {
    const patterns: Array<'concentric' | 'radial' | 'grid' | 'wave'> = ['concentric', 'radial', 'grid', 'wave']
    const answers: Array<'normal' | 'elevated' | 'high'> = ['normal', 'elevated', 'high']
    
    const newQuestions = []
    for (let i = 0; i < totalQuestions; i++) {
      const pattern = patterns[Math.floor(Math.random() * patterns.length)]
      const correctAnswer = answers[Math.floor(Math.random() * answers.length)]
      const intensity = correctAnswer === 'normal' ? 0.3 : correctAnswer === 'elevated' ? 0.6 : 0.9
      
      newQuestions.push({ pattern, correctAnswer, intensity })
    }
    setQuestions(newQuestions)
  }

  const handleAnswer = (answer: string) => {
    if (showFeedback) return

    setSelectedAnswer(answer)
    setShowFeedback(true)

    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
      } else {
        const duration = Math.floor((Date.now() - startTime) / 1000)
        const finalScore = answer === questions[currentQuestion].correctAnswer ? score + 1 : score
        onComplete({
          testType: 'pressure',
          score: finalScore,
          totalQuestions,
          points: finalScore * 20,
          duration
        })
      }
    }, 2000)
  }

  if (questions.length === 0) {
    return <div className="text-center text-white text-2xl">Loading...</div>
  }

  const currentQ = questions[currentQuestion]

  const renderPattern = () => {
    const baseColor = '#6B5B95'
    const intensity = currentQ.intensity

    switch (currentQ.pattern) {
      case 'concentric':
        return (
          <div className="relative w-80 h-80 flex items-center justify-center">
            {[1, 2, 3, 4, 5].map((ring) => (
              <div
                key={ring}
                className="absolute rounded-full border-8"
                style={{
                  width: `${ring * 60}px`,
                  height: `${ring * 60}px`,
                  borderColor: baseColor,
                  opacity: intensity * (6 - ring) / 5,
                  animation: `pulse ${2 - intensity}s ease-in-out infinite`
                }}
              />
            ))}
            <Eye className="w-16 h-16 text-[#6B5B95] z-10" style={{ opacity: intensity }} />
          </div>
        )

      case 'radial':
        return (
          <div className="relative w-80 h-80 flex items-center justify-center">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-40 rounded-full"
                style={{
                  backgroundColor: baseColor,
                  opacity: intensity,
                  transform: `rotate(${i * 30}deg)`,
                  transformOrigin: 'center',
                  animation: `spin ${3 - intensity}s linear infinite`
                }}
              />
            ))}
            <div className="absolute w-20 h-20 rounded-full bg-[#88B04B] border-4 border-white" 
                 style={{ opacity: intensity }} />
          </div>
        )

      case 'grid':
        return (
          <div className="grid grid-cols-8 gap-2 w-80 h-80 p-4">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg transition-all"
                style={{
                  backgroundColor: baseColor,
                  opacity: intensity * (Math.random() * 0.5 + 0.5),
                  animation: `pulse ${1.5 - intensity * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.02}s`
                }}
              />
            ))}
          </div>
        )

      case 'wave':
        return (
          <div className="relative w-80 h-80 flex items-center justify-center overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-8 rounded-full"
                style={{
                  backgroundColor: baseColor,
                  opacity: intensity * 0.7,
                  transform: `translateY(${i * 40 - 160}px)`,
                  animation: `wave ${2 - intensity * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes wave {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-10px) scaleY(1.1); }
        }
      `}</style>

      <div className="bg-white rounded-3xl p-8 border-8 border-[#88B04B] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 bg-[#FF6F61] text-white px-6 py-3 rounded-full font-bold border-4 border-white shadow-lg hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-[#88B04B] to-[#6B5B95] text-white px-6 py-3 rounded-full border-4 border-white shadow-lg">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span className="font-bold">Question {currentQuestion + 1}/{totalQuestions}</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-[#FF6F61] to-[#F7CAC9] text-white px-6 py-3 rounded-full border-4 border-white shadow-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-bold">Score: {score}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-[#F7CAC9] h-6 rounded-full border-4 border-[#88B04B] overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#88B04B] to-[#6B5B95] h-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            >
              <span className="text-white text-xs font-bold">
                {Math.round(((currentQuestion + 1) / totalQuestions) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-[#88B04B] to-[#F7CAC9] p-6 rounded-2xl border-4 border-[#6B5B95] mb-8">
          <h3 className="text-2xl font-bold text-[#6B5B95] mb-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
            Assess Eye Pressure Pattern! 👁️
          </h3>
          <p className="text-gray-700 font-semibold">
            Look at the visual pattern and determine the pressure level it represents.
          </p>
        </div>

        {/* Pattern Display */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-8 rounded-3xl border-8 border-[#6B5B95] shadow-inner">
            {renderPattern()}
          </div>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {['normal', 'elevated', 'high'].map((option) => {
            const isCorrect = option === currentQ.correctAnswer
            const isSelected = option === selectedAnswer
            
            const colors = {
              normal: 'from-[#88B04B] to-[#6B5B95]',
              elevated: 'from-[#F7CAC9] to-[#FF6F61]',
              high: 'from-[#FF6F61] to-[#6B5B95]'
            }

            const labels = {
              normal: 'Normal Pressure',
              elevated: 'Elevated Pressure',
              high: 'High Pressure'
            }
            
            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback}
                className={`p-6 rounded-2xl border-4 font-bold text-xl transition-all transform hover:scale-105 ${
                  showFeedback && isSelected
                    ? isCorrect
                      ? 'bg-green-500 border-green-700 text-white scale-110'
                      : 'bg-red-500 border-red-700 text-white scale-95'
                    : `bg-gradient-to-br ${colors[option as keyof typeof colors]} border-white text-white hover:scale-110`
                } ${showFeedback && isCorrect ? 'ring-8 ring-green-300' : ''}`}
                style={{ fontFamily: "'Baloo 2', cursive" }}
              >
                {labels[option as keyof typeof labels]}
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`text-center p-6 rounded-2xl border-4 ${
            selectedAnswer === currentQ.correctAnswer
              ? 'bg-green-100 border-green-500'
              : 'bg-red-100 border-red-500'
          }`}>
            <p className="text-3xl font-bold mb-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
              {selectedAnswer === currentQ.correctAnswer ? '🎉 Perfect! +20 points' : '❌ Not quite right!'}
            </p>
            <p className="text-lg text-gray-700">
              {selectedAnswer === currentQ.correctAnswer 
                ? 'You correctly identified the pressure pattern!' 
                : `The correct answer was: ${currentQ.correctAnswer} pressure`}
            </p>
          </div>
        )}

        {/* Educational Note */}
        <div className="mt-8 bg-gradient-to-r from-[#F7CAC9] to-white p-6 rounded-2xl border-4 border-[#88B04B]">
          <p className="text-sm text-gray-700 font-semibold">
            💡 <strong>Note:</strong> This is an educational simulation. For actual eye pressure testing, please consult an eye care professional.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PressureTest
