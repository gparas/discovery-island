import { Link } from 'react-router'
import { paths } from '../routes/paths.ts'
import type { Profile } from '../types.ts'
import { Avatar } from './Avatar.tsx'

/** The exploring profile, kept visible on the map screens, with a way to switch profiles. */
export function ExplorerBadge({ profile }: { profile: Profile }) {
  return <div className="explorer-badge">
    <Avatar index={profile.avatar} />
    <span className="explorer-name">{profile.name}</span>
    <Link to={paths.chooseProfile}>Άλλαξε προφίλ</Link>
  </div>
}
