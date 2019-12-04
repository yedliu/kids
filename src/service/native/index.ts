import bridge from 'plugins/bridge';
import {isMobile, isAndroid} from 'utils/ua';

export default {
  show(type: string) {
    bridge.callhandler('showTipWithWorkType', type);
  },
  close() {
    if (isMobile()) {
      bridge.callhandler('exit');
      !isAndroid() && window.webkit.messageHandlers.back.postMessage({body: ''});
    } else {
      const target: any = window.parent && window.parent.window;
      target.postMessage({
        action: 'back'
      }, '*');
    }
  },
  showFirst() {
    bridge.callhandler('showFirstTip');
  },
  showTestFirst() {
    bridge.callhandler('showTestFirstTip');
  },
  showPraise() {
    bridge.callhandler('showPraise');
  }
};

