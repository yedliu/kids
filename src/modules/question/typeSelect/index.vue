<template>
  <div :class="'homework-type-select ' + pagetype" @scroll="onScroll($event)">
<!--    <div class="option titleImgInit" v-html="question.title"></div>-->
    <question-title :title="question.title"></question-title>
    <Question :pagetype="pagetype" :question="question" answerType="stuAnswer" :scrollTopNow="scrollTopNow"></Question>
    <Answer v-if="pagetype === 'report'" :question="question">
      <Question :pagetype="pagetype" :question="question" answerType="correctAnswer"></Question>
    </Answer>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import Question from './Question.vue';
  import Answer from '../../analysis/index.vue';
  import QuestionTitle from 'components/homework/title_question.vue';

  @Component({
    components: {
      QuestionTitle,
      Question,
      Answer
    },
  })

  export default class TypeSelect extends Vue {
    @Prop({
      type: Object,
      default: ''
    })
    private question: any;

    @Prop({
      type: String,
      default: ''
    })
    private pagetype: any;

    private scrollTopNow: number = 0;

    private onScroll(e: any) {
      this.scrollTopNow = e.target.scrollTop;
    }
  }
</script>

<style lang="scss">

</style>
