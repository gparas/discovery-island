import { createContext, useContext, useState } from 'react'
import { lessonReducer, newProgress, type LessonAction, type LessonProgress } from './electricity/lesson.ts'

/**
 * Owns each profile's electricity-lesson progress for this session, keyed by profile id.
 * Like the preview profiles it lives in memory only; durable storage and legacy import are still undecided.
 */
export function useLessonProgressState() {
  const [byProfile, setByProfile] = useState<Readonly<Record<string, LessonProgress>>>({})

  function progressFor(profileId: string): LessonProgress {
    return byProfile[profileId] ?? newProgress()
  }

  function dispatch(profileId: string, action: LessonAction) {
    setByProfile(previous => {
      const current = previous[profileId] ?? newProgress()
      const next = lessonReducer(current, action)
      return next === current ? previous : { ...previous, [profileId]: next }
    })
  }

  function clearProgress() { setByProfile({}) }

  return { progressFor, dispatch, clearProgress }
}

export type LessonProgressState = ReturnType<typeof useLessonProgressState>

export const LessonProgressContext = createContext<LessonProgressState | null>(null)

export function useLessonProgress(): LessonProgressState {
  const state = useContext(LessonProgressContext)
  if (!state) throw new Error('useLessonProgress must be used inside LessonProgressProvider')
  return state
}

/** The given profile's lesson progress and a dispatcher bound to that profile. */
export function useElectricityLesson(profileId: string) {
  const { progressFor, dispatch } = useLessonProgress()
  return [progressFor(profileId), (action: LessonAction) => dispatch(profileId, action)] as const
}
