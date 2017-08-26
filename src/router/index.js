import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import ForgotPassword from '@/components/ForgotPassword';
import Register from '@/components/Register';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'App',
      component: Login,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/forgot',
      name: 'Forgot Password',
      component: ForgotPassword,
    },
    {
      path: '/register',
      name: 'Create a new account',
      component: Register,
    },
  ],
});
