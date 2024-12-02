import React, { useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { useDateDiff } from "../utils/hooks";

dayjs.extend(timezone)
dayjs.extend(utc)
export default function IndexPage() {
    useEffect(() => {
        console.log(dayjs().tz("Asia/Shanghai").toISOString())
        console.log(dayjs().tz("PRC", true).toISOString())
        console.log(dayjs().utc().toString())
    }, [])

    const dateDiff = useDateDiff("2023-09-15 16:00:00")

    const layoutContext = useOutletContext<{from: string}>()
    const elRef = useRef<HTMLDivElement>(null)
    const html = useRef<string>("<div>哈哈哈，嘻嘻嘻，咕咕咕，咩咩咩，哒哒哒</div>")
    const text = "#容祖儿#"
    function handleInsert() {
        const selection = document.getSelection()
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            const node = document.createElement("span")
            node.style.cssText = `color: red;`
            node.id = "__insert_id"
            node.insertAdjacentText("afterbegin", text)
            range.insertNode(node)
            range.collapse(false)
            document.getSelection()?.removeAllRanges()
        }
    }
    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = function (ev) {
        if (ev.code === "Backspace") {
            
            const selection = document.getSelection()
            console.log("handleKeyUp", ev, selection?.rangeCount)
            if (selection && selection.rangeCount > 0) {
                const focusNode = selection.focusNode
                if (focusNode) {
                    const node = focusNode.parentElement
                    if (node && node.id === "__insert_id") {
                        ev.preventDefault()
                        const focusOffset = selection.focusOffset
                        if (focusOffset === text.length) {
                            node.remove()
                        }
                    }
                }
            }
        }
    }
    const actions = [] as JSX.Element[]
    actions.push(<button onClick={() => alert("123")}>插入文本</button>)
    actions.push(<button onClick={() => alert("123dd")}>插入文本1</button>)
    return <div>
        这是首页, outlet context: { layoutContext.from }
        <div ref={elRef} dangerouslySetInnerHTML={{__html:html.current}} contentEditable={true} style={{
            width: 400, height: 300, border: "1px solid skyblue"
        }} onKeyDown={handleKeyDown}></div>
        <button onClick={handleInsert}>插入昵称</button>
        <div>
            当前剩余时间: {dateDiff.days}天{dateDiff.hours}小时{dateDiff.minutes}分钟{dateDiff.seconds}秒
        </div>
        <div className="bg-light-500">
            {
                React.Children.map(actions, action => action)
            }
        </div>
    </div>
}