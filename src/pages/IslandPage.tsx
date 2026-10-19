import { SelectedProfile } from '../components/SelectedProfile.tsx'
import { useFocusOnNavigation } from '../hooks/useFocusOnNavigation.ts'
import { WelcomeFrame } from '../layouts/WelcomeFrame.tsx'
import { useCurrentProfile } from '../profiles/useProfiles.ts'

/** Stand-in for the island map: the approved selection acknowledgement, until the map is designed. */
export function IslandPage() {
  const profile = useCurrentProfile()
  const heading = useFocusOnNavigation<HTMLHeadingElement>()
  return <WelcomeFrame view="selected"><SelectedProfile profile={profile} headingRef={heading} /></WelcomeFrame>
}
