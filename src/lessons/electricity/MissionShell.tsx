import type { ReactNode } from 'react'
import { Avatar } from '../../components/Avatar.tsx'
import { BackLink } from '../../components/BackLink.tsx'
import { useFocusOnNavigation } from '../../hooks/useFocusOnNavigation.ts'
import { paths } from '../../routes/paths.ts'
import type { Mission, Profile, Topic } from '../../types.ts'
import { copy } from './copy.ts'

interface Props {
  readonly topic: Topic
  readonly mission: Mission
  readonly profile: Profile
  /** Index into the stage indicator; -1 before the first step, past the end once all are done. */
  readonly step: number
  /** The current instruction, kept above the board on phones. */
  readonly instruction?: string | undefined
  /** A short saved fact shown beside the title, such as the submitted prediction. */
  readonly note: string | null
  readonly board?: ReactNode
  /** Σπίθα's live feedback under the board. */
  readonly tip?: ReactNode
  /** The side panel: the stage question, its controls and the main action. */
  readonly children: ReactNode
}

export function Spitha() {
  return <img className="spitha" src="/assets/spitha.webp" alt="" width="480" height="438" />
}

/** The persistent mission frame: return to the island, stage indicator, profile, board, guide and action panel. */
export function MissionShell({ topic, mission, profile, step, instruction, note, board, tip, children }: Props) {
  const title = useFocusOnNavigation<HTMLHeadingElement>()
  return <div className="mission-shell">
    <header className="mission-bar">
      <BackLink className="back-button" to={paths.topic(topic.id)}>{topic.backLabel}</BackLink>
      <StageIndicator step={step} />
      <p className="mission-profile"><Avatar index={profile.avatar} /><span>{profile.name}</span></p>
    </header>
    <main id="main" className="mission-main">
      <div className="mission-heading">
        <div>
          <p className="mission-topic">{topic.name}</p>
          <h1 ref={title} tabIndex={-1}>{mission.title}</h1>
          {instruction && <p className="mission-instruction">{instruction}</p>}
        </div>
        {note && <p className="mission-note">{note}</p>}
      </div>
      <div className={`mission-grid${board ? '' : ' is-solo'}`}>
        {board && <div className="mission-board">{board}</div>}
        {board && <div className="spitha-tip" role="status">{tip && <><Spitha /><div><p className="tip-name">Σπίθα</p><div className="tip-text">{tip}</div></div></>}</div>}
        <section className="mission-panel" aria-label="Η αποστολή σου">{children}</section>
      </div>
    </main>
  </div>
}

function StageIndicator({ step }: { step: number }) {
  return <ol className="stage-indicator" aria-label="Στάδια αποστολής">
    {copy.stages.map((label, index) => <li key={label} className={index === step ? 'is-current' : index < step ? 'is-done' : ''} aria-current={index === step ? 'step' : undefined}>
      <span className="stage-number" aria-hidden="true">{index + 1}</span>
      <span className="stage-label">{label}</span>
    </li>)}
  </ol>
}
