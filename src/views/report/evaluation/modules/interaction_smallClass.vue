<template>
  <board title="答题互动">
    <div class="interaction">
      <div class="interaction__game" v-if="dataSource.gamePracticeCount || dataSource.avgGamePracticeTime">
        <item layout="vertical" v-if="dataSource.gamePracticeCount" :src="icon1" header="闯关次数" style="margin-left: 20px;">{{dataSource.gamePracticeCount}}次</item>
        <item layout="vertical" v-if="dataSource.avgGamePracticeTime" :src="icon2" header="平均闯关时间">{{dataSource.avgGamePracticeTime}}分钟</item>
      </div>
      <div class="interaction__line"></div>
      <div class="interaction__chart-gauge" v-if="rate">
        <kids-chart-gauge
          v-bind="{
          titleText: '闯关速度',
          isCorrectRate: false,
          dataValue: rate,
          comment: dataSource.msg,
          factor: 37.5/38.5
        }"
          class="interaction__gauge"
          style="width: 7.32422rem;height: 4.76563rem;"
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
  import { ChartGauge } from '@kids/mobile-ui';
  @Component({
    components: {
      Board,
      Item: () => import('views/report/common/components/performance__board.vue'),
      ChartGauge
    }
  })
  export default class Interaction extends Vue {
    @Prop()
    private dataSource: any;

    // gamePracticeCount: number,
    // avgGamePracticeTime: number,

    private icon1: string = require('views/report/evaluation/images/one-to-one/perf4.png');
    private icon2: string = require('views/report/evaluation/images/one-to-one/perf5.png');

    private data: any = {
      titleText: '闯关速度',
      isCorrectRate: true,       // 必传参数，始终为true
      dataValue: 60,
    };
    private get rate() {
      return Math.floor(this.dataSource.practiceSpeedOverPCT * 100);
    }
  }
</script>
<style lang="scss">
  .interaction {
    @include flex(flex-start);
    flex-wrap: nowrap;
    padding: 40px 0 40px 40px;
    &__game {
      @include flex(space-around);
      flex-direction: row;
      padding-top: 20px;
      flex: 1;
      padding-right: 20px;
      .board-perf_vertical {
        img {
          margin: 0 !important;
        }
        .board-perf__header {
          padding-right: 0 !important;
        }
      }
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
