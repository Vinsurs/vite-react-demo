import { createContext, useContext, createElement, FC, PropsWithChildren, useState, useEffect } from 'react'

type IBroadcastChannelContext = {
    bc: BroadcastChannel|null
}
const BroadcastChannelContext = createContext<IBroadcastChannelContext>({
    bc: null
})
export function useBroadcastChannelContext() {
    return useContext(BroadcastChannelContext)
}
export const WithBroadCastChannel: FC<PropsWithChildren> = function WithBroadCastChannel({ children }) {
    const [bc, setBc] = useState<BroadcastChannel|null>(null)
    useEffect(() => {
        const broadcastChannel = new BroadcastChannel("test")
        setBc(broadcastChannel)
    }, [])
    return createElement(BroadcastChannelContext.Provider, { value: { bc }}, children)
}