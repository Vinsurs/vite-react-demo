import type { RouteObject } from 'react-router-dom'
import DefaultLayout from '../layout/Default'
import { loadable } from '../components/Loadable'

const IndexPage = loadable(() => import("../pages/Index"))
const Dotline = loadable(() => import("../pages/Dotline"))
const GoodsList = loadable(() => import("../pages/GoodsList"))
const GoodsDetail = loadable(() => import("../pages/GoodsDetail"))
const Animation = loadable(() => import("../pages/Animation"))
const ImageCompress = loadable(() => import("../pages/ImageCompress"))
const TransitionHook = loadable(() => import("../pages/TransitionHook"))
const CountTo = loadable(() => import("../pages/CountTo"))

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                index: true,
                element: <IndexPage />,
            },
            {
                path: "dotline",
                element: <Dotline />,
            },
            {
                path: "goodslist",
                element: <GoodsList />,
            },
            {
                path: "goods/:id",
                element: <GoodsDetail />
            },
            {
                path: "animation",
                element: <Animation />
            },
            {
                path: "image-compress",
                element: <ImageCompress />
            },
            {
                path: "transition-hook",
                element: <TransitionHook />
            },
            {
                path: "to-count",
                element: <CountTo />
            }
        ]
    }
]