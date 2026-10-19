import type { Ref } from 'react'
import type { Profile } from '../types.ts'
import { Avatar } from './Avatar.tsx'
import { BackButton } from './BackButton.tsx'

export function SelectedProfile({ profile, headingRef, onBack }: { profile: Profile; headingRef: Ref<HTMLHeadingElement>; onBack: () => void }) {
  return <div className="selected-state">
    <Avatar index={profile.avatar} large />
    <h2 id="panel-title" ref={headingRef} tabIndex={-1}>Γεια σου, {profile.name}!</h2>
    <p>Το προφίλ σου επιλέχθηκε.</p>
    <p className="preview-next">Η προεπισκόπηση τελειώνει εδώ.<br />Επόμενη οθόνη: ο χάρτης του νησιού.</p>
    <BackButton className="button primary" onClick={onBack} />
  </div>
}
