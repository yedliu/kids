import Vue from 'vue';
import App from './App.vue';
import router from 'plugins/router';
import store from 'plugins/store';
import '@/sentry/';
// import Kids from '@kids/mobile-ui';
import '@kids/mobile-ui/lib/theme-chalk/index.css';
import '../packages/theme/src/index.scss';
// import Vconsole from 'vconsole';

// moment.locale('zh-cn');

window.GLOBAL.vbus = new Vue();
// Vue.use(Kids, { platform: 'PAD' });

// 引入插件
import inject from 'plugins/inject';
import logUpload from 'utils/event-tracking';
import cookie from 'js-cookie';
// if (process.env.VUE_APP_ENV !== 'production') {
//   const vConsole = new Vconsole();
//   Vue.use(vConsole);
// }
// 配置sdk参数
window.ZM_JSSDK && window.ZM_JSSDK.setConfig({
  logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'error',
  environment: process.env.VUE_APP_ENV === 'production' ? 'prod' :
               process.env.VUE_APP_ENV === 'uat' ? 'uat' : 'fat',
  // 如果你使用了router并且是history模式
  // 如果你使用了vue-router的hash模式，也是设置history
  history: true
});

// 配置上报公共属性
// console.log(2.0.0);
window.ZM_JSSDK && window.ZM_JSSDK.setDefaults({
  appId: 10846,
  appVersion: process.env.APP_VERSION
  // 其他公共字段，appId & appVersion请尽量参考**使用须知**
}, true);

Vue.use(inject);

Vue.prototype.$isAndroid = /android/g.test(navigator.userAgent.toLowerCase());
Vue.prototype.$logUpload = logUpload;
Vue.prototype.$cookie = cookie;
Vue.prototype.$KID = { platform: 'PAD' };

// Vue.prototype.$moment = moment;

Vue.config.productionTip = false;
import './assets/scss/index.scss';


new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
