<template>
  <div class="count-down">
    {{pauseCountdown}}
    <slot></slot>
    <span v-if="secondsCountdownState">距离答题结束还有:&nbsp;</span>
    <div v-if="!secondsCountdownState">
      <span>{{formatTime.hours}}</span>
      <slot name="hours"></slot>
      <span>{{formatTime.minutes}}</span>
      <slot name="minutes"></slot>
    </div>
    <span :class="{'count-down__seconds-countdown': secondsCountdownState}">{{formatTime.seconds}}</span>
    <slot v-if="!secondsCountdownState" name="seconds"></slot>
  </div>
</template>
<script lang="ts">
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';
  @Component({
    components: {},
  })
  export default class CountDown extends Vue {
    @Prop({
      type: Boolean,
      required: true,
    })
    private play: boolean; // 开始

    @Prop({
      type: Boolean,
      required: true
    })
    private pause: boolean; // 暂停

    @Prop({
      type: Boolean,
      required: false
    })
    private changeCallBack: boolean; // 开始

    @Prop({
      type: Number,
      required: true
    })
    private totalTime: number; // 开始倒数时的总时间。单位 秒

    @Prop({
      type: Number,
      required: false,
    })
    private timeToWarn: number; // 倒计时剩余 timeToWarn ，对外暴露回调函数

    @Prop({
      type: Number,
      required: false,
    })
    private secondsCountdown: number; // 按秒倒计时 ， 比如 10秒倒计时

    private restTime: any = this.totalTime; // 剩余时间
    private secondsCountdownState: boolean = false;
    private countdownInterval: any = 0;

    @Watch('restTime')
    private restTimeChanged(val: number) {
      this.timeChange();
    }

    private addZero(data: string | number) {
      if (data < 10) { return '0' + data; }
      return data;
    }

    private startCountDown() {
      this.countdownInterval = setInterval( () => {
        if (this.restTime > 0) {
          if (this.restTime === this.timeToWarn) { this.timeWarn(); }
          if (this.restTime === this.secondsCountdown + 1) { this.beginSecondsCountdown(); }
          // if (this.play) { this.timeChange(); }
          // this.timeChange();
          this.restTime--;
        } else {
          this.stopCountDown();
          // this.stopSecondsCountdown();
        }
      }, 1000);
    }

    private timeWarn() {
      if (this.timeToWarn > 0) { this.$emit('timeToWarn', this.restTime); }
    }

    private beginSecondsCountdown() {
      if (this.secondsCountdown > 0) {
        this.secondsCountdownState = true;
        this.$emit('secondsCountDown');
      }
    }

    private stopSecondsCountdown() {
      this.secondsCountdownState = false;
      this.$off('secondsCountDown');
    }

    private timeChange() { this.$emit('timeChange', this.restTime); }

    private stopCountDown() {
      clearInterval(this.countdownInterval);
    }
    private get formatTime() {
      const time = this.restTime;
      let seconds: string | number = 0;
      let minutes: string | number = 0;
      let hours: string | number = 0;
      if (time > this.secondsCountdown) {
        seconds = this.addZero((time % 60));
        minutes = this.addZero(Math.floor(time / 60 % 60));
        hours = this.addZero(Math.floor(time / 60 / 60));
      } else {
        seconds = (time % 60);
      }

      return { hours, minutes, seconds };
    }

    private get pauseCountdown() {
      const state = this.pause;
      if (state) { this.stopCountDown(); } else { this.startCountDown(); }
      return '';
    }
  }
</script>
<style lang="scss" scoped>
  .count-down{
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-flow: row nowrap;
    min-width:204px;
    height:32px;
    padding: 0 32px 5px;
    background: url("../../assets/images/stageEvaluation/bg_clock@2x.png") 50% no-repeat / 100% 100%;
    font-size: 0;
    span{
      font-size:14px;
      font-family:HYZhengYuan-HEW;
      font-weight:normal;
      color:rgba(255,255,255,1);
      line-height:28px;
      &.count-down__seconds-countdown{
        font-size: 20px;
        color:#FFEA54;
      }
    }

  }
</style>
