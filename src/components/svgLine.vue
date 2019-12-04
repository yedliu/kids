<template>
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="190">
    <polygon :points="points"
             :style="lineStyle" />
  </svg>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component({
    components: {},
  })

  export default class SvgLine extends Vue {
    @Prop({
      type: String,
      default: ''
    })
    private points: string;

    @Prop({
      type: String,
      default: ''
    })
    private lineStyle: string;
  }
</script>

<style scoped>

</style>
