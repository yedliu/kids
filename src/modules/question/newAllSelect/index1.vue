<template>
  <div class="pad-select-with-jude">
<!--    <div class="selectAndJudgeSubjectTitle option" v-html="question.title"></div>-->
    <question-title :title="question.title"></question-title>
    <!-- 题干音频 -->
    <!-- <div class="select-option-audio" :class="{'active-playing-option': playing}"></div> -->
    <div class="pad-select-with-jude__option">
      <div v-if="question.titleImgUrl" class="pad-select-with-jude__pictureinstem" >
        <div class="pad-select-with-jude__img" :style="{backgroundImage: 'url(' + question.titleImgUrl + ')'}"></div>
      </div>
      <ul class="pad-select-with-jude__optioncontain" :class="[{'pad-select-with-jude__optioncontain--pic': question.titleImgUrl},{'pad-select-with-jude__analysisStyle': analysisStyle}]">
        <li
          v-for="(option, index) in question.optionList"
          :key="question.id+index"
          :class="[
            option.image ? 'pad-select-with-jude__pictureOption' : 'pad-select-with-jude__textOption',
            option.image && !allowEdit && question.correctAnswer && question.correctAnswer.indexOf(option.index) > -1  ? 'pad-select-with-jude__pictureOption--rightOption': option.image && !allowEdit && question.stuAnswer && question.stuAnswer.indexOf(option.index)  > -1 ? 'pad-select-with-jude__pictureOption--wrongOption' : '',
            !option.image && !allowEdit && question.correctAnswer && question.correctAnswer.indexOf(option.index) > -1  ? 'pad-select-with-jude__textOption--rightOption': !option.image && !allowEdit && question.stuAnswer && question.stuAnswer.indexOf(option.index)  > -1 ? 'pad-select-with-jude__textOption--wrongOption' : '',
            { 'pad-select-with-jude__pictureOption--selected': option.image && allowEdit && question.stuAnswer && question.stuAnswer.indexOf(option.index) > -1},
            { 'pad-select-with-jude__textOption--selected': !option.image && allowEdit && question.stuAnswer && question.stuAnswer.indexOf(option.index) > -1}
           ]"
          @click="selectOption(option, question, index)"
        >
        <!-- 依据bem格式编写，此处不该在dom加入如此多的计算，准备使用grid布局重构此页面(next version) -->
          <i :class="['pad-select-with-jude__text',
            {'pad-select-with-jude__text--picoption': option.image},
            option.image && !allowEdit && question.correctAnswer && question.correctAnswer.indexOf(option.index) > -1  ? 'pad-select-with-jude__text--picright': option.image && !allowEdit && question.stuAnswer && question.stuAnswer.indexOf(option.index)  > -1 ? 'pad-select-with-jude__text--picwrong' : '',
            !option.image && !allowEdit && question.correctAnswer && question.correctAnswer.indexOf(option.index) > -1  ? 'pad-select-with-jude__text--textright': !option.image && !allowEdit && question.stuAnswer && question.stuAnswer.indexOf(option.index)  > -1 ? 'pad-select-with-jude__text--textright' : '',
            {'pad-select-with-jude__text--picselected': option.image && allowEdit && question.stuAnswer && question.stuAnswer.indexOf(option.index) > -1},
          ]">{{option.index}}</i>
          <div class="pad-select-with-jude__img" v-if="option.image"  :style="{backgroundImage:'url(' + option.image + ')'}">
          </div>
          <p class="pad-select-with-jude__content" v-else-if="option.text" v-html="initialOption(option.text)">{{initialOption(option.text)}}</p>
          <!-- 选项audio -->
          <!-- <div class="option-audio" @click.stop="playAudio(option, index)" :class="{'active-playing': currentIndex === index && playing}">
          </div> -->
        </li>
      </ul>
    </div>
    <analysis-content :question="question" v-if="!allowEdit"></analysis-content>
     <!-- <audio
          id="question-audio" 
          ref="questionAudio" 
          @ended="end"
          @play="play"
          @canplay="ready" 
          @error="error" 
        ></audio> -->
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Inject, Vue } from 'vue-property-decorator';
  import renderToKatex from 'service/data/utils/questionFormula';
  import QuestionTitle from 'components/homework/title_question.vue';
  import TypeSelect from '../typeSelect/Question.vue';

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
    private selectOption(option: any, question: any, index: number) {
      if (!this.allowEdit) { return false; }
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

// <style lang="scss">
//   .option-audio {
//     width: 54px;
//     height: 54px;
//     border-radius: 50%;
//     margin-left: 5px;
//     background-image: url('../../../assets/images/homework/typeSelect/btn_yellow_horn@2x.png');
//     background-position: center center;
//     background-size: cover;
//     &.active-playing {
//       background: #f40;;
//     }
//   }
//   .select-option-audio {
//       width: 96px;
//       height: 40px;
//       background-image: url('../../../assets/images/homework/typeSelect/icon_blue_horn@2x.png');
//       background-position: center center;
//       background-size: cover;
//       border-radius: 20px;
//       margin: 14px 0px 34px 66px;
//       &.active-playing-option {
//         background: orange;
//       }
//   }
// </style>

