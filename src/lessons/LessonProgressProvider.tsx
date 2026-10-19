import type { ReactNode } from 'react'
import { LessonProgressContext, useLessonProgressState } from './useLessonProgress.ts'

export function LessonProgressProvider({ children }: { children: ReactNode }) {
  return <LessonProgressContext value={useLessonProgressState()}>{children}</LessonProgressContext>
}
