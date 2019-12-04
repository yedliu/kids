export default {
  path: 'preview',
  component: () => import('components/router-view.vue'),
  children: [
    {
      path: 'single',
      component: () => import('views/preview/single.vue'),
      props: true
    },
    {
      path: 'multiple',
      component: () => import('views/preview/multiple.vue'),
      props: true
    }
  ]
};
