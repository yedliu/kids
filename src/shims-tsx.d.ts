import Vue, {VNode} from 'vue';

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
  interface Window {
    GLOBAL: any;
    WebViewJavascriptBridge: any;
    CountDownContinue: any;
    WVJBCallbacks: any;
    katex: any;
    lib: any;
    mozRequestAnimationFrame: any;
    msRequestAnimationFrame: any;
    ZM_JSSDK: any;
    callhandler: (name: string, data?: any, callback?: () => void) => void;
    webkit: any;
  }
}

