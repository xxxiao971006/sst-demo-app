import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './index.css'

import { KindeProvider } from '@kinde-oss/kinde-auth-react'

import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KindeProvider
        audience={import.meta.env.VITE_APP_KINDE_AUDIENCE}
        clientId="458b2bf883834ad59bc60b5d8394cbde"
        domain="https://expensetrackerxiao.kinde.com"
        logoutUri={window.location.origin}
        redirectUri={window.location.origin}
    >
      {/* <App /> */}
      <RouterProvider router={router} />
    </KindeProvider>
  </React.StrictMode>,
)
