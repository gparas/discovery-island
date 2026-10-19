/** Position of an avatar in the 3×2 island-avatars sprite sheet. */
export type AvatarIndex = 0 | 1 | 2 | 3 | 4 | 5

export interface Profile {
  readonly id: string
  readonly name: string
  readonly avatar: AvatarIndex
}

/** The profile panel shows exactly one of these screens; only `selected` carries a profile. */
export type Screen =
  | { readonly view: 'choose' }
  | { readonly view: 'create' }
  | { readonly view: 'selected'; readonly profile: Profile }

export type ScreenView = Screen['view']

export type IconKind = 'plus' | 'back' | 'arrow'
