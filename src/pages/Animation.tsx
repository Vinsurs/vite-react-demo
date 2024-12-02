import { CSSProperties, Fragment, useState, useId, useDeferredValue, useTransition, startTransition } from "react";
import { Transition, SwitchTransition, CSSTransition, TransitionStatus, TransitionGroup } from 'react-transition-group'

export default function Animation() {
    const id = useId()
    const [inputValue, setInputValue] = useState<string>("")
    const deferredInputValue = useDeferredValue(inputValue)


    const duration = 300
    const [state, setState] = useState(false)
    const [inProp, setInProp] = useState<boolean>(false)
    const [list, setList] = useState<string[]>(["hello", "world", "click", "me"])
    const defaultStyle: CSSProperties = {
        opacity: 0,
        transition: `opacity ${duration}ms ease-in-out`
    }
    const transitionStyle: {[prop in TransitionStatus]?: CSSProperties} = {
        entering: { opacity: 1 },
        entered: { opacity: 1 }
    }
    function handleAddList() {
        setList(prev => ([
            ...prev,
            prompt("input a message") as string
        ]))
    }
    function handleRemoveList(index: number) {
        const newList = list.slice()
        newList.splice(index, 1)
        setList(newList)
    }
    return (
        <Fragment>
            <h1>{id}</h1>
            <div>
                <ul className="list-none">
                    <li className="list-none">
                        inputValue: {inputValue}
                    </li>
                    <li className="list-none">
                        deferredInputValue: {deferredInputValue}
                    </li>
                </ul>
                <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} />
            </div>
            <div>SwitchTransition&amp;CSSTransition</div>
            <SwitchTransition mode="out-in">
                <CSSTransition key={state ? "Goodbye, world!" : "Hello, world!"}
                    addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
                    classNames='page' 
                >
                <button onClick={() => setState(state => !state)}>
                    {state ? "Goodbye, world!" : "Hello, world!"}
                </button>
                </CSSTransition>
            </SwitchTransition>
            <div>Transition</div>
            <button onClick={() => setInProp(prev => !prev)}>过渡</button>
            <Transition in={inProp} timeout={duration} addEndListener={(node,done) => node.addEventListener("transitionend", done, false)}>
                {
                    state => (
                        <div style={{
                            ...defaultStyle,
                            ...transitionStyle[state]
                        }}>I'm A fade Transition!</div>
                    )
                }
            </Transition>
            <div>TransitionGroup</div>
            <button onClick={handleAddList}>Add</button>
            <ul className="list-none">
                <TransitionGroup>
                    {
                        list.map((item, index) => (
                            <CSSTransition key={item} classNames="page" addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}>
                                <li className="list-none bg-blue-500">
                                    {item}
                                    <button onClick={() => handleRemoveList(index)}>remove</button>
                                </li>
                            </CSSTransition>
                        ))
                    }
                </TransitionGroup>
            </ul>
        </Fragment>
    )
}