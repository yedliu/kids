<template>
  <div :class="'homework-ttMatch-select ' + pagetype">
    <!--<div class="option">-->
      <!--【配对题】{{question.title}}-->
      <!--<div v-if="question.titleImgUrl" class="title-img" >-->
        <!--<img :src="question.titleImgUrl" alt="">-->
      <!--</div>-->
    <!--</div>-->
<!--    <div class="option titleImgInit" v-html="question.title"></div>-->
    <question-title :title="question.title"></question-title>
    <Question :pagetype="pagetype" :question="question" answerType="studentAnswer"></Question>
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

  export default class TextMatchTest extends Vue {
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
  }
</script>

<style lang="scss">

</style>
