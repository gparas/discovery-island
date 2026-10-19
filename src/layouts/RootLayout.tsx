import { Link, Outlet, useNavigate } from 'react-router'
import { ProfilesProvider } from '../profiles/ProfilesProvider.tsx'
import { useProfiles } from '../profiles/useProfiles.ts'
import { paths } from '../routes/paths.ts'

export function RootLayout() {
  return <ProfilesProvider><SiteChrome /></ProfilesProvider>
}

function SiteChrome() {
  const { resetPreview } = useProfiles()
  const navigate = useNavigate()
  function reset(empty: boolean) {
    resetPreview(empty)
    void navigate(paths.chooseProfile)
  }
  return <>
    <a className="skip-link" href="#main">Πήγαινε στο περιεχόμενο</a>
    <aside className="preview-bar" aria-label="Εργαλεία προεπισκόπησης">
      <span><strong>Προεπισκόπηση σχεδίου</strong><span className="preview-description"> · Δοκιμαστικά προφίλ, χωρίς αποθήκευση</span></span>
      <div><button type="button" onClick={() => reset(false)}>Με προφίλ</button><button type="button" onClick={() => reset(true)}>Πρώτη επίσκεψη</button></div>
    </aside>
    <header className="site-header"><Link className="brand" to={paths.chooseProfile}><span className="brand-mark" aria-hidden="true"><svg width="26" height="30" viewBox="0 0 26 30"><path d="M15 1 3 17h9l-2 12 13-18h-9z" fill="currentColor" /></svg></span><span>Το Νησί των<br />Ανακαλύψεων</span></Link><span className="header-note">Μικρές απορίες.<br />Μεγάλες ανακαλύψεις.</span></header>
    <Outlet />
    <footer className="site-footer"><span>Ένας ολόκληρος κόσμος για να τον ανακαλύψεις.</span><span>Με τη Σπίθα, βήμα βήμα.</span></footer>
  </>
}
