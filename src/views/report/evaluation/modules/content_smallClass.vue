<template>
  <board title="课堂内容" class="class-content">
    <div class="class-content__inner" @click="videoPlayToogle">
      <video width="100%" height="100%" ref="videoDom" preload="auto" @click.prevent controlsList='nodownload' :poster="poster">
        <source :src="url" type="video/mp4" @click.prevent>
        抱歉，您当前设备不支持播放视频～
      </video>
      <div v-show="paused" class="class-content__inner__paused"></div>
    </div>
  </board>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    components: {
      Board: () => import('./board.vue')
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
    private poster: any;

    private paused: boolean = true;

    private videoPlayToogle() {
      console.log(1111);
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
  .class-content {
    .pad-board__inner {
      overflow: hidden;
      height: 540px;
      background: url('../images/one-to-one/content_bg.png') no-repeat 100%/100%;
    }
    &__inner {
      position: absolute;
      top: 94px;
      left: 162px;
      width: 540px;
      height: 304px;
      border-radius: 8px;
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
