import type { Terminal, Wire } from './circuit.ts'
import type { BoardFeedback, ChallengeStatus, ExplanationChoice, Prediction } from './lesson.ts'

/** Approved Greek copy from docs/electricity-lesson.md. Short shell labels are marked as interface copy. */
export const copy = {
  story: {
    speech: 'Καλώς ήρθες στο εργαστήριο του φάρου! Έχω μια μικρή λάμπα, μια μπαταρία και δύο καλώδια. Θέλεις να με βοηθήσεις να ανάψω τη λάμπα;',
    action: 'Ας εξερευνήσουμε!',
  },
  prediction: {
    prompt: 'Θα ανάψει η λάμπα με αυτή τη σύνδεση;',
    support: 'Διάλεξε τι πιστεύεις. Μετά θα το δοκιμάσουμε.',
    action: 'Ας το δοκιμάσουμε',
  },
  build: {
    observation: 'Με αυτή τη σύνδεση, η λάμπα μένει σβηστή.',
    task: 'Μπορείς να αλλάξεις τις συνδέσεις ώστε να ανάψει;',
    success: 'Η λάμπα άναψε! Ας δούμε τι άλλαξε.',
    action: 'Γιατί άναψε;',
  },
  controls: {
    instruction: 'Πάτησε μία επαφή και μετά μια δεύτερη για να τις συνδέσεις.',
    undo: 'Αναίρεση',
    help: 'Βοήθεια',
    removeAll: 'Αφαίρεση όλων των καλωδίων',
    demonstrate: 'Δείξε μου μία σύνδεση',
  },
  explain: {
    question: 'Γιατί άναψε η λάμπα;',
    action: 'Έλεγξε την απάντηση',
    next: 'Μια νέα δοκιμή',
  },
  challenge: {
    speech: 'Άλλαξα θέση στη μπαταρία και στη λάμπα. Μπορείς να φτιάξεις πάλι ένα κύκλωμα που ανάβει τη λάμπα;',
    instruction: 'Σύνδεσε τις επαφές με τα δύο καλώδια. Όταν είσαι έτοιμος/η, δοκίμασε το κύκλωμά σου.',
    action: 'Δοκίμασε το κύκλωμα',
    unlit: 'Η λάμπα δεν άναψε ακόμη. Έλεγξε τις συνδέσεις και δοκίμασε ξανά.',
    lit: 'Η λάμπα άναψε ξανά! Η θέση των εξαρτημάτων άλλαξε, αλλά η ολόκληρη διαδρομή παρέμεινε απαραίτητη.',
    next: 'Τι ανακαλύψαμε;',
  },
  complete: {
    title: 'Ολοκλήρωσες την αποστολή!',
    summary: 'Δοκίμασες πώς ανάβει μια λάμπα. Στο κύκλωμά μας χρειάζεται μια ολόκληρη διαδρομή: από τον έναν πόλο της μπαταρίας, μέσα από τη λάμπα, ως τον άλλο πόλο.',
    back: 'Πίσω στο νησί',
    replay: 'Παίξε ξανά',
  },
  bulb: { off: 'Η λάμπα είναι σβηστή', on: 'Η λάμπα είναι αναμμένη' },
  // Interface copy for the shell.
  stages: ['Πρόβλεψη', 'Πείραμα', 'Εξήγηση', 'Νέα δοκιμή'],
  panels: { story: 'Σπίθα', prediction: 'Η πρόβλεψή σου', build: 'Οι συνδέσεις σου', explain: 'Η εξήγησή σου', challenge: 'Οι συνδέσεις σου' },
  predictionSaved: 'Η πρόβλεψή σου',
} as const

export const predictionLabels: Record<Prediction, string> = { yes: 'Ναι', no: 'Όχι', unsure: 'Δεν είμαι σίγουρος/η' }

