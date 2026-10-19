import { describe, expect, it } from 'vitest'
import { addWire, isLit, isShort, nextConnection, type Wire } from './circuit.ts'

const loop: readonly Wire[] = [['positive', 'a'], ['negative', 'b']]

describe('circuit model', () => {
  it('lights the bulb only when opposite poles reach separate terminals', () => {
    expect(isLit([])).toBe(false)
    expect(isLit([['positive', 'a']])).toBe(false)
    expect(isLit(loop)).toBe(true)
    expect(isLit([['positive', 'b'], ['negative', 'a']])).toBe(true)
    expect(isLit([['positive', 'a'], ['positive', 'b']])).toBe(false)
    expect(isLit([['positive', 'a'], ['negative', 'a']])).toBe(false)
  })

  it('turns the bulb off when either wire of the loop is removed', () => {
    for (const wire of loop) expect(isLit(loop.filter(other => other !== wire))).toBe(false)
  })

  it('detects direct and indirect battery shorts', () => {
    expect(isShort([['positive', 'negative']])).toBe(true)
    expect(isShort([['positive', 'a'], ['a', 'b'], ['b', 'negative']])).toBe(true)
    expect(isShort(loop)).toBe(false)
    expect(addWire([], 'positive', 'negative')).toEqual({ ok: false, reason: 'short' })
    expect(addWire([['positive', 'a']], 'a', 'negative')).toEqual({ ok: false, reason: 'short' })
  })

  it('rejects self, repeated and third wires', () => {
    expect(addWire([], 'a', 'a')).toEqual({ ok: false, reason: 'same' })
    expect(addWire([['positive', 'a']], 'a', 'positive')).toEqual({ ok: false, reason: 'duplicate' })
    expect(addWire([['positive', 'a'], ['positive', 'b']], 'a', 'b')).toEqual({ ok: false, reason: 'full' })
  })

  it('adds a valid wire without changing the original board', () => {
    const wires: readonly Wire[] = [['positive', 'a']]
    expect(addWire(wires, 'negative', 'b')).toEqual({ ok: true, wires: loop })
    expect(wires).toHaveLength(1)
  })

  it('suggests a connection that matches the current wiring, including reversed polarity', () => {
    expect(nextConnection([])).toEqual(['positive', 'a'])
    expect(nextConnection([['positive', 'b']])).toEqual(['negative', 'a'])
    expect(nextConnection([['negative', 'a']])).toEqual(['positive', 'b'])
    expect(nextConnection([['a', 'b']])).toBeNull()
    expect(nextConnection([['positive', 'a'], ['positive', 'b']])).toBeNull()
    expect(nextConnection(loop)).toBeNull()
  })
})
