import { describe, expect, it } from 'vitest'
import { findMission, missions } from './missions.ts'

describe('missions', () => {
  it('lists the five introductory topics once each', () => {
    expect(missions.map(mission => mission.topic)).toEqual(['Ηλεκτρισμός', 'Φως', 'Θερμότητα', 'Ήχος', 'Δυνάμεις'])
    expect(new Set(missions.map(mission => mission.id)).size).toBe(5)
  })

  it('finds a mission by id and ignores unknown ids', () => {
    expect(findMission('electricity')?.title).toBe('Άναψε τη λάμπα')
    expect(findMission('volcanoes')).toBeUndefined()
    expect(findMission(undefined)).toBeUndefined()
  })
})
