import React from 'react'
import { LucideIcon } from 'lucide-react'

interface TestCardProps {
  onClick: () => void
  icon: LucideIcon
  title: string
  description: string
  testsCount: number
  borderColor: string
  hoverColor: string
  gradientFrom: string
  gradientTo: string
  showWarning?: boolean
}

export const TestCard: React.FC<TestCardProps> = ({
  onClick,
  icon: Icon,
  title,
  description,
  testsCount,
  borderColor,
  hoverColor,
  gradientFrom,
  gradientTo,
  showWarning = false
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-3xl p-6 border-8 ${borderColor} ${hoverColor} transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} p-4 rounded-2xl border-4 border-white`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div className="text-left">
          <h3 className="text-2xl font-bold text-[#6B5B95]" style={{ fontFamily: "'Baloo 2', cursive" }}>
            {title}
          </h3>
          <p className="text-sm text-gray-600">Tests: {testsCount}</p>
        </div>
      </div>
      <p className="text-gray-700 text-left">{description}</p>
      {showWarning && (
        <div className="mt-3 bg-yellow-100 border-2 border-yellow-400 rounded-xl p-2">
          <p className="text-xs text-yellow-800 font-semibold">
            ⚠️ Medical screening tool - consult an eye care professional
          </p>
        </div>
      )}
    </button>
  )
}
