import { Link, useNavigate } from 'react-router'
import { useFocusOnNavigation } from '../hooks/useFocusOnNavigation.ts'
import { avatarLabels } from '../profiles/profiles.ts'
import { useProfiles } from '../profiles/useProfiles.ts'
import { paths } from '../routes/paths.ts'
import type { Profile } from '../types.ts'
import { Avatar } from './Avatar.tsx'
import { Icon } from './Icon.tsx'

export function ProfileChooser() {
  const { profiles, selectProfile } = useProfiles()
  const navigate = useNavigate()
  const heading = useFocusOnNavigation<HTMLHeadingElement>()
  const isEmpty = profiles.length === 0
  function enter(profile: Profile) {
    selectProfile(profile)
    void navigate(paths.map)
  }
  return <>
    <h2 id="panel-title" className="panel-title" ref={heading} tabIndex={-1}>{isEmpty ? 'Το πρώτο σου προφίλ' : 'Διάλεξε το προφίλ σου'}</h2>
    {isEmpty
      ? <div className="empty-state">
          <div className="empty-avatars"><Avatar index={0} /><Avatar index={2} /><Avatar index={5} /></div>
          <h3>Κάθε εξερευνητής,<br />η δική του αρχή.</h3>
          <p>Διάλεξε μια εικόνα από το νησί και ένα ψευδώνυμο που θα αναγνωρίζεις.</p>
          <Link className="button primary" to={paths.newProfile}>Δημιούργησε προφίλ <Icon kind="arrow" /></Link>
        </div>
      : <>
          <div className="profile-grid">{profiles.map(profile => <button className="profile-choice" key={profile.id} onClick={() => enter(profile)} aria-label={`${profile.name}, ${avatarLabels[profile.avatar]}`}><Avatar index={profile.avatar} /><span className="profile-name">{profile.name}</span><span className="choice-arrow"><Icon kind="arrow" /></span></button>)}</div>
          <Link className="button new-profile" to={paths.newProfile}><Icon kind="plus" /> Νέο προφίλ</Link>
        </>}
    <p className="privacy-note">Χωρίς email ή κωδικό. Ένα ψευδώνυμο αρκεί.</p>
  </>
}
