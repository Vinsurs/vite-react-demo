import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.tsx'
import 'virtual:windi.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Router><App /></Router>)
