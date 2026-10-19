import type { TopicId } from '../types.ts'

/** A topic's island vignette, the same artwork as its card on the map; always decorative. */
export function TopicArt({ topicId, className = '' }: { topicId: TopicId; className?: string }) {
  const src = (width: number) => `/assets/map/topic-${topicId}-${width}.webp`
  return <picture className={`topic-art ${className}`}>
    {/* Phones always get the small file, whatever their pixel density. */}
    <source media="(max-width: 760px)" srcSet={src(520)} />
    <img src={src(520)} srcSet={`${src(520)} 520w, ${src(1040)} 1040w`}
      sizes="520px" alt="" width="1040" height="880" decoding="async" />
  </picture>
}
