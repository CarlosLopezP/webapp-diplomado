import React from "react"
import './index.css'
import ReactDOM from "react-dom/client"
import App from "./App"
import Login from "./pages/login/login"
import Listadanhos from "./pages/lista-danhos/Lista-danhos"
import Listaimagenes from "./pages/lista-imagenes/Lista-imagen"
import NoFound from "./pages/404/nofound"
import{
  createBrowserRouter,
  Route,
  RouterProvider
} from "react-router-dom";

 const router = createBrowserRouter([
  { path: "/", element: <Login />},
  { path: "/lista-danhos", element: <Listadanhos />},
  { path: "/lista-imagenes/:id", element: <Listaimagenes />},
  { path: "*", element: <NoFound />},
 ]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <Route/>
    </RouterProvider>
  </React.StrictMode>,
)