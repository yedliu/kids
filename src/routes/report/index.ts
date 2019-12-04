export default {
  path: 'report',
  component: () => import('views/report/index.vue'),
  name: 'report',
  children: [
    {
      path: 'evaluation',
      // name: '小班课测评课报告',
      component: () => import('views/report/evaluation/one-to-more.vue'),
      props: true
    },
    {
      path: 'evaluation/1v1',
      // name: '1对1测评课报告',
      component: () => import('views/report/evaluation/one-to-one.vue'),
      props: true
    },
    {
      path: 'formal',
      // name: '正式课报告',
      component: () => import('views/report/formal/one-to-more.vue'),
      props: true
    },
    {
      path: 'evaluation/smallClass',
      // name: '新版小班课测评课报告',
      component: () => import('views/report/evaluation/one-to-more-new.vue'),
      props: true
    },
    {
      path: 'formal/smallClass',
      // name: '新版小班课正式课报告',
      component: () => import('views/report/formal/one-to-more-new.vue'),
      props: true
    }
  ]
};
