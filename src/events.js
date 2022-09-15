import Vue from 'vue';

// event bus
export default new Vue();

// events
export const SNACKBAR_SUCCESS = 'SNACKBAR_SUCCESS'; // show the toast/snackbar alert message box
export const SNACKBAR_FAILURE = 'SNACKBAR_FAILURE';
export const SHOW_SPINNER = 'SHOW_SPINNER';
export const HIDE_SPINNER = 'HIDE_SPINNER';
export const BACKEND_ERROR = 'BACKEND_ERROR';
