import { Suspense, lazy, ReactNode } from "react";

type ILoadableOptions = {
    fallback?: ReactNode
}
export const loadable = function loadable(Loader: Parameters<typeof lazy>["0"], options?: ILoadableOptions) {
    const LoadComponent = lazy(Loader)
    const fallback = options?.fallback??<div>loading...</div>
    return function (props: any) {
        return (
            <Suspense fallback={fallback}>
                <LoadComponent {...props} />
            </Suspense>
        )
    }
}