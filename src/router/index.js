import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Home from '@/components/Home';
import Dashboard from '@/components/Dashboard';
import PowerPlantManager from '@/components/PowerPlantManager';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'App',
      component: Home,
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Home,
      children: [
        {
          path: '',
          component: Dashboard,
        },
        {
          path: 'power-plant-manager',
          component: PowerPlantManager,
        },
      ],
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
