import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { GoogleAuthProvider } from '@components/auth/GoogleAuthProvider'
import { LayoutProvider } from '@hooks/useLayout'

import App from './App'
import './styles/globals.css'
import { store } from './store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleAuthProvider>
        <BrowserRouter>
          <LayoutProvider>
            <App />
          </LayoutProvider>
        </BrowserRouter>
      </GoogleAuthProvider>
    </Provider>
  </StrictMode>,
)
