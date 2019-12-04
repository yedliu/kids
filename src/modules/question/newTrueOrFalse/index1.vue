<template>
  <div class="pad-select-with-jude">
<!--    <div class="judeAndJudgeSubjectTitle np option" v-html="question.title"></div>-->
    <question-title :title="question.title"></question-title>
    <div class="pad-select-with-jude__option">
      <div v-if="question.titleImgUrl" class="pad-select-with-jude__pictureinstem" >
        <div class="pad-select-with-jude__img" :style="{backgroundImage: 'url(' + question.titleImgUrl + ')'}"></div>
      </div>
      <ul :class="['pad-select-with-jude__optioncontain',  question.titleImgUrl ? 'pad-select-with-jude__optioncontain--judepic' : 'pad-select-with-jude__optioncontain--judenopic',]">
        <li :class="['pad-select-with-jude__judgeOption',
        question.titleImgUrl ? 'pad-select-with-jude__judgeOption--pic' : 'pad-select-with-jude__judgeOption--nopic',
        {'pad-select-with-jude__judgeOption--more': !allowEdit}
        ]" @click="judeOption('A', question)">
          <img :src="currentOptionAUrl" :alt="question.optionList[0] ? 'right' : 'wrong'" />
        </li>
        <li :class="['pad-select-with-jude__judgeOption',
        question.titleImgUrl ? 'pad-select-with-jude__judgeOption--pic' : 'pad-select-with-jude__judgeOption--nopic',
        {'pad-select-with-jude__judgeOption--more': !allowEdit}
        ]" @click="judeOption('B', question)">
          <img :src="currentOptionBUrl" :alt="question.optionList[0] ? 'wrong' : 'right'" />
        </li>
      </ul>
    </div>
    <analysis-content :question="question" v-if="!allowEdit"></analysis-content>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Inject, Vue } from 'vue-property-decorator';
  import QuestionTitle from 'components/homework/title_question.vue';


  @Component({
    components: {
      QuestionTitle,
      'analysis-content': () => import('../../analysis/index.vue')
    }
  })

  export default class TrueOrFalse extends Vue {
    @Prop({
      type: Object,
      default: ''
    })
    private question: any;

    @Inject() private goNextPage!: any;
    private allowEdit: any = this.$store.getters.allowEdit;
    private analysisStyle = this.allowEdit ? '' : 'analysisStyle';
    private baseImgUrl: string = '';
    private optionsImgUrl: any = {
      right_jude: require('@/assets/images/homework/report/btn_judge_right_s.png'),
      right_unjude: require('@/assets/images/homework/report/btn_judge_right_n.png'),
      wrong_jude: require('@/assets/images/homework/report/btn_judge_wrong_s.png'),
      wrong_unjude: require('@/assets/images/homework/report/btn_judge_wrong_n.png')
    };
    private currentOptionAUrl: any = this.optionsImgUrl.right_unjude;
    private currentOptionBUrl: any = this.optionsImgUrl.wrong_unjude;
    private nextQuestion = 0;
    private created()  {
      // this.question.titleImgUrl = 'https://question-image.zmlearn.com/qb_test/20190219111024_3155.jpg';
      const stuAnswer = this.question.stuAnswer;
      const correctAnswer = this.question.correctAnswer;
      const optionA = this.question.optionList[0];
      const optionB = this.question.optionList[1];
      const rus = this.optionsImgUrl.right_unjude;
      const wus = this.optionsImgUrl.wrong_unjude;
      const rs = this.optionsImgUrl.right_jude;
      const ws = this.optionsImgUrl.wrong_jude;

      this.currentOptionAUrl = optionA ? rus : wus;
      this.currentOptionBUrl = optionB ? rus : wus;
      if ((stuAnswer === 'A' && this.allowEdit)  || (correctAnswer === 'A' && !this.allowEdit)) {
        this.currentOptionAUrl = optionA ? rs : ws;
      } else if ((stuAnswer === 'B' && this.allowEdit) || (correctAnswer === 'B' && !this.allowEdit)) {
        this.currentOptionBUrl = optionB ? rs : ws;
      }
    }
    private judeOption(option: any, question: any) {
      if (!this.allowEdit) { return false; }
      const rus = this.optionsImgUrl.right_unjude;
      const wus = this.optionsImgUrl.wrong_unjude;
      const rs = this.optionsImgUrl.right_jude;
      const ws = this.optionsImgUrl.wrong_jude;
      const optionA = this.question.optionList[0];
      const optionB = this.question.optionList[1];
      if (option === 'A') {
        this.currentOptionAUrl = optionA ? rs : ws;
        this.currentOptionBUrl = optionB ? rus : wus;
      } else if (option === 'B') {
        this.currentOptionAUrl = optionA ? rus : wus;
        this.currentOptionBUrl = optionB ? rs : ws;
      }
      this.$store.dispatch('set_current_answer', {id: question.id, type: question.type, stuAnswer: option});
    }
  }
</script>
