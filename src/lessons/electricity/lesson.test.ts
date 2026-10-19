import { describe, expect, it } from 'vitest'
import type { Terminal } from './circuit.ts'
import { challengeStatus, lessonReducer, newProgress, type BoardId, type LessonAction, type LessonProgress } from './lesson.ts'

const play = (actions: readonly LessonAction[], from: LessonProgress = newProgress()) => actions.reduce(lessonReducer, from)
const connect = (board: BoardId, from: Terminal, to: Terminal): LessonAction[] => [
  { type: 'select-terminal', board, terminal: from },
  { type: 'select-terminal', board, terminal: to },
]

const toBuild: LessonAction[] = [{ type: 'begin' }, { type: 'choose-prediction', prediction: 'unsure' }, { type: 'submit-prediction' }]
const toExplain: LessonAction[] = [...toBuild, ...connect('build', 'negative', 'b'), { type: 'explain' }]
const toChallenge: LessonAction[] = [...toExplain, { type: 'choose-explanation', choice: 1 }, { type: 'check-explanation' }, { type: 'start-challenge' }]
const toComplete: LessonAction[] = [...toChallenge, ...connect('challenge', 'positive', 'b'), ...connect('challenge', 'negative', 'a'), { type: 'test-circuit' }, { type: 'finish' }]

describe('prediction', () => {
  it('records the submitted prediction, including uncertainty, and keeps the seeded wire', () => {
    const progress = play(toBuild)
    expect(progress.current.stage).toBe('build')
    expect(progress.current.prediction).toBe('unsure')
    expect(progress.first.prediction).toBe('unsure')
    expect(progress.current.build.wires).toEqual([['positive', 'a']])
    expect(progress.current.build.assistance).toEqual({ hints: 0, demonstrations: 0 })
  })

  it('waits for a choice before continuing', () => {
    expect(play([{ type: 'begin' }, { type: 'submit-prediction' }]).current.stage).toBe('prediction')
  })
})

describe('build board', () => {
  it('connects two selected terminals and cancels a repeated selection', () => {
    let progress = play([...toBuild, { type: 'select-terminal', board: 'build', terminal: 'negative' }])
    expect(progress.current.build).toMatchObject({ pending: 'negative', feedback: 'select-second' })
    progress = play([{ type: 'select-terminal', board: 'build', terminal: 'negative' }], progress)
    expect(progress.current.build).toMatchObject({ pending: null, feedback: null })
    progress = play(connect('build', 'negative', 'b'), progress)
    expect(progress.current.build.wires).toEqual([['positive', 'a'], ['negative', 'b']])
  })

  it('rejects duplicates, shorts and a third wire without changing the board', () => {
    const start = play(toBuild)
    expect(play(connect('build', 'a', 'positive'), start).current.build).toMatchObject({ wires: [['positive', 'a']], feedback: 'duplicate' })
    expect(play(connect('build', 'a', 'negative'), start).current.build).toMatchObject({ wires: [['positive', 'a']], feedback: 'short' })
    const full = play(connect('build', 'positive', 'b'), start)
    expect(play(connect('build', 'a', 'b'), full).current.build).toMatchObject({ wires: full.current.build.wires, feedback: 'full' })
  })

  it('undoes and removes wires without touching saved evidence', () => {
    let progress = play([...toBuild, { type: 'remove-wires', board: 'build' }])
    expect(progress.current.build.wires).toEqual([])
    expect(progress.first.prediction).toBe('unsure')
    progress = play([{ type: 'undo', board: 'build' }], progress)
    expect(progress.current.build.wires).toEqual([['positive', 'a']])
  })

  it('counts each hint and offers one demonstrated connection at the third level', () => {
    let progress = play([...toBuild, { type: 'demonstrate', board: 'build' }])
    expect(progress.current.build.wires).toHaveLength(1)
    progress = play([{ type: 'request-help', board: 'build' }, { type: 'request-help', board: 'build' }, { type: 'request-help', board: 'build' }, { type: 'request-help', board: 'build' }], progress)
    expect(progress.current.build).toMatchObject({ helpLevel: 3, assistance: { hints: 3, demonstrations: 0 } })
    progress = play([{ type: 'demonstrate', board: 'build' }], progress)
    expect(progress.current.build.wires).toEqual([['positive', 'a'], ['negative', 'b']])
    expect(progress.current.build.assistance.demonstrations).toBe(1)
  })

  it('moves to the explanation only with a lit bulb, saving that arrangement', () => {
    expect(play([...toBuild, { type: 'explain' }]).current.stage).toBe('build')
    const progress = play(toExplain)
    expect(progress.current.stage).toBe('explain')
    expect(progress.current.workingCircuit).toEqual([['positive', 'a'], ['negative', 'b']])
  })
})

