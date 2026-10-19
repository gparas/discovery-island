import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import './global.css'
import { routes } from './routes/routes.tsx'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element')

const router = createBrowserRouter(routes)

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
