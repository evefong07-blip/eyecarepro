export interface TestResult {
  testType: 'color' | 'number' | 'pressure' | 'tumbling' | 'contrast' | 'amsler' | 'reaction' | 'blink' | 'light' | 'focus' | 'dominance'
  score: number
  totalQuestions: number
  points: number
  duration: number
  dominantEye?: 'left' | 'right' | 'neither'
}

export interface TestHistory {
  id: string
  date: string
  testType: 'color' | 'number' | 'pressure' | 'tumbling' | 'contrast' | 'amsler' | 'reaction' | 'blink' | 'light' | 'focus' | 'dominance'
  score: number
  totalQuestions: number
  points: number
  duration: number
  dominantEye?: 'left' | 'right' | 'neither'
}
