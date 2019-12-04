import Vue from 'vue';
import App from './Active.vue';
import axios from 'plugins/axios';
import MakeApi from 'plugins/api';
import '@/sentry/';
import './scss/active.scss';
import {API_DEFAULT_CONFIG} from '@/config';
import active from 'service/api/active-api';
window.GLOBAL.vbus = new Vue();

const api: any = new MakeApi({
  config: active,
  ...API_DEFAULT_CONFIG
}).api;

Vue.prototype.$api = api;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#active');
