import axios from './axios';
import {API_DEFAULT_CONFIG} from '@/config';
import API_CONFIG from 'service/api';
import consts from './const';
import bridge from './bridge';
import {log} from '@/utils';
import {MakeApi} from './api';
const api: any = new MakeApi({
  config: API_CONFIG,
  ...API_DEFAULT_CONFIG,
}).api;

export default {
  install: (vue: any, options: any) => {
    vue.prototype.$api = api;
    vue.prototype.$axios = axios;
    vue.prototype.$const = consts;
    vue.prototype.$register = bridge.registerHander;
    vue.prototype.$call = bridge.callhandler;
    vue.prototype.$log = log;
    // vue.prototype.$cookie = cookie;
  }
};
