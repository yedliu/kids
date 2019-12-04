const baseUrl = '/kids/lessons/';
export default [
  {
    name: 'detail',
    method: 'GET',
    desc: '课件详情',
    path: `${baseUrl}courseware/pad/findCwContent`,
    mock: false,
  },
  {
    name: 'info',
    method: 'GET',
    desc: '用户基本信息',
    path: `finishedCourse/small/report/evaluation`,
    mock: false,
  }
];
