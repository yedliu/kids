import Vue from 'vue';
import sentryPlugin from 'zm-sentry-plugin-vue';
import config from './config';

sentryPlugin.install(Vue, config);
