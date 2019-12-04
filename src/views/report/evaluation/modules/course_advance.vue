<template>
  <board title="课程预告" class="class-advance">
    <div class="advance_container">
      <kids-text class="advance">
        {{desc}}
      </kids-text>
      <div class="class-advance__video-box" @click="videoPlayToogle">
        <video width="100%" height="100%" ref="videoDom" @click.prevent preload="auto" controlsList='nodownload' :poster="poster">
          <source :src="url" type="video/mp4" @click.prevent>
          抱歉，您当前设备不支持播放视频～
        </video>
        <!--<iframe frameborder="0" width="100%" height="100%" name="class-content-iframe" class="course__player" :src="url"></iframe>-->
        <div v-show="paused" class="class-advance__video-box__paused"></div>
      </div>
    </div>
  </board>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import { Text } from '@kids/mobile-ui';
  @Component({
    components: {
      Board: () => import('./board.vue'),
      Text
    }
  })
  export default class ContentClass extends Vue {

    @Prop({
      required: true,
      type: String,
      default: ''
    })
    private url: any;

    @Prop({
      required: true,
      type: String,
      default: ''
    })
    private desc: any;

    @Prop({
      required: true,
      type: String,
      default: ''
    })
    private poster: any;

    private paused: boolean = true;

    private videoPlayToogle() {
      const videoDom: any = this.$refs.videoDom;
      if (videoDom.paused) {
        videoDom.play();
        this.paused = false;
        videoDom.controls = true;
      } else {
        videoDom.pause();
        this.paused = true;
      }
    }

  }
</script>
<style lang="scss">
  .class-advance {
    position: relative;
    .kids-text.advance {
      width: 620px;
      margin: 0;
      color: #7D582D;
      font-size: 24px;
      font-weight: bold;
      word-break: break-all;
      margin-left: -10px;
    }
    .advance_container {
      position: absolute;
      top: 40px;
      bottom: 60px;
      left: 132px;
      right: 132px;
    }
    .pad-board__inner {
      overflow: hidden;
      height: 540px;
      background: url('../images/img_yugao@2x.png') no-repeat center;
      background-size: 100% 100%;
    }

    &__inner {
      position: absolute;
      top: 94px;
      left: 162px;
      width: 540px;
      height: 304px;
      border-radius: 8px;
    }

    &__video-box {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 326px;
      border: 8px #caa579 solid;
      border-radius: 18px;
      background-color: #caa579;
      &__paused {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: url('../images/img_play@2x.png') no-repeat center;
        background-size: 20%;
      }
    }

    &__player-decorate {
      position: absolute;
      width: 540px;
      height: 48px;
      top: 398px;
      left: 50%;
      transform: translate(-50%, 0);

      ul {
        @include flex();
        height: 100%;
        list-style-type: none;

        li {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #FDE084;
          margin-right: 18px;

          &:first-of-type {
            @include flex(center);
            width: 28px;
            height: 28px;
            margin-right: 49px;
            margin-left: 85px;

            &::before {
              content: '';
              display: block;
              height: 5px;
              width: 90%;
              background: rgba(#FECB4C, 0.9);
              transform: rotateZ(-60deg);
            }
          }
        }
      }
    }

    &__control {
      @include flex(center);
      width: 100%;
      height: 100%;

      p {
        width: 114px;
        text-align: center;
      }
    }
  }

  .player__zml {
    width: 100%;
    height: 100%;
  }

  .button {
    &_ {
      &back, &next {
        @include disableUserSelect();
        width: 14px;
        height: 24px;
        /*margin: 0 30px;*/
      }

      &back {
        @include bg('../images/one-to-one/btn_prev.png');
        margin-left: 20px;

        &:active {
          opacity: 0.5;
        }

        &:disabled {
          opacity: 0.25;
        }
      }

      &next {
        @include bg('../images/one-to-one/btn_next.png');
        margin-right: 20px;

        &:active {
          opacity: 0.5;
        }

        &:disabled {
          opacity: 0.5;
        }
      }
    }
  }
</style>
