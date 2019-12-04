export default {
  path: 'homework',
  component: () => import('components/router-view.vue'),
  children: [
    {
      path: '',
      name: 'homework',
      component: () => import('views/homework/index.vue'),
      props: true
    }
  ]
};
