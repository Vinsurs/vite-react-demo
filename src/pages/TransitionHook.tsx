import { useState } from "react";
import { useTransition, Transition, useSwitchTransition, SwitchTransition, useListTransition, ListTransition } from "transition-hook"

export default function TransitionHook() {
    const [on, SetOn] = useState(true)
    const { stage, shouldMount } = useTransition(on, 500)
    const [switchValue, setSwitchValue] = useState(0)
    const renderCallback = useSwitchTransition(switchValue, 300, "out-in")
    const [list, setList] = useState([
        {
            name: "张二麻子",
            age: 38
        },
        {
            name: "林麻捷子",
            age: 38
        }
    ])
    const renderList = useListTransition(list, 300)
    function handleListDel(item: any) {
        const newList = list.slice()
        const index = newList.findIndex(l => l.name === item.name)
        if (~index) {
            newList.splice(index, 1)
            setList(newList)
        }
    }
    function handleListAdd() {
        const userName = prompt("请输入人员姓名")
        if (userName) {
            const userAge = prompt("请输入人员年龄")
            if (userAge) {
                const user = {
                    name: userName,
                    age: Number(userAge)
                }
                setList(prevList => prevList.concat(user))
            }
        }
    }
    return (
        <div>
            <section>
                <h3>useTransition使用</h3>
                <button onClick={() => SetOn(!on)}>切换</button>
                {
                    shouldMount && (
                        <div style={{
                            transition: '0.5s',
                            opacity: stage === "enter" ? 1 : 0,
                            backgroundColor: "skyblue"
                        }}>
                            过渡
                        </div>
                    )
                }
            </section>
            <section>
                <h3>Transition使用</h3>
                <button onClick={() => SetOn(!on)}>切换</button>
                {/* @ts-ignore */}
                <Transition state={on} timeout={300}>
                    {
                        (stage, shouldMount) => (
                            <div>
                                {shouldMount && <div style={{
                                    opacity: stage === "enter" ? 1 : 0,
                                    transition: '0.3s',
                                    backgroundColor: "skyblue"
                                }}>过渡</div>}
                            </div>
                        )
                    }
                </Transition>
            </section>
            <section>
                <h3>useTransition使用</h3>
                <button onClick={() => setSwitchValue(switchValue + 1)}>开始动画</button>
                {
                    renderCallback((state, stage) => {
                        const transitionStyle = {
                            from: {
                                transform: "translateX(-100px)"
                            },
                            enter: {
                                transform: "translateX(0px)"
                            },
                            leave: {
                                transform: "translateX(100px)"
                            }
                        }
                        return (
                            <div>
                                当前值是: {state}
                                <div style={{
                                    transition: "0.3s",
                                    opacity: stage === "enter" ? 1 : 0,
                                    ...transitionStyle[stage]
                                }}>过渡</div>
                            </div>
                        )
                    })
                }
            </section>
            <section>
                <h3>SwitchTransition使用</h3>
                <button onClick={() => setSwitchValue(switchValue + 1)}>开始动画</button>
                {/* @ts-ignore */}
                <SwitchTransition state={switchValue} timeout={300} mode="out-in">
                    {
                        (state, stage) => {
                            return (
                                <div>
                                    当前值为: { state }
                                    <div style={{
                                        opacity: stage === "enter" ? 1 : 0,
                                        transition: "0.3s",
                                        transform: {
                                            from: "translateX(-100px)",
                                            enter: "translateX(0px)",
                                            leave: "translateX(100px)"
                                        }[stage]
                                    }}>
                                        过渡
                                    </div>
                                </div>
                            )
                        }
                    }
                </SwitchTransition>
            </section>
            <section>
                <h3>useListTransition使用</h3>
                <button onClick={() => handleListAdd()}>添加人员</button>
                <ul className="list-none box-border">
                    {
                        renderList((item, stage) => {
                            return (
                                <li className="list-none box-border" key={item.name} style={{
                                    transition: "0.3s",
                                    opacity: stage === "enter" ? 1 : 0,
                                    transform: {
                                        from: "translateX(-100px)",
                                        enter: "translateX(0px)",
                                        leave: "translateX(100px)"
                                    }[stage]
                                }}>
                                    姓名：{ item.name }
                                    年龄：{ item.age }
                                    <button onClick={() => handleListDel(item)}>删除</button>
                                </li>
                            )
                        })
                    }
                </ul>
            </section>
            <section>
                <h3>ListTransition使用</h3>
                <button onClick={() => handleListAdd()}>添加人员</button>
                <ul className="list-none">
                    {/* @ts-ignore */}
                    <ListTransition list={list} timeout={300}> 
                        {
                            (item, stage) => (
                                <li className="list-none" key={item.name} style={{
                                    transition: "0.3s",
                                    opacity: stage === "enter" ? 1 : 0,
                                    transform: {
                                        from: "translateX(-100px)",
                                        enter: "translateX(0px)",
                                        leave: "translateX(100px)"
                                    }[stage]
                                }}>
                                    姓名：{item.name}
                                    年龄：{item.age}
                                    <button onClick={() => handleListDel(item)}>删除</button>
                                </li>
                            )
                        }
                    </ListTransition>
                </ul>
            </section>
        </div>
    )
}