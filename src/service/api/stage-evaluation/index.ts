const baseUrl = '/kids/evaluation/v1.0.0/stage/';
const mock = false;
// baseUrl = mock ? mockUrl + baseUrl : baseUrl;
const id = 14;
export default [
  {
    name: 'begin',
    method: 'GET',
    desc: '开始考试',
    path: `${baseUrl}beginExamInfo`,
    mock: false,
    id,
  },
  {
    name: 'content',
    method: 'POST',
    desc: '获取试题',
    path: `${baseUrl}prepareExamInfo`,
    mock: false,
    id,
  },
  {
    name: 'report',
    method: 'POST',
    desc: '获取考试报告',
    path: `${baseUrl}getExamInfoReport`,
    mock: false,
    id,
  },
  {
    name: 'magic',
    method: 'GET',
    desc: '获取积分(魔力果)策略',
    path: `${baseUrl}getMagicPowerFruit`,
    mock,
    id,
  },
  {
    name: 'list',
    method: 'POST',
    desc: '查询学生考试列表',
    path: `${baseUrl}queryStuExamInfoList`,
    mock: false,
    id,
  },
  {
    name: 'submit',
    method: 'POST',
    desc: '提交阶段测评',
    path: `${baseUrl}submitExamInfo`,
    mock,
    id,
  },
];
