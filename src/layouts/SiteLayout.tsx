import { Link, Outlet } from 'react-router'
import { paths } from '../routes/paths.ts'

/** Brand header and footer around the profile and island screens; missions use their own shell instead. */
export function SiteLayout() {
  return <>
    <header className="site-header"><Link className="brand" to={paths.chooseProfile}><span className="brand-mark" aria-hidden="true"><svg width="26" height="30" viewBox="0 0 26 30"><path d="M15 1 3 17h9l-2 12 13-18h-9z" fill="currentColor" /></svg></span><span>Το Νησί των<br />Ανακαλύψεων</span></Link><span className="header-note">Μικρές απορίες.<br />Μεγάλες ανακαλύψεις.</span></header>
    <Outlet />
    <footer className="site-footer"><span>Ένας ολόκληρος κόσμος για να τον ανακαλύψεις.</span><span>Με τη Σπίθα, βήμα βήμα.</span></footer>
  </>
}
