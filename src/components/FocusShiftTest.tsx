import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Focus, Eye, AlertCircle, CheckCircle, Target, Maximize2, Minimize2 } from 'lucide-react'
import { TestResult } from '../types'

interface FocusShiftTestProps {
  onComplete: (result: TestResult) => void
  onBack: () => void
}

type TestState = 'instructions' | 'countdown' | 'testing' | 'complete'
type Distance = 'near' | 'far'

interface Question {
  distance: Distance
  text: string
  fontSize: number
  correctAnswer: string
}

const FocusShiftTest: React.FC<FocusShiftTestProps> = ({ onComplete, onBack }) => {
  const [testState, setTestState] = useState<TestState>('instructions')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [countdown, setCountdown] = useState(3)
  const [testStartTime] = useState(Date.now())
  const [userAnswer, setUserAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)

  const questions: Question[] = [
    // Near vision tests (larger text)
    { distance: 'near', text: 'E', fontSize: 80, correctAnswer: 'E' },
    { distance: 'near', text: 'F', fontSize: 70, correctAnswer: 'F' },
    { distance: 'near', text: 'P', fontSize: 60, correctAnswer: 'P' },
    { distance: 'near', text: 'T', fontSize: 50, correctAnswer: 'T' },
    { distance: 'near', text: 'O', fontSize: 45, correctAnswer: 'O' },
    // Far vision tests (smaller text)
    { distance: 'far', text: 'Z', fontSize: 40, correctAnswer: 'Z' },
    { distance: 'far', text: 'L', fontSize: 35, correctAnswer: 'L' },
    { distance: 'far', text: 'P', fontSize: 30, correctAnswer: 'P' },
    { distance: 'far', text: 'E', fontSize: 28, correctAnswer: 'E' },
    { distance: 'far', text: 'D', fontSize: 25, correctAnswer: 'D' },
  ]

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  const startCountdown = () => {
    setTestState('countdown')
    setCountdown(3)

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current)
          setTestState('testing')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return

    const correct = userAnswer.toUpperCase() === questions[currentQuestion].correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)

    if (correct) {
      setScore(score + 1)
    }

    setTimeout(() => {
      setShowFeedback(false)
      setUserAnswer('')
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        completeTest(correct ? score + 1 : score)
      }
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitAnswer()
    }
  }

  const completeTest = (finalScore: number) => {
    setTestState('complete')
    
    const duration = Math.floor((Date.now() - testStartTime) / 1000)
    const points = finalScore * 2

    setTimeout(() => {
      onComplete({
        testType: 'focus',
        score: finalScore,
        totalQuestions: questions.length,
        points: points,
        duration
      })
    }, 3000)
  }

  const getAccommodationRating = () => {
    const percentage = (score / questions.length) * 100
    
    if (percentage >= 90) {
      return { text: 'Excellent! 🌟', color: 'text-green-600', bg: 'bg-green-100', description: 'Your eye accommodation is exceptional!' }
    } else if (percentage >= 70) {
      return { text: 'Very Good! 👍', color: 'text-blue-600', bg: 'bg-blue-100', description: 'Your focus shifting ability is above average.' }
    } else if (percentage >= 50) {
      return { text: 'Good 👌', color: 'text-yellow-600', bg: 'bg-yellow-100', description: 'Your accommodation is normal.' }
    } else if (percentage >= 30) {
      return { text: 'Fair 😐', color: 'text-orange-600', bg: 'bg-orange-100', description: 'Your focus shifting could be improved.' }
    } else {
      return { text: 'Needs Attention ⚠️', color: 'text-red-600', bg: 'bg-red-100', description: 'Consider consulting an eye care professional.' }
    }
  }

  if (testState === 'instructions') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 border-8 border-[#FF6F61] shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 bg-[#FF6F61] text-white px-6 py-3 rounded-full font-bold border-4 border-white shadow-lg hover:scale-105 transition-transform"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-[#FF6F61] to-[#6B5B95] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-lg">
              <Focus className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-5xl font-bold text-[#FF6F61] mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Focus Shift Test 🎯
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Test your eye's ability to shift focus between near and far distances!
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#F7CAC9] to-[#FF6F61] p-8 rounded-2xl border-4 border-[#FF6F61] mb-8">
            <h3 className="text-2xl font-bold text-[#6B5B95] mb-4 flex items-center gap-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
              <Target className="w-8 h-8" />
              How It Works
            </h3>
            
            <div className="space-y-4 text-gray-800">
              <div className="bg-white p-4 rounded-xl border-4 border-[#FF6F61]">
                <p className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Maximize2 className="w-6 h-6 text-[#FF6F61]" />
                  1. Near Vision Test 👁️
                </p>
                <p>You'll see larger letters simulating near reading distance</p>
              </div>

              <div className="bg-white p-4 rounded-xl border-4 border-[#6B5B95]">
                <p className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Minimize2 className="w-6 h-6 text-[#6B5B95]" />
                  2. Far Vision Test 🔭
                </p>
                <p>Then smaller letters simulating distance vision</p>
              </div>

              <div className="bg-white p-4 rounded-xl border-4 border-[#88B04B]">
                <p className="font-bold text-lg mb-2">3. Type What You See ⌨️</p>
                <p>Enter the letter you can clearly identify</p>
              </div>

              <div className="bg-white p-4 rounded-xl border-4 border-[#F7CAC9]">
                <p className="font-bold text-lg mb-2">4. Get Your Results 📊</p>
                <p>Discover your accommodation ability and earn points!</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#6B5B95] to-[#88B04B] p-6 rounded-2xl border-4 border-white mb-8">
            <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Why Focus Shifting Matters
            </h4>
            <div className="space-y-2 text-white">
              <p className="flex items-start gap-2">
                <span className="text-2xl">👁️</span>
                <span>Accommodation is your eye's ability to change focus from near to far</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-2xl">📱</span>
                <span>Essential for reading, using devices, and driving</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-2xl">⚡</span>
                <span>Accommodation naturally decreases with age (presbyopia)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-2xl">⚕️</span>
                <span>Poor accommodation may indicate eye muscle fatigue or vision problems</span>
              </p>
            </div>
          </div>

          <div className="bg-[#F7CAC9] p-6 rounded-2xl border-4 border-[#FF6F61] mb-8">
            <h4 className="text-xl font-bold text-[#6B5B95] mb-3">Test Details 📋</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl text-center border-2 border-[#FF6F61]">
                <p className="text-3xl mb-2">10</p>
                <p className="text-sm font-bold text-gray-700">Questions</p>
              </div>
              <div className="bg-white p-4 rounded-xl text-center border-2 border-[#6B5B95]">
                <p className="text-3xl mb-2">20</p>
                <p className="text-sm font-bold text-gray-700">Max Points</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#88B04B] to-[#6B5B95] p-6 rounded-2xl border-4 border-white mb-8">
            <h4 className="text-xl font-bold text-white mb-3">Important Tips 💡</h4>
            <ul className="space-y-2 text-white">
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Sit at your normal viewing distance from the screen</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Don't squint or strain - answer what you can clearly see</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Take your time to focus on each letter</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Type the letter and press Enter to submit</span>
              </li>
            </ul>
          </div>

          <button
            onClick={startCountdown}
            className="w-full bg-gradient-to-r from-[#FF6F61] to-[#6B5B95] text-white px-8 py-6 rounded-full text-2xl font-bold border-8 border-white shadow-lg hover:scale-105 transition-transform"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            Start Focus Shift Test 🚀
          </button>
        </div>
      </div>
    )
  }

  if (testState === 'countdown') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-16 border-8 border-[#FF6F61] shadow-2xl">
          <div className="text-center">
            <div className="bg-gradient-to-br from-[#FF6F61] to-[#F7CAC9] w-48 h-48 rounded-full flex items-center justify-center mx-auto mb-8 border-8 border-white shadow-lg animate-pulse">
              <span className="text-9xl font-bold text-white" style={{ fontFamily: "'Baloo 2', cursive" }}>
                {countdown}
              </span>
            </div>
            <h3 className="text-4xl font-bold text-[#6B5B95] mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Get Ready!
            </h3>
            <p className="text-xl text-gray-700">
              Prepare to test your focus shifting ability...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (testState === 'testing') {
    const question = questions[currentQuestion]
    
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl p-8 border-8 border-[#FF6F61] shadow-2xl mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="bg-gradient-to-r from-[#6B5B95] to-[#88B04B] text-white px-6 py-3 rounded-full border-4 border-white shadow-lg">
              <span className="font-bold text-xl">Question {currentQuestion + 1}/{questions.length}</span>
            </div>
            
            <div className="bg-gradient-to-r from-[#FF6F61] to-[#F7CAC9] text-white px-6 py-3 rounded-full border-4 border-white shadow-lg">
              <span className="font-bold text-xl">Score: {score}</span>
            </div>
          </div>

          <div className="bg-[#F7CAC9] h-4 rounded-full border-4 border-[#FF6F61] overflow-hidden mb-8">
            <div 
              className="bg-gradient-to-r from-[#FF6F61] to-[#6B5B95] h-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-16 border-8 border-[#6B5B95] shadow-2xl min-h-[500px] flex flex-col items-center justify-center mb-8">
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border-4 border-white shadow-lg mb-8 ${
              question.distance === 'near' 
                ? 'bg-gradient-to-r from-[#FF6F61] to-[#F7CAC9]' 
                : 'bg-gradient-to-r from-[#6B5B95] to-[#88B04B]'
            }`}>
              {question.distance === 'near' ? (
                <>
                  <Maximize2 className="w-6 h-6 text-white" />
                  <span className="text-white font-bold text-lg">Near Vision</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-6 h-6 text-white" />
                  <span className="text-white font-bold text-lg">Far Vision</span>
                </>
              )}
            </div>

            <div className="bg-gradient-to-br from-[#F7CAC9] to-white p-12 rounded-2xl border-4 border-[#FF6F61] mb-8">
              <p className="text-gray-700 text-xl font-semibold mb-6">What letter do you see?</p>
              <div 
                className="font-bold leading-none text-[#6B5B95]"
                style={{ 
                  fontSize: `${question.fontSize}px`,
                  fontFamily: "'Baloo 2', cursive"
                }}
              >
                {question.text}
              </div>
            </div>

            {!showFeedback ? (
              <div className="flex flex-col items-center gap-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  maxLength={1}
                  placeholder="Type letter"
                  className="w-32 h-32 text-6xl text-center font-bold text-[#6B5B95] bg-white border-8 border-[#88B04B] rounded-2xl focus:outline-none focus:border-[#FF6F61] transition-colors"
                  style={{ fontFamily: "'Baloo 2', cursive" }}
                  autoFocus
                />
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!userAnswer.trim()}
                  className="bg-gradient-to-r from-[#88B04B] to-[#6B5B95] text-white px-12 py-4 rounded-full text-xl font-bold border-4 border-white shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Baloo 2', cursive" }}
                >
                  Submit Answer
                </button>
              </div>
            ) : (
              <div className={`${isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'} p-8 rounded-2xl border-4`}>
                <div className="flex items-center justify-center gap-3 mb-3">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-12 h-12 text-green-600" />
                      <p className="text-3xl font-bold text-green-600">Correct! 🎉</p>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-12 h-12 text-red-600" />
                      <p className="text-3xl font-bold text-red-600">Incorrect</p>
                    </>
                  )}
                </div>
                {!isCorrect && (
                  <p className="text-gray-700 text-lg">
                    The correct answer was: <span className="font-bold text-2xl text-[#6B5B95]">{question.correctAnswer}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border-8 border-[#88B04B] shadow-2xl">
          <div className="flex items-center gap-4">
            <Eye className="w-8 h-8 text-[#FF6F61]" />
            <div>
              <p className="font-bold text-lg text-[#6B5B95]">Focus Tip:</p>
              <p className="text-gray-700">
                {question.distance === 'near' 
                  ? 'Relax your eyes and focus as if reading a book at arm\'s length.'
                  : 'Focus as if looking at a distant object across the room.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (testState === 'complete') {
    const rating = getAccommodationRating()
    const nearScore = questions.slice(0, 5).reduce((acc, q, i) => acc + (i < currentQuestion && userAnswer === q.correctAnswer ? 1 : 0), 0)
    const farScore = score - nearScore
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 border-8 border-[#FF6F61] shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-[#FF6F61] to-[#6B5B95] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-5xl font-bold text-[#FF6F61] mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Test Complete! 🎉
            </h2>
          </div>

          <div className="bg-gradient-to-r from-[#F7CAC9] to-[#FF6F61] p-8 rounded-2xl border-4 border-[#FF6F61] mb-8">
            <div className="text-center mb-6">
              <p className="text-2xl font-bold text-[#6B5B95] mb-2">Your Score</p>
              <p className="text-7xl font-bold text-white mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
                {score}/{questions.length}
              </p>
              <p className="text-xl text-white font-semibold">
                {Math.round((score / questions.length) * 100)}% Correct
              </p>
            </div>

            <div className={`${rating.bg} p-6 rounded-2xl border-4 border-white`}>
              <p className={`text-3xl font-bold ${rating.color} text-center mb-2`}>
                {rating.text}
              </p>
              <p className="text-center text-gray-700 font-semibold">
                {rating.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#FF6F61] to-[#F7CAC9] p-6 rounded-2xl border-4 border-white">
              <div className="flex items-center gap-3 mb-3">
                <Maximize2 className="w-8 h-8 text-white" />
                <h4 className="text-xl font-bold text-white">Near Vision</h4>
              </div>
              <p className="text-5xl font-bold text-white mb-2">{nearScore}/5</p>
              <p className="text-white font-semibold">{Math.round((nearScore / 5) * 100)}% Accuracy</p>
            </div>

            <div className="bg-gradient-to-br from-[#6B5B95] to-[#88B04B] p-6 rounded-2xl border-4 border-white">
              <div className="flex items-center gap-3 mb-3">
                <Minimize2 className="w-8 h-8 text-white" />
                <h4 className="text-xl font-bold text-white">Far Vision</h4>
              </div>
              <p className="text-5xl font-bold text-white mb-2">{farScore}/5</p>
              <p className="text-white font-semibold">{Math.round((farScore / 5) * 100)}% Accuracy</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border-4 border-[#6B5B95] mb-8">
            <h4 className="text-xl font-bold text-[#6B5B95] mb-4 flex items-center gap-2">
              <Focus className="w-6 h-6" />
              Accommodation Analysis
            </h4>
            <div className="space-y-3">
              {score >= 8 ? (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    ✅ Your eye accommodation is excellent! You can effectively shift focus between near and far distances, indicating healthy eye muscles and good visual flexibility.
                  </p>
                  <p className="text-gray-700 font-semibold mt-3">
                    💡 Tip: Continue practicing the 20-20-20 rule to maintain your accommodation ability.
                  </p>
                </div>
              ) : score >= 6 ? (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    ✓ Your accommodation is good. You can shift focus reasonably well, which is normal for most people.
                  </p>
                  <p className="text-gray-700 font-semibold mt-3">
                    💡 Tip: Practice focusing exercises to strengthen your eye muscles.
                  </p>
                </div>
              ) : score >= 4 ? (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    ⚠️ Your accommodation is fair. You may experience difficulty switching focus between near and far objects.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Take regular breaks from close-up work</li>
                    <li>Practice focusing on distant objects periodically</li>
                    <li>Consider an eye examination if symptoms persist</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    ⚠️ Your accommodation test results suggest difficulty with focus shifting.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>This could indicate eye muscle fatigue or presbyopia</li>
                    <li>Common in people over 40 (age-related accommodation loss)</li>
                    <li>May benefit from reading glasses or vision correction</li>
                  </ul>
                  <p className="text-gray-700 font-semibold mt-3 text-red-600">
                    🏥 Recommendation: Schedule an eye examination for proper assessment.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#88B04B] to-[#6B5B95] p-6 rounded-2xl border-4 border-white">
            <h4 className="text-xl font-bold text-white mb-3">Understanding Accommodation</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <p className="text-2xl mb-2">📱</p>
                <p className="text-white font-bold text-sm">Near Focus</p>
                <p className="text-white text-xs">Reading, phone use</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <p className="text-2xl mb-2">🚗</p>
                <p className="text-white font-bold text-sm">Far Focus</p>
                <p className="text-xs text-white">Driving, distance viewing</p>
              </div>
              <div className="bg-white/30 backdrop-blur-sm p-4 rounded-xl border-2 border-white col-span-2">
                <p className="text-2xl mb-2">⚡</p>
                <p className="text-white font-bold text-sm">Healthy Accommodation</p>
                <p className="text-white text-xs">Quick, effortless focus changes between distances</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default FocusShiftTest
