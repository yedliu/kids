<template>
  <div class="answer-correct">
    <div class="title">正确答案</div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component({
    components: {},
  })

  export default class CorrectAnswer extends Vue {

  }
</script>

<style scoped>

</style>
