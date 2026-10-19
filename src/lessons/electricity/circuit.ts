/**
 * Qualitative single-battery, single-bulb circuit model, ported from the original game's verified rules.
 * A bulb lights when opposite battery poles reach separate bulb terminals through wires, with no wire-only short.
 */

export type Terminal = 'positive' | 'negative' | 'a' | 'b'
export type Wire = readonly [Terminal, Terminal]

export const terminals: readonly Terminal[] = ['positive', 'negative', 'a', 'b']

/** The child has two wires; a third is rejected. */
export const WIRE_LIMIT = 2

export type WireRejection = 'same' | 'duplicate' | 'short' | 'full'
export type AddWireResult = { readonly ok: true; readonly wires: readonly Wire[] } | { readonly ok: false; readonly reason: WireRejection }

/** True when wires alone join `start` to `end`; the bulb's own filament is not part of this graph. */
export function connected(wires: readonly Wire[], start: Terminal, end: Terminal): boolean {
  const seen = new Set<Terminal>([start])
  const queue: Terminal[] = [start]
  for (let current = queue.shift(); current; current = queue.shift()) {
    if (current === end) return true
    for (const [a, b] of wires) {
      const next = a === current ? b : b === current ? a : null
      if (next && !seen.has(next)) {
        seen.add(next)
        queue.push(next)
      }
    }
  }
  return false
}

/** A conductive wire-only path between the poles, direct or through a shared terminal. */
export const isShort = (wires: readonly Wire[]) => connected(wires, 'positive', 'negative')

export function isLit(wires: readonly Wire[]): boolean {
  if (isShort(wires)) return false
  return (connected(wires, 'positive', 'a') && connected(wires, 'negative', 'b'))
    || (connected(wires, 'positive', 'b') && connected(wires, 'negative', 'a'))
}

const sameWire = ([a, b]: Wire, from: Terminal, to: Terminal) => (a === from && b === to) || (a === to && b === from)

export function addWire(wires: readonly Wire[], from: Terminal, to: Terminal): AddWireResult {
  if (from === to) return { ok: false, reason: 'same' }
  if (wires.some(wire => sameWire(wire, from, to))) return { ok: false, reason: 'duplicate' }
  const next: readonly Wire[] = [...wires, [from, to]]
  if (isShort(next)) return { ok: false, reason: 'short' }
  if (wires.length >= WIRE_LIMIT) return { ok: false, reason: 'full' }
  return { ok: true, wires: next }
}

/**
 * The connection a hint should point at: one wire that completes the circuit, or the first wire of an empty board.
 * Null when the bulb is lit or a wire must be removed first.
 */
export function nextConnection(wires: readonly Wire[]): Wire | null {
  if (isLit(wires)) return null
  const candidates: readonly Wire[] = [['positive', 'a'], ['negative', 'b'], ['positive', 'b'], ['negative', 'a']]
  for (const [a, b] of candidates) {
    const result = addWire(wires, a, b)
    if (result.ok && isLit(result.wires)) return [a, b]
  }
  return wires.length ? null : ['positive', 'a']
}
