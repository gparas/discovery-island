import { Icon } from './Icon.tsx'

export function BackButton({ className, onClick }: { className: string; onClick: () => void }) {
  return <button className={className} onClick={onClick}><Icon kind="back" /> Πίσω στα προφίλ</button>
}
