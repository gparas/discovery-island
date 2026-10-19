import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { BackLink } from '../components/BackLink.tsx'
import { ExplorerBadge } from '../components/ExplorerBadge.tsx'
import { useFocusOnNavigation } from '../hooks/useFocusOnNavigation.ts'
import { useLessonProgress } from '../lessons/useLessonProgress.ts'
import { Islet } from '../map/Islet.tsx'
import { completedCount, currentMission, findMission, findTopic, missingRequirements, missionStatus, missionTitle, type MissionProgress } from '../map/topics.ts'
import { useMissionProgress } from '../map/useMissionProgress.ts'
import { useCurrentProfile } from '../profiles/useProfiles.ts'
import { paths } from '../routes/paths.ts'
import type { Mission, MissionId, Profile, Topic } from '../types.ts'

export function TopicPage() {
  const topic = findTopic(useParams().topicId)
  if (!topic) return <Navigate to={paths.map} replace />
  return <TopicMap key={topic.id} topic={topic} />
}

function stationNote(mission: Mission, progress: MissionProgress): string {
  const status = missionStatus(mission, progress)
  if (status === 'locked') return `Πρώτα: ${missingRequirements(mission, progress).map(missionTitle).join(', ')}`
  if (!mission.playable) return 'Σύντομα'
  return { available: 'Έτοιμη για εξερεύνηση', 'in-progress': 'Σε εξέλιξη', completed: 'Ολοκληρώθηκε' }[status]
}

/** Placeholder topic map: the topic's islet with its missions as numbered stations along a path, and a detail card. */
function TopicMap({ topic }: { topic: Topic }) {
  const profile = useCurrentProfile()
  const progress = useMissionProgress(profile.id)
  const heading = useFocusOnNavigation<HTMLHeadingElement>()
  const current = currentMission(topic, progress)
  const [selectedId, setSelectedId] = useState<MissionId | undefined>(current?.id)
  const selected = findMission(topic, selectedId) ?? current
  return <main id="main" className={`topic-page topic-${topic.id}`}>
    <BackLink className="back-button" to={paths.map}>Πίσω στον χάρτη</BackLink>
    <div className="map-intro">
      <div>
        <p className="eyebrow">Θέμα</p>
        <h1 ref={heading} tabIndex={-1}>{topic.name}</h1>
      </div>
      <ExplorerBadge profile={profile} />
    </div>
    {topic.missions.length === 0 || !selected
      ? <section className="topic-soon">
          <Islet />
          <h2>Σύντομα</h2>
          <p>Οι αποστολές για αυτό το θέμα ετοιμάζονται.</p>
          <BackLink className="button primary" to={paths.map}>Πίσω στον χάρτη</BackLink>
        </section>
      : <div className="topic-layout">
          <section className="topic-path" aria-labelledby="path-title">
            <h2 id="path-title" className="path-title">Το μονοπάτι σου <span>{completedCount(topic, progress)} / {topic.missions.length}</span></h2>
            <ol className="stations">
              {topic.missions.map((mission, index) => <li key={mission.id} className={`station-item is-${missionStatus(mission, progress)}`}>
                <button type="button" className="station" aria-label={`${mission.title}, ${stationNote(mission, progress)}`} aria-pressed={mission.id === selected.id} onClick={() => setSelectedId(mission.id)}>
                  <span className="station-number" aria-hidden="true">{missionStatus(mission, progress) === 'completed' ? '✓' : index + 1}</span>
                  <span className="station-text"><span className="station-title">{mission.title}</span><span className="station-note">{stationNote(mission, progress)}</span></span>
                </button>
                {mission.id === current?.id && <img className="station-spitha" src="/assets/spitha.webp" alt="Η Σπίθα είναι εδώ" width="480" height="438" />}
              </li>)}
            </ol>
          </section>
          <MissionCard topic={topic} mission={selected} number={topic.missions.indexOf(selected) + 1} profile={profile} progress={progress} onSelect={setSelectedId} />
        </div>}
  </main>
}

interface MissionCardProps {
  readonly topic: Topic
  readonly mission: Mission
  readonly number: number
  readonly profile: Profile
  readonly progress: MissionProgress
  readonly onSelect: (id: MissionId) => void
}

function MissionCard({ topic, mission, number, profile, progress, onSelect }: MissionCardProps) {
  const { dispatch } = useLessonProgress()
  const status = missionStatus(mission, progress)
  const missing = missingRequirements(mission, progress)
  const to = paths.mission(topic.id, mission.id)
  return <section className="mission-card" aria-labelledby="mission-card-title">
    <p className="eyebrow">Αποστολή {number} · {topic.name}</p>
    <h2 id="mission-card-title">{mission.title}</h2>
    <p className="mission-goal">{mission.goal}</p>
    {status === 'locked'
      ? <>
          <p className="mission-lock">Πρώτα: {missing.map(missionTitle).join(', ')}</p>
          {missing.map(id => <button key={id} type="button" className="button secondary" onClick={() => onSelect(id)}>Πήγαινε στο «{missionTitle(id)}»</button>)}
        </>
      : !mission.playable
        ? <p className="mission-lock">Αυτή η αποστολή δεν είναι ακόμη έτοιμη.</p>
        : status === 'completed'
          ? <Link className="button primary" to={to} onClick={() => { if (mission.id === 'light-the-bulb') dispatch(profile.id, { type: 'replay' }) }}>Παίξε ξανά</Link>
          : <Link className="button primary" to={to}>{status === 'in-progress' ? 'Συνέχισε την αποστολή' : 'Ξεκίνα την αποστολή'}</Link>}
  </section>
}
