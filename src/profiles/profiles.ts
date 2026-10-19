import type { AvatarIndex, Profile } from '../types.ts'

export const NICKNAME_MAX_LENGTH = 24

export const avatarIndexes: readonly AvatarIndex[] = [0, 1, 2, 3, 4, 5]
export const avatarLabels = ['Καραβάκι', 'Φάρος', 'Κοχύλι', 'Φύλλο', 'Ήλιος', 'Ψαράκι'] as const satisfies Record<AvatarIndex, string>

const exampleNames = ['Ελένη', 'Νίκος', 'Μαρία', 'Άρης', 'Δανάη', 'Πέτρος'] as const satisfies Record<AvatarIndex, string>
/** Fictional profiles shown by the design preview; never persisted. */
export const exampleProfiles: readonly Profile[] = avatarIndexes.map(avatar => ({ id: `sample-${avatar}`, name: exampleNames[avatar], avatar }))

function sameNickname(a: string, b: string) {
  return a.toLocaleLowerCase('el') === b.toLocaleLowerCase('el')
}

/** Returns the error message for a trimmed nickname, or null when it can be used. */
export function validateNickname(name: string, profiles: readonly Profile[]): string | null {
  if (!name) return 'Γράψε ένα ψευδώνυμο για το προφίλ σου.'
  if (profiles.some(profile => sameNickname(profile.name, name))) return 'Αυτό το ψευδώνυμο υπάρχει ήδη. Διάλεξε ένα διαφορετικό.'
  return null
}

export function createProfile(name: string, avatar: AvatarIndex): Profile {
  return { id: crypto.randomUUID(), name, avatar }
}
