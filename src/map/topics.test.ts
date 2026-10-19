import { describe, expect, it } from 'vitest'
import type { MissionId } from '../types.ts'
import { currentMission, findMission, findTopic, missingRequirements, missionStatus, topics, type MissionProgress } from './topics.ts'

const progress = (completed: MissionId[] = [], inProgress: MissionId[] = []): MissionProgress => ({ completed: new Set(completed), inProgress: new Set(inProgress) })
const electricity = findTopic('electricity')!
const [lightTheBulb, materials, switches] = electricity.missions

describe('topics', () => {
  it('lists the five topics once each, with electricity holding three missions', () => {
    expect(topics.map(topic => topic.name)).toEqual(['Ηλεκτρισμός', 'Φως', 'Θερμότητα', 'Ήχος', 'Δυνάμεις'])
    expect(electricity.missions.map(mission => mission.title)).toEqual(['Άναψε τη λάμπα', 'Ποιο υλικό βοηθά;', 'Έλεγξε το φως'])
  })

  it('finds topics and missions by id and ignores unknown ids', () => {
    expect(findTopic('volcanoes')).toBeUndefined()
    expect(findMission(electricity, 'switches')?.title).toBe('Έλεγξε το φως')
    expect(findMission(electricity, 'light-the-bulb')).toBe(lightTheBulb)
    expect(findMission(findTopic('light')!, 'light-the-bulb')).toBeUndefined()
  })

  it('keeps the first mission of every topic open', () => {
    for (const topic of topics) expect(topic.missions[0]?.requires ?? []).toEqual([])
  })
})

describe('mission status', () => {
  it('locks missions until their requirements are completed', () => {
    expect(missionStatus(lightTheBulb!, progress())).toBe('available')
    expect(missionStatus(materials!, progress())).toBe('locked')
    expect(missingRequirements(switches!, progress())).toEqual(['light-the-bulb'])
    expect(missionStatus(materials!, progress(['light-the-bulb']))).toBe('available')
    expect(missionStatus(switches!, progress(['light-the-bulb']))).toBe('available')
  })

  it('reports runs under way before completion', () => {
    expect(missionStatus(lightTheBulb!, progress([], ['light-the-bulb']))).toBe('in-progress')
    expect(missionStatus(lightTheBulb!, progress(['light-the-bulb'], ['light-the-bulb']))).toBe('in-progress')
    expect(missionStatus(lightTheBulb!, progress(['light-the-bulb']))).toBe('completed')
  })

  it('places Σπίθα at the mission under way, else the first open one', () => {
    expect(currentMission(electricity, progress())).toBe(lightTheBulb)
    expect(currentMission(electricity, progress(['light-the-bulb']))).toBe(materials)
    expect(currentMission(findTopic('sound')!, progress())).toBeUndefined()
  })
})
