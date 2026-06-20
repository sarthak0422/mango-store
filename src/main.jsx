import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { useAppStore } from './store/useAppStore'

// Kick off the global Firebase Auth state listener instantly on application boot
useAppStore.getState().initAuthListener();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)