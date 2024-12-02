import React, { Fragment, ForwardRefRenderFunction, useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react";

type IProps = {
    /** 起始值, 默认0 */
    startVal?: number
    /** 结束值 */
    endVal: number
    /** 动画时长, 默认1500 */
    duration?: number
    /** 自动执行 */
    autoplay?: boolean
}
export type IExposed = {
    start(): void
    reset(): void
}
const CounTo: ForwardRefRenderFunction<IExposed, IProps> = function CountTo({ startVal = 0, endVal, duration = 1500, autoplay = true }, ref) {
    const requestId = useRef<number>()
    const [value, setValue] = useState(startVal)
    const diffValue = endVal - startVal
    useImperativeHandle(ref, () => {
        return {
            start() {
                startCount()
            },
            reset() {
                setValue(startVal)
            },
        }
    })
    useEffect(() => {
        autoplay && startCount()
        return () => {
            requestId.current && cancelAnimationFrame(requestId.current)
        }
    }, [])
    function startCount() {
        let start: number;
        function tick(timestamp: number) {
            if (!start) {
                start = timestamp
            } 
            const elapsed = timestamp - start
            const speed = diffValue / duration
            const nextValue = Math.floor(startVal + elapsed * speed)
            setValue(Math.min(nextValue, endVal))
            if (nextValue < endVal) {
                requestId.current = requestAnimationFrame(tick)
            }
        }
        requestId.current = requestAnimationFrame(tick)
    }
    return <Fragment>{value}</Fragment>
}
CounTo.displayName = "CountTo"
export default forwardRef(CounTo)