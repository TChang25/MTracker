import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './Root.tsx';
import Dashboard from './Dashboard.tsx';
import Login from './Login.tsx';
import Register from './Register.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "Login",
        element: <Login />,
      },
      {
        path: "Register",
        element: <Register/>,
      },
      {
        path: "Dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <RouterProvider router={router} />
  </StrictMode>,
)
