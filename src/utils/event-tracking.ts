import cookie from 'js-cookie';
import axios from 'axios';

const env = process.env.VUE_APP_ENV;
console.log(window.location.host);
const isAndroid = /android/g.test(navigator.userAgent.toLowerCase());
const uploadBasePath = '/log/';
const appId = isAndroid ? '523' : '513';
const platform = isAndroid ? 'aPad_h5' : 'iPad_h5';
// const logUrl = isAndroid ? 'kid_student_apad' : 'kid_student_ipad'; // 埋点线上地址
const appVersion = cookie.get('version') || '0.0.1';
const deviceId = cookie.get('deviceId') || 'Test1000001';
const accessToken = cookie.get('token') || 'test00001a';
const homeworkId = cookie.get('homeworkId') || 100001;
let logUrl = isAndroid ? 'kid_student_apad_h5' : 'kid_student_ipad_h5'; // 埋点测试地址
logUrl = env === 'production' ? logUrl : logUrl + '_test';

// device_id	      非空	访客唯一身份id	ios取自UUID,Android取自Android_id，如无法获取浏览器缓存中GA
// app_id	          非空	应用id
// version	        非空	客户端版本号
// tracker_type	    非空	埋点类型	      默认为2，1表示设备信息，2表示事件信息，3表示页面信息
// session_id	      非空	会话标识	      用于区分是否为新会话,每次新启动或者从后台进入前台为一次新会话
// event_time_start	非空	事件发生时间
// event_id	        非空	事件id          (事件名称根据BI配置表可获取)	IOS和Andriod同一事件ID
// event_type	      非空	事件类型	      0表示统计事件次数，1表示统计事件时长
// event_value	    非空	值	            event_type为0时，每点击1次，记录1次；event_type为1时，记录时长，按秒计算
// event_para	　	        事件参数	      预留字段，用来统计自定义分析维度{"idA:2","idB:9,8,7"}
// sdk_version	　	      SDK版本号
// platform	        非空	平台	          h5

const logUpload = ({trackerType, eventId, eventType, eventValue, eventPara}: {trackerType: number, eventId: string, eventType: number, eventValue: number, eventPara: any}) => {
  const maidianInfo = {
    device_id: deviceId,
    app_id: appId,
    version: appVersion,
    tracker_type: trackerType,
    session_id: accessToken,
    event_time_start: moment(new Date()),
    event_id: eventId,
    event_type: eventType,
    event_value: eventValue,
    event_para: JSON.stringify({homeworkId: +homeworkId, ...eventPara}),
    platform
  };
  console.log(maidianInfo);
  axios.post(uploadBasePath + logUrl, {...maidianInfo});
};

const moment = (date: any) => {
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = date.getDate() + ' ';
  const h = date.getHours() + ':';
  const m = date.getMinutes() + ':';
  const s = date.getSeconds();
  return Y + M + D + h + m + s;
};

export default logUpload;
