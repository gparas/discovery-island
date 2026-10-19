import { addWire, isLit, nextConnection, type Terminal, type Wire, type WireRejection } from './circuit.ts'

/** The lesson's guided stages, in order. See docs/electricity-lesson.md. */
export type Stage = 'story' | 'prediction' | 'build' | 'explain' | 'challenge' | 'complete'
export type Prediction = 'yes' | 'no' | 'unsure'
/** Index into the explanation choices, kept in their stable order. */
export type ExplanationChoice = 0 | 1 | 2
export const CORRECT_EXPLANATION: ExplanationChoice = 1
/** 0 = no help yet; 1 = verbal cue; 2 = highlighted connection; 3 = demonstration offered. */
export type HelpLevel = 0 | 1 | 2 | 3
export type BoardId = 'build' | 'challenge'
export type BoardFeedback = 'select-second' | Exclude<WireRejection, 'same'>

export interface Assistance {
  readonly hints: number
  readonly demonstrations: number
}

/** One wiring board: the current wires, undo history, a pending first terminal and its help record. */
export interface Board {
  readonly wires: readonly Wire[]
  readonly history: readonly (readonly Wire[])[]
  readonly pending: Terminal | null
  readonly feedback: BoardFeedback | null
  readonly helpLevel: HelpLevel
  readonly assistance: Assistance
}

export interface ChallengeTest {
  readonly wires: readonly Wire[]
  readonly lit: boolean
  /** Help used on the challenge board up to this test. */
  readonly assistance: Assistance
}

export type ExplanationOutcome =
  | { readonly kind: 'answered'; readonly choice: ExplanationChoice; readonly correct: boolean }
  | { readonly kind: 'revealed' }

export interface Run {
  readonly stage: Stage
  /** The prediction currently selected; it can change until submitted. */
  readonly predictionChoice: Prediction | null
  readonly prediction: Prediction | null
  readonly build: Board
  /** The working arrangement saved when leaving the build stage, shown unchanged during the explanation. */
  readonly workingCircuit: readonly Wire[] | null
  readonly explanationChoice: ExplanationChoice | null
  /** Every checked answer, in order; the last one drives the feedback. */
  readonly explanationAttempts: readonly ExplanationChoice[]
  readonly explanationRevealed: boolean
  readonly challenge: Board
  readonly challengeTests: readonly ChallengeTest[]
  /** The wiring changed after the latest test, so its result no longer applies. */
  readonly challengeEdited: boolean
}

export interface RunSummary {
  readonly prediction: Prediction | null
  readonly buildAssistance: Assistance
  readonly explanationAttempts: readonly ExplanationChoice[]
  readonly explanationRevealed: boolean
  readonly challengeTests: readonly ChallengeTest[]
  readonly challengeAssistance: Assistance
}

/** A profile's progress through the lesson. First evidence is written once and survives replays. */
export interface LessonProgress {
  readonly completed: boolean
  readonly first: {
    readonly prediction: Prediction | null
    readonly explanation: ExplanationOutcome | null
    readonly challengeTest: ChallengeTest | null
  }
  readonly completedRuns: readonly RunSummary[]
  readonly current: Run
}

export type LessonAction =
  | { readonly type: 'begin' }
  | { readonly type: 'choose-prediction'; readonly prediction: Prediction }
  | { readonly type: 'submit-prediction' }
  | { readonly type: 'select-terminal'; readonly board: BoardId; readonly terminal: Terminal }
  | { readonly type: 'undo'; readonly board: BoardId }
  | { readonly type: 'remove-wires'; readonly board: BoardId }
  | { readonly type: 'request-help'; readonly board: BoardId }
  | { readonly type: 'demonstrate'; readonly board: BoardId }
  | { readonly type: 'explain' }
  | { readonly type: 'choose-explanation'; readonly choice: ExplanationChoice }
  | { readonly type: 'check-explanation' }
  | { readonly type: 'reveal-explanation' }
  | { readonly type: 'start-challenge' }
  | { readonly type: 'test-circuit' }
  | { readonly type: 'finish' }
  | { readonly type: 'replay' }

/** The prediction's single wire, carried unchanged into the experiment. It is part of the lesson, not assistance. */
export const SEEDED_WIRE: Wire = ['positive', 'a']

const noAssistance: Assistance = { hints: 0, demonstrations: 0 }

function newBoard(wires: readonly Wire[]): Board {
  return { wires, history: [], pending: null, feedback: null, helpLevel: 0, assistance: noAssistance }
}

export function newRun(): Run {
  return {
    stage: 'story',
    predictionChoice: null,
    prediction: null,
    build: newBoard([SEEDED_WIRE]),
    workingCircuit: null,
    explanationChoice: null,
    explanationAttempts: [],
    explanationRevealed: false,
    challenge: newBoard([]),
    challengeTests: [],
    challengeEdited: false,
  }
}

export function newProgress(): LessonProgress {
  return { completed: false, first: { prediction: null, explanation: null, challengeTest: null }, completedRuns: [], current: newRun() }
}

export const explanationSolved = (run: Run) => run.explanationRevealed || run.explanationAttempts.at(-1) === CORRECT_EXPLANATION

export type ChallengeStatus = 'untested' | 'changed' | 'lit' | 'unlit'

