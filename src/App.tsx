import { ProfileChooser } from './components/ProfileChooser.tsx'
import { ProfileForm } from './components/ProfileForm.tsx'
import { SelectedProfile } from './components/SelectedProfile.tsx'
import { WelcomePanel } from './components/WelcomePanel.tsx'
import { useFocusOnChange } from './hooks/useFocusOnChange.ts'
import { useProfiles } from './profiles/useProfiles.ts'

export default function App() {
  const { profiles, screen, draft, showProfiles, openForm, selectProfile, setNickname, setAvatar, submitDraft, resetPreview } = useProfiles()
  const heading = useFocusOnChange<HTMLHeadingElement>(screen.view)
  return <>
    <a className="skip-link" href="#main">Πήγαινε στο περιεχόμενο</a>
    <aside className="preview-bar" aria-label="Εργαλεία προεπισκόπησης">
      <span><strong>Προεπισκόπηση σχεδίου</strong><span className="preview-description"> · Δοκιμαστικά προφίλ, χωρίς αποθήκευση</span></span>
      <div><button type="button" onClick={() => resetPreview(false)}>Με προφίλ</button><button type="button" onClick={() => resetPreview(true)}>Πρώτη επίσκεψη</button></div>
    </aside>
    <header className="site-header"><a className="brand" href="#main" onClick={showProfiles}><span className="brand-mark" aria-hidden="true"><svg width="26" height="30" viewBox="0 0 26 30"><path d="M15 1 3 17h9l-2 12 13-18h-9z" fill="currentColor" /></svg></span><span>Το Νησί των<br />Ανακαλύψεων</span></a><span className="header-note">Μικρές απορίες.<br />Μεγάλες ανακαλύψεις.</span></header>
    <main id="main" className="profile-layout">
      <WelcomePanel view={screen.view} />
      <section className="profile-panel" aria-labelledby="panel-title">
        {screen.view === 'choose' && <ProfileChooser profiles={profiles} headingRef={heading} onSelect={selectProfile} onCreate={openForm} />}
        {screen.view === 'create' && <ProfileForm draft={draft} headingRef={heading} onNicknameChange={setNickname} onAvatarChange={setAvatar} onSubmit={submitDraft} onBack={showProfiles} />}
        {screen.view === 'selected' && <SelectedProfile profile={screen.profile} headingRef={heading} onBack={showProfiles} />}
      </section>
    </main>
    <footer className="site-footer"><span>Ένας ολόκληρος κόσμος για να τον ανακαλύψεις.</span><span>Με τη Σπίθα, βήμα βήμα.</span></footer>
  </>
}
