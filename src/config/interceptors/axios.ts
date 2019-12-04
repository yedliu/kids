import {CONSOLE_REQUEST_ENABLE, CONSOLE_RESPONSE_ENABLE} from '../';

import cookie from 'js-cookie';


export function requestSuccessFunc(requestObj: any) {
  // CONSOLE_REQUEST_ENABLE && console.log(`%c id: ${requestObj.id}`, 'color: #f00; requestInterceptorFunc', `url: ${requestObj.url}`, `${requestObj.desc}`);
  if (process.env.NODE_ENV !== 'production') {
    if (!requestObj.mock) {
      requestObj.headers.accessToken = cookie.get('token') || 'eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJTVW1sejVuOTZJdDlrSkwvUTZ5bVVBPT0iLCJmcm9tIjoia2lkc1BhZCIsIm5iZiI6MTU2Njk3NjY3OH0.joOlYiuoAQ52ypXrKQ6P4xhIGNtiMuNUVDfzCb_PcwekFTDPTviqf9tURJbJc6xB1cSeIAO0kyK3XZKL2-M0bROOx6xKVWahPWFBOkzVO1UlfhTdVe7QnROG8Jy24ISXyn77kcQmUTxgi9l8DGj9WZBa4e2ow6hoT2ImJJX_aFs';
      requestObj.headers['Api-Version'] = '1.0.0';
      requestObj.headers['App-Version'] = '1.0.0';
      requestObj.headers['App-Name'] = 'KidsPad';
    }
  } else {
    requestObj.headers.accessToken = cookie.get('token');
    requestObj.headers['Api-Version'] = '1.0.0';
    requestObj.headers['App-Version'] = '1.0.0';
    requestObj.headers['App-Name'] = 'KidsPad';
  }
  return requestObj;
}


export function requestFailFunc(requestError: any) {
  CONSOLE_REQUEST_ENABLE && console.info('requestInterceptorFunc', `url: ${requestError.url}`, requestError);
  return Promise.reject(requestError);
}

export function responseSuccessFunc(responseObj: any) {
  CONSOLE_RESPONSE_ENABLE && console.info('响应返回成功', `url: ${responseObj.config.url}`, responseObj);
  if (parseInt(responseObj.data.code, 10) !== 0) {
    responseObj.config.dialog === true && window.GLOBAL.vbus.$emit('message', responseObj.data.message || '服务器异常，请稍候重试');
    return Promise.reject(responseObj.data);
  } else {
    responseObj.config.message && window.GLOBAL.vbus.$emit('message', 'success', responseObj.config.message);
    // responseObj.config.router && window.GLOBAL.vbus.$emit('router', responseObj.config.router);
    return responseObj.data.data;
  }
}


export function responseFailFunc(responseError: any) {
  // 响应失败，可根据 responseError.message 和 responseError.response.status 来做监控处理
  const {status} = responseError.response;
  const responseObj = responseError.response;
  const resData = responseObj.data;
  if (status === 404) {
    // window.GLOBAL.vbus.$emit('router', {
    //   name: '404'
    // });
  }
  // const {error_code} = resData;
  return Promise.reject(resData);

}
