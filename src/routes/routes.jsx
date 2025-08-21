import {Navigate} from "react-router-dom";

import {paths} from '../consts';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';

export const publicRoutes = [
  {path: paths.LOGIN, element: <Login />, title: "Авторизация"},
  {path: paths.REGISTER, element: <Register />, title: "Регистрация"},
  {path: "/*", element: <Navigate to={paths.LOGIN} />, title: "Переадресация"}
]

export const privateRoutes = [
  {path: paths.DASHBOARD, element: <Dashboard />, title: "Записи клиентов"},
  {path: "/*", element: <Navigate to={paths.DASHBOARD} />, title: "Переадресация"}
]
