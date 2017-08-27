import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'App',
      component: Dashboard,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      props: { mode: 'login' },
    },
    {
      path: '/forgot',
      name: 'Forgot Password',
      component: Login,
      props: { mode: 'forgot' },
    },
    {
      path: '/register',
      name: 'Create a new account',
      component: Login,
      props: { mode: 'register' },
    },
  ],
});
