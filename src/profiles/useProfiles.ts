import { useState } from 'react'
import type { AvatarIndex, Profile, ProfileDraft, Screen } from '../types.ts'
import { createProfile, exampleProfiles, validateNickname } from './profiles.ts'

const emptyDraft: ProfileDraft = { nickname: '', avatar: 0, error: '' }

/** Owns the preview's profiles, which screen the panel shows, and the creation-form draft. */
export function useProfiles() {
  const [profiles, setProfiles] = useState<readonly Profile[]>(exampleProfiles)
  const [screen, setScreen] = useState<Screen>({ view: 'choose' })
  const [draft, setDraft] = useState<ProfileDraft>(emptyDraft)

  function showProfiles() { setScreen({ view: 'choose' }) }
  function openForm() { setDraft(previous => ({ ...previous, error: '' })); setScreen({ view: 'create' }) }
  function selectProfile(profile: Profile) { setScreen({ view: 'selected', profile }) }
  function setNickname(nickname: string) { setDraft(previous => ({ ...previous, nickname, error: '' })) }
  function setAvatar(avatar: AvatarIndex) { setDraft(previous => ({ ...previous, avatar })) }

  /** Creates and selects a profile from the draft. Returns false and records the error when the nickname is invalid. */
  function submitDraft(): boolean {
    const name = draft.nickname.trim()
    const error = validateNickname(name, profiles)
    if (error) { setDraft(previous => ({ ...previous, error })); return false }
    const profile = createProfile(name, draft.avatar)
    setProfiles(previous => [...previous, profile])
    setDraft(previous => ({ ...previous, nickname: '' }))
    selectProfile(profile)
    return true
  }

  function resetPreview(empty: boolean) {
    setProfiles(empty ? [] : exampleProfiles)
    setDraft(emptyDraft)
    showProfiles()
  }

  return { profiles, screen, draft, showProfiles, openForm, selectProfile, setNickname, setAvatar, submitDraft, resetPreview }
}
