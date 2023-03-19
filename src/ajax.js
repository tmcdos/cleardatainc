import axios from 'axios';
import AxiosIsCancel from 'axios/lib/cancel/isCancel';
import router from './router';
import store from './store';
import { GET_TOKEN } from '@/store/names';
import events, { SHOW_SPINNER, HIDE_SPINNER, SNACKBAR_FAILURE, BACKEND_ERROR } from './events';

const BASE_URL = process.env.NODE_ENV === 'development' ? '/api' : process.env.VUE_APP_API_URL + '/api';

const ajax = axios.create({
  baseURL: BASE_URL,
  timeout: 30 * 1000, // 30 seconds before we cancel the AJAX call
  headers: {
    'Content-Type': 'application/json'
  },
});

// we broadcast the error so that an error popup will be shown
function checkError(err)
{
  if (err.response && (err.response.status === 500 || err.response.headers['content-type'].startsWith('text/html')))
  {
    if (err.response.data) events.$emit(BACKEND_ERROR, err.response.data);
    else if (err.response && err.response.status === 404)
    {
      events.$emit(SNACKBAR_FAILURE, 'API endpoint was not found');
    }
    else events.$emit(SNACKBAR_FAILURE, err.message || err);
  }
  else if (err.response && err.response.status === 404)
  {
    events.$emit(SNACKBAR_FAILURE, 'API endpoint was not found');
  }
  else if (err.response && err.response.data)
  {
    events.$emit(SNACKBAR_FAILURE, (err.response.data.error || {}).message || err.response.data.error || (typeof err.response.data === 'string' ? err.response.data : err.message), err.response.data.error);
  }
  else
  {
    events.$emit(SNACKBAR_FAILURE, err.message || err);
  }
}

function requestInterceptorSuccess(config)
{
  const token = store.getters[GET_TOKEN];
  if (token)
  {
    config.headers.Authorization = `Bearer ${typeof token === 'string' ? token : token.accessToken}`;
  }
  if (config.spinner && typeof config.spinner === 'function') config.spinner(true);
  else events.$emit(SHOW_SPINNER);
  return config;
}

function requestInterceptorFailure(error)
{
  if (AxiosIsCancel(error))
  {
    if (error.message && typeof error.message.spinner === 'function') error.message.spinner(false);
    else events.$emit(HIDE_SPINNER);
    return;
  }
  if (error.config && error.config.spinner && typeof error.config.spinner === 'function') error.config.spinner(false);
  else events.$emit(HIDE_SPINNER);
  // we return NULL in case of error
  checkError(error);
  if (error.status === 401)
  {
    router.push({ name: 'Login' });
  }
}

// we show the global spinner just before the AJAX request is started
ajax.interceptors.request.use(requestInterceptorSuccess, requestInterceptorFailure);

function responseInterceptorSuccess(response)
{
  if (response.config && response.config.spinner && typeof response.config.spinner === 'function') response.config.spinner(false);
  else events.$emit(HIDE_SPINNER);
  if (response.headers['content-type'].startsWith('application/json'))
  {
    if ('error' in response.data)
    {
      events.$emit(SNACKBAR_FAILURE, response.data.error.message || response.data.error);
      return undefined;
    }
    else return response.data;
  }
  else if (response.headers['content-disposition'])
  {
    const filename = response.headers['content-disposition'].split(';')[1].split('=')[1];
    return {
      data: response.data,
      filename: filename.substring(1, filename.length - 1),
    };
  }
  else
  {
    if (response.data instanceof Blob)
    {
      response.data.text().then(txt =>
      {
        events.$emit(BACKEND_ERROR, txt);
      });
    }
    else events.$emit(BACKEND_ERROR, response.data);
  }
}

function responseInterceptorFailure(error)
{
  if (AxiosIsCancel(error))
  {
    if (error.message && typeof error.message.spinner === 'function') error.message.spinner(false);
    else events.$emit(HIDE_SPINNER);
    return;
  }
  if (error.config && error.config.spinner && typeof error.config.spinner === 'function') error.config.spinner(false);
  else events.$emit(HIDE_SPINNER);
  if (error.config && error.response && error.response.status === 401)
  {
    // token has expired
    //store.commit(SET_TOKEN, null);
    router.push({ name: 'Login' }).catch(() => true);
  }
  else
  {
    if (/^timeout /.test(error.message)) events.$emit(SNACKBAR_FAILURE, error.message);
    else if (error.response && error.response.status === 400 && error.response.data && error.response.data.error)
    {
      if (error.config && error.config.catcher)
      {
        const err = new Error();
        err.ajax = error.response.data.error;
        throw err;
      }
      else checkError(error);
    }
    else checkError(error);
  }
  return undefined;
}

// we hide the global spinner as soon as we get an error or all of the data
ajax.interceptors.response.use(responseInterceptorSuccess, responseInterceptorFailure);

export default ajax;
