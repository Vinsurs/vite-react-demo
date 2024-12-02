import { useRef } from "react";
import CounTo, { IExposed } from "/@/components/CountTo"

export default function CountTo() {
    const countToRef = useRef<IExposed>(null)
    function handleChange() {
        countToRef.current && countToRef.current.start()
    }
    function handleReset() {
        countToRef.current && countToRef.current.reset()
    }
    return (
        <div>
            当前金额: $<CounTo startVal={0} endVal={500} duration={2000} ref={countToRef} autoplay={false} />
            <button onClick={handleChange}>给我变</button>
            <button onClick={handleReset}>重置</button>
        </div>
    )
}