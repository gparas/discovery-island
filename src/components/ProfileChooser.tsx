import type { Ref } from 'react'
import { avatarLabels } from '../profiles/profiles.ts'
import type { Profile } from '../types.ts'
import { Avatar } from './Avatar.tsx'
import { Icon } from './Icon.tsx'

interface ProfileChooserProps {
  profiles: readonly Profile[]
  headingRef: Ref<HTMLHeadingElement>
  onSelect: (profile: Profile) => void
  onCreate: () => void
}

export function ProfileChooser({ profiles, headingRef, onSelect, onCreate }: ProfileChooserProps) {
  const isEmpty = profiles.length === 0
  return <>
    <h2 id="panel-title" className="panel-title" ref={headingRef} tabIndex={-1}>{isEmpty ? 'Το πρώτο σου προφίλ' : 'Διάλεξε το προφίλ σου'}</h2>
    {isEmpty
      ? <div className="empty-state">
          <div className="empty-avatars"><Avatar index={0} /><Avatar index={2} /><Avatar index={5} /></div>
          <h3>Κάθε εξερευνητής,<br />η δική του αρχή.</h3>
          <p>Διάλεξε μια εικόνα από το νησί και ένα ψευδώνυμο που θα αναγνωρίζεις.</p>
          <button className="button primary" onClick={onCreate}>Δημιούργησε προφίλ <Icon kind="arrow" /></button>
        </div>
      : <>
          <div className="profile-grid">{profiles.map(profile => <button className="profile-choice" key={profile.id} onClick={() => onSelect(profile)} aria-label={`${profile.name}, ${avatarLabels[profile.avatar]}`}><Avatar index={profile.avatar} /><span className="profile-name">{profile.name}</span><span className="choice-arrow"><Icon kind="arrow" /></span></button>)}</div>
          <button className="button new-profile" onClick={onCreate}><Icon kind="plus" /> Νέο προφίλ</button>
        </>}
    <p className="privacy-note">Χωρίς email ή κωδικό. Ένα ψευδώνυμο αρκεί.</p>
  </>
}
