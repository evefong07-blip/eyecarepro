import React from 'react'
import { Palette, Hash, Trophy, TrendingUp, Clock, Target, Gauge, Eye, Contrast, Grid3x3, Zap, Heart, Activity, Sun, Focus, Crosshair } from 'lucide-react'
import { TestHistory } from '../types'

interface DashboardProps {
  onStartColorTest: () => void
  onStartNumberTest: () => void
  onStartPressureTest: () => void
  onStartTumblingTest: () => void
  onStartContrastTest: () => void
  onStartAmslerTest: () => void
  onStartReactionTest: () => void
  onStartBlinkTest: () => void
  onStartLightTest: () => void
  onStartFocusTest: () => void
  onStartDominanceTest: () => void
  onViewResults: () => void
  history: TestHistory[]
  totalPoints: number
}

const Dashboard: React.FC<DashboardProps> = ({ 
  onStartColorTest, 
  onStartNumberTest,
  onStartPressureTest,
  onStartTumblingTest,
  onStartContrastTest,
  onStartAmslerTest,
  onStartReactionTest,
  onStartBlinkTest,
  onStartLightTest,
  onStartFocusTest,
  onStartDominanceTest,
  onViewResults,
  history,
  totalPoints 
}) => {
  const recentTests = history.slice(0, 5)
  const colorTests = history.filter(h => h.testType === 'color').length
  const numberTests = history.filter(h => h.testType === 'number').length
  const pressureTests = history.filter(h => h.testType === 'pressure').length
  const tumblingTests = history.filter(h => h.testType === 'tumbling').length
  const contrastTests = history.filter(h => h.testType === 'contrast').length
  const amslerTests = history.filter(h => h.testType === 'amsler').length
  const reactionTests = history.filter(h => h.testType === 'reaction').length
  const blinkTests = history.filter(h => h.testType === 'blink').length
  const lightTests = history.filter(h => h.testType === 'light').length
  const focusTests = history.filter(h => h.testType === 'focus').length
  const dominanceTests = history.filter(h => h.testType === 'dominance').length
  const averageScore = history.length > 0 
    ? Math.round(history.reduce((acc, h) => acc + (h.score / h.totalQuestions * 100), 0) / history.length)
    : 0

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 border-8 border-[#6B5B95] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF6F61] rounded-full transform translate-x-20 -translate-y-20 opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#88B04B] transform -translate-x-16 translate-y-16 rotate-45 opacity-30"></div>
        
        <div className="relative z-10">
          <h2 className="text-5xl font-bold text-[#6B5B95] mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
            Welcome to Eye Test Pro!
          </h2>
          <p className="text-xl text-gray-700 mb-6">
            Test your vision with fun and interactive challenges. Track your progress and earn points!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#FF6F61] to-[#F7CAC9] p-4 rounded-2xl border-4 border-white shadow-lg">
              <Trophy className="w-8 h-8 text-white mb-2" />
              <p className="text-white text-sm font-semibold">Total Points</p>
              <p className="text-3xl font-bold text-white">{totalPoints}</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#88B04B] to-[#6B5B95] p-4 rounded-2xl border-4 border-white shadow-lg">
              <Target className="w-8 h-8 text-white mb-2" />
              <p className="text-white text-sm font-semibold">Tests Taken</p>
              <p className="text-3xl font-bold text-white">{history.length}</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#6B5B95] to-[#FF6F61] p-4 rounded-2xl border-4 border-white shadow-lg">
              <TrendingUp className="w-8 h-8 text-white mb-2" />
              <p className="text-white text-sm font-semibold">Avg Score</p>
              <p className="text-3xl font-bold text-white">{averageScore}%</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#F7CAC9] to-[#88B04B] p-4 rounded-2xl border-4 border-white shadow-lg">
              <Clock className="w-8 h-8 text-white mb-2" />
              <p className="text-white text-sm font-semibold">This Week</p>
              <p className="text-3xl font-bold text-white">{history.filter(h => {
                const testDate = new Date(h.date)
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return testDate > weekAgo
              }).length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#6B5B95] to-[#FF6F61] rounded-3xl p-6 border-8 border-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="bg-white p-4 rounded-full border-4 border-[#88B04B]">
            <Eye className="w-10 h-10 text-[#6B5B95]" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-1" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Level 1: Eye Tests
            </h2>
            <p className="text-white text-lg">Comprehensive vision testing suite</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={onStartColorTest}
          className="bg-white rounded-3xl p-6 border-8 border-[#FF6F61] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF6F61] rounded-full transform translate-x-12 -translate-y-12 opacity-20 group-hover:scale-150 transition-transform"></div>
          <div className="relative z-10">
            <div className="bg-gradient-to-br from-[#FF6F61] to-[#F7CAC9] p-4 rounded-2xl w-fit mb-4 border-4 border-white">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#6B5B95] mb-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Color Blindness Test
            </h3>
            <p className="text-gray-600 mb-4">Test your color perception with Ishihara-style plates</p>
            <div className="flex items-center justify-between">
              <span className="text-[#FF6F61] font-bold">{colorTests} completed</span>
              <span className="bg-[#88B04B] text-white px-3 py-1 rounded-full text-sm font-bold">12-18 pts</span>
            </div>
          </div>
        </button>

        <button
          onClick={onStartNumberTest}
          className="bg-white rounded-3xl p-6 border-8 border-[#88B04B] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#88B04B] rounded-full transform translate-x-12 -translate-y-12 opacity-20 group-hover:scale-150 transition-transform"></div>
          <div className="relative z-10">
            <div className="bg-gradient-to-br from-[#88B04B] to-[#6B5B95] p-4 rounded-2xl w-fit mb-4 border-4 border-white">
              <Hash className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#6B5B95] mb-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Number Recognition
            </h3>
            <p className="text-gray-600 mb-4">Identify numbers in various visual conditions</p>
            <div className="flex items-center justify-between">
              <span className="text-[#88B04B] font-bold">{numberTests} completed</span>
              <span className="bg-[#FF6F61] text-white px-3 py-1 rounded-full text-sm font-bold">12-18 pts</span>
            </div>
          </div>
        </button>

        <button
          onClick={onStartTumblingTest}
          className="bg-white rounded-3xl p-6 border-8 border-[#6B5B95] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#6B5B95] rounded-full transform translate-x-12 -translate-y-12 opacity-20 group-hover:scale-150 transition-transform"></div>
          <div className="relative z-10">
            <div className="bg-gradient-to-br from-[#6B5B95] to-[#FF6F61] p-4 rounded-2xl w-fit mb-4 border-4 border-white">
              <Gauge className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#6B5B95] mb-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Tumbling E Test
            </h3>
            <p className="text-gray-600 mb-4">Measure visual acuity with directional E letters</p>
            <div className="flex items-center justify-between">
              <span className="text-[#6B5B95] font-bold">{tumblingTests} completed</span>
              <span className="bg-[#88B04B] text-white px-3 py-1 rounded-full text-sm font-bold">12-18 pts</span>
            </div>
          </div>
        </button>

        <button
          onClick={onStartContrastTest}
          className="bg-white rounded-3xl p-6 border-8 border-[#F7CAC9] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#F7CAC9] rounded-full transform translate-x-12 -translate-y-12 opacity-20 group-hover:scale-150 transition-transform"></div>
          <div className="relative z-10">
            <div className="bg-gradient-to-br from-[#F7CAC9] to-[#FF6F61] p-4 rounded-2xl w-fit mb-4 border-4 border-white">
              <Contrast className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#6B5B95] mb-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Contrast Sensitivity
            </h3>
            <p className="text-gray-600 mb-4">Test your ability to detect subtle differences</p>
            <div className="flex items-center justify-between">
              <span className="text-[#FF6F61] font-bold">{contrastTests} completed</span>
              <span className="bg-[#6B5B95] text-white px-3 py-1 rounded-full text-sm font-bold">12-18 pts</span>
            </div>
          </div>
        </button>

        <button
          onClick={onStartAmslerTest}
          className="bg-white rounded-3xl p-6 border-8 border-[#88B04B] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#88B04B] rounded-full transform translate-x-12 -translate-y-12 opacity-20 group-hover:scale-150 transition-transform"></div>
          <div className="relative z-10">
            <div className="bg-gradient-to-br from-[#88B04B] to-[#F7CAC9] p-4 rounded-2xl w-fit mb-4 border-4 border-white">
              <Grid3x3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#6B5B95] mb-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Amsler Grid Test
            </h3>
            <p className="text-gray-600 mb-4">Screen for macular degeneration and vision distortions</p>
            <div className="flex items-center justify-between">
              <span className="text-[#88B04B] font-bold">{amslerTests} completed</span>
              <span className="bg-[#FF6F61] text-white px-3 py-1 rounded-full text-sm font-bold">15 pts</span>
            </div>
          </div>
        </button>

        <button
          onClick={onStartReactionTest}
          className="bg-white rounded-3xl p-6 border-8 border-[#FF6F61] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF6F61] rounded-full transform translate-x-12 -translate-y-12 opacity-20 group-hover:scale-150 transition-transform"></div>
          <div className="relative z-10">
            <div className="bg-gradient-to-br from-[#FF6F61] to-[#6B5B95] p-4 rounded-2xl w-fit mb-4 border-4 border-white">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#6B5B95] mb-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Reaction Speed Test
            </h3>
            <p className="text-gray-600 mb-4">Measure your visual reaction time</p>
            <div className="flex items-center justify-between">
              <span className="text-[#FF6F61] font-bold">{reactionTests} completed</span>
              <span className="bg-[#88B04B] text-white px-3 py-1 rounded-full text-sm font-bold">Variable</span>
            </div>
          </div>
        </button>
      </div>

      <div className="bg-gradient-to-r from-[#88B04B] to-[#6B5B95] rounded-3xl p-6 border-8 border-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="bg-white p-4 rounded-full border-4 border-[#FF6F61]">
            <Heart className="w-10 h-10 text-[#88B04B]" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-1" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Level 2: Wellness and Lifestyle Tracking
            </h2>
            <p className="text-white text-lg">Monitor habits that affect your eye health</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={onStartDominanceTest}
          className="bg-white rounded-3xl p-6 border-8 border-[#6B5B95] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#6B5B95] rounded-full transform translate-x-12 -translate-y-12 opacity-20 group-hover:scale-150 transition-transform"></div>
          <div className="relative z-10">
            <div className="bg-gradient-to-br from-[#6B5B95] to-[#88B04B] p-4 rounded-2xl w-fit mb-4 border-4 border-white">
              <Crosshair className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#6B5B95] mb-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Eye Dominance Test
            </h3>
            <p className="text-gray-600 mb-4">Discover which eye is your dominant eye</p>
            <div className="flex items-center justify-between">
              <span className="text-[#6B5B95] font-bold">{dominanceTests} completed</span>
              <span className="bg-[#FF6F61] text-white px-3 py-1 rounded-full text-sm font-bold">15 pts</span>
            </div>
          </div>
        </button>

        <button
          onClick={onStartBlinkTest}
          className="bg-white rounded-3xl p-6 border-8 border-[#F7CAC9] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#F7CAC9] rounded-full transform translate-x-12 -translate-y-12 opacity-20 group-hover:scale-150 transition-transform"></div>
          <div className="relative z-10">
            <div className="bg-gradient-to-br from-[#F7CAC9] to-[#88B04B] p-4 rounded-2xl w-fit mb-4 border-4 border-white">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#6B5B95] mb-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Blink Rate Monitor
            </h3>
            <p className="text-gray-600 mb-4">Track your blinking frequency for eye health</p>
            <div className="flex items-center justify-between">
              <span className="text-[#F7CAC9] font-bold">{blinkTests} completed</span>
              <span className="bg-[#6B5B95] text-white px-3 py-1 rounded-full text-sm font-bold">Variable</span>
            </div>
          </div>
        </button>

        <button
          onClick={onStartLightTest}
          className="bg-white rounded-3xl p-6 border-8 border-[#88B04B] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#88B04B] rounded-full transform translate-x-12 -translate-y-12 opacity-20 group-hover:scale-150 transition-transform"></div>
          <div className="relative z-10">
            <div className="bg-gradient-to-br from-[#88B04B] to-[#FF6F61] p-4 rounded-2xl w-fit mb-4 border-4 border-white">
              <Sun className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#6B5B95] mb-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Light Sensitivity Test
            </h3>
            <p className="text-gray-600 mb-4">Assess your sensitivity to different light levels</p>
            <div className="flex items-center justify-between">
              <span className="text-[#88B04B] font-bold">{lightTests} completed</span>
              <span className="bg-[#FF6F61] text-white px-3 py-1 rounded-full text-sm font-bold">12-18 pts</span>
            </div>
          </div>
        </button>

        <button
          onClick={onStartFocusTest}
          className="bg-white rounded-3xl p-6 border-8 border-[#FF6F61] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF6F61] rounded-full transform translate-x-12 -translate-y-12 opacity-20 group-hover:scale-150 transition-transform"></div>
          <div className="relative z-10">
            <div className="bg-gradient-to-br from-[#FF6F61] to-[#6B5B95] p-4 rounded-2xl w-fit mb-4 border-4 border-white">
              <Focus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#6B5B95] mb-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Focus Shift Test
            </h3>
            <p className="text-gray-600 mb-4">Test your ability to shift focus between distances</p>
            <div className="flex items-center justify-between">
              <span className="text-[#FF6F61] font-bold">{focusTests} completed</span>
              <span className="bg-[#88B04B] text-white px-3 py-1 rounded-full text-sm font-bold">Variable</span>
            </div>
          </div>
        </button>
      </div>

      {history.length > 0 && (
        <div className="bg-white rounded-3xl p-8 border-8 border-[#6B5B95] shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold text-[#6B5B95]" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Recent Tests
            </h3>
            <button
              onClick={onViewResults}
              className="bg-gradient-to-r from-[#FF6F61] to-[#6B5B95] text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transform hover:scale-105 transition-all border-4 border-white"
            >
              View All Results
            </button>
          </div>
          
          <div className="space-y-4">
            {recentTests.map((test) => (
              <div
                key={test.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-[#F7CAC9] to-[#88B04B] rounded-2xl border-4 border-white"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-full border-4 border-[#6B5B95]">
                    {test.testType === 'color' && <Palette className="w-6 h-6 text-[#FF6F61]" />}
                    {test.testType === 'number' && <Hash className="w-6 h-6 text-[#88B04B]" />}
                    {test.testType === 'pressure' && <Gauge className="w-6 h-6 text-[#6B5B95]" />}
                    {test.testType === 'tumbling' && <Gauge className="w-6 h-6 text-[#6B5B95]" />}
                    {test.testType === 'contrast' && <Contrast className="w-6 h-6 text-[#FF6F61]" />}
                    {test.testType === 'amsler' && <Grid3x3 className="w-6 h-6 text-[#88B04B]" />}
                    {test.testType === 'reaction' && <Zap className="w-6 h-6 text-[#FF6F61]" />}
                    {test.testType === 'blink' && <Activity className="w-6 h-6 text-[#6B5B95]" />}
                    {test.testType === 'light' && <Sun className="w-6 h-6 text-[#F7CAC9]" />}
                    {test.testType === 'focus' && <Focus className="w-6 h-6 text-[#88B04B]" />}
                    {test.testType === 'dominance' && <Crosshair className="w-6 h-6 text-[#6B5B95]" />}
                  </div>
                  <div>
                    <p className="font-bold text-[#6B5B95] capitalize">
                      {test.testType === 'tumbling' ? 'Tumbling E' : test.testType === 'dominance' ? 'Eye Dominance' : test.testType} Test
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(test.date).toLocaleDateString()}
                      {test.dominantEye && ` • ${test.dominantEye === 'left' ? 'Left' : test.dominantEye === 'right' ? 'Right' : 'No'} Eye Dominant`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    {test.testType === 'dominance' ? '✓' : `${test.score}/${test.totalQuestions}`}
                  </p>
                  <p className="text-sm text-white font-semibold">
                    +{test.points} points
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
