import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Home from '@/components/Home';
import Dashboard from '@/components/Dashboard';
import PowerPlantManager from '@/components/PowerPlantManager';

import AuthService from '@/services/AuthService';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'App',
      component: Home,
      redirect: '/home/',
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/home/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
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

router.beforeEach((to, from, next) => {
  AuthService.verifyRouteAccess(to, from, next);
});

export default router;
