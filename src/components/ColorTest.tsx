import React, { useState, useEffect } from 'react'
import { ArrowLeft, Clock, Target } from 'lucide-react'
import { TestResult } from '../types'

interface ColorTestProps {
  onComplete: (result: TestResult) => void
  onBack: () => void
}

const ColorTest: React.FC<ColorTestProps> = ({ onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [startTime] = useState(Date.now())
  const [questions, setQuestions] = useState<Array<{
    baseColor: string
    differentIndex: number
    gridSize: number
  }>>([])

  const totalQuestions = 10

  useEffect(() => {
    generateQuestions()
  }, [])

  const generateQuestions = () => {
    const newQuestions = []
    for (let i = 0; i < totalQuestions; i++) {
      const baseHue = Math.floor(Math.random() * 360)
      const baseSat = 60 + Math.floor(Math.random() * 30)
      const baseLit = 50 + Math.floor(Math.random() * 20)
      const gridSize = 3 + Math.floor(i / 3)
      
      newQuestions.push({
        baseColor: `hsl(${baseHue}, ${baseSat}%, ${baseLit}%)`,
        differentIndex: Math.floor(Math.random() * (gridSize * gridSize)),
        gridSize
      })
    }
    setQuestions(newQuestions)
  }

  const handleAnswer = (index: number) => {
    if (showFeedback) return

    setSelectedAnswer(index)
    setShowFeedback(true)

    if (index === questions[currentQuestion].differentIndex) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
      } else {
        const duration = Math.floor((Date.now() - startTime) / 1000)
        const finalScore = index === questions[currentQuestion].differentIndex ? score + 1 : score
        onComplete({
          testType: 'color',
          score: finalScore,
          totalQuestions,
          points: finalScore * 10,
          duration
        })
      }
    }, 1500)
  }

  if (questions.length === 0) {
    return <div className="text-center text-white text-2xl">Loading...</div>
  }

  const currentQ = questions[currentQuestion]
  const baseHsl = currentQ.baseColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
  const hue = parseInt(baseHsl![1])
  const sat = parseInt(baseHsl![2])
  const lit = parseInt(baseHsl![3])
  
  const differentColor = `hsl(${hue}, ${sat}%, ${lit + (currentQuestion < 5 ? 15 : 10)}%)`

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-8 border-8 border-[#FF6F61] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 bg-[#6B5B95] text-white px-6 py-3 rounded-full font-bold border-4 border-white shadow-lg hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-[#FF6F61] to-[#F7CAC9] text-white px-6 py-3 rounded-full border-4 border-white shadow-lg">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span className="font-bold">Question {currentQuestion + 1}/{totalQuestions}</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-[#88B04B] to-[#6B5B95] text-white px-6 py-3 rounded-full border-4 border-white shadow-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-bold">Score: {score}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-[#F7CAC9] h-6 rounded-full border-4 border-[#FF6F61] overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#FF6F61] to-[#6B5B95] h-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            >
              <span className="text-white text-xs font-bold">
                {Math.round(((currentQuestion + 1) / totalQuestions) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-[#F7CAC9] to-[#88B04B] p-6 rounded-2xl border-4 border-[#FF6F61] mb-8">
          <h3 className="text-2xl font-bold text-[#6B5B95] mb-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
            Find the Different Color! 🎨
          </h3>
          <p className="text-gray-700 font-semibold">
            Click on the circle that looks slightly different from the others.
          </p>
        </div>

        {/* Color Grid */}
        <div className="flex justify-center mb-8">
          <div 
            className="grid gap-4 p-8 bg-white rounded-3xl border-8 border-[#6B5B95] shadow-inner"
            style={{ 
              gridTemplateColumns: `repeat(${currentQ.gridSize}, 1fr)`,
            }}
          >
            {Array.from({ length: currentQ.gridSize * currentQ.gridSize }).map((_, index) => {
              const isCorrect = index === currentQ.differentIndex
              const isSelected = index === selectedAnswer
              const color = isCorrect ? differentColor : currentQ.baseColor
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showFeedback}
                  className={`w-20 h-20 rounded-full border-4 transition-all transform hover:scale-110 ${
                    showFeedback && isSelected
                      ? isCorrect
                        ? 'border-green-500 scale-125'
                        : 'border-red-500 scale-90'
                      : 'border-white hover:border-[#FF6F61]'
                  } ${showFeedback && isCorrect ? 'ring-8 ring-green-300' : ''}`}
                  style={{ 
                    backgroundColor: color,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`text-center p-6 rounded-2xl border-4 ${
            selectedAnswer === currentQ.differentIndex
              ? 'bg-green-100 border-green-500'
              : 'bg-red-100 border-red-500'
          }`}>
            <p className="text-3xl font-bold" style={{ fontFamily: "'Baloo 2', cursive" }}>
              {selectedAnswer === currentQ.differentIndex ? '🎉 Correct! +10 points' : '❌ Oops! Try the next one'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ColorTest
