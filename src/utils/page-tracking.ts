import cookie from 'js-cookie';
import axios from 'axios';

const env = process.env.VUE_APP_ENV;
console.log(window.location.host);
const isAndroid = /android/g.test(navigator.userAgent.toLowerCase());
let logUrl = 'kid_report_small_class'; // 埋点测试地址
logUrl = env === 'production' ? logUrl : logUrl + '_test';
const uploadBasePath = '/log/';

const trackerType = 3;
const deviceId = cookie.get('deviceId') || 'Test1000001';

// tracker_type	    非空	埋点类型	      默认为2，1表示设备信息，2表示事件信息，3表示页面信息
// device_id	      非空	访客唯一身份id	ios取自UUID,Android取自Android_id，如无法获取浏览器缓存中GA
// app_id	          非空	应用id
// page_id	        非空	页面id        当前页面URL
// page_name            页面别名
// user_id  	      非空	会员id
// time_start     	非空	进入页面时间
// duration	        非空	页面停留时长
// expand	　	            扩展参数	      预留字段，用来统计自定义分析维度{"idA:2","idB:9,8,7"}
// sdk_version	　	      SDK版本号
// platform	        非空	平台	          h5

const logUploadPage = ({appId, pageId, pageName, userId, timeStart, expand, platform}: {appId: number, pageId: string, pageName: string, userId: number, timeStart: any, expand: any, platform: string}) => {
  const maidianInfo = {
    tracker_type: trackerType,
    device_id: deviceId,
    app_id: appId,
    page_id: pageId,
    page_name: pageName,
    user_id: userId,
    time_start: moment(timeStart),
    duration: ((new Date().getTime() - timeStart.getTime()) / 1000) + '秒',
    expand: JSON.stringify(expand),
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

export default logUploadPage;
