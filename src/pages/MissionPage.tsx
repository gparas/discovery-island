import { Navigate, useParams } from 'react-router'
import { Avatar } from '../components/Avatar.tsx'
import { BackLink } from '../components/BackLink.tsx'
import { useFocusOnNavigation } from '../hooks/useFocusOnNavigation.ts'
import { findMission } from '../missions/missions.ts'
import { useCurrentProfile } from '../profiles/useProfiles.ts'
import { paths } from '../routes/paths.ts'

/** Placeholder mission shell; no mission is playable yet. */
export function MissionPage() {
  const mission = findMission(useParams().missionId)
  const profile = useCurrentProfile()
  const heading = useFocusOnNavigation<HTMLHeadingElement>()
  if (!mission) return <Navigate to={paths.island} replace />
  return <main id="main" className="mission-placeholder">
    <p className="mission-profile"><Avatar index={profile.avatar} /><span>{profile.name}</span></p>
    <p className="mission-topic">{mission.topic}</p>
    <h1 ref={heading} tabIndex={-1}>{mission.title}</h1>
    <p>Αυτή η αποστολή δεν είναι ακόμη έτοιμη.</p>
    <BackLink className="button primary" to={paths.island}>Πίσω στο νησί</BackLink>
  </main>
}
