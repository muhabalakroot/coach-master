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
    async signup(context, payload) {
      try {
        const res = await axios.post(
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAmEMYPgHDkqAno7Ucop8m8De0gmqMNBZY',
          {
            email: payload.email,
            password: payload.password,
          }
        );
        console.log(res.data);
        context.commite('setData', {
          idToken: res.data.idToken,
          expiresIn: res.data.expiresIn,
          localId: res.data.localId,
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
  getters: {
    userId(state) {
      return state.userId;
    },
  },
};

export default AuthModule;
