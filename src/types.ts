/** Position of an avatar in the 3×2 island-avatars sprite sheet. */
export type AvatarIndex = 0 | 1 | 2 | 3 | 4 | 5

export interface Profile {
  readonly id: string
  readonly name: string
  readonly avatar: AvatarIndex
}

/** Which welcome copy accompanies the profile panel. */
export type WelcomeView = 'choose' | 'create'

export type IconKind = 'plus' | 'back' | 'arrow'

/** The in-progress values of the profile creation form, kept while the learner leaves and returns to it. */
export interface ProfileDraft {
  readonly nickname: string
  readonly avatar: AvatarIndex
}

export type DraftResult =
  | { readonly ok: true; readonly profile: Profile }
  | { readonly ok: false; readonly error: string }

export type TopicId = 'electricity' | 'light' | 'heat' | 'sound' | 'forces'
export type MissionId = 'light-the-bulb' | 'materials' | 'switches'

/** One station on a topic's path. */
export interface Mission {
  readonly id: MissionId
  readonly topicId: TopicId
  readonly title: string
  /** One-line description for the station's detail card. */
  readonly goal: string
  /** Missions of the same topic that must be completed first. */
  readonly requires: readonly MissionId[]
  /** False until the lesson is implemented; the station stays visible but cannot be started. */
  readonly playable: boolean
}

/** A topic islet on the map. */
export interface Topic {
  readonly id: TopicId
  readonly name: string
  /** «Πίσω στον Ηλεκτρισμό»: back actions name the topic in its own Greek form. */
  readonly backLabel: string
  /** In order along the topic's path; empty while the topic has no missions yet. */
  readonly missions: readonly Mission[]
}

export type MissionStatus = 'locked' | 'available' | 'in-progress' | 'completed'
