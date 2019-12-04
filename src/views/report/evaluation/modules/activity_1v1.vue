<template>
  <board title="课堂活跃状态">
    <div class="activity">
      <div class="activity__chart-line-wrap" v-if="dataSource.chartLine.length > 0">
        <kids-chart-line
          v-if="dataSource.chartLine.length > 0"
          :value="dataSource.chartLine"
          :options="options"
          :style="dataSource.rate ? 'height: 250px;width: 8.58906rem' : 'height: 250px;width: 12.58906rem;'"
        ></kids-chart-line>
      </div>
      <div class="activity__line" v-if="dataSource.rate && (dataSource.chartLine.length > 0)"></div>
      <div class="activity__chart-gauge" v-if="dataSource.rate">
        <kids-chart-gauge
          v-bind="{
            titleText: '活跃度',
            dataValue: Math.floor(dataSource.rate * 100),
            isCorrectRate: false,
            comment: dataSource.msg
          }"
          style="width: 7.32422rem;height: 4.76563rem;"
        >
          <div slot="header">
            <p>活跃度<br>超过同年级小孩</p>
          </div>
          <div class="activity__chart-gauge-content">{{`${Math.floor(dataSource.rate * 100)}%`}}</div>
          <div slot="footer" class="activity__chart-gauge-footer">{{dataSource.msg}}</div>
        </kids-chart-gauge>
      </div>
    </div>
  </board>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Board from './board.vue';
  import { ChartLine, ChartGauge } from '@kids/mobile-ui';

  @Component({
    components: {
      Board,
      ChartLine,
      ChartGauge
    }
  })
  export default class Activity extends Vue {
    @Prop()
    private dataSource: any;

    private get options() {
      console.log(this.dataSource);
      if (this.dataSource.chartLine.length > 0) {
        const yMax: number = Math.max(...this.dataSource.chartLine.map((ele: any) => ele[1]));
        const xMin: number = Math.min(...this.dataSource.chartLine.map((ele: any) => ele[0]));
        const xMax: number = Math.max(...this.dataSource.chartLine.map((ele: any) => ele[0]));
        return {
          yMax: 1.2 * yMax,
          xMax: 1.5 * xMax,
          xMin,
          yMin: 0
        };
      } else {
        return {
          xMax: 1,
          yMax: 1,
          xMin: 0,
          yMin: 0
        };
      }
    }

    private data: any = {
      titleText: '闯关速度',
      isCorrectRate: true,       // 必传参数，始终为true
      dataValue: 60,
    };
  }
</script>
<style lang="scss">
  .activity {
    @include flex(flex-start);
    flex-wrap: nowrap;
    &__chart-line-wrap {
      flex: 1;
      width: 490px;
      overflow: hidden;
      padding: 0 48px 0 50px;
    }
    &__line {
      align-self: stretch;
      background: rgba(239, 228, 215, 1);
      width: 1px;
      margin: 30px 0;
    }
    &__chart-gauge {
      padding-top: 40px;
    }
    &__chart-gauge-content {
      margin: 10px 0;
    }
    &__chart-gauge-footer {
      width: 145px;
      margin: 0 auto;
    }
  }
</style>
