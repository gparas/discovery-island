import type { Ref } from 'react'
import { paths } from '../routes/paths.ts'
import type { Profile } from '../types.ts'
import { Avatar } from './Avatar.tsx'
import { BackLink } from './BackLink.tsx'

export function SelectedProfile({ profile, headingRef }: { profile: Profile; headingRef: Ref<HTMLHeadingElement> }) {
  return <div className="selected-state">
    <Avatar index={profile.avatar} large />
    <h2 id="panel-title" ref={headingRef} tabIndex={-1}>Γεια σου, {profile.name}!</h2>
    <p>Το προφίλ σου επιλέχθηκε.</p>
    <p className="preview-next">Η προεπισκόπηση τελειώνει εδώ.<br />Επόμενη οθόνη: ο χάρτης του νησιού.</p>
    <BackLink className="button primary" to={paths.chooseProfile}>Πίσω στα προφίλ</BackLink>
  </div>
}
