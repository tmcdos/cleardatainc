import {
  GET_TOKEN,
  SET_TOKEN,
  GET_USER,
  SET_USER
} from '../names';

const emptyUser = {
  id: 0,
  fullName: '',
  email: '',
};

export default
{
  state()
  {
    return {
      token: null,
      userData: Object.assign({}, emptyUser),
    };
  },
  getters:
    {
      [GET_TOKEN](state)
      {
        return state.token;
      },
      [GET_USER](state)
      {
        return state.userData;
      },
    },
  mutations:
    {
      [SET_TOKEN](state, token)
      {
        state.token = token
          ? {
              ...token,
              expiration: new Date(Date.now() + token.expires_in * 1000)
            }
          : null;
        if (!token)
        {
          state.userData = Object.assign({}, emptyUser);
        }
      },
      [SET_USER](state, user)
      {
        state.userData = Object.assign({}, emptyUser, user);
      },
    },
};
