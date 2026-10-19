import { describe, expect, it } from 'vitest'
import type { Profile } from '../types.ts'
import { avatarIndexes, avatarLabels, createProfile, exampleProfiles, validateNickname } from './profiles.ts'

const existing: readonly Profile[] = [{ id: 'a', name: 'Ελένη', avatar: 0 }]

describe('validateNickname', () => {
  it('rejects an empty nickname', () => {
    expect(validateNickname('', existing)).toBe('Γράψε ένα ψευδώνυμο για το προφίλ σου.')
  })

  it('rejects a nickname that already exists, ignoring Greek letter case', () => {
    expect(validateNickname('ΕΛΈΝΗ', existing)).toBe('Αυτό το ψευδώνυμο υπάρχει ήδη. Διάλεξε ένα διαφορετικό.')
    expect(validateNickname('ελένη', existing)).not.toBeNull()
  })

  it('treats nicknames that differ only by accent as distinct', () => {
    expect(validateNickname('Ελενη', existing)).toBeNull()
  })

  it('accepts a new nickname', () => {
    expect(validateNickname('Αστερίας', existing)).toBeNull()
    expect(validateNickname('Αστερίας', [])).toBeNull()
  })
})

describe('createProfile', () => {
  it('creates profiles with the given name and avatar and a unique id', () => {
    const first = createProfile('Αστερίας', 3)
    const second = createProfile('Αστερίας', 3)
    expect(first).toMatchObject({ name: 'Αστερίας', avatar: 3 })
    expect(first.id).not.toBe(second.id)
  })
})

describe('preview data', () => {
  it('has a label for every avatar', () => {
    expect(avatarLabels).toHaveLength(avatarIndexes.length)
  })

  it('gives each example profile its own avatar, id and nickname', () => {
    expect(exampleProfiles.map(profile => profile.avatar)).toEqual(avatarIndexes)
    expect(new Set(exampleProfiles.map(profile => profile.id)).size).toBe(exampleProfiles.length)
    for (const profile of exampleProfiles) expect(validateNickname(profile.name, exampleProfiles.filter(other => other !== profile))).toBeNull()
  })
})
