import type { Ref } from 'react'
import { Link } from 'react-router'
import { paths } from '../routes/paths.ts'
import type { Profile } from '../types.ts'
import { Avatar } from './Avatar.tsx'
import { BackLink } from './BackLink.tsx'

export function SelectedProfile({ profile, headingRef }: { profile: Profile; headingRef: Ref<HTMLHeadingElement> }) {
  return <div className="selected-state">
    <Avatar index={profile.avatar} large />
    <h2 id="panel-title" ref={headingRef} tabIndex={-1}>Γεια σου, {profile.name}!</h2>
    <p>Το προφίλ σου επιλέχθηκε.</p>
    <p className="preview-next">Η προεπισκόπηση τελειώνει εδώ.<br />Ο χάρτης του νησιού έρχεται σύντομα· η αποστολή του ηλεκτρισμού είναι έτοιμη.</p>
    <Link className="button primary" to={paths.mission('electricity')}>Άναψε τη λάμπα</Link>
    <BackLink className="button back-to-profiles" to={paths.chooseProfile}>Πίσω στα προφίλ</BackLink>
  </div>
}
