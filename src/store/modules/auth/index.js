import axios from 'axios';

const AuthModule = {
  state() {
    return {
      userId: null,
      expiresIn: null,
      idToken: null,
    };
  },
  mutations: {
    setData(state, payload) {
      state.userId = payload.localId;
      state.idToken = payload.idToken;
      state.expiresIn = payload.expiresIn;
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

        localStorage.setItem('token', res.data.idToken);
        localStorage.setItem('localId', res.data.localId);

        context.commit('setData', {
          idToken: res.data.idToken,
          expiresIn: res.data.expiresIn,
          localId: res.data.localId,
        });
      } catch (err) {
        console.log(err);
      }
    },
    tryLogin(context) {
      const token = localStorage.getItem('token');
      const localId = localStorage.getItem('localId');

      context.commit('setData', {
        idToken: token,
        expiresIn: null,
        localId: localId,
      });
    },
    logout(context) {
      context.commit('setData', {
        idToken: null,
        expiresIn: null,
        localId: null,
      });
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
  },
};

export default AuthModule;
