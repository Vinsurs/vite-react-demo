import { Fragment, useEffect } from 'react'
import { Routes, Route, useRoutes } from 'react-router-dom'
import { request } from './utils/request'
import { WithBroadCastChannel } from "./context/broadcastchannel"
import { routes } from './routes'
import './App.css'


function App() {
  const routesTree = useRoutes(routes)
  useEffect(() => {
    request("https://jsonplaceholder.typicode.com/todos", {
      method: 'GET'
    })
  }, [])
  return (
    <Fragment>
      <Routes location={{ pathname: '/all-show' }}>
        <Route path='/all-show' element={<div>这里的内容是常显的</div>}></Route>
      </Routes>
      <WithBroadCastChannel>
        { routesTree }
      </WithBroadCastChannel>
    </Fragment>
  )
}

export default App
