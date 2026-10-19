import { Outlet, useMatch } from 'react-router'
import { paths } from '../routes/paths.ts'
import { WelcomeFrame } from './WelcomeFrame.tsx'

/** Keeps the welcome in place while the profile routes swap the panel beside it. */
export function WelcomeLayout() {
  const creating = useMatch(paths.newProfile) !== null
  return <WelcomeFrame view={creating ? 'create' : 'choose'}><Outlet /></WelcomeFrame>
}
