import type { ReactNode } from 'react'
import type { ScreenView } from '../types.ts'

const copy: Record<ScreenView, { title: ReactNode; body: string }> = {
  choose: { title: <>Ποιος εξερευνά<br /><span>σήμερα;</span></>, body: 'Είμαι η Σπίθα! Διάλεξε το προφίλ σου και έλα να εξερευνήσουμε μαζί.' },
  create: { title: <>Η περιπέτεια<br /><span>ξεκινά εδώ.</span></>, body: 'Ένα ψευδώνυμο και μια εικόνα. Κάτι δικό σου, για κάθε ανακάλυψη.' },
  selected: { title: <>Έτοιμοι για<br /><span>ανακαλύψεις;</span></>, body: 'Η Σπίθα σε περιμένει για την επόμενη ανακάλυψη.' },
}

export function WelcomePanel({ view }: { view: ScreenView }) {
  const { title, body } = copy[view]
  return <section className="welcome" aria-labelledby="welcome-title">
    <div className="welcome-copy"><h1 id="welcome-title">{title}</h1><p>{body}</p></div>
    <img className="mascot" src="/assets/spitha.webp" alt="Η Σπίθα, το χαμογελαστό ρομπότ που μας καθοδηγεί" width="480" height="480" />
  </section>
}
