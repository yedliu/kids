<template>
  <div class="media">
    <img class="media__title-image" src="../images/img_audio.png" alt="">
    <div class="media__play" @click="handlerPlayClick">
      <div class="media__icon">
        <img src="../images/audio__short.png" alt="" :class="{media__short: play}">
        <img src="../images/audio__middle.png" alt="" :class="{media__middle: play}">
        <img src="../images/audio__lang.png" alt="" :class="{media__long: play}">
      </div>
    </div>
    <p style="font-size: 10px;margin-left: 14px;" v-if="second > 0">{{formatDuration(second)}}</p>
    <audio
      :src="src"
      ref="audio"
      preload
      @canplay="handlerCanPlay"
      @play="handlerAudioPlay"
      @pause="handlerAudioPause"
      @ended="handlerAudioEnded"
      @error="handlerAudioError"
    ></audio>
  </div>
</template>

<script lang='ts'>
  import {Component, Watch, Prop, Vue} from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class Audio extends Vue {
    private play: boolean = false;
    private duration: string = '';
    private second: number = 0;
    private timer: any = null;

    @Prop({
      type: String,
      required: true
    })
    private src: string;

    @Watch('src')
    private srcChanged(old: string, value: string) {
      console.log(old);
      console.log(value);
    }

    private formatDuration(duration: number) {
      this.$log('duration');
      this.$log(duration);
      let min: string = (duration / 60).toString();
      min = Math.floor(+min) > 0 ? `${Math.floor(+min)}` : '';
      const second: number = duration % 60;
      return `${+min > 0 ? min + '\'' : ''}${second}\'\'`;
    }

    private handlerPlayClick() {
      const audioElement: any = this.$refs.audio;
      if (this.play) {
        audioElement.pause();
        return;
      }
      audioElement.play();
    }

    private handlerCanPlay() {
      const audioElement: any = this.$refs.audio;
      this.$log(audioElement.duration);
      this.second = audioElement.duration.toFixed(0);
    }

    private handlerAudioPlay() {
      console.log('play');
      this.play = true;
    }

    private handlerAudioPause() {
      console.log('pause');
      this.play = false;
      clearInterval(this.timer);
    }

    private handlerAudioEnded() {
      console.log('ended');
      this.play = false;
    }

    private handlerAudioError() {
      console.error('error');
      this.play = false;
    }
  }
</script>
<style lang="scss">
  .media {
    @include flex();
    &__ {
      &title-image {
        margin: 0 25px 0 50px;
        width: 84px;
      }
      &play {
        @include flex(center);
        position: relative;
        width: 180px;
        height: 40px;
        background: #83DF69;
        border-radius: 6px;
        &::before {
          position: absolute;
          top: 50%;
          left: -20px;
          transform: translateY(-50%);
          content: '';
          border: 10px solid transparent;
          border-right-color: #83DF69;
        }
        &:hover {
          cursor: pointer;
        }
      }
      &icon {
        position: relative;
        width: 12px;
        height: 20px;
        img {
          position: absolute;
          left: 0;
          top: 0;
          width: 14px;
        }
      }
      &short {
        animation: flash 2s infinite;
      }
      &middle {
        animation: flash 2s 0.3s infinite;
      }
      &long {
        animation: flash 2s 0.5s infinite;
      }
    }
  }
  @-webkit-keyframes flash {
    from,
    50%,
    to {
      opacity: 1;
    }

    25%,
    75% {
      opacity: 0;
    }
  }

  @keyframes flash {
    from,
    50%,
    to {
      opacity: 1;
    }

    25%,
    75% {
      opacity: 0;
    }
  }

  .flash {
    -webkit-animation-name: flash;
    animation-name: flash;
  }
</style>
