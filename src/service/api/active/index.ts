const baseUrl = '/kids/evaluation/v1.0.0/teachers/day/';
const id = 14;
export default [
  {
    name: 'baseInfo',
    method: 'GET',
    desc: '基本信息',
    path: `${baseUrl}getStudentEntranceInfo`,
    mock: false,
    id,
  },
  {
    name: 'content',
    method: 'POST',
    desc: '发送祝福',
    path: `${baseUrl}send/blessings`,
    mock: false,
    id,
  },
  {
    name: 'giftList',
    method: 'GET',
    desc: '教师节礼物',
    path: `${baseUrl}teacherDayReceiveGiftList`,
    mock: false,
    id,
  },
  {
    name: 'wxSignature',
    method: 'POST',
    desc: '教师节礼物',
    path: '/app-resources/api/wechat/jsTicketSign/kidsTeacher',
    mock: false,
    id,
  }
];
