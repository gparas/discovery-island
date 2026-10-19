import { createContext, useContext, useState } from 'react'
import type { AvatarIndex, DraftResult, Profile, ProfileDraft } from '../types.ts'
import { createProfile, exampleProfiles, validateNickname } from './profiles.ts'

const emptyDraft: ProfileDraft = { nickname: '', avatar: 0 }

/** Owns the preview's profiles, the profile currently exploring, and the creation-form draft. */
export function useProfileState() {
  const [profiles, setProfiles] = useState<readonly Profile[]>(exampleProfiles)
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null)
  const [draft, setDraft] = useState<ProfileDraft>(emptyDraft)

  function selectProfile(profile: Profile) { setCurrentProfile(profile) }
  function setNickname(nickname: string) { setDraft(previous => ({ ...previous, nickname })) }
  function setAvatar(avatar: AvatarIndex) { setDraft(previous => ({ ...previous, avatar })) }

  /** Creates and selects a profile from the draft, or reports why the nickname cannot be used. */
  function submitDraft(): DraftResult {
    const name = draft.nickname.trim()
    const error = validateNickname(name, profiles)
    if (error) return { ok: false, error }
    const profile = createProfile(name, draft.avatar)
    setProfiles(previous => [...previous, profile])
    setDraft(previous => ({ ...previous, nickname: '' }))
    selectProfile(profile)
    return { ok: true, profile }
  }

  function resetPreview(empty: boolean) {
    setProfiles(empty ? [] : exampleProfiles)
    setCurrentProfile(null)
    setDraft(emptyDraft)
  }

  return { profiles, currentProfile, draft, selectProfile, setNickname, setAvatar, submitDraft, resetPreview }
}

export type ProfileState = ReturnType<typeof useProfileState>

export const ProfilesContext = createContext<ProfileState | null>(null)

export function useProfiles(): ProfileState {
  const state = useContext(ProfilesContext)
  if (!state) throw new Error('useProfiles must be used inside ProfilesProvider')
  return state
}

/** The exploring profile; only valid below the RequireProfile route guard. */
export function useCurrentProfile(): Profile {
  const { currentProfile } = useProfiles()
  if (!currentProfile) throw new Error('useCurrentProfile must be used below RequireProfile')
  return currentProfile
}
