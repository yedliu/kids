<template>
  <div :class="'homework-reorder-text ' + pagetype" @scroll="scroll($event)" ref="mainBox">
<!--    <div class="option titleImgInit" v-html="question.title"></div>-->
    <question-title :title="question.title"></question-title>
    <Question :pagetype="pagetype" :question="question" answerType="stuAnswer" :scrollIng="scrollIng" :scrollTop="scrollTop" @scrollup="onScrollUp" @scrollstop="onScrollStop"></Question>
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

  export default class ReorderText extends Vue {
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

    private scrollTop: number = 0;
    private scrollIng: boolean = false;
    private scrollUpInterval: any = null;

    private scroll(e: any) {
      this.scrollTop = e.target.scrollTop;
    }

    private onScrollUp() {
      const mainBox: any = this.$refs.mainBox;
      const scrollTop = this.scrollTop;
      if (this.scrollIng) {
        return;
      }
      this.scrollIng = true;
      this.scrollUpInterval = setInterval(() => {
        if (!(scrollTop > 0)) {
          return;
        }
        mainBox.scrollTop = mainBox.scrollTop - 2;
      }, 10);
    }

    private onScrollStop() {
      this.scrollIng = false;
      clearInterval(this.scrollUpInterval);
    }
  }
</script>

<style lang="scss">

</style>
