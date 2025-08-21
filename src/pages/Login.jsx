import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores';

const Login = observer(() => {
  const { userStore } = useStore();

  return (
    <div>
      <h1>Страница входа</h1>
      <button onClick={() => userStore.setIsAuth(true)}>Войти</button>
    </div>
  );
});

export default Login;