import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { exampleProfiles } from './profiles.ts'
import { useProfiles } from './useProfiles.ts'

function setup() {
  return renderHook(() => useProfiles()).result
}

describe('useProfiles', () => {
  it('starts on the chooser with the example profiles and an empty draft', () => {
    const result = setup()
    expect(result.current.screen).toEqual({ view: 'choose' })
    expect(result.current.profiles).toBe(exampleProfiles)
    expect(result.current.draft).toEqual({ nickname: '', avatar: 0, error: '' })
  })

  it('selects a profile and returns to the chooser', () => {
    const result = setup()
    const profile = exampleProfiles[2]!
    act(() => result.current.selectProfile(profile))
    expect(result.current.screen).toEqual({ view: 'selected', profile })
    act(() => result.current.showProfiles())
    expect(result.current.screen).toEqual({ view: 'choose' })
  })

  it('rejects an empty draft without leaving the form', () => {
    const result = setup()
    act(() => result.current.openForm())
    act(() => result.current.setNickname('   '))
    let accepted = true
    act(() => { accepted = result.current.submitDraft() })
    expect(accepted).toBe(false)
    expect(result.current.draft.error).toBe('Γράψε ένα ψευδώνυμο για το προφίλ σου.')
    expect(result.current.screen.view).toBe('create')
    expect(result.current.profiles).toHaveLength(exampleProfiles.length)
  })

  it('rejects a duplicate nickname', () => {
    const result = setup()
    act(() => result.current.openForm())
    act(() => result.current.setNickname('νίκος'))
    act(() => { result.current.submitDraft() })
    expect(result.current.draft.error).toBe('Αυτό το ψευδώνυμο υπάρχει ήδη. Διάλεξε ένα διαφορετικό.')
    expect(result.current.screen.view).toBe('create')
  })

  it('clears the error when the nickname changes or the form reopens, keeping the nickname', () => {
    const result = setup()
    act(() => result.current.openForm())
    act(() => { result.current.submitDraft() })
    act(() => result.current.setNickname('Α'))
    expect(result.current.draft).toMatchObject({ nickname: 'Α', error: '' })

    act(() => result.current.setNickname('Νίκος'))
    act(() => { result.current.submitDraft() })
    act(() => result.current.showProfiles())
    act(() => result.current.openForm())
    expect(result.current.draft).toMatchObject({ nickname: 'Νίκος', error: '' })
  })

  it('creates, appends and selects a trimmed profile, then clears the nickname', () => {
    const result = setup()
    act(() => result.current.openForm())
    act(() => result.current.setAvatar(4))
    act(() => result.current.setNickname('  Αστερίας '))
    let accepted = false
    act(() => { accepted = result.current.submitDraft() })

    expect(accepted).toBe(true)
    const created = result.current.profiles.at(-1)
    expect(created).toMatchObject({ name: 'Αστερίας', avatar: 4 })
    expect(result.current.profiles).toHaveLength(exampleProfiles.length + 1)
    expect(result.current.screen).toEqual({ view: 'selected', profile: created })
    expect(result.current.draft).toEqual({ nickname: '', avatar: 4, error: '' })
  })

  it('resets the preview to an empty or example state', () => {
    const result = setup()
    act(() => result.current.openForm())
    act(() => result.current.setAvatar(5))
    act(() => result.current.setNickname('Αστερίας'))
    act(() => result.current.resetPreview(true))
    expect(result.current.profiles).toEqual([])
    expect(result.current.screen).toEqual({ view: 'choose' })
    expect(result.current.draft).toEqual({ nickname: '', avatar: 0, error: '' })

    act(() => result.current.resetPreview(false))
    expect(result.current.profiles).toBe(exampleProfiles)
  })
})
