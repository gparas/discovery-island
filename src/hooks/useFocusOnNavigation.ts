import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

/**
 * Focuses the returned element after each in-app navigation so screen readers announce the new screen.
 * The location the app first opened on keeps the browser's default focus.
 */
export function useFocusOnNavigation<T extends HTMLElement>() {
  const target = useRef<T>(null)
  const { key } = useLocation()
  useEffect(() => {
    if (key !== 'default') target.current?.focus()
  }, [key])
  return target
}
