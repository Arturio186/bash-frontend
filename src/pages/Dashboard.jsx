import React from 'react'
import {observer} from 'mobx-react-lite';
import {useStore} from '../stores';


const Dashboard = observer(() => {
  const { userStore } = useStore();
  
  return (
    <div>
      <h1>Главная</h1>
      <button onClick={() => userStore.setIsAuth(false)}>Выйти</button>
    </div>
  )
})

export default Dashboard;