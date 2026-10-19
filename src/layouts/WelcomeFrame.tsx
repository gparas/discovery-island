import type { ReactNode } from 'react'
import { WelcomePanel } from '../components/WelcomePanel.tsx'
import type { WelcomeView } from '../types.ts'

/** The approved welcome composition: Σπίθα's welcome beside the profile panel. */
export function WelcomeFrame({ view, children }: { view: WelcomeView; children: ReactNode }) {
  return <main id="main" className="profile-layout">
    <WelcomePanel view={view} />
    <section className="profile-panel" aria-labelledby="panel-title">{children}</section>
  </main>
}
