<template>
  <div class="answer-analysis"  v-if="analysis || knowledgeNameList.toString() ">
    <div class="title">
      解析
    </div>
    <p v-if="analysis" v-html="analysisDom"></p>
    <p v-if="!analysis">暂无解析</p>
    <p class="knowledge" v-if="knowledgeNameList.toString()">
      【相关知识点】{{knowledgeNameList.toString()}}
    </p>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import renderToKatex from 'service/data/utils/questionFormula';

  @Component({
    components: {},
  })

  export default class Analysis extends Vue {
    @Prop({
      type: String,
      default: ''
    })
    private analysis: string;

    @Prop({
      type: Array,
      default: ''
    })
    private knowledgeNameList: any[];

    private analysisDom: string = '';

    private mounted() {
      this.analysisInit();
    }

    private analysisInit() {
      const analysisDom =  renderToKatex(this.analysis);
      this.analysisDom = analysisDom;
    }
  }
</script>

<style lang="scss">
  .answer-analysis {
    table {
      border-collapse: collapse;
    }
    li {
      list-style-position: inside;
      /*list-style-type: inherit;*/
    }
  }
</style>
