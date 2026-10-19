import { useId } from 'react'
import type { Terminal, Wire } from './circuit.ts'
import { terminals } from './circuit.ts'
import { describeWires, terminalNames } from './copy.ts'

export type BoardLayout = 'normal' | 'reverse'

interface Props {
  readonly wires: readonly Wire[]
  readonly lit: boolean
  /** Visible bulb-state text beside the board; never colour or glow alone. */
  readonly status?: string
  readonly layout?: BoardLayout
  /** Prediction mode: the bulb shows a question mark and no outcome. */
  readonly mystery?: boolean
  /** Traces the complete loop after a correct explanation. */
  readonly traceLoop?: boolean
  readonly pending?: Terminal | null
  readonly hinted?: readonly Terminal[]
  /** Makes the terminals buttons; omit for a static illustration. */
  readonly onSelect?: (terminal: Terminal) => void
}

const WIDTH = 720, HEIGHT = 410, BATTERY_Y = 116

function positions(layout: BoardLayout) {
  const reverse = layout === 'reverse'
  const batteryX = reverse ? 486 : 92, bulbX = reverse ? 157 : 565
  // Battery contacts sit on the side facing the bulb.
  const contactX = reverse ? batteryX : batteryX + 126
  const points: Record<Terminal, { x: number; y: number }> = {
    positive: { x: contactX, y: BATTERY_Y + 51 },
    negative: { x: contactX, y: BATTERY_Y + 164 },
    a: { x: bulbX - 57, y: 293 },
    b: { x: bulbX + 57, y: 293 },
  }
  return { batteryX, bulbX, points }
}

function wirePath(from: { x: number; y: number }, to: { x: number; y: number }, index: number, layout: BoardLayout) {
  // With the bulb on the left, its far terminal is reached by curving under the glass rather than across it.
  const bend = (from.y + to.y) / 2 + (layout === 'reverse' ? (index ? 96 : 56) : index ? 52 : -38)
  const pull = (to.x - from.x) * 0.3
  return `M${from.x} ${from.y} C${from.x + pull} ${bend},${to.x - pull} ${bend},${to.x} ${to.y}`
}

/** The battery-and-bulb board, ported from the original game's artwork, with tap and keyboard terminals. */
export function CircuitBoard({ wires, lit, status, layout = 'normal', mystery = false, traceLoop = false, pending = null, hinted = [], onSelect }: Props) {
  const { batteryX: bx, bulbX: lx, points } = positions(layout)
  const id = useId()
  const descriptionId = `${id}-description`
  const glow = `${id}-glow`
  return <figure className={`circuit-board${lit ? ' is-lit' : ''}`} aria-describedby={descriptionId}>
    <div className="circuit-stage">
      <svg className="circuit-art" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-hidden="true">
        <defs><radialGradient id={glow}><stop stopColor="var(--color-yellow)" stopOpacity=".6" /><stop offset="1" stopColor="var(--color-yellow)" stopOpacity="0" /></radialGradient></defs>
        <ellipse cx={bx + 63} cy={346} rx={85} ry={10} fill="var(--color-navy)" opacity=".06" />
        <ellipse cx={lx} cy={336} rx={94} ry={10} fill="var(--color-navy)" opacity=".06" />
        <rect x={bx} y={BATTERY_Y} width={126} height={216} rx={17} fill="var(--color-teal-darker)" />
        <path d={`M${bx + 17} ${BATTERY_Y}h92q17 0 17 17v77H${bx}v-77q0-17 17-17`} fill="var(--color-yellow)" />
        <text x={bx + 63} y={BATTERY_Y + 66} className="circuit-sign" fill="var(--color-navy)">+</text>
        <text x={bx + 63} y={BATTERY_Y + 128} className="circuit-label" fill="var(--color-paper)">ΜΠΑΤΑΡΙΑ</text>
        <text x={bx + 63} y={BATTERY_Y + 180} className="circuit-sign" fill="var(--color-paper)">−</text>
        {lit && <circle cx={lx} cy={169} r={124} fill={`url(#${glow})`} />}
        <rect x={lx - 79} y={266} width={158} height={62} rx={22} fill="var(--color-teal)" />
        <rect x={lx - 22} y={230} width={44} height={48} rx={7} fill="var(--color-steel)" />
        <path d={`M${lx - 22} 241h44m-44 11h44m-44 11h44`} stroke="var(--color-muted)" strokeWidth="3" />
        <path d={`M${lx - 24} 230c0-25-39-36-39-78a63 63 0 0 1 126 0c0 42-39 53-39 78Z`} fill={lit ? 'var(--color-yellow)' : 'var(--color-glass)'} stroke={lit ? 'var(--color-bulb-rim)' : 'var(--color-muted)'} strokeWidth="3" />
        <path d={`M${lx - 36} 133q7-18 28-22`} fill="none" stroke="var(--color-paper)" strokeWidth="8" strokeLinecap="round" opacity=".9" />
        <path d={`M${lx - 12} 230l-8-58q5-8 10 0 5-8 10 0 5-8 10 0 5-8 10 0l-8 58`} fill="none" stroke={lit ? 'var(--color-bulb-rim)' : 'var(--color-navy)'} strokeWidth="3" strokeLinejoin="round" />
        {mystery && <><circle cx={lx} cy={155} r={25} fill="var(--color-cream)" /><text x={lx} y={166} className="circuit-sign mystery">?</text></>}
        <text x={points.a.x} y={318} className="circuit-label" fill="var(--color-paper)">Α</text>
        <text x={points.b.x} y={318} className="circuit-label" fill="var(--color-paper)">Β</text>
        {wires.map(([from, to], index) => {
          const d = wirePath(points[from], points[to], index, layout)
          return <g key={`${from}-${to}`}>
            {traceLoop && <path d={d} className="wire-trace" />}
            <path d={d} className="wire-shadow" />
            <path d={d} className={`wire ${index ? 'wire-second' : 'wire-first'}`} />
          </g>
        })}
      </svg>
      {terminals.map(terminal => {
        const { x, y } = points[terminal]
        const style = { left: `${(x / WIDTH) * 100}%`, top: `${(y / HEIGHT) * 100}%` }
        const className = `terminal${pending === terminal ? ' is-pending' : ''}${hinted.includes(terminal) ? ' is-hinted' : ''}`
        return onSelect
          ? <button key={terminal} type="button" className={className} style={style} aria-label={terminalNames[terminal]} aria-pressed={pending === terminal} onClick={() => onSelect(terminal)}><span /></button>
          : <span key={terminal} className={`${className} is-static`} style={style}><span /></span>
      })}
    </div>
    <figcaption className="circuit-caption">
      <span id={descriptionId}>{describeWires(wires)}</span>
      {status && <strong role="status">{status}</strong>}
    </figcaption>
  </figure>
}
