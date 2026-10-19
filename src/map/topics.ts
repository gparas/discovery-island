import type { Mission, MissionId, MissionStatus, Topic } from '../types.ts'

const electricity: readonly Mission[] = [
  { id: 'light-the-bulb', topicId: 'electricity', title: 'Άναψε τη λάμπα', goal: 'Ανακάλυψε τι χρειάζεται μια λάμπα για να ανάψει.', requires: [], playable: true },
  { id: 'materials', topicId: 'electricity', title: 'Ποιο υλικό βοηθά;', goal: 'Σύγκρινε τέσσερα υλικά στο ίδιο κύκλωμα.', requires: ['light-the-bulb'], playable: false },
  { id: 'switches', topicId: 'electricity', title: 'Έλεγξε το φως', goal: 'Άνοιξε και κλείσε τη διαδρομή με έναν διακόπτη.', requires: ['light-the-bulb'], playable: false },
]

/** The five topics, in map order. Topics never lock; only missions inside a topic may require earlier ones. */
export const topics: readonly Topic[] = [
  { id: 'electricity', name: 'Ηλεκτρισμός', backLabel: 'Πίσω στον Ηλεκτρισμό', missions: electricity },
  { id: 'light', name: 'Φως', backLabel: 'Πίσω στο Φως', missions: [] },
  { id: 'heat', name: 'Θερμότητα', backLabel: 'Πίσω στη Θερμότητα', missions: [] },
  { id: 'sound', name: 'Ήχος', backLabel: 'Πίσω στον Ήχο', missions: [] },
  { id: 'forces', name: 'Δυνάμεις', backLabel: 'Πίσω στις Δυνάμεις', missions: [] },
]

export function findTopic(id: string | undefined): Topic | undefined {
  return topics.find(topic => topic.id === id)
}

export function findMission(topic: Topic, id: string | undefined): Mission | undefined {
  return topic.missions.find(mission => mission.id === id)
}

export function missionTitle(id: MissionId): string {
  return topics.flatMap(topic => topic.missions).find(mission => mission.id === id)?.title ?? id
}

/** What the map knows about a profile's missions: which are completed and which have a run under way. */
export interface MissionProgress {
  readonly completed: ReadonlySet<MissionId>
  readonly inProgress: ReadonlySet<MissionId>
}

export function missionStatus(mission: Mission, progress: MissionProgress): MissionStatus {
  if (progress.inProgress.has(mission.id)) return 'in-progress'
  if (progress.completed.has(mission.id)) return 'completed'
  return mission.requires.every(id => progress.completed.has(id)) ? 'available' : 'locked'
}

/** Required missions that are not completed yet, for the «Πρώτα: …» message. */
export function missingRequirements(mission: Mission, progress: MissionProgress): readonly MissionId[] {
  return mission.requires.filter(id => !progress.completed.has(id))
}

/** Where Σπίθα stands: the mission under way, else the first open one not yet completed, else the last. */
export function currentMission(topic: Topic, progress: MissionProgress): Mission | undefined {
  const statuses = topic.missions.map(mission => [mission, missionStatus(mission, progress)] as const)
  return statuses.find(([, status]) => status === 'in-progress')?.[0]
    ?? statuses.find(([, status]) => status === 'available')?.[0]
    ?? topic.missions.at(-1)
}

export const completedCount = (topic: Topic, progress: MissionProgress) => topic.missions.filter(mission => progress.completed.has(mission.id)).length
