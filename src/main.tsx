import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { LayoutProvider } from '@hooks/useLayout'

import App from './App'
import './styles/globals.css'
import { store } from './store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <LayoutProvider>
          <App />
        </LayoutProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
