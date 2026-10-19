import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router'
import { useCurrentProfile } from '../../profiles/useProfiles.ts'
import { paths } from '../../routes/paths.ts'
import type { Mission } from '../../types.ts'
import { useElectricityLesson } from '../useLessonProgress.ts'
import { CircuitBoard } from './CircuitBoard.tsx'
import { isLit, nextConnection, type Terminal } from './circuit.ts'
import {
  boardFeedback, challengeStatusText, connectionHint, copy, describeLoop, explanationChoices, explanationFeedback, hints, predictionLabels,
} from './copy.ts'
import {
  challengeStatus, CORRECT_EXPLANATION, explanationSolved, type Board, type BoardId, type ExplanationChoice, type LessonAction, type Prediction, type Run, type Stage,
} from './lesson.ts'
import { MissionShell, Spitha } from './MissionShell.tsx'

type Dispatch = (action: LessonAction) => void

const stageStep: Record<Stage, number> = { story: -1, prediction: 0, build: 1, explain: 2, challenge: 3, complete: 4 }
const predictions: readonly Prediction[] = ['yes', 'no', 'unsure']
const explanationOrder: readonly ExplanationChoice[] = [0, 1, 2]

/** «Άναψε τη λάμπα»: story → prediction → build → explain → fresh challenge → completion. */
export function ElectricityLesson({ mission }: { mission: Mission }) {
  const profile = useCurrentProfile()
  const [progress, dispatch] = useElectricityLesson(profile.id)
  const run = progress.current
  const stageHeading = useStageFocus(run.stage)
  const view = stageView(run, dispatch)
  return <MissionShell
    mission={mission}
    profile={profile}
    step={stageStep[run.stage]}
    instruction={view.instruction}
    note={run.prediction && run.stage !== 'complete' ? `${copy.predictionSaved}: ${predictionLabels[run.prediction]}` : null}
    board={view.board}
    tip={view.tip}
  >
    {view.heading && <h2 className="panel-heading" ref={stageHeading} tabIndex={-1}>{view.heading}</h2>}
    {view.panel}
  </MissionShell>
}

/** Moves focus to the new stage's heading after a stage change, but not on first render. */
function useStageFocus(stage: Stage) {
  const heading = useRef<HTMLHeadingElement>(null)
  const previous = useRef(stage)
  useEffect(() => {
    if (previous.current !== stage) heading.current?.focus()
    previous.current = stage
  }, [stage])
  return heading
}

interface StageView {
  readonly instruction?: string
  readonly heading?: string
  readonly board?: ReactNode
  readonly tip?: ReactNode
  readonly panel: ReactNode
}

function stageView(run: Run, dispatch: Dispatch): StageView {
  switch (run.stage) {
    case 'story':
      return {
        heading: copy.panels.story,
        board: <CircuitBoard wires={[]} lit={false} />,
        panel: <>
          <div className="panel-guide"><Spitha /><p className="panel-speech">{copy.story.speech}</p></div>
          <button type="button" className="button primary panel-action" onClick={() => dispatch({ type: 'begin' })}>{copy.story.action}</button>
        </>,
      }
    case 'prediction':
      return {
        instruction: copy.prediction.support,
        heading: copy.prediction.prompt,
        board: <CircuitBoard wires={run.build.wires} lit={false} mystery />,
        panel: <>
          <ChoiceGroup legend={copy.panels.prediction} name="prediction" layout="row" options={predictions.map(value => ({ value, label: predictionLabels[value] }))} value={run.predictionChoice} onChange={prediction => dispatch({ type: 'choose-prediction', prediction })} />
          {run.predictionChoice && <button type="button" className="button primary panel-action" onClick={() => dispatch({ type: 'submit-prediction' })}>{copy.prediction.action}</button>}
        </>,
      }
    case 'build': {
      const { build } = run
      const lit = isLit(build.wires)
      const untouched = build.history.length === 0 && build.pending === null
      return {
        instruction: copy.controls.instruction,
        heading: copy.build.task,
        board: <WiringBoard board={build} lit={lit} status={lit ? copy.bulb.on : copy.bulb.off} onSelect={terminal => dispatch({ type: 'select-terminal', board: 'build', terminal })} />,
        tip: build.feedback ? boardFeedback[build.feedback] : lit ? copy.build.success : untouched ? copy.build.observation : null,
        panel: <>
          <BoardTools id="build" board={build} lit={lit} dispatch={dispatch} />
          {lit && <button type="button" className="button primary panel-action" onClick={() => dispatch({ type: 'explain' })}>{copy.build.action}</button>}
        </>,
      }
    }
    case 'explain': {
      const solved = explanationSolved(run)
      const last = run.explanationAttempts.at(-1)
      const wires = run.workingCircuit ?? []
      const loop = solved ? <p className="loop-text">{describeLoop(wires)}</p> : null
      const tip = run.explanationRevealed && last !== CORRECT_EXPLANATION
        ? <>{explanationChoices[CORRECT_EXPLANATION]} {loop}</>
        : last !== undefined ? <>{explanationFeedback[last]} {loop}</> : null
      return {
        heading: copy.explain.question,
        board: <CircuitBoard wires={wires} lit status={copy.bulb.on} traceLoop={solved} />,
        tip,
        panel: <>
          <ChoiceGroup legend={copy.panels.explain} name="explanation" layout="column" disabled={solved} options={explanationOrder.map(value => ({ value, label: explanationChoices[value] }))} value={run.explanationChoice} onChange={choice => dispatch({ type: 'choose-explanation', choice })} />
          {solved
            ? <button type="button" className="button primary panel-action" onClick={() => dispatch({ type: 'start-challenge' })}>{copy.explain.next}</button>
            : <>
              <button type="button" className="button primary panel-action" disabled={run.explanationChoice === null} onClick={() => dispatch({ type: 'check-explanation' })}>{copy.explain.action}</button>
              <button type="button" className="text-button" onClick={() => dispatch({ type: 'reveal-explanation' })}>{copy.controls.help}</button>
            </>}
        </>,
      }
    }
    case 'challenge': {
      const { challenge } = run
      const status = challengeStatus(run)
      const tip = challenge.feedback ? boardFeedback[challenge.feedback]
        : status === 'lit' ? copy.challenge.lit
        : status === 'unlit' ? copy.challenge.unlit
        : status === 'untested' && !challenge.wires.length ? copy.challenge.speech
        : null
      return {
        instruction: copy.controls.instruction,
        heading: copy.challenge.instruction,
        board: <WiringBoard board={challenge} layout="reverse" lit={status === 'lit'} status={challengeStatusText[status]} onSelect={terminal => dispatch({ type: 'select-terminal', board: 'challenge', terminal })} />,
        tip,
        panel: <>
          <BoardTools id="challenge" board={challenge} lit={status === 'lit'} dispatch={dispatch} />
          {status === 'lit'
            ? <button type="button" className="button primary panel-action" onClick={() => dispatch({ type: 'finish' })}>{copy.challenge.next}</button>
            : <button type="button" className="button primary panel-action" onClick={() => dispatch({ type: 'test-circuit' })}>{copy.challenge.action}</button>}
        </>,
      }
    }
    case 'complete':
      return {
        heading: copy.complete.title,
        panel: <>
          <div className="panel-guide"><Spitha /><p className="panel-speech">{copy.complete.summary}</p></div>
          <Link className="button primary panel-action" to={paths.island}>{copy.complete.back}</Link>
          <button type="button" className="button secondary panel-action" onClick={() => dispatch({ type: 'replay' })}>{copy.complete.replay}</button>
        </>,
      }
  }
}

