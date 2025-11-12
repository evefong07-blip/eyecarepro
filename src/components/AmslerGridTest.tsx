import React, { useState, useEffect } from 'react'
import { ArrowLeft, Clock, Target, Grid3x3, AlertCircle, CheckCircle } from 'lucide-react'
import { TestResult } from '../types'

interface AmslerGridTestProps {
  onComplete: (result: TestResult) => void
  onBack: () => void
}

type Question = {
  id: number
  question: string
  type: 'distortion' | 'missing' | 'wavy' | 'blur' | 'center'
}

const AmslerGridTest: React.FC<AmslerGridTestProps> = ({ onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<'yes' | 'no' | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [startTime] = useState(Date.now())
  const [showInstructions, setShowInstructions] = useState(true)
  const [testingEye, setTestingEye] = useState<'right' | 'left'>('right')

  const questions: Question[] = [
    {
      id: 1,
      question: "Can you see the center dot clearly?",
      type: 'center'
    },
    {
      id: 2,
      question: "Are all the grid lines straight and parallel?",
      type: 'distortion'
    },
    {
      id: 3,
      question: "Do you see any wavy or curved lines?",
      type: 'wavy'
    },
    {
      id: 4,
      question: "Are there any missing or broken areas in the grid?",
      type: 'missing'
    },
    {
      id: 5,
      question: "Do all the squares appear to be the same size?",
      type: 'distortion'
    },
    {
      id: 6,
      question: "Is any part of the grid blurry or distorted?",
      type: 'blur'
    },
    {
      id: 7,
      question: "Can you see all four corners of the grid clearly?",
      type: 'missing'
    },
    {
      id: 8,
      question: "Do any lines appear darker or lighter than others?",
      type: 'distortion'
    }
  ]

  const totalQuestions = questions.length

  const handleAnswer = (answer: 'yes' | 'no') => {
    if (showFeedback) return

    setSelectedAnswer(answer)
    setShowFeedback(true)

    const currentQ = questions[currentQuestion]
    let isCorrect = false

    // For a healthy eye, expected answers:
    // - Center dot visible: YES
    // - Lines straight: YES
    // - Wavy lines: NO
    // - Missing areas: NO
    // - Same size squares: YES
    // - Blurry/distorted: NO
    // - All corners visible: YES
    // - Lines different darkness: NO

    switch (currentQ.type) {
      case 'center':
      case 'distortion':
        isCorrect = answer === 'yes'
        break
      case 'wavy':
      case 'missing':
      case 'blur':
        isCorrect = answer === 'no'
        break
    }

    if (isCorrect) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
      } else {
        const duration = Math.floor((Date.now() - startTime) / 1000)
        const finalScore = isCorrect ? score + 1 : score
        onComplete({
          testType: 'amsler',
          score: finalScore,
          totalQuestions,
          points: finalScore * 18,
          duration
        })
      }
    }, 2000)
  }

  const startTest = () => {
    setShowInstructions(false)
  }

  if (showInstructions) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 border-8 border-[#FF6F61] shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 bg-[#6B5B95] text-white px-6 py-3 rounded-full font-bold border-4 border-white shadow-lg hover:scale-105 transition-transform"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-[#FF6F61] to-[#F7CAC9] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-lg">
              <Grid3x3 className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-5xl font-bold text-[#FF6F61] mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Amsler Grid Test 📐
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Test for macular degeneration and central vision problems
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#F7CAC9] to-[#88B04B] p-8 rounded-2xl border-4 border-[#FF6F61] mb-8">
            <h3 className="text-2xl font-bold text-[#6B5B95] mb-4 flex items-center gap-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
              <AlertCircle className="w-8 h-8" />
              Important Instructions
            </h3>
            
            <div className="space-y-4 text-gray-800">
              <div className="bg-white p-4 rounded-xl border-4 border-[#FF6F61]">
                <p className="font-bold text-lg mb-2">1. Viewing Distance 📏</p>
                <p>Hold your device at a comfortable reading distance (about 12-14 inches from your eyes)</p>
              </div>

              <div className="bg-white p-4 rounded-xl border-4 border-[#88B04B]">
                <p className="font-bold text-lg mb-2">2. Cover One Eye 👁️</p>
                <p>We'll test each eye separately. Cover your left eye first with your hand (don't press on it)</p>
              </div>

              <div className="bg-white p-4 rounded-xl border-4 border-[#6B5B95]">
                <p className="font-bold text-lg mb-2">3. Focus on Center Dot 🎯</p>
                <p>Keep your eye focused on the center dot throughout the entire test</p>
              </div>

              <div className="bg-white p-4 rounded-xl border-4 border-[#F7CAC9]">
                <p className="font-bold text-lg mb-2">4. Answer Honestly ✅</p>
                <p>Answer each question based on what you see while looking at the center dot</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-100 border-4 border-yellow-500 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-lg text-yellow-800 mb-2">Medical Disclaimer</p>
                <p className="text-yellow-700">
                  This is a screening tool only and not a substitute for professional eye examination. 
                  If you notice any distortions, wavy lines, or missing areas, consult an eye care professional immediately.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={startTest}
            className="w-full bg-gradient-to-r from-[#FF6F61] to-[#6B5B95] text-white px-8 py-6 rounded-full text-2xl font-bold border-8 border-white shadow-lg hover:scale-105 transition-transform"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            Start Amsler Grid Test 🚀
          </button>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const isCorrect = selectedAnswer && (
    (currentQ.type === 'center' || currentQ.type === 'distortion') ? selectedAnswer === 'yes' :
    selectedAnswer === 'no'
  )

  return (
    <div className="max-w-5xl mx-auto">
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

        {/* Eye Reminder */}
        <div className="bg-gradient-to-r from-[#88B04B] to-[#6B5B95] p-4 rounded-2xl border-4 border-white shadow-lg mb-6 text-center">
          <p className="text-white font-bold text-lg">
            Testing: {testingEye === 'right' ? 'RIGHT EYE 👁️' : 'LEFT EYE 👁️'}
          </p>
          <p className="text-white text-sm">
            Cover your {testingEye === 'right' ? 'left' : 'right'} eye with your hand
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Amsler Grid Display */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-8 rounded-3xl border-8 border-[#FF6F61] shadow-inner mb-4">
              <svg width="400" height="400" viewBox="0 0 400 400" className="bg-white">
                {/* Grid lines - vertical */}
                {Array.from({ length: 21 }).map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * 20}
                    y1="0"
                    x2={i * 20}
                    y2="400"
                    stroke="#000000"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Grid lines - horizontal */}
                {Array.from({ length: 21 }).map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1="0"
                    y1={i * 20}
                    x2="400"
                    y2={i * 20}
                    stroke="#000000"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Center dot */}
                <circle
                  cx="200"
                  cy="200"
                  r="4"
                  fill="#FF6F61"
                />
              </svg>
            </div>
            
            <div className="bg-[#F7CAC9] p-4 rounded-xl border-4 border-[#FF6F61] text-center">
              <p className="text-sm font-bold text-[#6B5B95] mb-2">
                Keep your eye focused on the red center dot! 🎯
              </p>
              <p className="text-xs text-gray-700">
                Use your peripheral vision to observe the grid
              </p>
            </div>
          </div>

          {/* Question and Answers */}
          <div className="flex flex-col justify-center">
            <div className="bg-gradient-to-r from-[#F7CAC9] to-[#88B04B] p-6 rounded-2xl border-4 border-[#FF6F61] mb-6">
              <h3 className="text-2xl font-bold text-[#6B5B95] mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
                Question {currentQuestion + 1}
              </h3>
              <p className="text-xl text-gray-800 font-semibold">
                {currentQ.question}
              </p>
            </div>

            {/* Answer Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer('yes')}
                disabled={showFeedback}
                className={`flex flex-col items-center gap-4 p-8 rounded-2xl border-4 transition-all transform hover:scale-105 ${
                  showFeedback && selectedAnswer === 'yes'
                    ? isCorrect
                      ? 'bg-green-100 border-green-500 scale-110'
                      : 'bg-red-100 border-red-500 scale-95'
                    : 'bg-white border-[#88B04B] hover:bg-[#F7CAC9]'
                }`}
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${
                  showFeedback && selectedAnswer === 'yes'
                    ? isCorrect ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'
                    : 'bg-[#88B04B] border-white'
                }`}>
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <span className="font-bold text-2xl text-[#88B04B]">YES</span>
              </button>

              <button
                onClick={() => handleAnswer('no')}
                disabled={showFeedback}
                className={`flex flex-col items-center gap-4 p-8 rounded-2xl border-4 transition-all transform hover:scale-105 ${
                  showFeedback && selectedAnswer === 'no'
                    ? isCorrect
                      ? 'bg-green-100 border-green-500 scale-110'
                      : 'bg-red-100 border-red-500 scale-95'
                    : 'bg-white border-[#FF6F61] hover:bg-[#F7CAC9]'
                }`}
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${
                  showFeedback && selectedAnswer === 'no'
                    ? isCorrect ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'
                    : 'bg-[#FF6F61] border-white'
                }`}>
                  <AlertCircle className="w-10 h-10 text-white" />
                </div>
                <span className="font-bold text-2xl text-[#FF6F61]">NO</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`text-center p-6 rounded-2xl border-4 ${
            isCorrect
              ? 'bg-green-100 border-green-500'
              : 'bg-yellow-100 border-yellow-500'
          }`}>
            <p className="text-3xl font-bold mb-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
              {isCorrect ? '✅ Normal Vision Response! +18 points' : '⚠️ Noted - Continue to next question'}
            </p>
            {!isCorrect && (
              <p className="text-sm text-gray-700">
                If you consistently see distortions, consult an eye care professional
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AmslerGridTest
