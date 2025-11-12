import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Clock, Target, Zap, Timer, TrendingUp } from 'lucide-react'
import { TestResult } from '../types'

interface ReactionSpeedTestProps {
  onComplete: (result: TestResult) => void
  onBack: () => void
}

type GameState = 'instructions' | 'waiting' | 'ready' | 'clicked' | 'tooEarly' | 'complete'

const ReactionSpeedTest: React.FC<ReactionSpeedTestProps> = ({ onComplete, onBack }) => {
  const [gameState, setGameState] = useState<GameState>('instructions')
  const [currentRound, setCurrentRound] = useState(0)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])
  const [startTime, setStartTime] = useState(0)
  const [waitTime, setWaitTime] = useState(0)
  const [testStartTime] = useState(Date.now())
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const totalRounds = 5

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const startTest = () => {
    setGameState('waiting')
    startRound()
  }

  const startRound = () => {
    setGameState('waiting')
    const randomWait = 2000 + Math.random() * 3000 // 2-5 seconds
    setWaitTime(randomWait)

    timeoutRef.current = setTimeout(() => {
      setGameState('ready')
      setStartTime(Date.now())
    }, randomWait)
  }

  const handleClick = () => {
    if (gameState === 'waiting') {
      // Clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setGameState('tooEarly')
      setTimeout(() => {
        startRound()
      }, 1500)
      return
    }

    if (gameState === 'ready') {
      const reactionTime = Date.now() - startTime
      const newReactionTimes = [...reactionTimes, reactionTime]
      setReactionTimes(newReactionTimes)
      setGameState('clicked')

      setTimeout(() => {
        if (currentRound < totalRounds - 1) {
          setCurrentRound(currentRound + 1)
          startRound()
        } else {
          // Calculate final score
          const avgReactionTime = newReactionTimes.reduce((a, b) => a + b, 0) / newReactionTimes.length
          const duration = Math.floor((Date.now() - testStartTime) / 1000)
          
          // Score based on average reaction time
          // Excellent: < 200ms = 5 points
          // Good: 200-300ms = 4 points
          // Average: 300-400ms = 3 points
          // Below Average: 400-500ms = 2 points
          // Slow: > 500ms = 1 point
          let score = 0
          newReactionTimes.forEach(time => {
            if (time < 200) score += 5
            else if (time < 300) score += 4
            else if (time < 400) score += 3
            else if (time < 500) score += 2
            else score += 1
          })

          setGameState('complete')
          
          setTimeout(() => {
            onComplete({
              testType: 'reaction',
              score: score,
              totalQuestions: totalRounds * 5, // Max possible score
              points: score * 4, // 4 points per score point
              duration
            })
          }, 2000)
        }
      }, 1000)
    }
  }

  const getReactionRating = (time: number) => {
    if (time < 200) return { text: 'Excellent! ⚡', color: 'text-green-600' }
    if (time < 300) return { text: 'Good! 👍', color: 'text-blue-600' }
    if (time < 400) return { text: 'Average 👌', color: 'text-yellow-600' }
    if (time < 500) return { text: 'Below Average 🤔', color: 'text-orange-600' }
    return { text: 'Slow 🐌', color: 'text-red-600' }
  }

  if (gameState === 'instructions') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 border-8 border-[#88B04B] shadow-2xl">
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
            <div className="bg-gradient-to-br from-[#88B04B] to-[#6B5B95] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-lg">
              <Zap className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-5xl font-bold text-[#88B04B] mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Reaction Speed Test ⚡
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Test your visual reaction time and hand-eye coordination!
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#F7CAC9] to-[#88B04B] p-8 rounded-2xl border-4 border-[#88B04B] mb-8">
            <h3 className="text-2xl font-bold text-[#6B5B95] mb-4 flex items-center gap-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
              <Timer className="w-8 h-8" />
              How It Works
            </h3>
            
            <div className="space-y-4 text-gray-800">
              <div className="bg-white p-4 rounded-xl border-4 border-[#88B04B]">
                <p className="font-bold text-lg mb-2">1. Wait for Green 🟢</p>
                <p>The screen will turn red. Wait patiently until it turns green!</p>
              </div>

              <div className="bg-white p-4 rounded-xl border-4 border-[#6B5B95]">
                <p className="font-bold text-lg mb-2">2. Click Fast! ⚡</p>
                <p>As soon as you see green, click or tap anywhere on the screen as fast as you can!</p>
              </div>

              <div className="bg-white p-4 rounded-xl border-4 border-[#FF6F61]">
                <p className="font-bold text-lg mb-2">3. Don't Jump the Gun! ⚠️</p>
                <p>If you click before it turns green, you'll have to start that round over</p>
              </div>

              <div className="bg-white p-4 rounded-xl border-4 border-[#F7CAC9]">
                <p className="font-bold text-lg mb-2">4. Complete 5 Rounds 🎯</p>
                <p>You'll do this 5 times. Your average reaction time will be calculated!</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#88B04B] to-[#6B5B95] p-6 rounded-2xl border-4 border-white mb-8">
            <h4 className="text-xl font-bold text-white mb-3">Scoring Guide 📊</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-white p-3 rounded-xl text-center">
                <p className="text-2xl mb-1">⚡</p>
                <p className="text-xs font-bold text-green-600">{'<200ms'}</p>
                <p className="text-xs text-gray-600">Excellent</p>
                <p className="text-sm font-bold text-[#88B04B]">5 pts</p>
              </div>
              <div className="bg-white p-3 rounded-xl text-center">
                <p className="text-2xl mb-1">👍</p>
                <p className="text-xs font-bold text-blue-600">200-300ms</p>
                <p className="text-xs text-gray-600">Good</p>
                <p className="text-sm font-bold text-[#88B04B]">4 pts</p>
              </div>
              <div className="bg-white p-3 rounded-xl text-center">
                <p className="text-2xl mb-1">👌</p>
                <p className="text-xs font-bold text-yellow-600">300-400ms</p>
                <p className="text-xs text-gray-600">Average</p>
                <p className="text-sm font-bold text-[#88B04B]">3 pts</p>
              </div>
              <div className="bg-white p-3 rounded-xl text-center">
                <p className="text-2xl mb-1">🤔</p>
                <p className="text-xs font-bold text-orange-600">400-500ms</p>
                <p className="text-xs text-gray-600">Below Avg</p>
                <p className="text-sm font-bold text-[#88B04B]">2 pts</p>
              </div>
              <div className="bg-white p-3 rounded-xl text-center">
                <p className="text-2xl mb-1">🐌</p>
                <p className="text-xs font-bold text-red-600">{'>500ms'}</p>
                <p className="text-xs text-gray-600">Slow</p>
                <p className="text-sm font-bold text-[#88B04B]">1 pt</p>
              </div>
            </div>
          </div>

          <button
            onClick={startTest}
            className="w-full bg-gradient-to-r from-[#88B04B] to-[#6B5B95] text-white px-8 py-6 rounded-full text-2xl font-bold border-8 border-white shadow-lg hover:scale-105 transition-transform"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            Start Reaction Test 🚀
          </button>
        </div>
      </div>
    )
  }

  const avgReactionTime = reactionTimes.length > 0 
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl p-8 border-8 border-[#88B04B] shadow-2xl mb-8">
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
            <div className="bg-gradient-to-r from-[#88B04B] to-[#6B5B95] text-white px-6 py-3 rounded-full border-4 border-white shadow-lg">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span className="font-bold">Round {currentRound + 1}/{totalRounds}</span>
              </div>
            </div>
            
            {avgReactionTime > 0 && (
              <div className="bg-gradient-to-r from-[#FF6F61] to-[#F7CAC9] text-white px-6 py-3 rounded-full border-4 border-white shadow-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-bold">Avg: {avgReactionTime}ms</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-[#F7CAC9] h-6 rounded-full border-4 border-[#88B04B] overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#88B04B] to-[#6B5B95] h-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${((currentRound + 1) / totalRounds) * 100}%` }}
            >
              <span className="text-white text-xs font-bold">
                {Math.round(((currentRound + 1) / totalRounds) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div 
        onClick={handleClick}
        className={`rounded-3xl p-16 border-8 shadow-2xl cursor-pointer transition-all duration-300 min-h-[500px] flex flex-col items-center justify-center ${
          gameState === 'waiting' 
            ? 'bg-gradient-to-br from-[#FF6F61] to-[#F7CAC9] border-[#FF6F61]' 
            : gameState === 'ready'
            ? 'bg-gradient-to-br from-[#88B04B] to-[#6B5B95] border-[#88B04B] scale-105'
            : gameState === 'clicked'
            ? 'bg-gradient-to-br from-[#6B5B95] to-[#FF6F61] border-[#6B5B95]'
            : gameState === 'tooEarly'
            ? 'bg-gradient-to-br from-red-500 to-red-700 border-red-600'
            : 'bg-gradient-to-br from-[#F7CAC9] to-[#88B04B] border-[#F7CAC9]'
        }`}
      >
        {gameState === 'waiting' && (
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm p-8 rounded-3xl border-4 border-white mb-6">
              <Clock className="w-24 h-24 text-white mx-auto mb-4 animate-pulse" />
              <h3 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
                Wait for it... 🔴
              </h3>
              <p className="text-2xl text-white font-semibold">
                Get ready to click!
              </p>
            </div>
          </div>
        )}

        {gameState === 'ready' && (
          <div className="text-center animate-pulse">
            <div className="bg-white/20 backdrop-blur-sm p-8 rounded-3xl border-4 border-white mb-6">
              <Zap className="w-32 h-32 text-white mx-auto mb-4" />
              <h3 className="text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
                CLICK NOW! 🟢
              </h3>
              <p className="text-3xl text-white font-semibold">
                As fast as you can!
              </p>
            </div>
          </div>
        )}

        {gameState === 'clicked' && reactionTimes.length > 0 && (
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm p-8 rounded-3xl border-4 border-white mb-6">
              <TrendingUp className="w-24 h-24 text-white mx-auto mb-4" />
              <h3 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
                {reactionTimes[reactionTimes.length - 1]}ms
              </h3>
              <p className={`text-3xl font-bold mb-2 ${getReactionRating(reactionTimes[reactionTimes.length - 1]).color.replace('text-', 'text-white')}`}>
                {getReactionRating(reactionTimes[reactionTimes.length - 1]).text}
              </p>
              <p className="text-xl text-white">
                {currentRound < totalRounds - 1 ? 'Get ready for next round...' : 'Calculating final score...'}
              </p>
            </div>
          </div>
        )}

        {gameState === 'tooEarly' && (
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm p-8 rounded-3xl border-4 border-white mb-6">
              <div className="text-8xl mb-4">⚠️</div>
              <h3 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
                Too Early!
              </h3>
              <p className="text-2xl text-white font-semibold">
                Wait for the green screen!
              </p>
            </div>
          </div>
        )}

        {gameState === 'complete' && (
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm p-8 rounded-3xl border-4 border-white mb-6">
              <div className="text-8xl mb-4">🎉</div>
              <h3 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
                Test Complete!
              </h3>
              <p className="text-3xl text-white font-bold mb-4">
                Average: {avgReactionTime}ms
              </p>
              <p className="text-xl text-white">
                Calculating your score...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reaction Times Display */}
      {reactionTimes.length > 0 && gameState !== 'complete' && (
        <div className="mt-8 bg-white rounded-3xl p-6 border-8 border-[#6B5B95] shadow-2xl">
          <h4 className="text-2xl font-bold text-[#6B5B95] mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
            Your Times 📊
          </h4>
          <div className="grid grid-cols-5 gap-4">
            {reactionTimes.map((time, index) => (
              <div key={index} className="bg-gradient-to-br from-[#88B04B] to-[#6B5B95] p-4 rounded-2xl border-4 border-white text-center">
                <p className="text-white text-sm font-semibold mb-1">Round {index + 1}</p>
                <p className="text-white text-2xl font-bold">{time}ms</p>
                <p className={`text-xs font-bold mt-1 ${getReactionRating(time).color.replace('text-', 'text-white')}`}>
                  {getReactionRating(time).text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReactionSpeedTest
