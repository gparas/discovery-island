import { useEffect, useRef } from 'react'

/** Focuses the returned element whenever `key` changes, skipping the initial render. */
export function useFocusOnChange<T extends HTMLElement>(key: unknown) {
  const target = useRef<T>(null)
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    target.current?.focus()
  }, [key])
  return target
}
