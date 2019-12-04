<template>
  <div class="report-default">
    <div v-if="loading" class="report-default__loading-box">
      <p style="font-size: 14px;margin: -50px 0 20px;color:rgba(196, 151, 97, 1)">数据加载中，请稍候...</p>
      <div class="loader-05"></div>
    </div>
    <img src="../images/default.jpg" alt="">
    <p class="report-default__text">暂无报告</p>
  </div>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class Home extends Vue {
    @Prop()
    private loading: boolean;
  }
</script>
<style lang="scss">
  .report-default {
    @include flex(center);
    position: relative;
    flex-direction: column;
    height: 100%;
    min-height: 638px;
    background: $--color-white;
    img {
      width: 250px;
    }
    &__loading-box {
      @include flex(center);
      flex-direction: column;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255,255,255,1);
      border-radius: 3px;
      font-size: 30px;
      color: rgba(200, 200, 200, 0.5);
      padding: 1em;
      margin-bottom: .25em;
      vertical-align: top;
      -webkit-transition: .3s color, .3s border;
      transition: .3s color, .3s border;
    }
    &__text {
      color: #D3A973;
      margin-top: 20px;
      font-size: 18px;
    }
  }
  .loader-05 {
    display: inline-block;
    width: 1em;
    height: 1em;
    color: inherit;
    vertical-align: middle;
    pointer-events: none;
    border: .2em solid transparent;
    border-top-color: currentcolor;
    border-radius: 50%;
    -webkit-animation: 1s loader-05 linear infinite;
    animation: 1s loader-05 linear infinite;
    position: relative;
    box-sizing: border-box;
  }
  .loader-05:before {
    content: '';
    display: block;
    width: inherit;
    height: inherit;
    position: absolute;
    top: -.2em;
    left: -.2em;
    border: .2em solid currentcolor;
    border-radius: 50%;
    opacity: .5;
    box-sizing: border-box;
  }
  @-webkit-keyframes loader-05 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes loader-05 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
</style>
