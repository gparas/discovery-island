import { Navigate, useParams } from 'react-router'
import { Avatar } from '../components/Avatar.tsx'
import { BackLink } from '../components/BackLink.tsx'
import { useFocusOnNavigation } from '../hooks/useFocusOnNavigation.ts'
import { ElectricityLesson } from '../lessons/electricity/ElectricityLesson.tsx'
import { findMission, findTopic, missingRequirements, missionTitle } from '../map/topics.ts'
import { useMissionProgress } from '../map/useMissionProgress.ts'
import { useCurrentProfile } from '../profiles/useProfiles.ts'
import { paths } from '../routes/paths.ts'
import type { Mission, Topic } from '../types.ts'

/** Plays a mission; locked or unfinished missions reached by URL explain why they cannot start. */
export function MissionPage() {
  const params = useParams()
  const profile = useCurrentProfile()
  const progress = useMissionProgress(profile.id)
  const topic = findTopic(params.topicId)
  if (!topic) return <Navigate to={paths.map} replace />
  const mission = findMission(topic, params.missionId)
  if (!mission) return <Navigate to={paths.topic(topic.id)} replace />
  const missing = missingRequirements(mission, progress)
  if (missing.length) return <UnavailableMission topic={topic} mission={mission} reason={`Πρώτα: ${missing.map(missionTitle).join(', ')}`} />
  if (mission.id === 'light-the-bulb') return <ElectricityLesson topic={topic} mission={mission} />
  return <UnavailableMission topic={topic} mission={mission} reason="Αυτή η αποστολή δεν είναι ακόμη έτοιμη." />
}

function UnavailableMission({ topic, mission, reason }: { topic: Topic; mission: Mission; reason: string }) {
  const profile = useCurrentProfile()
  const heading = useFocusOnNavigation<HTMLHeadingElement>()
  return <main id="main" className="mission-placeholder">
    <p className="mission-profile"><Avatar index={profile.avatar} /><span>{profile.name}</span></p>
    <p className="mission-topic">{topic.name}</p>
    <h1 ref={heading} tabIndex={-1}>{mission.title}</h1>
    <p>{reason}</p>
    <BackLink className="button primary" to={paths.topic(topic.id)}>{topic.backLabel}</BackLink>
  </main>
}
