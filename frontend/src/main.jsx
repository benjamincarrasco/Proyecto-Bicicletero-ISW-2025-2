"use strict";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from '@pages/Root'
import Home from '@pages/Home'
import Login from '@pages/Login'
import Register from '@pages/Register'
import Error404 from '@pages/Error404'
import Users from '@pages/Users'
import Profile from '@pages/Profile'
import ProtectedRoute from '@components/ProtectedRoute'
import Bicicletas from '@pages/Bicicletas';
import BicicletasGuardia from '@pages/BicicletasGuardia';
import Parking from '@pages/Parking';
import Reservas from '@pages/Reservas2';
import RegistroEntradaSalida from '@pages/RegistroEntradaSalida';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/users",
        element: (
          <ProtectedRoute allowedRoles={["administrador"]}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/bicicletas",
        element: (
          <ProtectedRoute allowedRoles={["administrador"]}>
            <Bicicletas />
          </ProtectedRoute>
        ),
      },
      {
        path: "/buscar-bicicletas",
        element: (
          <ProtectedRoute allowedRoles={["guardia"]}>
            <BicicletasGuardia />
          </ProtectedRoute>
        ),
      },
      {
        path: "/parking",
        element: (
          <ProtectedRoute allowedRoles={["administrador"]}>
            <Parking />
          </ProtectedRoute>
        ),
      },
      {
        path: "/reservas",
        element: <Reservas />,
      },
      {
        path: "/registro-entrada-salida",
        element: (
          <ProtectedRoute allowedRoles={["administrador", "guardia"]}>
            <RegistroEntradaSalida />
          </ProtectedRoute>
        ),
      },
    ],
  
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);
  
  ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
  );