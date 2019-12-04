<template>
  <div class="pad-question-status">
    :class="[
    {
    'pad-question-status--done': status === 'done',
    'pad-question-status--correct': status === 'correct',
    'pad-question-status--incorrect': status === 'incorrect'
    }
  </div>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class QuestionStatus extends Vue {
    @Prop()
    private status: string;
  }
</script>