function WiringBoard({ board, lit, status, layout = 'normal', onSelect }: { board: Board; lit: boolean; status: string; layout?: 'normal' | 'reverse'; onSelect: (terminal: Terminal) => void }) {
  const next = board.helpLevel >= 2 && !lit ? nextConnection(board.wires) : null
  return <CircuitBoard wires={board.wires} lit={lit} status={status} layout={layout} pending={board.pending} hinted={next ?? []} onSelect={onSelect} />
}

/** Undo, help and remove-all for a wiring board, plus the current hint. */
function BoardTools({ id, board, lit, dispatch }: { id: BoardId; board: Board; lit: boolean; dispatch: Dispatch }) {
  const next = nextConnection(board.wires)
  const hint = board.helpLevel === 0 || lit ? null
    : !next ? hints.change
    : board.helpLevel === 1 ? hints.cue
    : connectionHint(next)
  return <div className="board-tools">
    <div className="tool-row">
      <button type="button" className="button secondary" disabled={!board.history.length} onClick={() => dispatch({ type: 'undo', board: id })}>{copy.controls.undo}</button>
      <button type="button" className="button secondary" disabled={lit || board.helpLevel === 3} onClick={() => dispatch({ type: 'request-help', board: id })}>{copy.controls.help}</button>
    </div>
    {hint && <div className="hint" role="status">
      <p>{hint}</p>
      {board.helpLevel === 3 && next && <button type="button" className="button secondary" onClick={() => dispatch({ type: 'demonstrate', board: id })}>{copy.controls.demonstrate}</button>}
    </div>}
    <button type="button" className="text-button" disabled={!board.wires.length} onClick={() => dispatch({ type: 'remove-wires', board: id })}>{copy.controls.removeAll}</button>
  </div>
}

interface ChoiceGroupProps<T extends string | number> {
  readonly legend: string
  readonly name: string
  readonly layout: 'row' | 'column'
  readonly options: readonly { readonly value: T; readonly label: string }[]
  readonly value: T | null
  readonly disabled?: boolean
  readonly onChange: (value: T) => void
}

function ChoiceGroup<T extends string | number>({ legend, name, layout, options, value, disabled = false, onChange }: ChoiceGroupProps<T>) {
  return <fieldset className={`choice-group is-${layout}`} disabled={disabled}>
    <legend className="sr-only">{legend}</legend>
    {options.map(option => <label key={option.value} className={`choice${option.value === value ? ' is-selected' : ''}`}>
      <input type="radio" name={name} checked={option.value === value} onChange={() => onChange(option.value)} />
      <span>{option.label}</span>
    </label>)}
  </fieldset>
}
