import React, { useState, useEffect } from 'react'
import { ArrowLeft, Clock, Target, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react'
import { TestResult } from '../types'

interface TumblingETestProps {
  onComplete: (result: TestResult) => void
  onBack: () => void
}

type Direction = 'up' | 'down' | 'left' | 'right'

const TumblingETest: React.FC<TumblingETestProps> = ({ onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<Direction | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [startTime] = useState(Date.now())
  const [questions, setQuestions] = useState<Array<{
    direction: Direction
    size: number
  }>>([])

  const totalQuestions = 12

  useEffect(() => {
    generateQuestions()
  }, [])

  const generateQuestions = () => {
    const directions: Direction[] = ['up', 'down', 'left', 'right']
    const newQuestions = []
    
    for (let i = 0; i < totalQuestions; i++) {
      const randomDirection = directions[Math.floor(Math.random() * directions.length)]
      const size = 200 - (i * 12)
      
      newQuestions.push({
        direction: randomDirection,
        size: Math.max(size, 50)
      })
    }
    setQuestions(newQuestions)
  }

  const handleAnswer = (answer: Direction) => {
    if (showFeedback) return

    setSelectedAnswer(answer)
    setShowFeedback(true)

    if (answer === questions[currentQuestion].direction) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
      } else {
        const duration = Math.floor((Date.now() - startTime) / 1000)
        const finalScore = answer === questions[currentQuestion].direction ? score + 1 : score
        onComplete({
          testType: 'tumbling',
          score: finalScore,
          totalQuestions,
          points: finalScore * 12,
          duration
        })
      }
    }, 1500)
  }

  if (questions.length === 0) {
    return <div className="text-center text-white text-2xl">Loading...</div>
  }

  const currentQ = questions[currentQuestion]
  const rotation = {
    up: 270,
    down: 90,
    left: 180,
    right: 0
  }[currentQ.direction]

  const isCorrect = selectedAnswer === currentQ.direction

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
          <div className="bg-[#F7CAC9] h-6 rounded-full border-4 border-[#6B5B95] overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#6B5B95] to-[#88B04B] h-full transition-all duration-500 flex items-center justify-end pr-2"
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
            Which Direction is the E Pointing? 👁️
          </h3>
          <p className="text-gray-700 font-semibold">
            Click the arrow button that matches the direction of the letter E's opening.
          </p>
        </div>

        {/* E Display */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-[#F7CAC9] to-white p-12 rounded-3xl border-8 border-[#6B5B95] shadow-inner">
            <div 
              className="font-bold text-[#6B5B95] transition-all duration-300"
              style={{ 
                fontSize: `${currentQ.size}px`,
                transform: `rotate(${rotation}deg)`,
                fontFamily: 'monospace',
                lineHeight: 1
              }}
            >
              E
            </div>
          </div>
        </div>

        {/* Answer Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => handleAnswer('up')}
            disabled={showFeedback}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-4 transition-all transform hover:scale-105 ${
              showFeedback && selectedAnswer === 'up'
                ? isCorrect
                  ? 'bg-green-100 border-green-500 scale-110'
                  : 'bg-red-100 border-red-500 scale-95'
                : 'bg-white border-[#6B5B95] hover:bg-[#F7CAC9]'
            } ${showFeedback && currentQ.direction === 'up' && selectedAnswer !== 'up' ? 'ring-4 ring-green-300' : ''}`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${
              showFeedback && selectedAnswer === 'up'
                ? isCorrect ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'
                : 'bg-[#6B5B95] border-white'
            }`}>
              <ArrowUp className="w-8 h-8 text-white" />
            </div>
            <span className="font-bold text-lg text-[#6B5B95]">Up</span>
          </button>

          <button
            onClick={() => handleAnswer('down')}
            disabled={showFeedback}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-4 transition-all transform hover:scale-105 ${
              showFeedback && selectedAnswer === 'down'
                ? isCorrect
                  ? 'bg-green-100 border-green-500 scale-110'
                  : 'bg-red-100 border-red-500 scale-95'
                : 'bg-white border-[#88B04B] hover:bg-[#F7CAC9]'
            } ${showFeedback && currentQ.direction === 'down' && selectedAnswer !== 'down' ? 'ring-4 ring-green-300' : ''}`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${
              showFeedback && selectedAnswer === 'down'
                ? isCorrect ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'
                : 'bg-[#88B04B] border-white'
            }`}>
              <ArrowDown className="w-8 h-8 text-white" />
            </div>
            <span className="font-bold text-lg text-[#88B04B]">Down</span>
          </button>

          <button
            onClick={() => handleAnswer('left')}
            disabled={showFeedback}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-4 transition-all transform hover:scale-105 ${
              showFeedback && selectedAnswer === 'left'
                ? isCorrect
                  ? 'bg-green-100 border-green-500 scale-110'
                  : 'bg-red-100 border-red-500 scale-95'
                : 'bg-white border-[#FF6F61] hover:bg-[#F7CAC9]'
            } ${showFeedback && currentQ.direction === 'left' && selectedAnswer !== 'left' ? 'ring-4 ring-green-300' : ''}`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${
              showFeedback && selectedAnswer === 'left'
                ? isCorrect ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'
                : 'bg-[#FF6F61] border-white'
            }`}>
              <ArrowLeft className="w-8 h-8 text-white" />
            </div>
            <span className="font-bold text-lg text-[#FF6F61]">Left</span>
          </button>

          <button
            onClick={() => handleAnswer('right')}
            disabled={showFeedback}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-4 transition-all transform hover:scale-105 ${
              showFeedback && selectedAnswer === 'right'
                ? isCorrect
                  ? 'bg-green-100 border-green-500 scale-110'
                  : 'bg-red-100 border-red-500 scale-95'
                : 'bg-white border-[#6B5B95] hover:bg-[#F7CAC9]'
            } ${showFeedback && currentQ.direction === 'right' && selectedAnswer !== 'right' ? 'ring-4 ring-green-300' : ''}`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${
              showFeedback && selectedAnswer === 'right'
                ? isCorrect ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'
                : 'bg-[#6B5B95] border-white'
            }`}>
              <ArrowRight className="w-8 h-8 text-white" />
            </div>
            <span className="font-bold text-lg text-[#6B5B95]">Right</span>
          </button>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`text-center p-6 rounded-2xl border-4 ${
            isCorrect
              ? 'bg-green-100 border-green-500'
              : 'bg-red-100 border-red-500'
          }`}>
            <p className="text-3xl font-bold" style={{ fontFamily: "'Baloo 2', cursive" }}>
              {isCorrect ? '🎉 Perfect! +12 points' : '❌ Not quite! Keep trying'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TumblingETest
