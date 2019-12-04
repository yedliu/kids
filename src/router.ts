import Vue from 'vue';
import Router from 'vue-router';
import Homework from './views/Homework.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/homework',
      name: 'homework',
      component: Homework,
    }
  ],
});
