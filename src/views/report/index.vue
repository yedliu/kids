<template>
  <section :class="['report', {report_android: this.$isAndroid}, {report_ios: !this.$isAndroid}]">
<!--    <pad-header :title="title" fixed ref="container"></pad-header>-->
    <!--<pad-header :title="title" fixed ref="container" :pageInfo="pageInfo" :baseInfo="baseInfo"></pad-header>-->
    <div ref="scroll" class="report__scroll" @scroll="handleScroll">
      <div class="report__container">
        <div class="report__border report__top-left"></div>
        <div class="report__border report__top-right"></div>
        <div class="report__border report__bottom-left"></div>
        <div class="report__border report__bottom-left"></div>
        <div class="report__inner">
          <router-view @share="qrcode" @baseInfoInit="(baseInfo) => this.onBaseInfoInit(baseInfo)"></router-view>
        </div>
      </div>
    </div>
    <div v-show="toTopButtonVisible" class="button_to-top" @click="handleScrollToTop"></div>
    <div v-show="shareVisible" class="report__share-qrcode">
      <div class="report__qrcode">
        <div ref="qrcode"></div>
      </div>
      <div class="report__qrcode_tips">
        扫码可分享<br>课程报告哟
      </div>
    </div>
  </section>
</template>
<script lang='ts'>
  import {Component, Vue} from 'vue-property-decorator';
  import qrcode from 'qrcodejs2';
  import {reportType, reportPath} from 'views/report/index.ts';
  import {setHeader} from '@/utils';

  @Component({
    components: {
    }
  })
  export default class Report extends Vue {
    private toTopButtonVisible: boolean = false;
    private shareVisible: boolean = false;
    private title: string = '';
    private pageInfo: any = {};
    private baseInfo: any = {};

    private mounted() {
      this.pageInfoInit();
      window.onscroll = (e: any) => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        this.toTopButtonVisible = scrollTop > window.innerHeight;
        console.log(this.toTopButtonVisible);
      };
      window.GLOBAL.vbus.$on('report-exit', () => {
        this.sendLogData();
      });
      if (this.$route.query.from && (this.$route.query.from === 'teacher' || this.$route.query.from === 'cc')) {
        // 老师或销售后台无法监听退出事件，页面加载完一秒后自动发送埋点
        setTimeout(() => {
          this.sendLogData();
        }, 1000);
      }
    }

    private pageInfoInit() {
      const href = window.location.href;
      const classType: number = href.includes('smallClass') ? 1 : 2;
      const reportClass: number = href.includes('formal') ? 1 : 2;
      const queryParams = this.$route.query;
      let platform = (queryParams.device && queryParams.device === 'PC') ? 'PC' : 'Pad';
      if (queryParams.from && queryParams.from === 'teacher') {
        platform = 'TE';
      }
      if (queryParams.from && queryParams.from === 'cc') {
        platform = 'CC';
      }
      let reportTypeNum: number = 0;
      if (classType === 1 && reportClass === 1) {
        reportTypeNum = 3; // 小班课正式课
      }
      if (classType === 1 && reportClass === 2) {
        reportTypeNum = 4; // 小班课测评课
      }
      if (classType === 2) {
        reportTypeNum = 2; // 一对一测评课
      }
      const pageInfo = {
        appId: 533,
        pageId: href,
        pageName: `${platform}${classType === 1 ? '小班课' : '一对一'}${reportClass === 1 ? '正式课' : '测评课'}`,
        reportType: reportTypeNum,
        platform,
        startTime: new Date(),
      };
      this.pageInfo = pageInfo;
      // window.GLOBAL.vbus.$emit('homework-exit');
      // console.log(pageInfo);
    }

    private onBaseInfoInit(baseInfo: any) {
      console.log('onBaseInfoInit...');
      this.baseInfo = baseInfo;
    }

    private setTitle(t: string ) {
      setHeader(t);
    }

    private handleScroll(e: any) {
      this.toTopButtonVisible = e.target.scrollTop > window.innerHeight;
    }

    private handleScrollToTopAndroid() {
      // let timer: any = null;
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const speed = scrollTop / 40;
      const scrollTopInterval = setInterval(() => {
        if (scrollTop > speed) {
          scrollTop -= speed;
          if (document.documentElement.scrollTop > 0) {
            document.documentElement.scrollTop = scrollTop;
          } else if (document.body.scrollTop > 0) {
            document.body.scrollTop = scrollTop;
          }
        } else {
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          clearInterval(scrollTopInterval);
        }
      }, 10);
    }

    private handleScrollToTop() {
      console.log(this.$isAndroid);
      if (this.$isAndroid) {
        this.handleScrollToTopAndroid();
        return;
      }
      let timer: any = null;
      const scrollElement: any = this.$refs.scroll;
      let scrollTop = scrollElement.scrollTop;
      cancelAnimationFrame(timer);
      timer = requestAnimationFrame(function fn() {
        if (scrollTop > 0) {
          scrollTop -= 100;
          scrollElement.scrollTop = scrollTop;
          timer = requestAnimationFrame(fn);
        } else {
          cancelAnimationFrame(timer);
        }
      });

      // scrollElement.scrollTop = 0;
    }

    private qrcode(type: reportType, encryptParam: string) {
      const appShareDomain: string = process.env.VUE_APP_APP_DOMAIN;
      // enum reportPath {
      //   OneToOneEvaluation = '1to1TestClassReport',
      //   OneToMoreEvaluation = 'smallTestClassReport',
      //   OneToMoreFormal = 'smallNormalClassReport',
      // }
      console.log(reportPath);
      console.log(reportPath[type]);
      /*tslint:disable*/
      new qrcode(this.$refs.qrcode, {
        text: `${appShareDomain}/${reportPath[type]}?encryptParam=${encryptParam}&share=1`,
        correctLevel: qrcode.CorrectLevel.L
      });
      this.shareVisible = true;
    }

    private sendLogData() {
      // baseInfo, pageInfo
      if (this.pageInfo && this.pageInfo.appId === 533) {
        const pageParam = {
          userId: this.baseInfo.studentId,
          timeStart: this.pageInfo.startTime,
          lessonId: this.baseInfo.lessonId,
          teacherName: this.baseInfo.teacherName,
          platform: this.pageInfo.platform,
          device: this.pageInfo.platform,
          reportType: this.pageInfo.reportType,
          duration: ((new Date().getTime() - this.pageInfo.startTime.getTime()) / 1000) + '秒',
        };
        window.ZM_JSSDK.sendCustomPage({
          userId: this.baseInfo.studentId,
          pageId: encodeURI(this.pageInfo.pageId),
          pageName: this.pageInfo.pageName,
          trackerType: 3,
          pSource: this.pageInfo.platform,
          lessonUid: this.baseInfo.lessonId,
          pageParam: JSON.stringify(pageParam),
          deviceId: localStorage.getItem('ZM_DEVICEID')
        });
      } else {
        this.$logUpload({
          trackerType: 2,
          eventId: 'zuoye_querentuichu',
          eventType: 1,
          eventValue: 1
        });
      }
    }
  }
