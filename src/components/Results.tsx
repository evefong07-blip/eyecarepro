import React from 'react'
import { ArrowLeft, Trophy, TrendingUp, Clock, Target, Palette, Hash, Gauge, Eye, Contrast, Grid3x3, Zap } from 'lucide-react'
import { TestHistory } from '../types'

interface ResultsProps {
  history: TestHistory[]
  totalPoints: number
  onBack: () => void
}

const Results: React.FC<ResultsProps> = ({ history, totalPoints, onBack }) => {
  const colorTests = history.filter(h => h.testType === 'color')
  const numberTests = history.filter(h => h.testType === 'number')
  const pressureTests = history.filter(h => h.testType === 'pressure')
  const tumblingTests = history.filter(h => h.testType === 'tumbling')
  const contrastTests = history.filter(h => h.testType === 'contrast')
  const amslerTests = history.filter(h => h.testType === 'amsler')
  const reactionTests = history.filter(h => h.testType === 'reaction')

  const getAverageScore = (tests: TestHistory[]) => {
    if (tests.length === 0) return 0
    return Math.round(tests.reduce((acc, t) => acc + (t.score / t.totalQuestions * 100), 0) / tests.length)
  }

  const getTotalPoints = (tests: TestHistory[]) => {
    return tests.reduce((acc, t) => acc + t.points, 0)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl p-8 border-8 border-[#6B5B95] shadow-2xl mb-8">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 bg-[#FF6F61] text-white px-6 py-3 rounded-full font-bold border-4 border-white shadow-lg hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          
          <div className="bg-gradient-to-r from-[#FF6F61] to-[#6B5B95] text-white px-8 py-4 rounded-full border-4 border-white shadow-lg">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              <div>
                <p className="text-sm font-semibold">Total Points</p>
                <p className="text-3xl font-bold" style={{ fontFamily: "'Baloo 2', cursive" }}>{totalPoints}</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-5xl font-bold text-[#6B5B95] mb-4" style={{ fontFamily: "'Baloo 2', cursive" }}>
          Your Test Results 📊
        </h2>
        <p className="text-xl text-gray-700 mb-8">
          Track your progress across all vision tests!
        </p>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#FF6F61] to-[#F7CAC9] p-6 rounded-2xl border-4 border-white shadow-lg">
            <Palette className="w-10 h-10 text-white mb-3" />
            <p className="text-white text-sm font-semibold mb-1">Color Tests</p>
            <p className="text-4xl font-bold text-white mb-2">{colorTests.length}</p>
            <p className="text-white text-sm">Avg: {getAverageScore(colorTests)}%</p>
            <p className="text-white text-xs mt-1">{getTotalPoints(colorTests)} points</p>
          </div>

          <div className="bg-gradient-to-br from-[#6B5B95] to-[#88B04B] p-6 rounded-2xl border-4 border-white shadow-lg">
            <Hash className="w-10 h-10 text-white mb-3" />
            <p className="text-white text-sm font-semibold mb-1">Number Tests</p>
            <p className="text-4xl font-bold text-white mb-2">{numberTests.length}</p>
            <p className="text-white text-sm">Avg: {getAverageScore(numberTests)}%</p>
            <p className="text-white text-xs mt-1">{getTotalPoints(numberTests)} points</p>
          </div>

          <div className="bg-gradient-to-br from-[#88B04B] to-[#F7CAC9] p-6 rounded-2xl border-4 border-white shadow-lg">
            <Gauge className="w-10 h-10 text-white mb-3" />
            <p className="text-white text-sm font-semibold mb-1">Pressure Tests</p>
            <p className="text-4xl font-bold text-white mb-2">{pressureTests.length}</p>
            <p className="text-white text-sm">Avg: {getAverageScore(pressureTests)}%</p>
            <p className="text-white text-xs mt-1">{getTotalPoints(pressureTests)} points</p>
          </div>

          <div className="bg-gradient-to-br from-[#F7CAC9] to-[#6B5B95] p-6 rounded-2xl border-4 border-white shadow-lg">
            <Eye className="w-10 h-10 text-white mb-3" />
            <p className="text-white text-sm font-semibold mb-1">Tumbling E Tests</p>
            <p className="text-4xl font-bold text-white mb-2">{tumblingTests.length}</p>
            <p className="text-white text-sm">Avg: {getAverageScore(tumblingTests)}%</p>
            <p className="text-white text-xs mt-1">{getTotalPoints(tumblingTests)} points</p>
          </div>

          <div className="bg-gradient-to-br from-[#6B5B95] to-[#FF6F61] p-6 rounded-2xl border-4 border-white shadow-lg">
            <Contrast className="w-10 h-10 text-white mb-3" />
            <p className="text-white text-sm font-semibold mb-1">Contrast Tests</p>
            <p className="text-4xl font-bold text-white mb-2">{contrastTests.length}</p>
            <p className="text-white text-sm">Avg: {getAverageScore(contrastTests)}%</p>
            <p className="text-white text-xs mt-1">{getTotalPoints(contrastTests)} points</p>
          </div>

          <div className="bg-gradient-to-br from-[#FF6F61] to-[#88B04B] p-6 rounded-2xl border-4 border-white shadow-lg">
            <Grid3x3 className="w-10 h-10 text-white mb-3" />
            <p className="text-white text-sm font-semibold mb-1">Amsler Grid Tests</p>
            <p className="text-4xl font-bold text-white mb-2">{amslerTests.length}</p>
            <p className="text-white text-sm">Avg: {getAverageScore(amslerTests)}%</p>
            <p className="text-white text-xs mt-1">{getTotalPoints(amslerTests)} points</p>
          </div>

          <div className="bg-gradient-to-br from-[#88B04B] to-[#6B5B95] p-6 rounded-2xl border-4 border-white shadow-lg">
            <Zap className="w-10 h-10 text-white mb-3" />
            <p className="text-white text-sm font-semibold mb-1">Reaction Tests</p>
            <p className="text-4xl font-bold text-white mb-2">{reactionTests.length}</p>
            <p className="text-white text-sm">Avg: {getAverageScore(reactionTests)}%</p>
            <p className="text-white text-xs mt-1">{getTotalPoints(reactionTests)} points</p>
          </div>
        </div>
      </div>

      {/* Test History */}
      <div className="bg-white rounded-3xl p-8 border-8 border-[#88B04B] shadow-2xl">
        <h3 className="text-3xl font-bold text-[#88B04B] mb-6" style={{ fontFamily: "'Baloo 2', cursive" }}>
          Complete History 📝
        </h3>

        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-500 mb-4">No tests completed yet!</p>
            <p className="text-gray-600">Start taking tests to see your results here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((test) => (
              <div key={test.id} 
                   className="bg-gradient-to-r from-[#F7CAC9] to-white p-6 rounded-2xl border-4 border-[#88B04B] hover:scale-102 transition-transform">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-lg ${
                      test.testType === 'color' ? 'bg-[#FF6F61]' : 
                      test.testType === 'number' ? 'bg-[#6B5B95]' : 
                      test.testType === 'pressure' ? 'bg-[#88B04B]' : 
                      test.testType === 'tumbling' ? 'bg-[#F7CAC9]' : 
                      test.testType === 'contrast' ? 'bg-[#6B5B95]' : 
                      test.testType === 'amsler' ? 'bg-[#FF6F61]' : 'bg-[#88B04B]'
                    }`}>
                      {test.testType === 'color' ? <Palette className="w-8 h-8 text-white" /> : 
                       test.testType === 'number' ? <Hash className="w-8 h-8 text-white" /> :
                       test.testType === 'pressure' ? <Gauge className="w-8 h-8 text-white" /> :
                       test.testType === 'tumbling' ? <Eye className="w-8 h-8 text-white" /> :
                       test.testType === 'contrast' ? <Contrast className="w-8 h-8 text-white" /> :
                       test.testType === 'amsler' ? <Grid3x3 className="w-8 h-8 text-white" /> :
                       <Zap className="w-8 h-8 text-white" />}
                    </div>
                    <div>
                      <p className="font-bold text-2xl text-gray-800">
                        {test.testType === 'color' ? 'Color Test' : 
                         test.testType === 'number' ? 'Number Test' : 
                         test.testType === 'pressure' ? 'Pressure Test' : 
                         test.testType === 'tumbling' ? 'Tumbling E Test' : 
                         test.testType === 'contrast' ? 'Contrast Test' : 
                         test.testType === 'amsler' ? 'Amsler Grid Test' : 'Reaction Speed Test'}
                      </p>
                      <p className="text-gray-600">
                        {new Date(test.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(test.date).toLocaleTimeString()} • Duration: {test.duration}s
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-4xl font-bold text-[#6B5B95]">
                        {test.score}/{test.totalQuestions}
                      </p>
                      <p className="text-lg text-gray-600">
                        {Math.round((test.score / test.totalQuestions) * 100)}% correct
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-[#88B04B] to-[#6B5B95] text-white px-6 py-4 rounded-full font-bold border-4 border-white shadow-lg">
                      <p className="text-sm">Points</p>
                      <p className="text-2xl">+{test.points}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Results
