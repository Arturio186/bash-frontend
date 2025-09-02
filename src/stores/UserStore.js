import axios from 'axios';
import { observable, action, makeObservable } from 'mobx';
import { backendUrl } from '../consts';

class UserStore {
  isAuth = false;
  token = null;

  constructor() {
    makeObservable(this, {
      isAuth: observable,
      token: observable,
      setIsAuth: action,
      setToken: action
    });

    const savedToken = localStorage.getItem('token');

    if (savedToken) {
      this.token = savedToken;
      this.isAuth = true;
    }
  }

  setIsAuth = (isAuth) => {
    this.isAuth = isAuth;
  }

  setToken = (token) => {
    this.token = token;
  }

  login = async ({ username, password }) => {
    try {
      const response = await axios.post(`${backendUrl}/users/login`, { username, password });
      const token = response.data.token;

      localStorage.setItem('token', token);
      this.setToken(token);
      this.setIsAuth(true);

    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }

  register = async ({ username, password }) => {
    try {
      const response = await axios.post(`${backendUrl}/users/register`, { username, password });
      const token = response.data.token;

      localStorage.setItem('token', token);
      this.setToken(token);
      this.setIsAuth(true);

    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }

  logout = () => {
    localStorage.removeItem('token');
    this.setToken(null);
    this.setIsAuth(false);
  }

  getApplications = async(date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0];

      const response = await axios.get(
        `${backendUrl}/applications/getByDate/${formattedDate}`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }
      );

      return [response.data.hours, response.data.applications];
    } catch (err) {
      if (err.response?.status === 401) {
        this.logout();

        alert('Вы не авторизованы')

        return;
      } else if (err.response?.status === 403) {
        this.logout();

        alert('Ваш аккаунт не активирован');

        return;
      }

      console.log(err)

      alert(err.response?.data?.message || err.message)
    }
  }

  deleteApplication = async(id) => {
    try {
      await axios.delete(`${backendUrl}/applications/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      })
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }
}

export default new UserStore();
