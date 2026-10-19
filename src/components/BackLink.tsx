import { Link } from 'react-router'
import { Icon } from './Icon.tsx'

export function BackLink({ className, to, children }: { className: string; to: string; children: string }) {
  return <Link className={className} to={to}><Icon kind="back" /> {children}</Link>
}
