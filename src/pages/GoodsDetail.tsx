import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useBroadcastChannelContext } from "../context/broadcastchannel";

export default function GoodsDetail() {
    const [message, setMessage] = useState<string>("")
    const bcContext = useBroadcastChannelContext()
    const { id } = useParams<{ id: string }>()
    useEffect(() => {
        bcContext.bc?.addEventListener("message", e => {
            setMessage(e.data)
        })
    }, [])
    function handleSend() {
        if(bcContext.bc) {
            bcContext.bc.postMessage("这个是从商品详情广播发送的消息")
        }
    }
    return (
        <div>
            商品详情, id: {id}
            <button onClick={handleSend}>发送广播信息</button>
            广播消息: {message}
        </div>
    )
}