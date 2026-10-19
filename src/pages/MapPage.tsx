import { useState } from 'react'
import { Link } from 'react-router'
import { Icon } from '../components/Icon.tsx'
import { useFocusOnNavigation } from '../hooks/useFocusOnNavigation.ts'
import '../map/archipelago.css'
import { completedCount, topics, type MissionProgress } from '../map/topics.ts'
import { useMissionProgress } from '../map/useMissionProgress.ts'
import { useCurrentProfile } from '../profiles/useProfiles.ts'
import { paths } from '../routes/paths.ts'
import type { Topic, TopicId } from '../types.ts'

/** Phones show the scene as a banner below the list, so only there may it wait for scrolling; on desktop it is the main image. */
const sceneLoading = typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 899px)').matches ? 'lazy' : undefined

function topicProgress(topic: Topic, progress: MissionProgress) {
  return topic.missions.length ? `${completedCount(topic, progress)} από ${topic.missions.length} αποστολές` : 'Σύντομα'
}

/**
 * Five independently accessible topics: the list is the navigation, the island scene beside it is a
 * pointer shortcut that mirrors the list's hover and focus. Phones get the list and a small scene banner.
 */
export function MapPage() {
  const profile = useCurrentProfile()
  const progress = useMissionProgress(profile.id)
  const heading = useFocusOnNavigation<HTMLHeadingElement>()
  const [active, setActive] = useState<TopicId | null>(null)
  const resume = topics.flatMap(topic => topic.missions).find(mission => progress.inProgress.has(mission.id))
  const highlight = (id: TopicId) => ({ onPointerEnter: () => setActive(id), onPointerLeave: () => setActive(null) })
  return <main id="main" className="archipelago-page">
    <h1 ref={heading} tabIndex={-1} className="sr-only">Πού θα εξερευνήσεις σήμερα;</h1>
    {resume && <Link className="button primary resume-link" to={paths.mission(resume.topicId, resume.id)}>Συνέχισε την αποστολή: {resume.title} <Icon kind="arrow" /></Link>}
    <p className="map-prompt"><img src="/assets/spitha.webp" alt="" width="56" height="56" />Διάλεξε το νησί σου!</p>
    <div className="archipelago-layout">
      <ul className="topic-list" aria-label="Θέματα">
        {topics.map(topic => <li key={topic.id}>
          <Link className={`topic-card${active === topic.id ? ' is-active' : ''}`} to={paths.topic(topic.id)} aria-label={`${topic.name}, ${topicProgress(topic, progress)}`}
            {...highlight(topic.id)} onFocus={() => setActive(topic.id)} onBlur={() => setActive(null)}>
            <img className="topic-thumb" src={`/assets/map/thumb-${topic.id}.webp`} alt="" width="104" height="88" decoding="async" />
            <span className="topic-text">
              <span className="topic-name">{topic.name}</span>
              <span className="topic-progress">{topicProgress(topic, progress)}</span>
            </span>
            <span className="topic-chevron"><Icon kind="arrow" /></span>
          </Link>
        </li>)}
      </ul>
      <div className="archipelago-sea">
        <picture className="archipelago-scene">
          <source media="(max-width: 899px)" srcSet="/assets/map/scene-900.webp" />
          <img src="/assets/map/scene-1625.webp" srcSet="/assets/map/scene-900.webp 900w, /assets/map/scene-1625.webp 1625w" sizes="(min-width: 1280px) 820px, 64vw" alt="" loading={sceneLoading} decoding="async" />
        </picture>
        {/* Duplicates the list for pointer users only, so it stays out of the tab order and the accessibility tree. */}
        <div className="archipelago-islands" aria-hidden="true">
          {topics.map(topic => <Link key={topic.id} tabIndex={-1} to={paths.topic(topic.id)} {...highlight(topic.id)}
            className={`island-link destination-${topic.id}${active === topic.id ? ' is-active' : ''}`}>
            <span className="island-caption">{topic.name}</span>
          </Link>)}
        </div>
        <p className="map-guide" aria-hidden="true">Διάλεξε<br />το νησί σου!</p>
      </div>
    </div>
  </main>
}
