import { createRouter, createWebHistory } from 'vue-router';

import CoachDetail from './pages/coaches/CoachDetail.vue';
import CoachesList from './pages/coaches/CoachesList.vue';
import CoachRegistation from './pages/coaches/CoachRegistration.vue';
import ContactCoach from './pages/requests/ContactCoach.vue';
import RequestsReceived from './pages/requests/RequestsReceived.vue';
import NotFound from './pages/NotFound.vue';
import UserAuth from './pages/Auth/UserAuth.vue';
import store from './store/index';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/coaches' },
    { path: '/coaches', component: CoachesList },
    {
      path: '/coaches/:id',
      component: CoachDetail,
      props: true,
      children: [
        { path: 'contact', component: ContactCoach }, // /coaches/c1/contact
      ],
    },
    {
      path: '/register',
      component: CoachRegistation,
      meta: { requierAuth: true },
    },
    {
      path: '/requests',
      component: RequestsReceived,
      meta: { requierAuth: true },
    },
    { path: '/auth', component: UserAuth, meta: { requierUnauth: true } },
    { path: '/:notFound(.*)', component: NotFound },
  ],
});

router.beforeEach(function (to, from, next) {
  if (to.meta.requierAuth && !store.getters.isAuth) {
    next('/auth');
  } else if (to.meta.requierUnauth && store.getters.isAuth) {
    next('/coaches');
  } else {
    next();
  }
});

export default router;
