import React, { useEffect, useState } from "react";
import { useBroadcastChannelContext } from "../context/broadcastchannel";

export default function GoodsList() {
    const [message, setMessage] = useState<string>("")
    const bcContext = useBroadcastChannelContext()
    useEffect(() => {
        bcContext.bc?.addEventListener("message", e => {
            setMessage(e.data)
        })
    }, [])
    function handleSend() {
        if(bcContext.bc) {
            bcContext.bc.postMessage("这个是从商品列表广播发送的消息")
        }
    }
    return (
        <div>
            商品列表
            <button onClick={handleSend}>发送广播信息</button>
            <div>
                接收到的广播消息： {message}
            </div>
        </div>
    )
}