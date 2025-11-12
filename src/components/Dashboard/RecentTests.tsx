import React from 'react'
import { Palette, Hash, Gauge, Contrast, Grid3x3, Zap, Eye, Sun, Focus } from 'lucide-react'
import { TestHistory } from '../../types'

interface RecentTestsProps {
  tests: TestHistory[]
  onViewResults: () => void
}

export const RecentTests: React.FC<RecentTestsProps> = ({ tests, onViewResults }) => {
  if (tests.length === 0) return null

  const getTestIcon = (testType: string) => {
    switch (testType) {
      case 'color': return <Palette className="w-6 h-6 text-[#FF6F61]" />
      case 'number': return <Hash className="w-6 h-6 text-[#88B04B]" />
      case 'tumbling': return <Gauge className="w-6 h-6 text-[#6B5B95]" />
      case 'contrast': return <Contrast className="w-6 h-6 text-[#F7CAC9]" />
      case 'amsler': return <Grid3x3 className="w-6 h-6 text-[#FF6F61]" />
      case 'reaction': return <Zap className="w-6 h-6 text-[#88B04B]" />
      case 'blink-rate': return <Eye className="w-6 h-6 text-[#6B5B95]" />
      case 'light-sensitivity': return <Sun className="w-6 h-6 text-[#F7CAC9]" />
      case 'focus': return <Focus className="w-6 h-6 text-[#FF6F61]" />
      default: return <Eye className="w-6 h-6 text-[#6B5B95]" />
    }
  }

  const getTestName = (testType: string) => {
    const names: Record<string, string> = {
      'color': 'Color Blindness',
      'number': 'Number Recognition',
      'tumbling': 'Tumbling E',
      'contrast': 'Contrast Sensitivity',
      'amsler': 'Amsler Grid',
      'reaction': 'Reaction Speed',
      'blink-rate': 'Blink Rate',
      'light-sensitivity': 'Light Sensitivity',
      'focus': 'Focus Shift'
    }
    return names[testType] || testType
  }

  return (
    <div className="bg-white rounded-3xl p-8 border-8 border-[#88B04B] shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-3xl font-bold text-[#6B5B95]" style={{ fontFamily: "'Baloo 2', cursive" }}>
          Recent Tests 📊
        </h3>
        <button
          onClick={onViewResults}
          className="bg-gradient-to-r from-[#FF6F61] to-[#F7CAC9] text-white px-6 py-3 rounded-2xl font-bold border-4 border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          View All Results
        </button>
      </div>
      
      <div className="space-y-4">
        {tests.map((test, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-[#F7CAC9] to-white p-4 rounded-2xl border-4 border-[#6B5B95] flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-xl border-2 border-[#88B04B]">
                {getTestIcon(test.testType)}
              </div>
              <div>
                <p className="font-bold text-[#6B5B95] text-lg">
                  {getTestName(test.testType)}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(test.date).toLocaleDateString()} at {new Date(test.date).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#6B5B95]">
                {test.score}/{test.totalQuestions}
              </p>
              <p className="text-sm text-gray-600">
                +{test.pointsEarned} points
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
