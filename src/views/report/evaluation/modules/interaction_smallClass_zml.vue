<template>
  <board title="答题互动">
    <div class="interaction">
      <div class="interaction__chart-bar-wrap">
        <kids-chart-bar
          :suggestTime="dataSource.suggestTime"
          :actualTime="dataSource.actualTime"
          style="height: 200px;width: 8.08906rem"
        ></kids-chart-bar>
      </div>
      <div class="interaction__line"></div>
      <div class="interaction__chart-gauge">
        <kids-chart-gauge
          v-bind="{
          titleText: '正确率',
          isCorrectRate: false,
          dataValue: dataSource.answerRightPCT * 100,
          comment: dataSource.answerRightDesc,
          factor: 37.5/38.5
        }"
          class="interaction__gauge"
          style="width: 7.32422rem;height: 4.76563rem;"
        >
          <div slot="header" style="margin-bottom: 10px;padding-top: 10px;">
            <p>正确率</p>
          </div>
          <div class="interaction__chart-gauge-content">{{`${Math.floor(dataSource.answerRightPCT * 100)}%`}}</div>
          <div slot="footer" class="interaction__chart-gauge-footer">
            <div class="interaction__chart-gauge-footer__count right">答对 <span>{{this.dataSource.correctAnswerCount}}</span> 题</div>
            <div class="interaction__chart-gauge-footer__count wrong">答错 <span>{{this.dataSource.falseAnswerCount}}</span> 题</div>
            <div class="interaction__chart-gauge-footer__desc">{{dataSource.answerRightDesc}}</div>
          </div>
        </kids-chart-gauge>
      </div>
    </div>
  </board>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Board from './board.vue';
  import { ChartBar } from '@kids/mobile-ui';
  @Component({
    components: {
      Board,
      ChartBar
    }
  })
  export default class Interaction extends Vue {
    @Prop()
    private dataSource: any;
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
      padding-top: 20px;
      width: 450px;
    }
    &__line {
      align-self: stretch;
      background: rgba(239, 228, 215, 1);
      width: 1px;
    }
    &__chart-gauge-footer {
      width: 160px;
      margin: 10px auto 0;
      position: relative;
      @include flex(space-between);
      &__count {
        span {
          font-size: 28px;
        }
        &.right {
          color: #3096EC;
          margin-right: 20px;
        }
        &.wrong {
          color: #FF7A8C;
        }
      }
      &__desc {
        position: absolute;
        width: 300px;
        bottom: -30px;
        left: -70px;
        font-size: 14px;
      }
    }
    &__answer-count {
      font-size: 14px;
    }
  }
</style>
