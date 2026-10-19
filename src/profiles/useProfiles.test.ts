import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { DraftResult } from '../types.ts'
import { exampleProfiles } from './profiles.ts'
import { useProfileState } from './useProfiles.ts'

function setup() {
  return renderHook(() => useProfileState()).result
}

describe('useProfileState', () => {
  it('starts with the example profiles, no current profile and an empty draft', () => {
    const result = setup()
    expect(result.current.profiles).toBe(exampleProfiles)
    expect(result.current.currentProfile).toBeNull()
    expect(result.current.draft).toEqual({ nickname: '', avatar: 0 })
  })

  it('selects a profile', () => {
    const result = setup()
    const profile = exampleProfiles[2]!
    act(() => result.current.selectProfile(profile))
    expect(result.current.currentProfile).toBe(profile)
  })

  it('rejects an empty draft without changing profiles', () => {
    const result = setup()
    act(() => result.current.setNickname('   '))
    let outcome: DraftResult | undefined
    act(() => { outcome = result.current.submitDraft() })
    expect(outcome).toEqual({ ok: false, error: 'Γράψε ένα ψευδώνυμο για το προφίλ σου.' })
    expect(result.current.profiles).toHaveLength(exampleProfiles.length)
    expect(result.current.currentProfile).toBeNull()
    expect(result.current.draft.nickname).toBe('   ')
  })

  it('rejects a duplicate nickname', () => {
    const result = setup()
    act(() => result.current.setNickname('νίκος'))
    let outcome: DraftResult | undefined
    act(() => { outcome = result.current.submitDraft() })
    expect(outcome).toEqual({ ok: false, error: 'Αυτό το ψευδώνυμο υπάρχει ήδη. Διάλεξε ένα διαφορετικό.' })
  })

  it('creates, appends and selects a trimmed profile, then clears the nickname', () => {
    const result = setup()
    act(() => result.current.setAvatar(4))
    act(() => result.current.setNickname('  Αστερίας '))
    let outcome: DraftResult | undefined
    act(() => { outcome = result.current.submitDraft() })

    const created = result.current.profiles.at(-1)
    expect(created).toMatchObject({ name: 'Αστερίας', avatar: 4 })
    expect(outcome).toEqual({ ok: true, profile: created })
    expect(result.current.profiles).toHaveLength(exampleProfiles.length + 1)
    expect(result.current.currentProfile).toBe(created)
    expect(result.current.draft).toEqual({ nickname: '', avatar: 4 })
  })

  it('resets the preview to an empty or example state', () => {
    const result = setup()
    act(() => result.current.selectProfile(exampleProfiles[0]!))
    act(() => result.current.setAvatar(5))
    act(() => result.current.setNickname('Αστερίας'))
    act(() => result.current.resetPreview(true))
    expect(result.current.profiles).toEqual([])
    expect(result.current.currentProfile).toBeNull()
    expect(result.current.draft).toEqual({ nickname: '', avatar: 0 })

    act(() => result.current.resetPreview(false))
    expect(result.current.profiles).toBe(exampleProfiles)
  })
})
