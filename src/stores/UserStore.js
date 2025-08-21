import {observable, action, makeObservable} from 'mobx';

class UserStore {
  isAuth = false;

  constructor() {
    makeObservable(this, {
      isAuth: observable,
      setIsAuth: action
    })
  }

  setIsAuth = (isAuth) => {
    this.isAuth = isAuth;
  }
}

export default new UserStore();