import { useLessonProgress } from '../lessons/useLessonProgress.ts'
import type { MissionId } from '../types.ts'
import type { MissionProgress } from './topics.ts'

/** The current profile's mission progress, as the map and topic pages read it. Only «Άναψε τη λάμπα» is playable so far. */
export function useMissionProgress(profileId: string): MissionProgress {
  const lesson = useLessonProgress().progressFor(profileId)
  const completed = new Set<MissionId>(), inProgress = new Set<MissionId>()
  if (lesson.completed) completed.add('light-the-bulb')
  const { stage } = lesson.current
  if (stage !== 'story' && stage !== 'complete') inProgress.add('light-the-bulb')
  return { completed, inProgress }
}
