import { createRoot } from 'react-dom/client';
import AppRouter from './routes/AppRouter';
import UserStore from './stores/UserStore';
import { StoreContext } from './stores';

createRoot(document.getElementById('root')).render(
  <StoreContext.Provider value={{ 
    userStore: UserStore 
  }}>
    <AppRouter />
  </StoreContext.Provider>
);
