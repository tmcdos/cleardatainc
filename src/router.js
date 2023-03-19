import Vue from 'vue';
import Router from 'vue-router';

import LoginPage from './views/LoginPage';
import badRoute from './views/BadRoute';
import HomePage from './views/HomePage';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
      meta:
        {
          title: 'Home'
        }
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage,
      meta:
        {
          title: 'Login'
        }
    },

    {
      path: '*', // should be last, otherwise matches everything
      component: badRoute,
      meta:
        {
          title: 'NOT FOUND',
          public: true
        }
    }
  ],
});

// https://stackoverflow.com/a/63263736 - ignore NavigationDuplicated errors but keep other errors
const originalPush = router.push;
router.push = function push(location, onResolve, onReject)
{
  if (onResolve || onReject)
  {
    return originalPush.call(this, location, onResolve, onReject);
  }

  return originalPush.call(this, location).catch((err) =>
  {
    if (err && err.name === 'NavigationDuplicated')
    {
      return err;
    }

    return Promise.reject(err);
  });
};

router.afterEach(to =>
{
  const title = typeof to.meta.title === 'function' ? to.meta.title(to) : to.meta.title;
  document.title = title || 'ClearDataInc';
});

router.beforeEach((to, from, next) =>
{
  if (to.meta.public || Vue.prototype.$msal.isAuthenticated() || to.name === 'Login') next();
  else next({ name: 'Login' });
});

export default router;
