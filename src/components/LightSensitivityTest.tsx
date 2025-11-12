import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Sun, Moon, AlertCircle, CheckCircle, Eye, Lightbulb } from 'lucide-react'
import { TestResult } from '../types'

interface LightSensitivityTestProps {
  onComplete: (result: TestResult) => void
  onBack: () => void
}

type TestState = 'instructions' | 'countdown' | 'testing' | 'complete'

interface Question {
  brightness: number
  correctAnswer: 'visible' | 'not-visible'
  text: string
}

const LightSensitivityTest: React.FC<LightSensitivityTestProps> = ({ onComplete, onBack }) => {
  const [testState, setTestState] = useState<TestState>('instructions')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [countdown, setCountdown] = useState(3)
  const [testStartTime] = useState(Date.now())
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const countdownRef = useRef<NodeJS.Timeout | null>(null)

  const questions: Question[] = [
    { brightness: 0.9, correctAnswer: 'visible', text: 'E' },
    { brightness: 0.7, correctAnswer: 'visible', text: 'F' },
    { brightness: 0.5, correctAnswer: 'visible', text: 'P' },
    { brightness: 0.35, correctAnswer: 'visible', text: 'T' },
    { brightness: 0.25, correctAnswer: 'visible', text: 'O' },
    { brightness: 0.18, correctAnswer: 'visible', text: 'Z' },
    { brightness: 0.12, correctAnswer: 'visible', text: 'L' },
    { brightness: 0.08, correctAnswer: 'not-visible', text: 'P' },
    { brightness: 0.05, correctAnswer: 'not-visible', text: 'E' },
    { brightness: 0.03, correctAnswer: 'not-visible', text: 'D' },
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

  const handleAnswer = (answer: 'visible' | 'not-visible') => {
    const isCorrect = answer === questions[currentQuestion].correctAnswer
    
    if (isCorrect) {
      setScore(score + 1)
    }

    setUserAnswers([...userAnswers, answer])

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      completeTest(isCorrect ? score + 1 : score)
    }
  }

  const completeTest = (finalScore: number) => {
    setTestState('complete')
    
    const duration = Math.floor((Date.now() - testStartTime) / 1000)
    const points = finalScore * 2

    setTimeout(() => {
      onComplete({
        testType: 'light',
        score: finalScore,
        totalQuestions: questions.length,
        points: points,
        duration
      })
    }, 3000)
  }

  const getSensitivityRating = () => {
    const percentage = (score / questions.length) * 100
    
    if (percentage >= 90) {
      return { text: 'Excellent! 🌟', color: 'text-green-600', bg: 'bg-green-100', description: 'Your light sensitivity is exceptional!' }
    } else if (percentage >= 70) {
      return { text: 'Very Good! 👍', color: 'text-blue-600', bg: 'bg-blue-100', description: 'Your light sensitivity is above average.' }
    } else if (percentage >= 50) {
      return { text: 'Good 👌', color: 'text-yellow-600', bg: 'bg-yellow-100', description: 'Your light sensitivity is normal.' }
    } else if (percentage >= 30) {
      return { text: 'Fair 😐', color: 'text-orange-600', bg: 'bg-orange-100', description: 'Your light sensitivity could be improved.' }
    } else {
      return { text: 'Needs Attention ⚠️', color: 'text-red-600', bg: 'bg-red-100', description: 'Consider consulting an eye care professional.' }
    }
  }

  if (testState === 'instructions') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 border-8 border-[#88B04B] shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 bg-[#88B04B] text-white px-6 py-3 rounded-full font-bold border-4 border-white shadow-lg hover:scale-105 transition-transform"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-[#88B04B] to-[#FF6F61] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-lg">
              <Sun className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-5xl font-bold text-[#88B04B] mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Light Sensitivity Check 💡
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Test your ability to detect letters at varying brightness levels!
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#F7CAC9] to-[#88B04B] p-8 rounded-2xl border-4 border-[#88B04B] mb-8">
            <h3 className="text-2xl font-bold text-[#6B5B95] mb-4 flex items-center gap-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
              <Lightbulb className="w-8 h-8" />
              How It Works
            </h3>
            
            <div className="space-y-4 text-gray-800">
              <div className="bg-white p-4 rounded-xl border-4 border-[#88B04B]">
                <p className="font-bold text-lg mb-2">1. View the Letter 👁️</p>
                <p>You'll see letters displayed at different brightness levels</p>
              </div>

              <div className="bg-white p-4 rounded-xl border-4 border-[#6B5B95]">
                <p className="font-bold text-lg mb-2">2. Determine Visibility 🔍</p>
                <p>Decide if you can clearly see the letter or not</p>
              </div>

              <div className="bg-white p-4 rounded-xl border-4 border-[#FF6F61]">
                <p className="font-bold text-lg mb-2">3. Answer Honestly ✅</p>
                <p>Select "I Can See It" or "I Cannot See It" based on what you actually see</p>
              </div>

              <div className="bg-white p-4 rounded-xl border-4 border-[#F7CAC9]">
                <p className="font-bold text-lg mb-2">4. Get Your Results 📊</p>
                <p>Discover your light sensitivity level and earn points!</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#6B5B95] to-[#88B04B] p-6 rounded-2xl border-4 border-white mb-8">
            <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Why Light Sensitivity Matters
            </h4>
            <div className="space-y-2 text-white">
              <p className="flex items-start gap-2">
                <span className="text-2xl">👁️</span>
                <span>Light sensitivity affects how well you see in different lighting conditions</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-2xl">🌙</span>
                <span>Poor light sensitivity can indicate eye health issues</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-2xl">💡</span>
                <span>Normal eyes can detect subtle differences in brightness</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-2xl">⚕️</span>
                <span>Changes in light sensitivity may require professional evaluation</span>
              </p>
            </div>
          </div>

          <div className="bg-[#F7CAC9] p-6 rounded-2xl border-4 border-[#FF6F61] mb-8">
            <h4 className="text-xl font-bold text-[#6B5B95] mb-3">Test Details 📋</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl text-center border-2 border-[#88B04B]">
                <p className="text-3xl mb-2">10</p>
                <p className="text-sm font-bold text-gray-700">Questions</p>
              </div>
              <div className="bg-white p-4 rounded-xl text-center border-2 border-[#6B5B95]">
                <p className="text-3xl mb-2">20</p>
                <p className="text-sm font-bold text-gray-700">Max Points</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#FF6F61] to-[#6B5B95] p-6 rounded-2xl border-4 border-white mb-8">
            <h4 className="text-xl font-bold text-white mb-3">Important Tips 💡</h4>
            <ul className="space-y-2 text-white">
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Ensure your screen brightness is at a comfortable level</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Take the test in a well-lit room</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Sit at a normal viewing distance from your screen</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Answer honestly - don't strain to see letters</span>
              </li>
            </ul>
          </div>

          <button
            onClick={startCountdown}
            className="w-full bg-gradient-to-r from-[#88B04B] to-[#6B5B95] text-white px-8 py-6 rounded-full text-2xl font-bold border-8 border-white shadow-lg hover:scale-105 transition-transform"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            Start Light Sensitivity Test 🚀
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
              Prepare to test your light sensitivity...
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
        <div className="bg-white rounded-3xl p-8 border-8 border-[#88B04B] shadow-2xl mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="bg-gradient-to-r from-[#6B5B95] to-[#88B04B] text-white px-6 py-3 rounded-full border-4 border-white shadow-lg">
              <span className="font-bold text-xl">Question {currentQuestion + 1}/{questions.length}</span>
            </div>
            
            <div className="bg-gradient-to-r from-[#FF6F61] to-[#F7CAC9] text-white px-6 py-3 rounded-full border-4 border-white shadow-lg">
              <span className="font-bold text-xl">Score: {score}</span>
            </div>
          </div>

          <div className="bg-[#F7CAC9] h-4 rounded-full border-4 border-[#88B04B] overflow-hidden mb-8">
            <div 
              className="bg-gradient-to-r from-[#88B04B] to-[#6B5B95] h-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-16 border-8 border-white shadow-2xl min-h-[500px] flex flex-col items-center justify-center mb-8">
          <div className="text-center mb-12">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border-4 border-white/30 mb-8">
              <p className="text-white text-xl font-semibold mb-6">Can you see the letter below?</p>
              <div 
                className="text-[200px] font-bold leading-none"
                style={{ 
                  color: `rgba(255, 255, 255, ${question.brightness})`,
                  fontFamily: "'Baloo 2', cursive",
                  textShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
                }}
              >
                {question.text}
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <button
              onClick={() => handleAnswer('visible')}
              className="bg-gradient-to-r from-[#88B04B] to-[#6B5B95] text-white px-12 py-6 rounded-full text-2xl font-bold border-8 border-white shadow-lg hover:scale-105 transition-transform"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              <Eye className="w-8 h-8 inline-block mr-3" />
              I Can See It
            </button>
            
            <button
              onClick={() => handleAnswer('not-visible')}
              className="bg-gradient-to-r from-[#FF6F61] to-[#F7CAC9] text-white px-12 py-6 rounded-full text-2xl font-bold border-8 border-white shadow-lg hover:scale-105 transition-transform"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              <Moon className="w-8 h-8 inline-block mr-3" />
              I Cannot See It
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border-8 border-[#6B5B95] shadow-2xl">
          <div className="flex items-center gap-4">
            <AlertCircle className="w-8 h-8 text-[#FF6F61]" />
            <div>
              <p className="font-bold text-lg text-[#6B5B95]">Answer Honestly:</p>
              <p className="text-gray-700">Don't strain your eyes. If you can't clearly see the letter, select "I Cannot See It".</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (testState === 'complete') {
    const rating = getSensitivityRating()
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 border-8 border-[#88B04B] shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-[#88B04B] to-[#6B5B95] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-5xl font-bold text-[#88B04B] mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Test Complete! 🎉
            </h2>
          </div>

          <div className="bg-gradient-to-r from-[#F7CAC9] to-[#88B04B] p-8 rounded-2xl border-4 border-[#88B04B] mb-8">
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

          <div className="bg-white p-6 rounded-2xl border-4 border-[#6B5B95] mb-8">
            <h4 className="text-xl font-bold text-[#6B5B95] mb-4 flex items-center gap-2">
              <Sun className="w-6 h-6" />
              Light Sensitivity Analysis
            </h4>
            <div className="space-y-3">
              {score >= 7 ? (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    ✅ Your light sensitivity is excellent! You can detect subtle differences in brightness levels, which indicates healthy retinal function.
                  </p>
                  <p className="text-gray-700 font-semibold mt-3">
                    💡 Tip: Maintain your eye health with regular breaks from screens and proper lighting.
                  </p>
                </div>
              ) : score >= 5 ? (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    ✓ Your light sensitivity is good. You can detect most brightness variations, which is normal for healthy eyes.
                  </p>
                  <p className="text-gray-700 font-semibold mt-3">
                    💡 Tip: Ensure adequate lighting when reading or working to reduce eye strain.
                  </p>
                </div>
              ) : score >= 3 ? (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    ⚠️ Your light sensitivity is fair. You may have difficulty seeing in low-light conditions.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Consider increasing ambient lighting in your workspace</li>
                    <li>Avoid prolonged screen time in dark environments</li>
                    <li>Schedule regular eye exams</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    ⚠️ Your light sensitivity test results suggest difficulty detecting brightness variations.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>This could indicate retinal sensitivity issues</li>
                    <li>Consider consulting an eye care professional</li>
                    <li>Ensure proper screen brightness and room lighting</li>
                  </ul>
                  <p className="text-gray-700 font-semibold mt-3 text-red-600">
                    🏥 Recommendation: Schedule an eye examination if you experience vision difficulties.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#6B5B95] to-[#FF6F61] p-6 rounded-2xl border-4 border-white">
            <h4 className="text-xl font-bold text-white mb-3">Understanding Light Sensitivity</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <p className="text-2xl mb-2">🌞</p>
                <p className="text-white font-bold text-sm">Bright Light</p>
                <p className="text-white text-xs">Easy to detect</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <p className="text-2xl mb-2">🌙</p>
                <p className="text-white font-bold text-sm">Low Light</p>
                <p className="text-xs text-white">Harder to detect</p>
              </div>
              <div className="bg-white/30 backdrop-blur-sm p-4 rounded-xl border-2 border-white col-span-2">
                <p className="text-2xl mb-2">👁️</p>
                <p className="text-white font-bold text-sm">Healthy Eyes</p>
                <p className="text-white text-xs">Can adapt to various brightness levels</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default LightSensitivityTest
