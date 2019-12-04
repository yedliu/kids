<template>
  <board title="答题互动">
    <div class="interaction">
      <div class="interaction__chart-bar-wrap">
        <kids-chart-bar
          :suggestTime="dataSource.suggestTime"
          :actualTime="dataSource.actualTime"
          class="interaction__chart-bar"
        ></kids-chart-bar>
      </div>
      <div class="interaction__line"></div>
      <div class="interaction__chart-gauge">
        <kids-chart-gauge
          v-bind="{
          titleText: '闯关速度',
          isCorrectRate: false,
          dataValue: rate,
          comment: dataSource.msg,
          factor: 37.5/38.5
        }"
          class="interaction__gauge"
        >
          <div slot="header">
            <p>闯关速度<br>超过同年级小孩</p>
          </div>
          <div class="interaction__chart-gauge-content">{{`${Math.floor(rate)}%`}}</div>
          <div slot="footer" class="interaction__chart-gauge-footer">{{dataSource.msg}}</div>
        </kids-chart-gauge>
      </div>
    </div>
  </board>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Board from './board.vue';
  import { ChartBar, ChartGauge } from '@kids/mobile-ui';
  @Component({
    components: {
      Board,
      ChartBar,
      ChartGauge
    }
  })
  export default class Interaction extends Vue {
    @Prop()
    private dataSource: any;

    private data: any = {
      titleText: '闯关速度',
      isCorrectRate: true,       // 必传参数，始终为true
      dataValue: 60,
    };
    private get rate() {
      return Math.floor(Math.sqrt(Math.abs(Math.sin((this.dataSource.actualTime / this.dataSource.suggestTime) / 180))) * 100);
    }
  }
</script>
<style lang="scss">
  .interaction {
    @include flex(flex-start);
    flex-wrap: nowrap;
    padding: 40px 0 40px 40px;
    &__chart-bar-wrap {
      position: relative;
      align-self: stretch;
      padding-top: 10px;
      flex: 1;
    }
    &__chart-bar {
      /*width: 400px;*/
      height: 200px;
    }
    &__line {
      align-self: stretch;
      background: rgba(239, 228, 215, 1);
      width: 1px;
    }
    &__chart-gauge {
      padding-top: 10px;
      width: 375px;
      height: 210px;
    }
    &__chart-gauge-footer {
      width: 145px;
      margin: 0 auto;
    }
  }
</style>
