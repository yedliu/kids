export default {
  path: 'stage-evaluation',
  component: () => import('components/router-view.vue'),
  children: [
    {
      path: 'test',
      name: '阶段测评测试',
      component: () => import('views/stage-evaluation/index.vue'),
      props: true
    },
    {
      path: 'report',
      name: '阶段测评报告',
      component: () => import('views/stage-evaluation/report.vue'),
      props: true
    },
    {
      path: 'list',
      name: '阶段测评列表',
      component: () => import('views/stage-evaluation/list.vue'),
      props: true
    },
  ]
};