describe('explanation', () => {
  it('keeps the first answer separately from later tries', () => {
    const progress = play([...toExplain,
      { type: 'choose-explanation', choice: 0 }, { type: 'check-explanation' },
      { type: 'choose-explanation', choice: 1 }, { type: 'check-explanation' }])
    expect(progress.current.explanationAttempts).toEqual([0, 1])
    expect(progress.first.explanation).toEqual({ kind: 'answered', choice: 0, correct: false })
  })

  it('records a requested answer as assisted and lets the child continue', () => {
    const progress = play([...toExplain, { type: 'reveal-explanation' }, { type: 'start-challenge' }])
    expect(progress.first.explanation).toEqual({ kind: 'revealed' })
    expect(progress.current.stage).toBe('challenge')
  })

  it('does not continue before the explanation is solved', () => {
    expect(play([...toExplain, { type: 'start-challenge' }]).current.stage).toBe('explain')
  })
})

describe('challenge', () => {
  it('starts empty and only evaluates on an explicit test', () => {
    let progress = play(toChallenge)
    expect(progress.current.challenge.wires).toEqual([])
    progress = play(connect('challenge', 'positive', 'b'), progress)
    expect(challengeStatus(progress.current)).toBe('untested')
    progress = play([{ type: 'test-circuit' }], progress)
    expect(challengeStatus(progress.current)).toBe('unlit')
    progress = play(connect('challenge', 'negative', 'a'), progress)
    expect(challengeStatus(progress.current)).toBe('changed')
    progress = play([{ type: 'test-circuit' }], progress)
    expect(challengeStatus(progress.current)).toBe('lit')
    expect(progress.first.challengeTest).toMatchObject({ wires: [['positive', 'b']], lit: false })
    expect(progress.current.challengeTests).toHaveLength(2)
  })

  it('treats a rejected wire as an interaction, not an edit', () => {
    let progress = play([...toChallenge, { type: 'test-circuit' }])
    progress = play(connect('challenge', 'positive', 'negative'), progress)
    expect(progress.current.challenge.feedback).toBe('short')
    expect(challengeStatus(progress.current)).toBe('unlit')
  })

  it('finishes only after a lit test', () => {
    expect(play([...toChallenge, { type: 'finish' }]).current.stage).toBe('challenge')
  })
})

describe('completion and replay', () => {
  it('marks the mission completed and starts a fresh run that keeps first evidence', () => {
    let progress = play(toComplete)
    expect(progress.current.stage).toBe('complete')
    expect(progress.completed).toBe(true)
    expect(progress.completedRuns).toHaveLength(1)
    const first = progress.first

    progress = play([{ type: 'replay' }, { type: 'begin' }, { type: 'choose-prediction', prediction: 'yes' }, { type: 'submit-prediction' }], progress)
    expect(progress.current.stage).toBe('build')
    expect(progress.current.prediction).toBe('yes')
    expect(progress.first).toEqual(first)
    expect(progress.completed).toBe(true)
  })
})
