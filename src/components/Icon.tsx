import type { IconKind } from '../types.ts'

export function Icon({ kind }: { kind: IconKind }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{kind === 'plus' ? <path d="M12 5v14M5 12h14" /> : kind === 'chevron' ? <path d="m9 5 7 7-7 7" /> : kind === 'back' ? <path d="m10 5-7 7 7 7M3 12h18" /> : <path d="m14 5 7 7-7 7M21 12H3" />}</svg>
}
