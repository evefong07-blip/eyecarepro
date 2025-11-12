import React, { useState } from 'react'
import { ArrowLeft, Eye, Target, CheckCircle, XCircle } from 'lucide-react'
import { TestResult } from '../types'

interface EyeDominanceTestProps {
  onComplete: (result: TestResult) => void
  onBack: () => void
}

const EyeDominanceTest: React.FC<EyeDominanceTestProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(0)
  const [startTime] = useState(Date.now())
  const [results, setResults] = useState<Array<'left' | 'right' | 'neither'>>([])

  const steps = [
    {
      title: 'Welcome to Eye Dominance Test',
      instruction: 'This test will help determine which eye is your dominant eye. Eye dominance is similar to being right or left-handed, but for your eyes!',
      action: null
    },
    {
      title: 'Test 1: Miles Test (Hole-in-Card)',
      instruction: 'Extend both arms in front of you and create a small triangle opening with your hands by overlapping them. Keep both eyes open and look through the triangle at a distant object (like a doorknob or light switch).',
      action: 'triangle'
    },
    {
      title: 'Now Close Your Left Eye',
      instruction: 'Keep looking at the same object through the triangle. Close ONLY your left eye. Does the object stay centered in the triangle?',
      action: 'close-left'
    },
    {
      title: 'Now Close Your Right Eye',
      instruction: 'Open your left eye and close ONLY your right eye instead. Does the object stay centered in the triangle?',
      action: 'close-right'
    },
    {
      title: 'Test 2: Pointing Test',
      instruction: 'With both eyes open, point your finger at a distant object (like a light switch or picture frame). Keep your arm extended.',
      action: 'point'
    },
    {
      title: 'Close Your Left Eye',
      instruction: 'Keep pointing at the same object. Close ONLY your left eye. Does your finger still point at the object?',
      action: 'point-left'
    },
    {
      title: 'Close Your Right Eye',
      instruction: 'Open your left eye and close ONLY your right eye. Does your finger still point at the object?',
      action: 'point-right'
    },
    {
      title: 'Test 3: Convergence Test',
      instruction: 'Hold your finger about 10 inches from your nose. Focus on your finger with both eyes open, then slowly bring it closer to your nose.',
      action: 'convergence'
    },
    {
      title: 'Which Eye Stayed Focused?',
      instruction: 'As your finger got very close to your nose, one eye likely stopped focusing on it. Which eye kept the finger in focus until the very end?',
      action: 'convergence-result'
    }
  ]

  const handleAnswer = (answer: 'left' | 'right' | 'neither') => {
    const newResults = [...results, answer]
    setResults(newResults)

    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      // Calculate dominant eye
      const leftCount = newResults.filter(r => r === 'left').length
      const rightCount = newResults.filter(r => r === 'right').length
      
      let dominantEye: 'left' | 'right' | 'neither'
      if (leftCount > rightCount) {
        dominantEye = 'left'
      } else if (rightCount > leftCount) {
        dominantEye = 'right'
      } else {
        dominantEye = 'neither'
      }

      const duration = Math.floor((Date.now() - startTime) / 1000)
      
      onComplete({
        testType: 'dominance',
        score: 1,
        totalQuestions: 1,
        points: 15,
        duration,
        dominantEye
      })
    }
  }

  const currentStep = steps[step]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-8 border-8 border-[#6B5B95] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 bg-[#6B5B95] text-white px-6 py-3 rounded-full font-bold border-4 border-white shadow-lg hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="bg-gradient-to-r from-[#FF6F61] to-[#F7CAC9] text-white px-6 py-3 rounded-full border-4 border-white shadow-lg">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <span className="font-bold">Step {step + 1}/{steps.length}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-[#F7CAC9] h-6 rounded-full border-4 border-[#FF6F61] overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#FF6F61] to-[#6B5B95] h-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            >
              <span className="text-white text-xs font-bold">
                {Math.round(((step + 1) / steps.length) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Title */}
          <div className="bg-gradient-to-r from-[#6B5B95] to-[#88B04B] p-6 rounded-2xl border-4 border-white">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-full border-4 border-[#FF6F61]">
                <Eye className="w-8 h-8 text-[#6B5B95]" />
              </div>
              <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Baloo 2', cursive" }}>
                {currentStep.title}
              </h2>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-[#F7CAC9] to-[#88B04B] p-8 rounded-2xl border-4 border-[#FF6F61]">
            <p className="text-xl text-gray-800 font-semibold leading-relaxed">
              {currentStep.instruction}
            </p>
          </div>

          {/* Visual Aid */}
          {currentStep.action === 'triangle' && (
            <div className="bg-white p-8 rounded-2xl border-4 border-[#6B5B95] flex justify-center">
              <div className="relative">
                <div className="text-9xl text-[#FF6F61]">△</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-[#88B04B] rounded-full border-4 border-white"></div>
                </div>
              </div>
            </div>
          )}

          {currentStep.action === 'point' && (
            <div className="bg-white p-8 rounded-2xl border-4 border-[#6B5B95] flex justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">👉</div>
                <div className="text-6xl text-[#FF6F61]">🎯</div>
              </div>
            </div>
          )}

          {currentStep.action === 'convergence' && (
            <div className="bg-white p-8 rounded-2xl border-4 border-[#6B5B95] flex justify-center">
              <div className="text-center space-y-4">
                <div className="text-6xl">👁️ 👁️</div>
                <div className="text-8xl">☝️</div>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-4xl">←</div>
                  <div className="text-2xl text-[#FF6F61] font-bold">Move closer</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {currentStep.action === null ? (
            <button
              onClick={() => setStep(step + 1)}
              className="w-full bg-gradient-to-r from-[#88B04B] to-[#6B5B95] text-white py-6 rounded-2xl font-bold text-2xl border-4 border-white shadow-lg hover:scale-105 transition-transform"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              Start Test →
            </button>
          ) : currentStep.action === 'triangle' || currentStep.action === 'point' || currentStep.action === 'convergence' ? (
            <button
              onClick={() => setStep(step + 1)}
              className="w-full bg-gradient-to-r from-[#FF6F61] to-[#6B5B95] text-white py-6 rounded-2xl font-bold text-2xl border-4 border-white shadow-lg hover:scale-105 transition-transform"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              Ready! Continue →
            </button>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleAnswer('left')}
                className="bg-gradient-to-br from-[#88B04B] to-[#6B5B95] text-white py-6 rounded-2xl font-bold text-xl border-4 border-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-3"
              >
                <CheckCircle className="w-6 h-6" />
                Left Eye
              </button>
              
              <button
                onClick={() => handleAnswer('right')}
                className="bg-gradient-to-br from-[#FF6F61] to-[#F7CAC9] text-white py-6 rounded-2xl font-bold text-xl border-4 border-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-3"
              >
                <CheckCircle className="w-6 h-6" />
                Right Eye
              </button>
              
              <button
                onClick={() => handleAnswer('neither')}
                className="bg-gradient-to-br from-[#6B5B95] to-[#FF6F61] text-white py-6 rounded-2xl font-bold text-xl border-4 border-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-3"
              >
                <XCircle className="w-6 h-6" />
                Neither/Both
              </button>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border-4 border-blue-300 rounded-2xl p-6">
            <p className="text-blue-800 font-semibold">
              <strong>💡 Tip:</strong> Eye dominance is completely normal and doesn't indicate better vision in one eye. About 2/3 of people are right-eye dominant, similar to right-handedness!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EyeDominanceTest
