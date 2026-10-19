/** Flat isometric placeholder for a topic islet; the real artwork is chosen when the map is designed. */
export function Islet({ className = '' }: { className?: string }) {
  return <svg className={`islet-art ${className}`} viewBox="0 0 200 130" aria-hidden="true">
    <polygon className="islet-side" points="10,55 100,100 100,124 10,79" />
    <polygon className="islet-side is-dark" points="190,55 100,100 100,124 190,79" />
    <polygon className="islet-top" points="100,10 190,55 100,100 10,55" />
    <polygon className="landmark-side" points="72,40 100,54 100,78 72,64" />
    <polygon className="landmark-side is-dark" points="128,40 100,54 100,78 128,64" />
    <polygon className="landmark-top" points="100,26 128,40 100,54 72,40" />
  </svg>
}
