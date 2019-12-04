<template>
  <board title="学习能力分析">
    <div class="analysis-smallClass">
      <div class="analysis-smallClass__chart-radar-wrap">
        <kids-radar
          style="width: 6.83594rem;height: 5.66406rem;"
          :value="dataSource.value || []"
          :options="{
            indicator: dataSource.indicator || []
          }"></kids-radar>
      </div>
      <div class="analysis-smallClass__text">
        <kids-text>
          <h1>学科能力分析</h1>
          <p v-for="(text, index) in dataSource.comment">{{text}}</p>
        </kids-text>
      </div>
    </div>
  </board>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Board from './board.vue';
  import { Radar, Text } from '@kids/mobile-ui';
  @Component({
    components: {
      Board,
      Radar,
      Text
    }
  })
  export default class Analysis extends Vue {
    @Prop()
    private dataSource: any;
    private options: any = {
      indicator: [
        {name: '观察能力', max: 50},
        {name: '逻辑思维能力', max: 50},
        {name: '计算能力', max: 50},
        {name: '动手操作能力', max: 50},
        {name: '数据整理能力', max: 50},
        {name: '数据整理能力', max: 50},
        {name: '推理论证能力', max: 50},
        {name: '能力理解', max: 50},
      ]
    };

    private mounted() {
      console.log(this.dataSource);
    }
  }
</script>
<style lang="scss">
  .analysis-smallClass {
    @include flex(flex-start);
    padding: 40px 50px;
    &__chart-radar-wrap {
      /*width: 490px;*/
      width: 350px;
      height: 290px;
    }
    &__line {
      align-self: stretch;
      background: rgba(239, 228, 215, 1);
      width: 1px;
    }
    &__text {
      flex: 1;
      h1 {
        margin-bottom: 12px;
      }
    }
  }
</style>
