<template>
  <div class="answer">
    <AnswerResult :question="question" :is-select="isSelect"></AnswerResult>
    <CorrectAnswer :question="question" v-if="!isSelect && !isJudge && (question.correctResult !== 1)">
      <slot></slot>
    </CorrectAnswer>
    <Analysis :knowledgeNameList="question.knowledgeNameList" :analysis="question.analysis"></Analysis>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import Analysis from './Analysis.vue';
  import AnswerResult from './AnswerResult.vue';
  // import CorrectAnswer from './CorrectAnswer.vue';

  @Component({
    components: {
      Analysis,
      AnswerResult,
      CorrectAnswer: () => import('./CorrectAnswer.vue')
    },
  })

  export default class Answer extends Vue {
    @Prop({
      type: Object,
      default: ''
    })
    private question: any;

    private isSelect: boolean = false;
    private isJudge: boolean = false;
    private created() {
      this.isSelect = this.question.type === 'singleSelect' || this.question.type === 'multiSelect';
      this.isJudge = this.question.type === 'trueOrFalse';
    }
  }
</script>

<style scoped>

</style>
