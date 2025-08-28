import React from 'react';
import UserStore from './UserStore';

export const StoreContext = React.createContext({
  user: UserStore
});

export const useStore = () => React.useContext(StoreContext);