export default {
  path: 'docs',
  component: () => import('components/router-view.vue'),
  children: [
    {
      path: 'tips-for-remedial-classes',
      name: '补课须知',                                       // 智能录播课补课须知
      component: () => import('views/docs/tips-for-remedial-classes.vue'),
      props: true
    }
  ]
};
