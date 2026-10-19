import type { ReactNode } from 'react'
import { ProfilesContext, useProfileState } from './useProfiles.ts'

export function ProfilesProvider({ children }: { children: ReactNode }) {
  return <ProfilesContext value={useProfileState()}>{children}</ProfilesContext>
}
