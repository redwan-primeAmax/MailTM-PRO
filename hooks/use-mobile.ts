import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)

    // Using a microtask or just moving it slightly won't solve the lint rule if it's strict
    // But usually initializing in a state function is better if possible.
    // However, since it depends on 'window', we must do it in useEffect.
    const initialCheck = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    initialCheck();

    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