export const explanationChoices: Record<ExplanationChoice, string> = {
  0: 'Επειδή ένα καλώδιο αγγίζει τη λάμπα.',
  1: 'Επειδή υπάρχει μια ολόκληρη διαδρομή από τον έναν πόλο της μπαταρίας, μέσα από τη λάμπα, ως τον άλλο πόλο.',
  2: 'Επειδή η λάμπα βρίσκεται κοντά στην μπαταρία.',
}

export const explanationFeedback: Record<ExplanationChoice, string> = {
  0: 'Στην αρχή είχαμε ένα καλώδιο, αλλά η λάμπα έμενε σβηστή. Παρατήρησε τη διαδρομή τώρα και δοκίμασε ξανά.',
  1: 'Ακριβώς! Το ηλεκτρικό κύκλωμα είναι κλειστό: υπάρχει μια ολόκληρη αγώγιμη διαδρομή μέσα από τη λάμπα και την μπαταρία.',
  2: 'Η απόσταση από την μπαταρία δεν αρκεί για να ανάψει η λάμπα. Παρατήρησε τις συνδέσεις και δοκίμασε ξανά.',
}

export const boardFeedback: Record<BoardFeedback, string> = {
  'select-second': 'Τώρα διάλεξε τη δεύτερη επαφή.',
  duplicate: 'Αυτές οι επαφές είναι ήδη συνδεδεμένες.',
  short: 'Αυτή η σύνδεση ενώνει τους πόλους της μπαταρίας χωρίς να περνά από τη λάμπα. Δοκίμασε άλλη σύνδεση.',
  full: 'Έχεις χρησιμοποιήσει και τα δύο καλώδια. Πάτησε “Αναίρεση” για να αλλάξεις μια σύνδεση.',
}

export const hints = {
  cue: 'Παρατήρησε τη μπαταρία και τη λάμπα. Ποιες επαφές δεν έχουν συνδεθεί ακόμη;',
  change: 'Ας αλλάξουμε μια σύνδεση. Πάτησε “Αναίρεση” και δοκίμασε μια διαφορετική επαφή της λάμπας.',
  highlight: 'Δοκίμασε να ενώσεις αυτές τις δύο επαφές.',
}

export const challengeStatusText: Record<ChallengeStatus, string> = {
  untested: 'Δεν έχει δοκιμαστεί ακόμη',
  changed: 'Οι συνδέσεις άλλαξαν. Δοκίμασε ξανά.',
  lit: copy.bulb.on,
  unlit: copy.bulb.off,
}

export const terminalNames: Record<Terminal, string> = {
  positive: 'Θετικός πόλος μπαταρίας',
  negative: 'Αρνητικός πόλος μπαταρίας',
  a: 'Επαφή Α της λάμπας',
  b: 'Επαφή Β της λάμπας',
}

const lower = (name: string) => name.charAt(0).toLocaleLowerCase('el') + name.slice(1)

/** A text equivalent of the board for assistive technology and the visible caption. */
export function describeWires(wires: readonly Wire[]): string {
  if (!wires.length) return 'Δεν υπάρχουν συνδεδεμένα καλώδια.'
  return wires.map(([a, b]) => `${terminalNames[a]} με ${lower(terminalNames[b])}.`).join(' ')
}

/** The highlighted-connection hint, with the two terminals spelled out for assistive technology. */
export function connectionHint([from, to]: Wire): string {
  return `${hints.highlight} ${terminalNames[from]} και ${lower(terminalNames[to])}.`
}

/** The complete path through a working circuit, as a text equivalent of the highlighted loop. */
export function describeLoop(wires: readonly Wire[]): string {
  const bulbEnd = (pole: Terminal) => {
    const wire = wires.find(wire => wire.includes(pole))
    return wire?.[0] === pole ? wire[1] : wire?.[0]
  }
  const start = bulbEnd('positive'), end = bulbEnd('negative')
  if (!start || !end) return ''
  return `Η διαδρομή: θετικός πόλος → ${lower(terminalNames[start])} → μέσα από τη λάμπα → ${lower(terminalNames[end])} → αρνητικός πόλος.`
}
