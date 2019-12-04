const baseUrl = '/kidsPadApi/pad/homework/smallclass/';
const energyUrl = '/kidsStuApi/partner/api/';
const id: number = 13;          // mock 平台id
export default [
  {
    name: 'list',
    method: 'GET',
    desc: '作业题目列表',
    path: `${baseUrl}preStuAnswer`,
    mock: false,
    id
  },
  {
    name: 'info',
    method: 'GET',
    desc: '单个题目详情',
    path: `${baseUrl}queryByHomeworkId`,
    mock: false,
    id
  },
  {
    name: 'optional',
    method: 'POST',
    desc: '学生答题',
    path: `${baseUrl}stuAnswer`,
    mock: false,
    id
  },
  {
    name: 'energy',
    method: 'POST',
    desc: '学生答题增加魔力果',
    path: `${energyUrl}energy/operation/settle/submit/homework`,
    mock: false,
    id
  },
  {
    name: 'partner',
    method: 'GET',
    desc: '获取学伴信息',
    path: `${energyUrl}op/getPartnerInfo`,
    mock: false,
    id
  }
];
