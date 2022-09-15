import Vuex from 'vuex';
import Vue from 'vue';
import createPersistedState from 'vuex-persistedstate';
import auth from './auth';

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins:
    [
      createPersistedState(
        {
          key: 'cleardatainc',
          paths: ['auth']
        }
      )
    ],
  strict: process.env.NODE_ENV !== 'production',
  modules:
    {
      auth,
    },
});

export default store;
