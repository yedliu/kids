const dsn = 'https://941a72e1937541b5bcfad1981e13de4b@log-sentry.zmlearn.com/26';
const rate = 50; // 采样率，默认50，[0,100]
export default {
  dsn,
  rate,
  options: {
    // 用于sentry环境筛选标签，按需使用
    environment: process.env.VUE_APP_ENV,
    whitelistUrls: []
  },
  reportFn: function fn() {
    // 根据条件决定是否上报sentry,函数返回 true 则上报
    return process.env.VUE_APP_ENV === 'production';
  },
};

