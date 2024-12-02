import React from "react";
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { SwitchTransition, CSSTransition } from 'react-transition-group'

const DefaultLayout: React.FC<React.PropsWithChildren> = function DefaultLayout() {
    const location = useLocation()
    return (
        <React.Fragment>
            <header>
                <ul className="list-none flex flex-row items-center gap-2 bg-sky-500">
                    <li className="list-none font-normal text-base">
                    <NavLink to="/" className={({ isActive }) => {
                        return isActive ? 'text-red-500' : 'text-white'
                    }}>首页</NavLink>
                    </li>
                    <li className="list-none font-normal text-base">
                    <NavLink to="/dotline" className={({ isActive }) => {
                        return isActive ? 'text-red-500' : 'text-white'
                    }}>canvas页</NavLink>
                    </li>
                    <li className="list-none font-normal text-base">
                    <NavLink to="/goodslist" className={({ isActive }) => {
                        return isActive ? 'text-red-500' : 'text-white'
                    }}>商品列表页面</NavLink>
                    </li>
                    <li className="list-none font-normal text-base">
                    <NavLink to="/goods/1" className={({ isActive }) => {
                        return isActive ? 'text-red-500' : 'text-white'
                    }}>商品详情页面</NavLink>
                    </li>
                    <li className="list-none font-normal text-base">
                    <NavLink to="/animation" className={({ isActive }) => {
                        return isActive ? 'text-red-500' : 'text-white'
                    }}>动画</NavLink>
                    </li>
                    <li className="list-none font-normal text-base">
                    <NavLink to="/image-compress" className={({ isActive }) => {
                        return isActive ? 'text-red-500' : 'text-white'
                    }}>类tinyPng图片压缩功能</NavLink>
                    </li>
                    <li className="list-none font-normal text-base">
                    <NavLink to="/transition-hook" className={({ isActive }) => {
                        return isActive ? 'text-red-500' : 'text-white'
                    }}>TransitionHook实例</NavLink>
                    </li>
                    <li className="list-none font-normal text-base">
                    <NavLink to="/to-count" className={({ isActive }) => {
                        return isActive ? 'text-red-500' : 'text-white'
                    }}>数值动画实例</NavLink>
                    </li>
                </ul>
            </header>
            <main>
            <SwitchTransition mode="out-in">
                <CSSTransition key={location.key} classNames="page" nodeRef={null} addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}>
                    <Outlet context={{ from: 'DefaultLayout Context'}} />
                </CSSTransition>
            </SwitchTransition>
            </main>
        </React.Fragment>
    )
}
export default DefaultLayout