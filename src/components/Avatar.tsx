import type { AvatarIndex } from '../types.ts'

export function Avatar({ index, large = false }: { index: AvatarIndex; large?: boolean }) {
  return <span className={`avatar avatar-${index}${large ? ' avatar-large' : ''}`} aria-hidden="true"><span className="avatar-art" style={{ backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 100}%` }} /></span>
}
