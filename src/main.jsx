import React from "react"
import './index.css'
import ReactDOM from "react-dom/client"
import App from "./App"
import Login from "./pages/login/login"
import Listadanhos from "./pages/lista-danhos/Lista-danhos"
import{
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

 const router = createBrowserRouter([
  { path: "/", element: <Login />},
  { path: "/lista-danhos", element: <Listadanhos />},
 ]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)