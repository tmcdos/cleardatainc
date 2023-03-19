import Vue from 'vue';
import App from './App.vue';
import msal from './azure';
import router from './router.js';
import store from './store';
import ajax from './ajax';
import events, {
  SNACKBAR_SUCCESS,
  SNACKBAR_FAILURE,
  SHOW_SPINNER,
  HIDE_SPINNER
} from './events.js';
import vuetify from './vuetify.js';
import SNotify from 'vue-snotify';
import { version } from '../package.json';

Vue.use(msal, {
  auth:
    {
      clientId: process.env.VUE_APP_MSAD_CLIENT_ID,
      authority: process.env.VUE_APP_MSAD_AUTHORITY,
      redirectUri: process.env.VUE_APP_MSAD_REDIRECT_URI,
      postLogoutRedirectUri: process.env.VUE_APP_MSAD_POST_LOGOUT_URI,
      scopes: [process.env.VUE_APP_MSAD_SCOPE, 'profile', 'email', 'openid'],
    },
  cache:
    {
      cacheLocation: 'localStorage',
    },
  framework:
    {
      globalMixin: true,
    },
});
Vue.use(SNotify, {
  toast: {
    titleMaxLength: 30,
    bodyMaxLength: 250,
  },
});

if (process.env.NODE_ENV === 'development')
{
  Vue.config.errorHandler = (err, vm, info) =>
  {
    // err: error trace
    // vm: component in which error occurred
    // info: Vue specific error information such as lifecycle hooks, events etc.
    console.error(vm.$options._componentTag + ': ' + info, err);
    if (window.cleardatainc) window.cleardatainc.showFailed(vm.$options._componentTag + '\n' + info + '\n' + err.message + '\n' + err.stack);
  };

  window.onerror = function(message, source, lineno, colno, error)
  {
    alert('Error at ' + lineno + ':' + colno + ' in "' + source + '"\n' + message + '\n' + error);
  };
}

Vue.prototype.$axios = ajax;
Vue.config.productionTip = false;
Vue.config.performance = process.env.NODE_ENV !== 'production';
Vue.config.devtools = process.env.NODE_ENV !== 'production';

window.cleardatainc = new Vue({
  name: 'RootVue',
  data: {
    spin: 0,
  },
  computed:
    {
      appVersion() // eslint-disable-line vue/no-unused-properties
      {
        const buildTime = new Date(process.env.BUILD_TIME);
        return version.split('.').slice(0, 2).join('.') + ' (' + buildTime.toLocaleString('en', {
          year: 'numeric',
          day: 'numeric',
          month: 'short',
          hour: 'numeric',
          minute: 'numeric',
        }) + ')';
      },
      integrationTemplates() // eslint-disable-line vue/no-unused-properties
      {
        return [
          {
            value: 1,
            text: 'Employee Hours Detail'
          },
          {
            value: 2,
            text: 'Performance Detail'
          },
          {
            value: 3,
            text: 'RoyaltySummary'
          },
        ];
      },
    },
  created()
  {
    events.$on(SNACKBAR_SUCCESS, this.showSuccess);
    events.$on(SNACKBAR_FAILURE, this.showFailed);
    events.$on(SHOW_SPINNER, this.showSpinner);
    events.$on(HIDE_SPINNER, this.hideSpinner);
  },
  beforeDestroy()
  {
    events.$off(SNACKBAR_SUCCESS, this.showSuccess);
    events.$off(SNACKBAR_FAILURE, this.showFailed);
    events.$off(SHOW_SPINNER, this.showSpinner);
    events.$off(HIDE_SPINNER, this.hideSpinner);
  },
  methods:
  {
    showSpinner()
    {
      this.spin++;
    },
    hideSpinner()
    {
      if (this.spin > 0) this.spin--;
    },
    showFailed(msg, timeOut)
    {
      console.error(msg);
      this.$snotify.error(msg || '', 'ERROR', {
        timeout: typeof timeOut === 'number' ? timeOut : 3500,
        closeOnClick: true,
        bodyMaxLength: 150, // for some reason the default value has no effect !!!
      });
    },
    showSuccess(msg)
    {
      this.$snotify.success(msg, 'SUCCESS', {
        timeout: 2500,
      });
    },
  },
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
