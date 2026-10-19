import { Link, Outlet } from 'react-router'
import { ExplorerBadge } from '../components/ExplorerBadge.tsx'
import { useCurrentProfile } from '../profiles/useProfiles.ts'
import { paths } from '../routes/paths.ts'

function HeaderExplorer() {
  return <ExplorerBadge profile={useCurrentProfile()} />
}

/**
 * Brand header and footer around the profile and island screens; missions use their own shell instead.
 * Below the profile guard the header shows the exploring profile in place of the tagline.
 */
export function SiteLayout({ explorer = false }: { explorer?: boolean }) {
  return <>
    <header className="site-header"><Link className="brand" to={paths.chooseProfile}><span className="brand-mark" aria-hidden="true"><svg width="26" height="30" viewBox="0 0 26 30"><path d="M15 1 3 17h9l-2 12 13-18h-9z" fill="currentColor" /></svg></span><span>Το Νησί των<br />Ανακαλύψεων</span></Link>{explorer ? <HeaderExplorer /> : <span className="header-note">Μικρές απορίες.<br />Μεγάλες ανακαλύψεις.</span>}</header>
    <Outlet />
    <footer className="site-footer"><span>Ένας ολόκληρος κόσμος για να τον ανακαλύψεις.</span><span>Με τη Σπίθα, βήμα βήμα.</span></footer>
  </>
}
