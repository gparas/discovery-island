import { useState } from 'react'
import { Link } from 'react-router'
import { Icon } from '../components/Icon.tsx'
import { useFocusOnNavigation } from '../hooks/useFocusOnNavigation.ts'
import '../map/archipelago.css'
import { completedCount, currentMission, topics, type MissionProgress } from '../map/topics.ts'
import { useMissionProgress } from '../map/useMissionProgress.ts'
import { useCurrentProfile } from '../profiles/useProfiles.ts'
import { paths } from '../routes/paths.ts'
import type { Topic, TopicId } from '../types.ts'

/** Phones show the island below the list, so only there may it wait for scrolling; on desktop it is the main image. */
const sceneLoading = typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 899px)').matches ? 'lazy' : undefined

function topicProgress(topic: Topic, progress: MissionProgress) {
  return topic.missions.length ? `${completedCount(topic, progress)} από ${topic.missions.length} αποστολές` : 'Σύντομα'
}

function MapPin() {
  return <svg className="map-pin" width="34" height="44" viewBox="0 0 34 44" aria-hidden="true"><path d="M17 42.5S32 27.1 32 17A15 15 0 0 0 2 17c0 10.1 15 25.5 15 25.5Z" fill="currentColor" stroke="white" strokeWidth="2.5" /><circle cx="17" cy="17" r="6" fill="white" /></svg>
}

/**
 * Explorer's Basecamp: the topic list is the navigation, the island scene mirrors it, and Σπίθα's panel
 * shows the highlighted topic (or the mission under way) with one action. Phones get the list and a banner.
 */
export function MapPage() {
  const profile = useCurrentProfile()
  const progress = useMissionProgress(profile.id)
  const heading = useFocusOnNavigation<HTMLHeadingElement>()
  const [selected, setSelected] = useState<TopicId | null>(null)
  const resume = topics.flatMap(topic => topic.missions).find(mission => progress.inProgress.has(mission.id))
  // Until a topic is pointed at or focused, the panel rests on the mission under way, else the first topic with missions.
  const home = topics.find(topic => topic.id === resume?.topicId) ?? topics.find(topic => topic.missions.length) ?? topics[0]!
  const featured = topics.find(topic => topic.id === selected) ?? home
  const resuming = resume?.topicId === featured.id ? resume : undefined
  // The last topic pointed at or focused stays selected, so the panel's action still matches it when reached.
  const highlight = (id: TopicId) => ({ onPointerEnter: () => setSelected(id) })
  return <main id="main" className="archipelago-page">
    <div className="basecamp">
      <h1 ref={heading} tabIndex={-1} className="basecamp-title">Πού θα εξερευνήσεις σήμερα;</h1>
      {!resume && <p className="map-prompt"><img src="/assets/spitha.webp" alt="" width="56" height="51" />Διάλεξε το νησί σου!</p>}
      <ul className="topic-list" aria-label="Θέματα">
        {topics.map(topic => <li key={topic.id}>
          <Link className={`topic-card${featured.id === topic.id ? ' is-active' : ''}`} to={paths.topic(topic.id)} aria-label={`${topic.name}, ${topicProgress(topic, progress)}`}
            {...highlight(topic.id)} onFocus={() => setSelected(topic.id)}>
            <img className="topic-thumb" src={`/assets/map/thumb-${topic.id}.webp`} alt="" width="136" height="115" decoding="async" />
            <span className="topic-text">
              <span className="topic-name">{topic.name}</span>
              <span className={`topic-progress${topic.missions.length ? '' : ' is-soon'}`}>{topicProgress(topic, progress)}</span>
            </span>
            <span className="topic-chevron"><Icon kind="chevron" /></span>
          </Link>
        </li>)}
      </ul>
      <div className="archipelago-stage">
        <div className="archipelago-sea">
          <picture className="archipelago-scene">
            {/* Phones always get the small file, whatever their pixel density. */}
            <source media="(max-width: 899px)" srcSet="/assets/map/island-800.webp" />
            <img src="/assets/map/island-1536.webp" srcSet="/assets/map/island-800.webp 800w, /assets/map/island-1536.webp 1536w"
              sizes="(min-width: 1280px) 892px, 70vw" width="1536" height="1024" alt="" loading={sceneLoading} decoding="async" />
          </picture>
          {/* Duplicates the list for pointer users only, so it stays out of the tab order and the accessibility tree. */}
          <div className="archipelago-islands" aria-hidden="true">
            {topics.map(topic => <Link key={topic.id} tabIndex={-1} to={paths.topic(topic.id)} {...highlight(topic.id)}
              className={`island-link destination-${topic.id}${featured.id === topic.id ? ' is-active' : ''}`}>
              {featured.id === topic.id && <MapPin />}<span className="island-caption">{topic.name}</span>
            </Link>)}
          </div>
        </div>
      </div>
      <section className={`spitha-panel${resume ? ' is-resume' : ''}`} aria-labelledby="spitha-panel-title">
        <img className="spitha-panel-art" src="/assets/spitha.webp" alt="" width="132" height="120" />
        <div className="spitha-panel-text">
          <h2 id="spitha-panel-title">{featured.name}</h2>
          <p>{resuming ? `Συνέχισε από εκεί που σταμάτησες: ${resuming.title}.` : currentMission(featured, progress)?.goal ?? 'Οι αποστολές για αυτό το θέμα ετοιμάζονται.'}</p>
        </div>
        {resuming
          ? <Link className="button primary" to={paths.mission(resuming.topicId, resuming.id)} aria-label={`Συνέχισε την αποστολή: ${resuming.title}`}>Συνέχισε <Icon kind="arrow" /></Link>
          : <Link className="button primary" to={paths.topic(featured.id)} aria-describedby="spitha-panel-title">Εξερεύνησε <Icon kind="arrow" /></Link>}
      </section>
    </div>
  </main>
}
