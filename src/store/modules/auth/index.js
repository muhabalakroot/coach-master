import axios from 'axios';

// eslint-disable-next-line no-unused-vars
let timer;

const AuthModule = {
  state() {
    return {
      userId: null,
      idToken: null,
      didAutoLogout: false,
    };
  },
  mutations: {
    setData(state, payload) {
      state.userId = payload.localId;
      state.idToken = payload.idToken;
    },
    didAutoLogout(state) {
      state.didAutoLogout = true;
    },
  },
  actions: {
    async login(context, payload) {
      return context.dispatch('auth', {
        ...payload,
        mode: 'login',
      });
    },
    async signup(context, payload) {
      return context.dispatch('auth', {
        ...payload,
        mode: 'signup',
      });
    },
    async auth(context, payload) {
      try {
        var url = null;
        if (payload.mode === 'login') {
          url =
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAmEMYPgHDkqAno7Ucop8m8De0gmqMNBZY';
        } else if (payload.mode === 'signup') {
          url =
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAmEMYPgHDkqAno7Ucop8m8De0gmqMNBZY';
        }

        const res = await axios.post(url, {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        });

        const expiresIn = +res.data.expiresIn * 1000;
        const expirationDate = new Date().getTime() + expiresIn;

        localStorage.setItem('token', res.data.idToken);
        localStorage.setItem('localId', res.data.localId);
        localStorage.setItem('expiresIn', expirationDate);

        timer = setTimeout(function () {
          context.dispatch('autoLogout');
        }, expiresIn);

        context.commit('setData', {
          idToken: res.data.idToken,
          localId: res.data.localId,
        });
      } catch (err) {
        console.log(err);
      }
    },
    tryLogin(context) {
      const token = localStorage.getItem('token');
      const localId = localStorage.getItem('localId');
      const expireDate = localStorage.getItem('expiresIn');

      const expiresIn = +expireDate - new Date().getTime();

      if (expiresIn < 0) {
        return;
      }

      timer = setTimeout(function () {
        context.dispatch('autoLogout');
      }, expiresIn);

      context.commit('setData', {
        idToken: token,
        localId: localId,
      });
    },
    logout(context) {
      localStorage.removeItem('token');
      localStorage.removeItem('localId');
      localStorage.removeItem('expiresIn');

      clearTimeout(timer);

      context.commit('setData', {
        idToken: null,
        localId: null,
      });
    },
    autoLogout(context) {
      context.dispatch('logout');
      context.commit('didAutoLogout');
    },
  },
  getters: {
    userId(state) {
      return state.userId;
    },
    getToken(state) {
      return state.idToken;
    },
    isAuth(state) {
      return !!state.idToken;
    },
    getDidAutoLogout(state) {
      return state.didAutoLogout;
    },
  },
};

export default AuthModule;
