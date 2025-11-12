import React from 'react'
import { Trophy, Target, TrendingUp, Clock } from 'lucide-react'
import { TestHistory } from '../../types'

interface StatsCardsProps {
  totalPoints: number
  history: TestHistory[]
  averageScore: number
}

export const StatsCards: React.FC<StatsCardsProps> = ({ totalPoints, history, averageScore }) => {
  const thisWeekTests = history.filter(h => {
    const testDate = new Date(h.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return testDate > weekAgo
  }).length

  return (
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
        <p className="text-3xl font-bold text-white">{thisWeekTests}</p>
      </div>
    </div>
  )
}
