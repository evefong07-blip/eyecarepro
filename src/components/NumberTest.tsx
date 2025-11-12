import React, { useState, useEffect } from 'react'
import { ArrowLeft, Clock, Target } from 'lucide-react'
import { TestResult } from '../types'

interface NumberTestProps {
  onComplete: (result: TestResult) => void
  onBack: () => void
}

const NumberTest: React.FC<NumberTestProps> = ({ onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [startTime] = useState(Date.now())
  const [questions, setQuestions] = useState<Array<{
    number: number
    options: number[]
    pattern: Array<{ color: string; hasNumber: boolean }>
  }>>([])

  const totalQuestions = 10

  useEffect(() => {
    generateQuestions()
  }, [])

  const generateQuestions = () => {
    const newQuestions = []
    for (let i = 0; i < totalQuestions; i++) {
      const number = Math.floor(Math.random() * 90) + 10
      const options = [number]
      
      while (options.length < 4) {
        const option = Math.floor(Math.random() * 90) + 10
        if (!options.includes(option)) {
          options.push(option)
        }
      }
      
      options.sort(() => Math.random() - 0.5)
      
      const colors = ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9']
      const pattern = Array.from({ length: 64 }, (_, index) => ({
        color: colors[Math.floor(Math.random() * colors.length)],
        hasNumber: Math.random() > 0.7
      }))
      
      newQuestions.push({ number, options, pattern })
    }
    setQuestions(newQuestions)
  }

  const handleAnswer = (answer: number) => {
    if (showFeedback) return

    setSelectedAnswer(answer)
    setShowFeedback(true)

    if (answer === questions[currentQuestion].number) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
      } else {
        const duration = Math.floor((Date.now() - startTime) / 1000)
        const finalScore = answer === questions[currentQuestion].number ? score + 1 : score
        onComplete({
          testType: 'number',
          score: finalScore,
          totalQuestions,
          points: finalScore * 15,
          duration
        })
      }
    }, 1500)
  }

  if (questions.length === 0) {
    return <div className="text-center text-white text-2xl">Loading...</div>
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-8 border-8 border-[#6B5B95] shadow-2xl">
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
            <div className="bg-gradient-to-r from-[#6B5B95] to-[#88B04B] text-white px-6 py-3 rounded-full border-4 border-white shadow-lg">
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
          <div className="bg-[#88B04B] h-6 rounded-full border-4 border-[#6B5B95] overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#6B5B95] to-[#FF6F61] h-full transition-all duration-500 flex items-center justify-end pr-2"
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
            Find the Hidden Number! 🔢
          </h3>
          <p className="text-gray-700 font-semibold">
            Look carefully at the pattern and identify the number you see.
          </p>
        </div>

        {/* Number Pattern */}
        <div className="flex justify-center mb-8">
          <div className="relative bg-white p-8 rounded-3xl border-8 border-[#88B04B] shadow-inner">
            <div className="grid grid-cols-8 gap-2">
              {currentQ.pattern.map((dot, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md flex items-center justify-center font-bold text-white"
                  style={{ backgroundColor: dot.color }}
                >
                  {dot.hasNumber && (
                    <span className="text-xs opacity-70">
                      {currentQ.number.toString()[index % 2]}
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            {/* Hidden number overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-9xl font-bold opacity-20 text-[#6B5B95]" style={{ 
                fontFamily: "'Baloo 2', cursive",
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}>
                {currentQ.number}
              </div>
            </div>
          </div>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {currentQ.options.map((option) => {
            const isCorrect = option === currentQ.number
            const isSelected = option === selectedAnswer
            
            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback}
                className={`p-6 rounded-2xl border-4 font-bold text-3xl transition-all transform hover:scale-105 ${
                  showFeedback && isSelected
                    ? isCorrect
                      ? 'bg-green-500 border-green-700 text-white scale-110'
                      : 'bg-red-500 border-red-700 text-white scale-95'
                    : 'bg-gradient-to-br from-[#F7CAC9] to-white border-[#6B5B95] text-[#6B5B95] hover:from-[#FF6F61] hover:to-[#F7CAC9] hover:text-white'
                } ${showFeedback && isCorrect ? 'ring-8 ring-green-300' : ''}`}
                style={{ fontFamily: "'Baloo 2', cursive" }}
              >
                {option}
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`text-center p-6 rounded-2xl border-4 ${
            selectedAnswer === currentQ.number
              ? 'bg-green-100 border-green-500'
              : 'bg-red-100 border-red-500'
          }`}>
            <p className="text-3xl font-bold" style={{ fontFamily: "'Baloo 2', cursive" }}>
              {selectedAnswer === currentQ.number ? '🎉 Excellent! +15 points' : '❌ Not quite! The answer was ' + currentQ.number}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NumberTest