export function challengeStatus(run: Run): ChallengeStatus {
  const last = run.challengeTests.at(-1)
  if (!last) return 'untested'
  if (run.challengeEdited) return 'changed'
  return last.lit ? 'lit' : 'unlit'
}

function withWires(board: Board, wires: readonly Wire[]): Board {
  return { ...board, wires, history: [...board.history, board.wires], pending: null, feedback: null }
}

/** Applies a board action; returns the same object when nothing changed. */
function updateBoard(board: Board, action: LessonAction): Board {
  switch (action.type) {
    case 'select-terminal': {
      const { pending } = board
      if (!pending) return { ...board, pending: action.terminal, feedback: 'select-second' }
      if (pending === action.terminal) return { ...board, pending: null, feedback: null }
      const result = addWire(board.wires, pending, action.terminal)
      if (!result.ok) return { ...board, pending: null, feedback: result.reason === 'same' ? null : result.reason }
      return withWires(board, result.wires)
    }
    case 'undo': {
      const previous = board.history.at(-1)
      if (!previous) return board
      return { ...board, wires: previous, history: board.history.slice(0, -1), pending: null, feedback: null }
    }
    case 'remove-wires':
      return board.wires.length ? withWires(board, []) : board
    case 'request-help':
      if (board.helpLevel === 3 || isLit(board.wires)) return board
      return { ...board, helpLevel: (board.helpLevel + 1) as HelpLevel, assistance: { ...board.assistance, hints: board.assistance.hints + 1 } }
    case 'demonstrate': {
      const next = nextConnection(board.wires)
      if (board.helpLevel < 3 || !next) return board
      const result = addWire(board.wires, ...next)
      if (!result.ok) return board
      return { ...withWires(board, result.wires), assistance: { ...board.assistance, demonstrations: board.assistance.demonstrations + 1 } }
    }
    default:
      return board
  }
}

function updateRun(run: Run, action: LessonAction): Run {
  switch (action.type) {
    case 'begin':
      return run.stage === 'story' ? { ...run, stage: 'prediction' } : run
    case 'choose-prediction':
      return run.stage === 'prediction' ? { ...run, predictionChoice: action.prediction } : run
    case 'submit-prediction':
      return run.stage === 'prediction' && run.predictionChoice ? { ...run, prediction: run.predictionChoice, stage: 'build' } : run
    case 'select-terminal':
    case 'undo':
    case 'remove-wires':
    case 'request-help':
    case 'demonstrate': {
      if (run.stage !== action.board) return run
      const board = updateBoard(run[action.board], action)
      if (board === run[action.board]) return run
      const rewired = board.wires !== run[action.board].wires
      return { ...run, [action.board]: board, challengeEdited: run.challengeEdited || (action.board === 'challenge' && rewired) }
    }
    case 'explain':
      return run.stage === 'build' && isLit(run.build.wires) ? { ...run, stage: 'explain', workingCircuit: run.build.wires } : run
    case 'choose-explanation':
      return run.stage === 'explain' && !explanationSolved(run) ? { ...run, explanationChoice: action.choice } : run
    case 'check-explanation':
      if (run.stage !== 'explain' || explanationSolved(run) || run.explanationChoice === null) return run
      return { ...run, explanationAttempts: [...run.explanationAttempts, run.explanationChoice] }
    case 'reveal-explanation':
      return run.stage === 'explain' && !explanationSolved(run) ? { ...run, explanationRevealed: true } : run
    case 'start-challenge':
      return run.stage === 'explain' && explanationSolved(run) ? { ...run, stage: 'challenge' } : run
    case 'test-circuit': {
      if (run.stage !== 'challenge') return run
      const { wires, assistance } = run.challenge
      const test: ChallengeTest = { wires, lit: isLit(wires), assistance }
      return { ...run, challengeTests: [...run.challengeTests, test], challengeEdited: false, challenge: { ...run.challenge, pending: null, feedback: null } }
    }
    case 'finish':
      return run.stage === 'challenge' && challengeStatus(run) === 'lit' ? { ...run, stage: 'complete' } : run
    case 'replay':
      return run.stage === 'complete' ? newRun() : run
  }
}

function summarize(run: Run): RunSummary {
  return {
    prediction: run.prediction,
    buildAssistance: run.build.assistance,
    explanationAttempts: run.explanationAttempts,
    explanationRevealed: run.explanationRevealed,
    challengeTests: run.challengeTests,
    challengeAssistance: run.challenge.assistance,
  }
}

function firstExplanation(run: Run): ExplanationOutcome | null {
  const choice = run.explanationAttempts[0]
  if (choice !== undefined) return { kind: 'answered', choice, correct: choice === CORRECT_EXPLANATION }
  return run.explanationRevealed ? { kind: 'revealed' } : null
}

/** Advances the current run and records first evidence the first time it appears. */
export function lessonReducer(progress: LessonProgress, action: LessonAction): LessonProgress {
  const run = updateRun(progress.current, action)
  if (run === progress.current) return progress
  const { first } = progress
  const nextFirst = {
    prediction: first.prediction ?? run.prediction,
    explanation: first.explanation ?? firstExplanation(run),
    challengeTest: first.challengeTest ?? run.challengeTests[0] ?? null,
  }
  const finished = action.type === 'finish'
  return {
    completed: progress.completed || finished,
    first: nextFirst,
    completedRuns: finished ? [...progress.completedRuns, summarize(run)] : progress.completedRuns,
    current: run,
  }
}
