<template>
  <div class="pad-evaluation-report-board">
    <div v-if="header" class="pad-evaluation-report-board__header">{{header}}</div>
    <div class="pad-evaluation-report-board__content" :class="[bodyClass]">
      <slot></slot>
    </div>
  </div>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class StagedEvaluationReportBoard extends Vue {
    @Prop()
    private header: string;

    @Prop()
    private bodyClass: string[];
  }
</script>
