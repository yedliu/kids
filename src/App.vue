<template>
  <div id="app">
    <audio :src="clickVoice" style="display: none" ref="clickVoiceElm" />
    <router-view/>
    <modal v-model="dialogVisible" :message="dialogMessage"></modal>
  </div>
</template>
<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  // import Modal from '@/modules/modal/one-to-more-new.vue';
  import {exit} from 'modules/native-tips';

  @Component({
    components: {
      Modal: () => import('@/modules/modal/error.vue')
    }
  })
  export default class App extends Vue {
    private dialogVisible: boolean = false;
    private dialogMessage: string = '';
    private clickVoice: string = require('./assets/media/voice.mp3');
    private bindEvent() {
      window.GLOBAL.vbus.$on('message', (message: string) => {
        this.dialogMessage = message;
        this.dialogVisible = true;
      });
      window.GLOBAL.vbus.$on('router', (router: any) => {
        this.$router.push(router);
      });
      window.GLOBAL.vbus.$on('exit', () => {
        if (this.$route.name === 'homework') {
          this.$logUpload({
            trackerType: 2,
            eventId: 'zuoye_querentuichu',
            eventType: 1,
            eventValue: 1
          });
          window.GLOBAL.vbus.$emit('homework-exit');
          return;
        }
        if (/^\/report/.test(this.$route.path)) {
          window.GLOBAL.vbus.$emit('report-exit');
        }

        if (this.$route.name === '阶段测评测试') {
          return window.GLOBAL.vbus.$emit('stage-exit');
        }

        if (/^\/stage-evaluation/.test(this.$route.path)) {
          window.GLOBAL.vbus.$emit('stage-report-tracker');
          const {from} = this.$route.query;
          if (from) {
            return this.$router.go(-1);
          }
        }
        exit();
      });
    }

    private created() {
      this.bindEvent();
      this.clickAudioInit();
    }

    private clickAudioInit() {
      window.document.onclick = (e: any) => {
        if (e.target.getAttribute('playAudio')) {
          const clickVoiceElm: any = this.$refs.clickVoiceElm;
          clickVoiceElm.play();
        }
      };
    }
  }
</script>
<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-size: 20px;
  box-sizing: border-box;
}
#app {
  position: relative;
  height: 100%;
  width: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  .bg-grassland {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 22%;
    background-color: #86D236;
    /*background: linear-gradient(#AED43D, #5DAC0B) repeat-y;*/
    .bg-grass-arc {
      position: absolute;
      top: -15px;
      left: 0;
      width: 100%;
      height: 46px;
      border-radius: 50%;
      background-color: #86D236;
      &:before {
        position: absolute;
        content: '';
        top: -30px;
        left: 0;
        width: 100px;
        height: 54px;
        background: url("./assets/images/common/grass_left2.svg") center no-repeat;
        background-size: contain;
      }
      &:after {
        position: absolute;
        content: '';
        top: -30px;
        right: 0;
        width: 100px;
        height: 54px;
        background: url("./assets/images/common/grass_left2@2x.png") center no-repeat;
        background-size: contain;
        transform: rotateY(180deg);
      }
    }
    &:before {
      position: absolute;
      content: '';
      bottom: 0;
      left: 0;
      width: 150px;
      height: 75px;
      background: url("./assets/images/common/grass_left1@2x.png") center no-repeat;
      background-size: contain;
    }
    &:after {
      position: absolute;
      content: '';
      bottom: 0;
      right: 0;
      width: 150px;
      height: 75px;
      background: url("./assets/images/common/grass_left1@2x.png") center no-repeat;
      background-size: contain;
      transform: rotateY(180deg);
    }
  }
  .cloud-left {
    position: absolute;
    top: 200px;
    left: 0;
    width: 760px;
    height: 400px;
    background: url("./assets/images/common/cloud_left@2x.png") center no-repeat;
    background-size: contain;
  }
  .cloud-right {
    position: absolute;
    top: 160px;
    right: 0;
    width: 600px;
    height: 435px;
    background: url("./assets/images/common/cloud_right@2x.png") center no-repeat;
    background-size: contain;
  }
  .book-shadow {
    position: absolute;
    width: 90%;
    left: 5%;
    height: 53px;
    bottom: 16px;
    content: '';
    background: url("./assets/images/common/shadow@2x.png") no-repeat center;
    background-size: contain;
  }
  .pad-evaluation-staged-detail {
    .book-shadow {
      bottom: 36px;
      width: 96%;
      height: 55px;
      left: 2%;
    }
  }
}
</style>
