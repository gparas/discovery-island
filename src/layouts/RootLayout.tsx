import { Outlet, useNavigate } from 'react-router'
import { LessonProgressProvider } from '../lessons/LessonProgressProvider.tsx'
import { useLessonProgress } from '../lessons/useLessonProgress.ts'
import { ProfilesProvider } from '../profiles/ProfilesProvider.tsx'
import { useProfiles } from '../profiles/useProfiles.ts'
import { paths } from '../routes/paths.ts'

export function RootLayout() {
  return <ProfilesProvider><LessonProgressProvider><PreviewChrome /></LessonProgressProvider></ProfilesProvider>
}

function PreviewChrome() {
  const { resetPreview } = useProfiles()
  const { clearProgress } = useLessonProgress()
  const navigate = useNavigate()
  function reset(empty: boolean) {
    resetPreview(empty)
    clearProgress()
    void navigate(paths.chooseProfile)
  }
  return <>
    <a className="skip-link" href="#main">Πήγαινε στο περιεχόμενο</a>
    <aside className="preview-bar" aria-label="Εργαλεία προεπισκόπησης">
      <span><strong>Προεπισκόπηση σχεδίου</strong><span className="preview-description"> · Δοκιμαστικά προφίλ, χωρίς αποθήκευση</span></span>
      <div><button type="button" onClick={() => reset(false)}>Με προφίλ</button><button type="button" onClick={() => reset(true)}>Πρώτη επίσκεψη</button></div>
    </aside>
    <Outlet />
  </>
}
