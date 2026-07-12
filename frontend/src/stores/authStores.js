import { makeAutoObservable, runInAction } from 'mobx';

import {
  getCurrentUser, loginUser, logoutUser, registerUser
} from '../api/authApi';


class AuthStore {
  user = null;
  loading = false;
  error = null;
  formErrors = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isAuthenticated() {
    return Boolean(this.user?.is_authenticated);
  }

  get username() {
    return this.user?.username || '';
  }

  async loadCurrentUser() {
    this.loading = true;
    this.error = '';

    try {
      const data = await getCurrentUser();

      runInAction(() => {
        this.user = data.is_authenticated ? data : null;
      });
    } catch(e) {
      runInAction(() => {
        this.user = null;
        this.error = e.message;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }


  async login(payload) {
    this.loading = true;
    this.error = null;
    this.formErrors = null;

    try {
      const user = await loginUser(payload);

      runInAction(() => {
        this.user = user;
      });

      return true;
    } catch(e) {
      runInAction(() => {
        this.formErrors = e.data;
        this.error = e.message;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }


  async register(payload) {
    this.loading = true;
    this.error = null;
    this.formErrors = null;

    try {
      const user = await registerUser(payload);

      runInAction(() => {
        this.user = user;
      });

      return true;
    } catch(e) {
      runInAction(() => {
        this.formErrors = e.data;
        this.error = e.message;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }


  async logout() {
    this.loading = true;
    this.error = null;
    this.formErrors = null;

    try {
      await logoutUser();

      runInAction(() => {
        this.user = null;
      });
    } catch(e) {
      runInAction(() => {
        this.error = e.message;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }


  cleanFormErrors() {
    this.formErrors = null;
    this.error = null;
  }
}

export const authStore = new AuthStore();
