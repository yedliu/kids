<template>
  <div class="selectAndJudgeSubjects">
<!--    <div class="selectAndJudgeSubjectTitle option" v-html="question.title"></div>-->
    <question-title :title="question.title"></question-title>
    <div class="selectAndJudgeSubjectOption">
      <!--<div v-if="question.titleImgUrl" class="pictureInStem" >-->
        <!--<div :style="{backgroundImage: 'url(' + question.titleImgUrl + ')'}">-->
        <!--</div>-->
      <!--</div>-->
      <ul :class="analysisStyle">
        <li
          v-for="(option, index) in question.optionList"
          :key="question.id+index"
          :class="[
            option.image ? 'pictureOption' : 'textOption',
            !allowEdit && question.correctAnswer && question.correctAnswer.indexOf(option.index) > -1  ? 'rightOption': !allowEdit && question.stuAnswer && question.stuAnswer.indexOf(option.index)  > -1 ? 'wrongOption' : '',
            allowEdit && question.stuAnswer && question.stuAnswer.indexOf(option.index) > -1 ? 'selectedOption' : ''
          ]"
          @click="selectOption(option, question)"
        >
          <i>{{option.index}}</i>
          <div  v-if="option.image"  :style="{backgroundImage:'url(' + option.image + ')'}">
            <!--<img v-if="option.image" :src="option.image" :alt="option.image">-->
          </div>
          <p v-else-if="option.text" v-html="initialOption(option.text)" class="latexSelection">{{initialOption(option.text)}}</p>
        </li>
      </ul>
    </div>
    <analysis-content :question="question" v-if="!allowEdit"></analysis-content>
    <!--<analysis-content :question="question" v-if="allowEdit"></analysis-content>-->
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Inject, Vue } from 'vue-property-decorator';
  import renderToKatex from 'service/data/utils/questionFormula';
  import QuestionTitle from 'components/homework/title_question.vue';

  @Component({
    components: {
      QuestionTitle,
      'analysis-content': () => import('../../analysis/index.vue'),
    }
  })

  export default class SingleSelect extends Vue {
    @Prop({
      type: Object,
      default: ''
    })
    private question: any;

    @Inject() private goNextPage!: any;

    private allowEdit = this.$store.getters.allowEdit;
    private analysisStyle = this.allowEdit ? '' : 'analysisStyle';
    private nextQuestion = 0;

    private title: any = '';
    private option: any = '';

    private selectOption(option: any, question: any) {
      if (!this.allowEdit) { return false; }
      // if (question.type === 'singleSelect') {
      //   (this.nextQuestion > 0) && clearTimeout(this.nextQuestion);
      //   this.nextQuestion = setTimeout( () => {
      //   this.goNextPage();
      //   }, 500);
      // }

      this.$store.dispatch('set_current_answer', {id: question.id, type: question.type, stuAnswer: option.index});
    }

    private includeZmlatex(text: any) {
      return text.indexOf('<zmlatex') > -1;
    }

    private initialOption(text: any) {
      return renderToKatex(text.replace(/xLongequal/g, 'xlongequal'));
    }
  }

</script>

