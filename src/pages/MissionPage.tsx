import { Navigate, useParams } from 'react-router'
import { Avatar } from '../components/Avatar.tsx'
import { BackLink } from '../components/BackLink.tsx'
import { useFocusOnNavigation } from '../hooks/useFocusOnNavigation.ts'
import { ElectricityLesson } from '../lessons/electricity/ElectricityLesson.tsx'
import { findMission } from '../missions/missions.ts'
import { useCurrentProfile } from '../profiles/useProfiles.ts'
import { paths } from '../routes/paths.ts'
import type { Mission } from '../types.ts'

/** Plays the electricity lesson; the other topics are not playable yet. */
export function MissionPage() {
  const mission = findMission(useParams().missionId)
  if (!mission) return <Navigate to={paths.island} replace />
  return mission.id === 'electricity' ? <ElectricityLesson mission={mission} /> : <UnfinishedMission mission={mission} />
}

function UnfinishedMission({ mission }: { mission: Mission }) {
  const profile = useCurrentProfile()
  const heading = useFocusOnNavigation<HTMLHeadingElement>()
  return <main id="main" className="mission-placeholder">
    <p className="mission-profile"><Avatar index={profile.avatar} /><span>{profile.name}</span></p>
    <p className="mission-topic">{mission.topic}</p>
    <h1 ref={heading} tabIndex={-1}>{mission.title}</h1>
    <p>Αυτή η αποστολή δεν είναι ακόμη έτοιμη.</p>
    <BackLink className="button primary" to={paths.island}>Πίσω στο νησί</BackLink>
  </main>
}
