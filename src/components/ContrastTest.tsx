import React, { useState, useEffect } from 'react'
import { ArrowLeft, Clock, Target, Circle } from 'lucide-react'
import { TestResult } from '../types'

interface ContrastTestProps {
  onComplete: (result: TestResult) => void
  onBack: () => void
}

type Orientation = 'vertical' | 'horizontal' | 'diagonal-right' | 'diagonal-left'

const ContrastTest: React.FC<ContrastTestProps> = ({ onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<Orientation | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [startTime] = useState(Date.now())
  const [questions, setQuestions] = useState<Array<{
    orientation: Orientation
    contrast: number
  }>>([])

  const totalQuestions = 10

  useEffect(() => {
    generateQuestions()
  }, [])

  const generateQuestions = () => {
    const orientations: Orientation[] = ['vertical', 'horizontal', 'diagonal-right', 'diagonal-left']
    const newQuestions = []
    
    for (let i = 0; i < totalQuestions; i++) {
      const randomOrientation = orientations[Math.floor(Math.random() * orientations.length)]
      // Start with high contrast (0.9) and decrease to low contrast (0.1)
      const contrast = 0.9 - (i * 0.08)
      
      newQuestions.push({
        orientation: randomOrientation,
        contrast: Math.max(contrast, 0.1)
      })
    }
    setQuestions(newQuestions)
  }

  const handleAnswer = (answer: Orientation) => {
    if (showFeedback) return

    setSelectedAnswer(answer)
    setShowFeedback(true)

    if (answer === questions[currentQuestion].orientation) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
      } else {
        const duration = Math.floor((Date.now() - startTime) / 1000)
        const finalScore = answer === questions[currentQuestion].orientation ? score + 1 : score
        onComplete({
          testType: 'contrast',
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
  const isCorrect = selectedAnswer === currentQ.orientation

  // Generate stripe pattern based on orientation
  const generatePattern = (orientation: Orientation, contrast: number) => {
    const baseColor = 200
    const stripeColor = Math.round(baseColor - (contrast * 155))
    
    let gradient = ''
    const stripeWidth = 8
    
    switch (orientation) {
      case 'vertical':
        gradient = `repeating-linear-gradient(90deg, rgb(${baseColor}, ${baseColor}, ${baseColor}) 0px, rgb(${baseColor}, ${baseColor}, ${baseColor}) ${stripeWidth}px, rgb(${stripeColor}, ${stripeColor}, ${stripeColor}) ${stripeWidth}px, rgb(${stripeColor}, ${stripeColor}, ${stripeColor}) ${stripeWidth * 2}px)`
        break
      case 'horizontal':
        gradient = `repeating-linear-gradient(0deg, rgb(${baseColor}, ${baseColor}, ${baseColor}) 0px, rgb(${baseColor}, ${baseColor}, ${baseColor}) ${stripeWidth}px, rgb(${stripeColor}, ${stripeColor}, ${stripeColor}) ${stripeWidth}px, rgb(${stripeColor}, ${stripeColor}, ${stripeColor}) ${stripeWidth * 2}px)`
        break
      case 'diagonal-right':
        gradient = `repeating-linear-gradient(45deg, rgb(${baseColor}, ${baseColor}, ${baseColor}) 0px, rgb(${baseColor}, ${baseColor}, ${baseColor}) ${stripeWidth}px, rgb(${stripeColor}, ${stripeColor}, ${stripeColor}) ${stripeWidth}px, rgb(${stripeColor}, ${stripeColor}, ${stripeColor}) ${stripeWidth * 2}px)`
        break
      case 'diagonal-left':
        gradient = `repeating-linear-gradient(-45deg, rgb(${baseColor}, ${baseColor}, ${baseColor}) 0px, rgb(${baseColor}, ${baseColor}, ${baseColor}) ${stripeWidth}px, rgb(${stripeColor}, ${stripeColor}, ${stripeColor}) ${stripeWidth}px, rgb(${stripeColor}, ${stripeColor}, ${stripeColor}) ${stripeWidth * 2}px)`
        break
    }
    
    return gradient
  }

  return (
    <div className="max-w-4xl mx-auto">
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
        <div className="bg-gradient-to-r from-[#F7CAC9] to-[#88B04B] p-6 rounded-2xl border-4 border-[#88B04B] mb-8">
          <h3 className="text-2xl font-bold text-[#6B5B95] mb-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
            Identify the Stripe Pattern! 📊
          </h3>
          <p className="text-gray-700 font-semibold">
            Look carefully at the pattern and select the direction of the stripes. The contrast will get harder!
          </p>
        </div>

        {/* Pattern Display */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-8 rounded-3xl border-8 border-[#88B04B] shadow-inner">
            <div 
              className="w-80 h-80 rounded-2xl border-4 border-gray-300 transition-all duration-300"
              style={{ 
                background: generatePattern(currentQ.orientation, currentQ.contrast)
              }}
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 font-semibold">
                Contrast Level: {Math.round(currentQ.contrast * 100)}%
              </p>
              <div className="mt-2 bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#88B04B] to-[#6B5B95] h-full transition-all"
                  style={{ width: `${currentQ.contrast * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Answer Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => handleAnswer('vertical')}
            disabled={showFeedback}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-4 transition-all transform hover:scale-105 ${
              showFeedback && selectedAnswer === 'vertical'
                ? isCorrect
                  ? 'bg-green-100 border-green-500 scale-110'
                  : 'bg-red-100 border-red-500 scale-95'
                : 'bg-white border-[#88B04B] hover:bg-[#F7CAC9]'
            } ${showFeedback && currentQ.orientation === 'vertical' && selectedAnswer !== 'vertical' ? 'ring-4 ring-green-300' : ''}`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-4 ${
              showFeedback && selectedAnswer === 'vertical'
                ? isCorrect ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'
                : 'bg-[#88B04B] border-white'
            }`}>
              <div className="w-8 h-12 bg-white rounded" style={{
                background: 'repeating-linear-gradient(90deg, white 0px, white 2px, transparent 2px, transparent 4px)'
              }} />
            </div>
            <span className="font-bold text-lg text-[#88B04B]">Vertical</span>
          </button>

          <button
            onClick={() => handleAnswer('horizontal')}
            disabled={showFeedback}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-4 transition-all transform hover:scale-105 ${
              showFeedback && selectedAnswer === 'horizontal'
                ? isCorrect
                  ? 'bg-green-100 border-green-500 scale-110'
                  : 'bg-red-100 border-red-500 scale-95'
                : 'bg-white border-[#6B5B95] hover:bg-[#F7CAC9]'
            } ${showFeedback && currentQ.orientation === 'horizontal' && selectedAnswer !== 'horizontal' ? 'ring-4 ring-green-300' : ''}`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-4 ${
              showFeedback && selectedAnswer === 'horizontal'
                ? isCorrect ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'
                : 'bg-[#6B5B95] border-white'
            }`}>
              <div className="w-12 h-8 bg-white rounded" style={{
                background: 'repeating-linear-gradient(0deg, white 0px, white 2px, transparent 2px, transparent 4px)'
              }} />
            </div>
            <span className="font-bold text-lg text-[#6B5B95]">Horizontal</span>
          </button>

          <button
            onClick={() => handleAnswer('diagonal-right')}
            disabled={showFeedback}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-4 transition-all transform hover:scale-105 ${
              showFeedback && selectedAnswer === 'diagonal-right'
                ? isCorrect
                  ? 'bg-green-100 border-green-500 scale-110'
                  : 'bg-red-100 border-red-500 scale-95'
                : 'bg-white border-[#FF6F61] hover:bg-[#F7CAC9]'
            } ${showFeedback && currentQ.orientation === 'diagonal-right' && selectedAnswer !== 'diagonal-right' ? 'ring-4 ring-green-300' : ''}`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-4 ${
              showFeedback && selectedAnswer === 'diagonal-right'
                ? isCorrect ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'
                : 'bg-[#FF6F61] border-white'
            }`}>
              <div className="w-12 h-12 bg-white rounded" style={{
                background: 'repeating-linear-gradient(45deg, white 0px, white 2px, transparent 2px, transparent 4px)'
              }} />
            </div>
            <span className="font-bold text-lg text-[#FF6F61]">Diagonal ↗</span>
          </button>

          <button
            onClick={() => handleAnswer('diagonal-left')}
            disabled={showFeedback}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-4 transition-all transform hover:scale-105 ${
              showFeedback && selectedAnswer === 'diagonal-left'
                ? isCorrect
                  ? 'bg-green-100 border-green-500 scale-110'
                  : 'bg-red-100 border-red-500 scale-95'
                : 'bg-white border-[#F7CAC9] hover:bg-[#88B04B]'
            } ${showFeedback && currentQ.orientation === 'diagonal-left' && selectedAnswer !== 'diagonal-left' ? 'ring-4 ring-green-300' : ''}`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-4 ${
              showFeedback && selectedAnswer === 'diagonal-left'
                ? isCorrect ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'
                : 'bg-[#F7CAC9] border-white'
            }`}>
              <div className="w-12 h-12 bg-white rounded" style={{
                background: 'repeating-linear-gradient(-45deg, white 0px, white 2px, transparent 2px, transparent 4px)'
              }} />
            </div>
            <span className="font-bold text-lg text-[#6B5B95]">Diagonal ↖</span>
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
              {isCorrect ? '🎉 Excellent! +15 points' : '❌ Keep focusing! Try the next one'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContrastTest
