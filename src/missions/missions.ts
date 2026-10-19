import type { Mission } from '../types.ts'

/** The five introductory missions, in no required order. Only electricity is planned in detail so far. */
export const missions: readonly Mission[] = [
  { id: 'electricity', topic: 'Ηλεκτρισμός', title: 'Άναψε τη λάμπα' },
  { id: 'light', topic: 'Φως', title: 'Φως' },
  { id: 'heat', topic: 'Θερμότητα', title: 'Θερμότητα' },
  { id: 'sound', topic: 'Ήχος', title: 'Ήχος' },
  { id: 'forces', topic: 'Δυνάμεις', title: 'Δυνάμεις' },
]

export function findMission(id: string | undefined): Mission | undefined {
  return missions.find(mission => mission.id === id)
}

