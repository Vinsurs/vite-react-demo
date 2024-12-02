import React from "react"

export function useDateDiff(target: string) {
    const [state, setState] = React.useState<{
      days: number
      hours: number
      minutes: number
      seconds: number
    }>({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    })
    const timer = React.useRef<NodeJS.Timeout>()
    React.useEffect(() => {
      let left = new Date(target).getTime() - new Date().getTime()
      flush()
      function flush() {
        let diff = left
        const days = Math.floor(diff / (24 * 3600 * 1000))
        diff = diff % (24 * 3600 * 1000)
        const hours = Math.floor(diff / (3600 * 1000))
        diff = diff % (3600 * 1000)
        const minutes = Math.floor(diff / (60 * 1000))
        diff = diff % (60 * 1000)
        const seconds = Math.floor(diff / 1000)
        setState({
          days,
          hours,
          minutes,
          seconds
        })
        timer.current = setTimeout(() => {
            left -= 1000;
            flush()
        }, 1000);
      }
      return () => {
        if (timer.current) {
          clearTimeout(timer.current)
        }
      }
    }, [])
    return state
}