</script>
<style lang="scss">
  .report {
    position: relative;
    background: url(./common/images/star.png) repeat-y, linear-gradient(180deg, #14266E, #396EA9 50%, #65C2EE);
    background-size: 100% auto;
    color: #333;
    /*overflow: hidden;*/
    transition: all 0.3s;
    /*background-image: ;*/
    height: 100%;
    &_android {
      height: auto;
      min-height: 100%;
      .report__share-qrcode {
        position: fixed !important;
      }
      .button_to-top {
        position: fixed !important;
      }
    }
    &_ios {
      .report__scroll {
        height: 100%;
        overflow-y: scroll;
      }
      .report__container {
        overflow: hidden;
      }
    }
    &__ {
      &scroll {
        padding: 85px 0;
      }
      &container {
        position: relative;
        width: 942px;
        margin: 0 auto;
        border: 12px solid #6086FF;
        border-radius: 30px;
      }
      &inner {
      }
      &content {
        border-radius: 20px;
        height: 100%;
        overflow: hidden;
        z-index: 0;
      }
      &title {
        width: 100%;
        display: block;
      }
      &number {
        margin-left: 20px;
        margin-top: 20px;
      }
      &tag {
        @include flex(center);
        height: 30px;
        padding: 0 16px;
        font-size: 16px;
        color: #EF4C4F;
        background: #FFFFFF;
        border: 2px solid #FF7171;
        box-shadow: 4px 4px 0 0  #FFDADA;
      }
      &border {
        position: absolute;
        width: 60px;
        height: 60px;
        border: 12px solid transparent;
        border-radius: 30px;
        z-index: 2;
      }
      &top-left {
        border-left-color: #6086FF;
        transform: rotate(45deg);
        top: -12px;
        left: -12px;
      }
      &top-right {
        border-right-color: #6086FF;
        transform: rotate(-45deg);
        top: -12px;
        right: -12px;
      }
      &bottom-left {
        border-left-color: #6086FF;
        transform: rotate(-45deg);
        bottom: -12px;
        left: -12px;
      }
      &bottom-right {
        border-right-color: #6086FF;
        transform: rotate(45deg);
        bottom: -12px;
        right: -12px;
      }
    }
    &__share-qrcode {
      position: absolute;
      right: 0;
      bottom: 5px;
      width: 125px;
      height: 173px;
      @include bg('./common/images/img_code@2x.png');
    }
    &__qrcode {
      width: 110px;
      height: 110px;
      margin: 9px 0 0 2px;
      padding: 6px;
      img, canvas {
        width: 100%;
        height: 100%;
      }
    }
    &__qrcode_tips {
      color: $--color-white;
      width: 110px;
      padding: 7px 0;
      margin: 0 0 0 3px;
      font-size: 14px;
      line-height: 20px;
      text-align: center;
    }
  }
  .button {
    &_to-top {
      position: absolute;
      top: 528px;
      right: 40px;
      width:56px;
      height:56px;
      border-radius:8px;
      background: url(./evaluation/images/one-to-one/button_to-top.png) no-repeat 100%/100%;
    }
  }
</style>
