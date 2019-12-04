<template>
  <div class="analysis">
    <chart :data="info"></chart>
    <knowledge :data="info"></knowledge>
  </div>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Knowledge from '../components/knowledge.vue';
  // import Chart from '';

  @Component({
    components: {
      Knowledge,
      Chart: () => import('../components/chart.vue')
    }
  })
  export default class Analysis extends Vue {
    @Prop({
      type: Array,
      required: true
    })
    private info: any[];
  }
</script>
<style lang="scss">
  .analysis {
    @include flex(space-between);
    padding: 0 20px;
  }
</style>
