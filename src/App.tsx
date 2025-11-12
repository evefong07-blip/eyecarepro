import React, { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'
import Dashboard from './components/Dashboard'
import ColorTest from './components/ColorTest'
import NumberTest from './components/NumberTest'
import PressureTest from './components/PressureTest'
import TumblingETest from './components/TumblingETest'
import ContrastTest from './components/ContrastTest'
import AmslerGridTest from './components/AmslerGridTest'
import ReactionSpeedTest from './components/ReactionSpeedTest'
import BlinkRateTest from './components/BlinkRateTest'
import LightSensitivityTest from './components/LightSensitivityTest'
import FocusShiftTest from './components/FocusShiftTest'
import EyeDominanceTest from './components/EyeDominanceTest'
import Results from './components/Results'
import { TestHistory, TestResult } from './types'

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'color' | 'number' | 'pressure' | 'tumbling' | 'contrast' | 'amsler' | 'reaction' | 'blink' | 'light' | 'focus' | 'dominance' | 'results'>('dashboard')
  const [history, setHistory] = useState<TestHistory[]>([])
  const [totalPoints, setTotalPoints] = useState(0)

  useEffect(() => {
    const savedHistory = localStorage.getItem('eyeTestHistory')
    const savedPoints = localStorage.getItem('eyeTestPoints')
    
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
    if (savedPoints) {
      setTotalPoints(parseInt(savedPoints))
    }
  }, [])

  const saveTestResult = (result: TestResult) => {
    const newHistoryEntry: TestHistory = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      testType: result.testType,
      score: result.score,
      totalQuestions: result.totalQuestions,
      points: result.points,
      duration: result.duration,
      dominantEye: result.dominantEye
    }

    const updatedHistory = [newHistoryEntry, ...history]
    const updatedPoints = totalPoints + result.points

    setHistory(updatedHistory)
    setTotalPoints(updatedPoints)

    localStorage.setItem('eyeTestHistory', JSON.stringify(updatedHistory))
    localStorage.setItem('eyeTestPoints', updatedPoints.toString())

    setCurrentView('results')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF6F61] via-[#F7CAC9] to-[#88B04B] relative overflow-hidden">
      {/* Memphis Design Background Patterns */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 border-8 border-[#6B5B95] rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-[#FF6F61] transform rotate-45"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 border-8 border-[#88B04B]" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
        <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-[#6B5B95] rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-36 h-36 border-8 border-[#F7CAC9] transform rotate-12"></div>
      </div>

      {/* Zigzag Pattern */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-repeat-x opacity-30" style={{
        backgroundImage: `repeating-linear-gradient(45deg, #6B5B95 0, #6B5B95 10px, transparent 10px, transparent 20px)`
      }}></div>

      {/* Header */}
      <header className="relative z-10 bg-white/90 backdrop-blur-sm border-b-8 border-[#6B5B95] shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-2 bg-[#FF6F61] rounded-full transform rotate-12"></div>
                <div className="relative bg-[#88B04B] p-3 rounded-full border-4 border-[#6B5B95]">
                  <Eye className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#6B5B95]" style={{ fontFamily: "'Baloo 2', cursive" }}>
                  Eye Test Pro
                </h1>
                <p className="text-[#FF6F61] font-semibold">Test Your Vision!</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#FF6F61] to-[#6B5B95] text-white px-6 py-3 rounded-full border-4 border-white shadow-lg transform hover:scale-105 transition-transform">
              <p className="text-sm font-semibold">Total Points</p>
              <p className="text-3xl font-bold" style={{ fontFamily: "'Baloo 2', cursive" }}>{totalPoints}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {currentView === 'dashboard' && (
          <Dashboard 
            onStartColorTest={() => setCurrentView('color')}
            onStartNumberTest={() => setCurrentView('number')}
            onStartPressureTest={() => setCurrentView('pressure')}
            onStartTumblingTest={() => setCurrentView('tumbling')}
            onStartContrastTest={() => setCurrentView('contrast')}
            onStartAmslerTest={() => setCurrentView('amsler')}
            onStartReactionTest={() => setCurrentView('reaction')}
            onStartBlinkTest={() => setCurrentView('blink')}
            onStartLightTest={() => setCurrentView('light')}
            onStartFocusTest={() => setCurrentView('focus')}
            onStartDominanceTest={() => setCurrentView('dominance')}
            onViewResults={() => setCurrentView('results')}
            history={history}
            totalPoints={totalPoints}
          />
        )}
        
        {currentView === 'color' && (
          <ColorTest 
            onComplete={saveTestResult}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'number' && (
          <NumberTest 
            onComplete={saveTestResult}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'pressure' && (
          <PressureTest 
            onComplete={saveTestResult}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'tumbling' && (
          <TumblingETest 
            onComplete={saveTestResult}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'contrast' && (
          <ContrastTest 
            onComplete={saveTestResult}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'amsler' && (
          <AmslerGridTest 
            onComplete={saveTestResult}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'reaction' && (
          <ReactionSpeedTest 
            onComplete={saveTestResult}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'blink' && (
          <BlinkRateTest 
            onComplete={saveTestResult}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'light' && (
          <LightSensitivityTest 
            onComplete={saveTestResult}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'focus' && (
          <FocusShiftTest 
            onComplete={saveTestResult}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'dominance' && (
          <EyeDominanceTest 
            onComplete={saveTestResult}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'results' && (
          <Results 
            history={history}
            totalPoints={totalPoints}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
      </main>
    </div>
  )
}

export default App
