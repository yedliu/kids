<template>
  <div class="pad-active-h5">
    <div v-if="hasError" class="pad-active-h5__error-box">
      <div>加载失败</div>
    </div>
    <div class="pad-active-h5__list-page">
      <div class="pad-active-h5__header">
        <img src="./assets/img_h5/header.png">
      </div>
      <div class="pad-active-h5__msg">
        {{isShare ? 'Ta' : '你'}}共收到了来自<span style="color: #FFE700;">{{infoList ? infoList.length : 0}}</span>位学生的祝福，快看看吧~
      </div>
      <div class="pad-active-h5__card-container">
        <div v-for="(item, index) in infoList" class="pad-active-h5__item" @click="() => showCard(item)">
          <div class="pad-active-h5__item--main">
            <div class="pad-active-h5__item--avatar">
              <img :src="item.studentAvatar" onerror="this.style.display='none'">
            </div>
            <div class="pad-active-h5__item--info">
              <span style="color: #FF5C2E">{{item.studentName}}</span>同学给{{isShare ? 'Ta' : '你'}}送了一张节日贺卡<br/>
              <span style="font-size: 14px;color: #999999">{{timeFormat(item.sendTime)}}</span>
            </div>
          </div>
          <div class="pad-active-h5__item--show-btn">
            查看
          </div>
        </div>
      </div>
    </div>
    <div v-show="cardShow" class="pad-active-h5__card-details-page" @touchmove.prevent>
      <div class="pad-active-h5__card-details-main">
        <img class="pad-active-h5__card-details-main--back" src="./assets/img_h5/detail_back.png">
        <div class="pad-active-h5__card-details-main--card pad-active-h5__card-details-main--move">
          <img width="100%" :src="showCardInfo.cardUrl">
        </div>
        <img class="pad-active-h5__card-details-main--front" src="./assets/img_h5/detail_front.png">
        <img class="pad-active-h5__card-details-main--close" src="./assets/img_h5/close.png" @click="() => hideCard()">
        <div class="pad-active-h5__card-details-main--msg">
          <span>{{showCardInfo.content || '这份美好的祝福通过电波，跨过重重高山，越过滔滔江水，掠过高楼大厦。'}}</span>
          <img src="./assets/img_h5/quotation_end.png">
        </div>
        <div class="pad-active-h5__card-details-main--student">您的学生<span style="color: #FF5C2E">{{showCardInfo.studentName}}</span></div>
      </div>
    </div>
    <div v-show="transverse" class="pad-active-h5__transverse-tip" @touchmove.prevent>
      <div class="pad-active-h5__transverse-tip--msg">
        请翻转屏幕，使用竖屏模式查看
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import wx from 'weixin-js-sdk';
  import md5 from 'js-md5';
  import {Component, Vue} from 'vue-property-decorator';
  import WxConfig from './config/wx.config';
  @Component({
    components: {}
  })
  export default class Active extends Vue {
    private infoList: any[] = [];
    private showCardInfo: any = {};
    private cardShow: boolean = false;
    private transverse: boolean = false;
    private isShare: boolean = false;
    private hasError: boolean = false;

    private async mounted() {
      const data = this.getUrlQuery('data');
      const isShare: boolean = !!this.getUrlQuery('share');
      this.isShare = isShare;
      try {
        const info: any = await this.$api['active/giftList']({paramJson: data});
        this.infoList = info;
      } catch (e) {
        this.hasError = true;
      }
      window.matchMedia && this.orientationChangeActionInit();
      this.wxShareInit();
    }

    private wxShareInit() {
      const ua = navigator.userAgent.toLowerCase(); // 获取判断用的对象
      if (/micromessenger/.test(ua) || /MicroMessenger/.test(ua)) {
        try {
          console.log('在微信中打开');
          this.secondShare();
        } catch (e) {
          console.log(e);
        }
      } else {
        try {
          this.secondShare();
        } catch (e) {
          console.log(e);
        }
        console.log('非微信中打开');
      }
    }

    private async getSignature(params: any) {
      const stuCount = (this.infoList && this.infoList.length) || 0;
      const info: any = await this.$api['active/wxSignature'](params);
      const url = this.isShare ? window.location.href : (window.location.href + '&share=1');
      const data = info;
      console.log(info, data);
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList: [
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'updateAppMessageShareData',
          'updateTimelineShareData',
          'checkJsApi'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      this.wxShare({
        title: '教师节礼物', // 分享标题
        desc: stuCount + '位小朋友给我发来了教师节祝福，这也太暖心了叭~', // 分享描述
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'https://web-data.zmlearn.com/image/ed032178-52d2-467d-b842-223ec61aef73.png', // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: () => {
          // 用户确认分享后执行的回调函数
          console.log('shared success');
        },
        cancel: () => {
          // 用户取消分享后执行的回调函数
          console.log('shared cancel');
        }
      });
    }

    private orientationChangeActionInit() {
      const mql = window.matchMedia('(orientation: portrait)');
      mql.onchange = (mqlCall) => {
        if (mqlCall && !mqlCall.matches) {
          this.transverse = true;
        } else {
          this.transverse = false;
        }
      };
      console.log(mql);
    }

    private getUrlQuery(queryKey: string) {
      const reg = new RegExp('(^|&)' + queryKey + '=([^&]*)(&|$)');
      const r = window.location.search.substr(1).match(reg) || window.location.hash.substring((window.location.hash.search(/\?/)) + 1).match(reg);
      if (r != null) {
        return decodeURIComponent(r[2]);
      }
    }

    private showCard(item: any) {
      // item.cardUrl = 'https://web-data.zmlearn.com/image/2e87795b-7ade-4c19-ae16-99d0dc6a31b3.png';
      this.showCardInfo = item;
      this.cardShow = true;
    }

    private hideCard() {
      this.cardShow = false;
    }

    private timeFormat(timeStr: any) {
      let timeStamp: number = 0;
      if (timeStr * 1) {
        timeStamp = Number(timeStr);
      } else {
        timeStamp = new Date(timeStr.replace(/-/g, '/')).getTime();
      }
      const dateTime = new Date(timeStamp);
      // 'M+': date.getMonth() + 1,
      //   'd+': date.getDate(),
      //   'h+': date.getHours(),
      //   'm+': date.getMinutes(),
      //   's+': date.getSeconds(),
      const month = (dateTime.getMonth() + 1 > 9) ? (dateTime.getMonth() + 1) : ('0' + (dateTime.getMonth() + 1));
      const day = dateTime.getDate() > 9 ? dateTime.getDate() : ('0' + dateTime.getDate());
      const hours = dateTime.getHours() > 9 ? dateTime.getHours() : ('0' + dateTime.getHours());
      const minutes = dateTime.getMinutes() > 9 ? dateTime.getMinutes() : ('0' + dateTime.getMinutes());
      return `${month}.${day} ${hours}:${minutes}`;
    }

    // 二次分享
    private secondShare() {
      const url = window.location.href;
      // const url = window.location.href.split('#')[0].replace('http', 'https')
      // const url = encodeURIComponent(`${window.location.href}`.split('#')[0])
      const timestamp = (new Date()).getTime();
      const signOrign = `${WxConfig.secret},timestamp=${timestamp},url=${url},${WxConfig.secret}`;
      const parms = {
        url,
        timestamp,
        sign: md5(signOrign)
      };
      console.log(signOrign, parms);
      this.getSignature(parms);
    }

    private wxShare(config: any) {
      console.log(config);
      wx.ready(() => {
        console.log('has ready');
        wx.checkJsApi({
          jsApiList: ['checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'updateAppMessageShareData',
            'updateTimelineShareData'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
          success: (res: any) => {
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
            console.log(res);
          }
        });
        wx.onMenuShareAppMessage(config);
        wx.onMenuShareTimeline(config);
        wx.onMenuShareQQ(config);
        wx.onMenuShareWeibo(config);
        wx.updateAppMessageShareData(config);
        wx.updateTimelineShareData(config);
        console.log('####### has ready');
      });
    }
  }
</script>
