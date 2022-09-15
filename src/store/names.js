/*
We use constants in Vuex for several reasons:
1. Preventing duplicate names
2. Preventing usage/calling of getter/mutation/action with non-existent name
3. Getting advantage of IDE code-completion and usage of constants (i.e. to spot unused names)
*/

// getters
export const GET_TOKEN = 'GET_TOKEN';
export const GET_USER = 'GET_USER';

// mutations
export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER = 'SET_USER';
