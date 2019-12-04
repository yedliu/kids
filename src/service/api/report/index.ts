const baseUrl = '/eduLesson/';
const baseUrlOneToOne = '/test/lessonReport/'; // 1对1测评课报告baseUrl地址
const evaluationUrlOneToMore = '/kids/evaluation/v1.0.0/'; // 小班课测评课报告baseUrl地址
export default [
  {
    name: 'formal',
    method: 'GET',
    desc: '小班课正式课课程报告',
    path: `${baseUrl}report/assessment/data`,
    mock: false,
  },
  {
    name: 'evaluation',
    method: 'GET',
    desc: '小班课测评课课程报告',
    path: `${baseUrl}test-report/assessment/data`,
    mock: false
  },
  {
    name: 'EncryptParam',
    method: 'POST',
    desc: '1对1bu加密参数获取',
    path: `${baseUrlOneToOne}getEncryptParam`,
    mock: false
  },
  {
    name: 'evaluation-1v1',
    method: 'POST',
    desc: '1对1bu测评课报告详细信息获取',
    path: `${baseUrlOneToOne}queryLessonReportConvergeDataByEncryptParam`,
    mockPath: 'http://mock-api.com/wrnNmagl.mock/mock/5ce52a57c6b30f52bdef3f68/api/test/lessonReport/queryLessonReportConvergeData',
    mock: false
  },
  {
    name: 'evaluation-base',
    method: 'POST',
    desc: '1对1bu测评课报告基本信息获取',
    path: `${baseUrlOneToOne}queryLessonReportStaticDataByEncryptParam`,
    mock: false
  },
  {
    name: 'evaluation-small-class',
    method: 'GET',
    desc: '小班课测评课报告基本信息获取',
    path: `${evaluationUrlOneToMore}smallTestLesson/test-report/assessment/data`,
    mock: false
  },
  {
    name: 'formal-small-class',
    method: 'GET',
    desc: '小班课正式课报告基本信息获取',
    path: `${evaluationUrlOneToMore}smallRegularLesson/report/assessment/data`,
    mock: false
  }
];
