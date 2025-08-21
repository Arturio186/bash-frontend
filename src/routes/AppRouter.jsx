import React from 'react';
import { observer } from 'mobx-react-lite';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { publicRoutes, privateRoutes } from './routes';
import { useStore } from '../stores';

const AppRouter = observer(() => {
  const { userStore } = useStore();

  return <RouterProvider router={createBrowserRouter(userStore.isAuth ? privateRoutes : publicRoutes)} />;
});

export default AppRouter;