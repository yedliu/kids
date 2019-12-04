import homework from './homework';
import preview from './preview';
import report from './report';
import docs from './docs';
import stageEvaluation from './stage-evaluation';


export default [
  {
    path: '/',
    component: () => import('components/router-view.vue'),
    children: [
      {
        path: '',
        redirect: {name: 'homework'}
      },
      homework,
      preview,
      report,
      docs,
      stageEvaluation
    ]
  }
];
