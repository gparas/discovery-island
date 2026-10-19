import { Link } from 'react-router'
import { ExplorerBadge } from '../components/ExplorerBadge.tsx'
import { Icon } from '../components/Icon.tsx'
import { useFocusOnNavigation } from '../hooks/useFocusOnNavigation.ts'
import { Islet } from '../map/Islet.tsx'
import { completedCount, topics, type MissionProgress } from '../map/topics.ts'
import { useMissionProgress } from '../map/useMissionProgress.ts'
import { useCurrentProfile } from '../profiles/useProfiles.ts'
import { paths } from '../routes/paths.ts'
import type { Topic } from '../types.ts'

function topicProgress(topic: Topic, progress: MissionProgress) {
  return topic.missions.length ? `${completedCount(topic, progress)} από ${topic.missions.length} αποστολές` : 'Σύντομα'
}

/** Placeholder map: five open topic islets joined by decorative stones, top to bottom. */
export function MapPage() {
  const profile = useCurrentProfile()
  const progress = useMissionProgress(profile.id)
  const heading = useFocusOnNavigation<HTMLHeadingElement>()
  const resume = topics.flatMap(topic => topic.missions).find(mission => progress.inProgress.has(mission.id))
  return <main id="main" className="map-page">
    <div className="map-intro">
      <div>
        <p className="eyebrow">Ο χάρτης</p>
        <h1 ref={heading} tabIndex={-1}>Πού θα εξερευνήσεις σήμερα;</h1>
      </div>
      <ExplorerBadge profile={profile} />
    </div>
    {resume && <Link className="button primary resume-link" to={paths.mission(resume.topicId, resume.id)}>Συνέχισε την αποστολή: {resume.title} <Icon kind="arrow" /></Link>}
    <ol className="islets" aria-label="Θέματα">
      {topics.map(topic => <li key={topic.id} className={`islet-item topic-${topic.id}`}>
        <Link className="islet" to={paths.topic(topic.id)} aria-label={`${topic.name}, ${topicProgress(topic, progress)}`}>
          <Islet />
          <span className="islet-name">{topic.name}</span>
          <span className={`islet-status${topic.missions.length ? '' : ' is-soon'}`}>{topicProgress(topic, progress)}</span>
        </Link>
      </li>)}
    </ol>
  </main>
}
