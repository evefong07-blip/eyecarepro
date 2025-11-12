import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Eye, Timer, Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { TestResult } from '../types'

interface BlinkRateTestProps {
  onComplete: (result: TestResult) => void
  onBack: () => void
}

type TestState = 'instructions' | 'countdown' | 'testing' | 'complete'

const BlinkRateTest: React.FC<BlinkRateTestProps> = ({ onComplete, onBack }) => {
  const [testState, setTestState] = useState<TestState>('instructions')
  const [blinkCount, setBlinkCount] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [countdown, setCountdown] = useState(3)
  const [testStartTime] = useState(Date.now())
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
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
          startTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const startTest = () => {
    setTestState('testing')
    setTimeRemaining(60)
    setBlinkCount(0)

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          completeTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleBlink = () => {
    if (testState === 'testing') {
      setBlinkCount(prev => prev + 1)
    }
  }

  const completeTest = () => {
    setTestState('complete')
    
    // Normal blink rate is 15-20 blinks per minute
    // Score based on how close to normal range
    const normalMin = 15
    const normalMax = 20
    let score = 0
    
    if (blinkCount >= normalMin && blinkCount <= normalMax) {
      score = 10 // Perfect range
    } else if (blinkCount >= normalMin - 3 && blinkCount <= normalMax + 3) {
      score = 8 // Close to normal
    } else if (blinkCount >= normalMin - 5 && blinkCount <= normalMax + 5) {
      score = 6 // Slightly off
    } else if (blinkCount >= normalMin - 8 && blinkCount <= normalMax + 8) {
      score = 4 // Moderately off
    } else {
      score = 2 // Significantly off
    }

    const duration = Math.floor((Date.now() - testStartTime) / 1000)

    setTimeout(() => {
      onComplete({
        testType: 'blink',
        score: score,
        totalQuestions: 10,
        points: score * 2,
        duration
      })
    }, 3000)
  }

  const getBlinkRating = () => {
    if (blinkCount >= 15 && blinkCount <= 20) {
      return { text: 'Excellent! 🎯', color: 'text-green-600', bg: 'bg-green-100' }
    } else if (blinkCount >= 12 && blinkCount <= 23) {
      return { text: 'Good! 👍', color: 'text-blue-600', bg: 'bg-blue-100' }
    } else if (blinkCount >= 10 && blinkCount <= 25) {
      return { text: 'Fair 👌', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    } else if (blinkCount < 10) {
      return { text: 'Too Few 😐', color: 'text-orange-600', bg: 'bg-orange-100' }
    } else {
      return { text: 'Too Many 😅', color: 'text-red-600', bg: 'bg-red-100' }
    }
  }

  if (testState === 'instructions') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 border-8 border-[#6B5B95] shadow-2xl">
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
            <div className="bg-gradient-to-br from-[#6B5B95] to-[#88B04B] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-lg">
              <Eye className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-5xl font-bold text-[#6B5B95] mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Blink Rate Tracker 👁️
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Monitor your natural blink frequency to assess eye health!
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#F7CAC9] to-[#88B04B] p-8 rounded-2xl border-4 border-[#6B5B95] mb-8">
            <h3 className="text-2xl font-bold text-[#6B5B95] mb-4 flex items-center gap-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
              <Timer className="w-8 h-8" />
              How It Works
            </h3>
            
            <div className="space-y-4 text-gray-800">
              <div className="bg-white p-4 rounded-xl border-4 border-[#6B5B95]">
                <p className="font-bold text-lg mb-2">1. Get Ready 🎯</p>
                <p>You'll have 60 seconds to track your natural blink rate</p>
              </div>

              <div className="bg-white p-4 rounded-xl border-4 border-[#88B04B]">
                <p className="font-bold text-lg mb-2">2. Blink Naturally 👁️</p>
                <p>Press the spacebar or tap the screen each time you blink naturally</p>
              </div>

              <div className="bg-white p-4 rounded-xl border-4 border-[#FF6F61]">
                <p className="font-bold text-lg mb-2">3. Don't Force It! ⚠️</p>
                <p>Blink at your natural pace - don't try to blink more or less than usual</p>
              </div>

              <div className="bg-white p-4 rounded-xl border-4 border-[#F7CAC9]">
                <p className="font-bold text-lg mb-2">4. Get Your Results 📊</p>
                <p>See how your blink rate compares to the healthy range of 15-20 blinks per minute</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#6B5B95] to-[#88B04B] p-6 rounded-2xl border-4 border-white mb-8">
            <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Why Blink Rate Matters
            </h4>
            <div className="space-y-2 text-white">
              <p className="flex items-start gap-2">
                <span className="text-2xl">💧</span>
                <span>Normal blinking keeps eyes lubricated and prevents dryness</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-2xl">💻</span>
                <span>Screen time can reduce blink rate by up to 60%</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-2xl">🎯</span>
                <span>Healthy range: 15-20 blinks per minute</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-2xl">⚕️</span>
                <span>Low blink rate can lead to dry eye syndrome</span>
              </p>
            </div>
          </div>

          <div className="bg-[#F7CAC9] p-6 rounded-2xl border-4 border-[#FF6F61] mb-8">
            <h4 className="text-xl font-bold text-[#6B5B95] mb-3">Scoring Guide 📊</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-white p-3 rounded-xl text-center border-2 border-green-500">
                <p className="text-2xl mb-1">🎯</p>
                <p className="text-xs font-bold text-green-600">15-20 blinks</p>
                <p className="text-xs text-gray-600">Perfect</p>
                <p className="text-sm font-bold text-[#88B04B]">10 pts</p>
              </div>
              <div className="bg-white p-3 rounded-xl text-center border-2 border-blue-500">
                <p className="text-2xl mb-1">👍</p>
                <p className="text-xs font-bold text-blue-600">12-23 blinks</p>
                <p className="text-xs text-gray-600">Good</p>
                <p className="text-sm font-bold text-[#88B04B]">8 pts</p>
              </div>
              <div className="bg-white p-3 rounded-xl text-center border-2 border-yellow-500">
                <p className="text-2xl mb-1">👌</p>
                <p className="text-xs font-bold text-yellow-600">10-25 blinks</p>
                <p className="text-xs text-gray-600">Fair</p>
                <p className="text-sm font-bold text-[#88B04B]">6 pts</p>
              </div>
              <div className="bg-white p-3 rounded-xl text-center border-2 border-orange-500">
                <p className="text-2xl mb-1">😐</p>
                <p className="text-xs font-bold text-orange-600">7-28 blinks</p>
                <p className="text-xs text-gray-600">Below Avg</p>
                <p className="text-sm font-bold text-[#88B04B]">4 pts</p>
              </div>
              <div className="bg-white p-3 rounded-xl text-center border-2 border-red-500">
                <p className="text-2xl mb-1">⚠️</p>
                <p className="text-xs font-bold text-red-600">{'<7 or >28'}</p>
                <p className="text-xs text-gray-600">Concern</p>
                <p className="text-sm font-bold text-[#88B04B]">2 pts</p>
              </div>
            </div>
          </div>

          <button
            onClick={startCountdown}
            className="w-full bg-gradient-to-r from-[#6B5B95] to-[#88B04B] text-white px-8 py-6 rounded-full text-2xl font-bold border-8 border-white shadow-lg hover:scale-105 transition-transform"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            Start Blink Rate Test 🚀
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
              Prepare to track your blinks...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (testState === 'testing') {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl p-8 border-8 border-[#88B04B] shadow-2xl mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="bg-gradient-to-r from-[#FF6F61] to-[#F7CAC9] text-white px-6 py-3 rounded-full border-4 border-white shadow-lg">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                <span className="font-bold text-2xl">{timeRemaining}s</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-[#6B5B95] to-[#88B04B] text-white px-6 py-3 rounded-full border-4 border-white shadow-lg">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span className="font-bold text-2xl">{blinkCount} blinks</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F7CAC9] h-4 rounded-full border-4 border-[#88B04B] overflow-hidden mb-8">
            <div 
              className="bg-gradient-to-r from-[#88B04B] to-[#6B5B95] h-full transition-all duration-1000"
              style={{ width: `${((60 - timeRemaining) / 60) * 100}%` }}
            ></div>
          </div>
        </div>

        <div 
          onClick={handleBlink}
          onKeyDown={(e) => e.key === ' ' && handleBlink()}
          tabIndex={0}
          className="bg-gradient-to-br from-[#6B5B95] to-[#88B04B] rounded-3xl p-16 border-8 border-white shadow-2xl cursor-pointer min-h-[500px] flex flex-col items-center justify-center hover:scale-105 transition-transform focus:outline-none focus:ring-8 focus:ring-[#FF6F61]"
        >
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm p-12 rounded-3xl border-4 border-white mb-6">
              <Eye className="w-32 h-32 text-white mx-auto mb-6 animate-pulse" />
              <h3 className="text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
                Blink Naturally
              </h3>
              <p className="text-3xl text-white font-semibold mb-6">
                Press SPACE or TAP when you blink
              </p>
              <div className="bg-white/30 backdrop-blur-sm p-6 rounded-2xl border-4 border-white">
                <p className="text-5xl font-bold text-white mb-2">{blinkCount}</p>
                <p className="text-xl text-white font-semibold">Blinks Recorded</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-3xl p-6 border-8 border-[#6B5B95] shadow-2xl">
          <div className="flex items-center gap-4">
            <AlertCircle className="w-8 h-8 text-[#FF6F61]" />
            <div>
              <p className="font-bold text-lg text-[#6B5B95]">Tips for Accurate Results:</p>
              <p className="text-gray-700">Blink at your natural pace. Don't force or suppress blinks. Focus on a point in the distance.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (testState === 'complete') {
    const rating = getBlinkRating()
    
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
              <p className="text-2xl font-bold text-[#6B5B95] mb-2">Your Blink Rate</p>
              <p className="text-7xl font-bold text-white mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
                {blinkCount}
              </p>
              <p className="text-xl text-white font-semibold">blinks per minute</p>
            </div>

            <div className={`${rating.bg} p-6 rounded-2xl border-4 border-white`}>
              <p className={`text-3xl font-bold ${rating.color} text-center`}>
                {rating.text}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border-4 border-[#6B5B95] mb-8">
            <h4 className="text-xl font-bold text-[#6B5B95] mb-4 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Analysis
            </h4>
            <div className="space-y-3">
              {blinkCount >= 15 && blinkCount <= 20 ? (
                <p className="text-gray-700">
                  ✅ Your blink rate is in the optimal range! This indicates healthy eye lubrication and good screen habits.
                </p>
              ) : blinkCount < 15 ? (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    ⚠️ Your blink rate is below the healthy range. This may indicate:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Extended screen time reducing natural blink frequency</li>
                    <li>High concentration tasks</li>
                    <li>Potential risk for dry eye symptoms</li>
                  </ul>
                  <p className="text-gray-700 font-semibold mt-3">
                    💡 Tip: Practice the 20-20-20 rule - every 20 minutes, look at something 20 feet away for 20 seconds.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    ℹ️ Your blink rate is higher than average. This could indicate:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>Eye irritation or dryness</li>
                    <li>Environmental factors (wind, air conditioning)</li>
                    <li>Fatigue or stress</li>
                  </ul>
                  <p className="text-gray-700 font-semibold mt-3">
                    💡 Tip: Ensure proper hydration and consider using artificial tears if eyes feel dry.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#6B5B95] to-[#FF6F61] p-6 rounded-2xl border-4 border-white">
            <h4 className="text-xl font-bold text-white mb-3">Healthy Blink Rate Reference</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center">
                <p className="text-3xl mb-2">😐</p>
                <p className="text-white font-bold">{'<12'}</p>
                <p className="text-white text-sm">Too Low</p>
              </div>
              <div className="bg-white/30 backdrop-blur-sm p-4 rounded-xl text-center border-4 border-white">
                <p className="text-3xl mb-2">🎯</p>
                <p className="text-white font-bold">15-20</p>
                <p className="text-white text-sm">Optimal</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center">
                <p className="text-3xl mb-2">😅</p>
                <p className="text-white font-bold">{'>25'}</p>
                <p className="text-white text-sm">Too High</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default BlinkRateTest
