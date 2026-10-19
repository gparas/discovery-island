import type { TopicId } from '../types.ts'

/** A topic's island vignette, the same artwork as its card on the map; always decorative. */
export function TopicArt({ topicId, className = '' }: { topicId: TopicId; className?: string }) {
  return <img className={`topic-art ${className}`} src={`/assets/map/topic-${topicId}.webp`} alt="" width="440" height="372" decoding="async" />
}
