/** Position of an avatar in the 3×2 island-avatars sprite sheet. */
export type AvatarIndex = 0 | 1 | 2 | 3 | 4 | 5

export interface Profile {
  readonly id: string
  readonly name: string
  readonly avatar: AvatarIndex
}

/** Which welcome copy accompanies the profile panel. */
export type WelcomeView = 'choose' | 'create' | 'selected'

export type IconKind = 'plus' | 'back' | 'arrow'

/** The in-progress values of the profile creation form, kept while the learner leaves and returns to it. */
export interface ProfileDraft {
  readonly nickname: string
  readonly avatar: AvatarIndex
}

export type DraftResult =
  | { readonly ok: true; readonly profile: Profile }
  | { readonly ok: false; readonly error: string }

export type MissionId = 'electricity' | 'light' | 'heat' | 'sound' | 'forces'

export interface Mission {
  readonly id: MissionId
  readonly topic: string
  readonly title: string
}
