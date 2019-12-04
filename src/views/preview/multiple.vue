<template>
  <div id="stageEvaluation" :class="'homework-' + EvaluationType" class="pad-staged">
    <div class="bg-grassland">
      <div class="bg-grass-arc"></div>
    </div>
    <div class="book-shadow"></div>
    <img v-show="!answerSheetVisible" class="pad-homework__trigger-menu pad-button pad-button--circle "
         :src="require('packages/theme/assets/answer-sheet/trigger-menu@2x.png')" alt=""
         @click="answerSheetVisible = true" />
    <!--todo: 答题卡长度优化，答题卡文字优化-->
    <answer-sheet
      v-model="answerSheetVisible"
      :dataSource="answerSheetDataSource"
      :text="answerSheetText"
      @child-click="handleAnseerSheetChildClick"
      :pagetype="this.allowEdit ? 'test' : 'report'"
      :class="[{'pad-staged__report-answer-sheet': EvaluationType === 'report'}]"
    >
    </answer-sheet>
    <div
      v-if="(EvaluationType === 'report') || showQuestions"
      id="main-container"
      :class="'bg-' + EvaluationType"
    >
      <count-down
        v-show="allowEdit"
        v-bind="countDownData"
        @timeChange="handleCountDownChange"
      >
        <slot>
          <i class="icon-clock"></i>
        </slot>
        <slot slot="hours"><span>&nbsp;:&nbsp;</span></slot>
        <slot slot="minutes"><span>&nbsp;:&nbsp;</span></slot>
      </count-down>
      <div v-if="allowEdit" v-show="false" ><audio ref="audio-for-submit-by-user" :src="audioSourceForSubmitByUser" ></audio></div>
      <div id="border-container">
        <div class="question-number">
          <div>{{currentQuestionIndex + 1}}/{{questionCount}}</div>
        </div>
        <div class="question-window">
          <div
            :style="{width: (questionCount * 100) + '%', transform: 'translateX(-' + currentQuestionIndex * 100 / questionCount + '%)', transition: 'transform 1s'}"
            class="slide-box"
          >
            <Question
              :pagetype="EvaluationType"
              v-for="(question, index) in homeworkQuestionList"
              :question="question"
              :key="index"/>
          </div>
        </div>
      </div>
      <div id="command">
        <button v-if="currentQuestionIndex > 0" class="last-btn" playAudio="true" @click="handlePrevClick" id="lastSubject">上一题</button>
        <button v-show="NextQuestionButtonVisible" class="next-btn" playAudio="true"
                @click="handleNextButtonClick">{{commandState}}
        </button>
      </div>

    </div>
    <confirm
      v-show="CountDownDialogVisible"
      @confirm="handleConfirm(4)"
      :showCancel="false"
      headerStyle="padding: 0;"
      confirmText="知道啦"
      wrapperStyle="padding-top: 0;"
    >
      <header class="pad-staged__dialog-header" slot="header">
        <img class="pad-staged__dialog-header-icon"
             :src="require('packages/theme/assets/stage-evaluation/img_pop_warn@2x.png')" alt="">
      </header>
      <p class="pad-staged__dialog-text">还有<span>{{Math.ceil(ResetTime / 60)}}分钟</span>做题时间就结束啦<br>请尽快答题哦~</p>
    </confirm>
  </div>
</template>

<script lang="ts">
  import {Component, Provide, Vue} from 'vue-property-decorator';
  import MakeData from 'service/data/stage-evaluation-data.ts';
  import Question from 'modules/question/index.vue';
  import CountDown from 'modules/count-down/index.vue';
  import MagicFruitProcess from 'modules/magic-fruit/index.vue';
  import {questionDialog, testFirstTips, exit} from 'modules/native-tips';
  import {playSvga, stopSvga} from 'plugins/svga.ts';
  import Button from 'components/button.vue';
  import Confirm from 'components/confirm.vue';
  import {isMobile} from '@/utils/ua';
  import {setHeader} from '@/utils';


  enum ActionType {
    SuccessConfirm = 0,
    SuccessCancel,
    ErrorConfirm,
    ErrorCancel,
    CountDownConfirm,
    CountDownSuccessConfirm,
    CountDownCancel,
    ExitConfirm,
    ExitCancel
  }

  enum EvaluationType {
    report = 'report',
    test = 'test'
  }

  enum SubmitState {
    start = 0,
    loading,
    done,
    error
  }

  @Component({
    components: {
      Question,
      CountDown,
      MagicFruitProcess,
      Modal: () => import('modules/modal/index.vue'), // 弹窗
      AnswerSheet: () => import('components/answer-sheet.vue'),
      PadButton: Button,
      Confirm
    },
  })

  export default class StageEvaluation extends Vue {
    // private NextQuestionButtonVisible: boolean = false;
    private NextQuestionButtonDisabled: boolean = false;
    // private SubmitButtonVisible: boolean = false;
    private SubmitButtonDisabled: boolean = false;
    private SuccessDialogVisible: boolean = false;
    private ErrorDialogVisible: boolean = false;
    private CountDownDialogVisible: boolean = false;
    private AutoSubmitDialogVisible: boolean = false;
    private ExitConfirmVisible: boolean = false;
    private SubmitState: number = SubmitState.start;
    private ResetTime: number = 0;
    private isMobile: boolean = isMobile();
    private ErrorIndex: number = 0;

    private EvaluationType: string = 'test';

    private questionsData: any = '';
    private currentQuestionIndex: number = 0;
    private questionCount: number = 0;
    private homeworkId: number | number | null = 0;
    private homeworkQuestionList: any[] = [];
    private allowEdit: boolean = this.$store.getters.allowEdit;
    private showQuestions: boolean = false;
    private totalCompleted: number = 0;
    private costTimeFontSize: any = 16;
    private correctMode: number = 2;
    private whichUnitTimeShow: any = 0; //  作业花费时间的显示格式
    private modalData: any = '';
    private defaultModalData: object = {
      content: '', // 主要显示内容，支持 string 和 字符串模板
      dialog: false, // 是否显示 ‘确认和取消按键’
      okText: '', // 确定按键显示的文字
      cancelText: '', // 取消按键显示的文字
      submitOk: '', // 点击确定调用的函数
      submitCancel: '', // 点击取消调用的函数
      duration: 1500, // 没有确认和取消按钮时，modal 在duration ms 之后消失
      animationName: 'slide-fade', // 弹窗动画名称，支持自定义
      customClass: '',
    };
    private showModal: boolean = false;
    private countDownData = {
      play: true,
      pause: false,
      totalTime: 20.25 * 60,
      timeToWarn: 5 * 60,
      secondsCountdown: 10,
      changeCallBack: false,
    };
    private magicFruitData = {
      currentIndex: 0,
      numberToGetMagicFruit: 5,
      totalSubjectsNumber: 15,
      addNumberEachTime: 1
    };
    private answerSheetVisible: boolean = false;
    private answerSheetDataSource: any[] = [];
    private answerSheetText: string = '这是答题卡';
    private hasAnswerMaxIndex: number = -1; // 当前用户已做过的且值最大的index
    private questionBeenClickedTimes: number = 0; // 题目区域被点击的次数
    private questionBeenClickedJustNow: boolean = false;
    private magicFruitNumber: number = 0;
    private slideBoxTransformSwitch: boolean = false;
    private audioSourceForSubmitByUser: string = require('../../assets/media/submit-by-user.mp3');
    @Provide() private goNextPage = this.goNext;

    private get NextQuestionButtonVisible() {
      const index: number = this.currentQuestionIndex;
      const questions: any[] = this.$store.state.questionsData.questions || [];
      return (index + 1) < questions.length;
    }

    private get SubmitButtonVisible() {
      if (this.SubmitState === SubmitState.error) {
        this.SubmitButtonDisabled = false;
        return this.currentQuestionIndex === this.ErrorIndex;
      }
      if (!this.allowEdit) {
        this.SubmitButtonDisabled = true;
        return false;
      }
      const index: number = this.currentQuestionIndex;
      const n: number = index + 1;
      const questions: any[] = this.$store.state.questionsData.questions || [];
      const type = questions && questions[index].type;
      let stuAnswer: any = questions && (questions[index].stuAnswer || '');
      if (type === 'multiSelect') {
        stuAnswer = stuAnswer && stuAnswer.replace(/\|/g, '') || '';
      }
      const undoList: any[] = questions.filter((qus: any) => {
        const _stuAnswer: any = qus.stuAnswer;
        if (_stuAnswer instanceof Array) {
          return _stuAnswer.length === 0 && (this.SubmitButtonDisabled = true);
        } else {
          return this.SubmitButtonDisabled = !_stuAnswer;
        }
      });
      if (stuAnswer instanceof Array) {
        this.SubmitButtonDisabled = stuAnswer.length === 0 || undoList.length > 0;
        // stuAnswer.length === 0 && (this.SubmitButtonDisabled = true);
      } else {
        this.SubmitButtonDisabled = !stuAnswer || undoList.length > 0;
      }
      return n === questions.length;
    }

    private mounted() {
      this.$register('countDownContinue', this.countDownContinue);
      window.addEventListener('message', (event) => { // 子获取父消息
        if (event.data.action && event.data.action === 'testPreview') {
          this.getHomework(event.data.data);
          // this.questionDataFormat(event.data.data);
        }
      }, false);
      window.parent.postMessage({
        action: 'ready',
        data: {
          origin: 'testPreview',
        }
      }, '*');
    }

    /**
     * 获取魔力果配置
     */
    private async getMagicFruitOptions() {
      const info: {
        itemNum: number;                // 题目数, 表示每做 itemNum 题 可以获得 score 个魔力果
        score: number;                  // 魔力果数, 动画 +1 时用来替换 1 的数目
      } = await this.$api['evaluationStaged/magic']();
      this.$set(this.magicFruitData, 'numberToGetMagicFruit', info.itemNum);
      this.magicFruitData.numberToGetMagicFruit = info.itemNum;
      this.magicFruitData.addNumberEachTime = info.score;
    }

    /**
     * 倒计时更改回调
     * @param time
     */
    private async handleCountDownChange(time: number) {
      this.ResetTime = time;
      if (this.ResetTime === 300) {
        this.CountDownAction('stop');
        this.CountDownDialogVisible = true;
      }
      if (this.ResetTime === 0) {
        this.CountDownAction('stop');
      }
    }

    private startTest() {
      setHeader('');
    }

    private get commandState() {
      const index = this.currentQuestionIndex;
      const infos = this.$store.getters.questionsData;
      const type = infos.questions && infos.questions[index].type;
      if (this.EvaluationType === EvaluationType.test) {
        if (this.isMobile) {
          questionDialog(type, this.countDownPause);
        }
        this.answerSheetDataSourceChange();
      }
      return '下一题';
    }

    private countDownPause() {
      console.log('countDownPause');
      this.countDownData.pause = true;
    }

    private countDownContinue() {
      console.log('countDownContinue');
      this.countDownData.pause = false;
    }

    private answerSheetDataSourceChange() {
      const questions = this.homeworkQuestionList;
      const totalAmount: number = questions.length;
      let doAmount: number = 0;
      this.answerSheetDataSource = questions.map((qus: any) => {
        const correctResult: number = qus.correctResult;
        const stuAnswer: any = qus.stuAnswer;
        let status: string = 'done';
        if (!stuAnswer || ((stuAnswer instanceof Array) && (stuAnswer.length < 1))) {
          status = 'undo';
        }
        // const status: string = stuAnswer && stuAnswer !== '[]' && (stuAnswer instanceof Array && stuAnswer.length > 0) ? 'done' : 'undo';
        status === 'done' && doAmount++;
        return {
          status
        };
      });
      this.undoAmount = totalAmount - doAmount;
      this.answerSheetText = `共${totalAmount}题，已完成${doAmount}题`;
    }

    private async handleConfirm(type: number) {
      switch (type) {
        case ActionType.CountDownConfirm:
          this.CountDownDialogVisible = false;
          this.CountDownAction('start');
          break;
        case ActionType.ErrorConfirm:
          this.ErrorDialogVisible = false;
          try {
            await this.submit();
            this.SuccessDialogVisible = true;
            this.SubmitState = SubmitState.done;
          } catch (err) {
            this.ErrorDialogVisible = true;
            this.SubmitState = SubmitState.error;
          }
          break;
        case ActionType.ExitConfirm:
          this.ExitConfirmVisible = false;
          this.CountDownAction('start');
          break;
      }
    }

    private stateDependQuestions(questions: any) {
      this.homeworkQuestionList = questions;
      if (this.allowEdit) {
        this.getNoAnswerQuestionIndex(questions);
      }
      if (this.EvaluationType === 'test') {
        this.setAnswerSheetData(questions.length || 0);
      }
      this.questionCount = questions.length;
    }

    private async getHomework(testInfo: any) {
      this.EvaluationType = EvaluationType.test;
      this.allowEdit = true;
      this.$store.dispatch('set_allow_edit', this.allowEdit ? 0 : 1);
      let questionList: any[] = [];
      questionList = await this.getQuestionData(testInfo);
      const info = new MakeData(questionList);
      this.$store.dispatch('set_questions_data', info.data);
      const data: any = this.$store.getters.questionsData;
      const {questions} = data;
      this.stateDependQuestions(questions);
      this.formatDataWhichDependOnReq(questions);
      this.showQuestions = true;
    }

    private formatDataWhichDependOnReq(questions: any[]) {
      if (this.allowEdit) {
        this.$set(this.magicFruitData, 'totalSubjectsNumber', questions.length);
      } else {
        this.countDownData.pause = true;
        this.getTotalCompleted(this.homeworkQuestionList);
      }
    }

    private async getQuestionData(testInfo: any) {
      const {name, suggestTime, questionList}: {
        name: string;
        suggestTime: number;                                    // 测试考试时间（分）
        questionList: any[];                                    // 试题列表
      } = testInfo;
      setHeader(name);
      this.countDownData.totalTime = suggestTime * 60;
      return questionList;
    }

    private setAnswerSheetData(totalSubjectsNumber: number) {
      let i = 0;
      while (i < totalSubjectsNumber) {
        this.answerSheetDataSource.push({status: 'undo', enable: true});
        i++;
      }
    }

    private getTotalCompleted(questions: any) {
      let totalCompleted: number = 0;
      questions.forEach((item: any, index: number) => {
        if (!!item.stuAnswer && item.stuAnswer !== '[]') {
          if (!(item.stuAnswer instanceof Array) || item.stuAnswer.length > 0) {
            totalCompleted++;
          }
        }
      });
      this.totalCompleted = totalCompleted;
    }

    private getNoAnswerQuestionIndex(questions: any) {
      let totalCompleted: number = 0;
      let noAnswerQuestionIndex: number = 0;
      questions.forEach((item: any, index: number) => {
        if (!!item.stuAnswer) {
          if (!(item.stuAnswer instanceof Array) || item.stuAnswer.length > 0) {
            totalCompleted++;
          } else if (!noAnswerQuestionIndex) {
            noAnswerQuestionIndex = index + 1; // index 之所以 + 1 是为了 防止 noAnswerQuestionIndex === 0 且 当前题目学生的答案为空时，noAnswerQuestionIndex 重复赋值，下同
          }
        } else if (!noAnswerQuestionIndex) {
          noAnswerQuestionIndex = index + 1;
        }
      });
      this.totalCompleted = totalCompleted;
      this.currentQuestionIndex = noAnswerQuestionIndex === 0 ? 0 : noAnswerQuestionIndex - 1;
    }

    private handleNextButtonClick($e: any) {
      console.log('next question');
      this.getTotalCompleted(this.homeworkQuestionList);
      this.currentQuestionIndex++;
      this.magicFruitData.currentIndex = this.currentQuestionIndex;
    }

    private hasStuAnswer(stuAnswer: any): boolean {
      if (typeof stuAnswer === 'string') {
        return !(stuAnswer === '' || stuAnswer === '[]');
      }
      if (stuAnswer instanceof Array) {
        return stuAnswer.length > 0;
      }
      return false;
    }

    private async goNext($event: any) {
      this.getTotalCompleted(this.homeworkQuestionList);
      if (this.currentQuestionIndex > this.questionCount - 1) {
        console.log('======0', 'return');
        return;
      } else if (this.currentQuestionIndex === this.questionCount - 1) {
        console.log('======', 'check');

        if ($event && $event.target.id === 'commandButton') {
          console.log('======1', 'begin');
          window.GLOBAL.vbus.$emit('submitCheck');
        }
        return;
      }
      // this.saveResult($event);
      this.currentQuestionIndex++;
    }

    private handlePrevClick($event: any) {
      if (this.currentQuestionIndex <= 0) {
        return;
      }
      // this.saveResult($event);
      this.getTotalCompleted(this.homeworkQuestionList);
      this.currentQuestionIndex--;
    }

    /**
     * 答题卡按钮点击事件
     * @param index {Number} 数组索引，0开头
     */
    private handleAnseerSheetChildClick(index: number) {
      this.answerSheetVisible = false;
      this.currentQuestionIndex = index;
    }

    private CountDownAction(_action: string) {
      this.countDownData.pause = _action === 'stop';
    }
  }
</script>

<style lang="scss">
  #stageEvaluation {
    position: relative;
    height: 100%;
    width: 100%;
    color: #2c3e50;
    background: linear-gradient(to bottom, #8EB2FF, #F6FFF2);
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;

    .zmsubline {
      display: inline-block;
      width: 60px;
      border-bottom: 2px solid #2c3e50;
    }

    #main-container {
      position: absolute;
      height: 630px;
      width: 960px;
      bottom: 55px;
      background-size: 100% 100%;
      left: 50%;
      margin-left: -480px;

      #border-container {
        position: absolute;

        .question-number {
          position: absolute;
          background-color: #FF6969;
          color: #fff;
          border-radius: 0 14px 14px 0;
          font-size: 16px;
          line-height: 30px;
          width: 50px;
          text-align: center;
          top: 24px;
          left: 0;
          padding-right: 6px;
          z-index: 2;
          @include disableUserSelect();
        }

        .question-window {
          height: 100%;
          position: relative;
          overflow: hidden;
          padding-top: 14px;

          .slide-box {
            height: 100%;
            width: 200%;
            display: flex;
            flex-direction: row;
            position: absolute;
            /*transition: transform 1s;*/
          }
        }
      }

      #command {
        position: absolute;
        bottom: -40px;
        left: 50%;
        transform: translateX(-50%);
        @include disableUserSelect();

        .next-btn {
          @include DefaultRedBtn(56px);
          @include btnScale(1.1);

          &:disabled {
            @include DefaultGrayBtn(56px);
            line-height: 47px;
          }

          width: 200px;
          height: 53px;
          margin: 0 20px;
          font-family: PingFangSC-Semibold;
          line-height: 47px;
          font-size: 24px;
          color: #FFFFFF;
          letter-spacing: 0;
          text-align: center;
          background-size: contain;
          padding: 0 10px 0 0;

          &::before {
            position: absolute;
            top: 50%;
            right: 20px;
            transform: none;
            margin-top: -12px;
            content: '';
            display: inline-block;
            width: 24px;
            height: 24px;
            background: url('../../assets/images/stageEvaluation/icon_arrow_right@2x.png') center center no-repeat / 100%;
            vertical-align: top;
          }
        }

        .last-btn {
          @include DefaultYellowBtn(56px);
          @include btnScale(1.1);
          width: 200px;
          height: 53px;
          margin: 0 20px;
          font-family: PingFangSC-Semibold;
          line-height: 47px;
          font-size: 24px;
          color: #FFFFFF;
          letter-spacing: 0;
          text-align: center;
          background-size: contain;
          padding: 0 0 0 10px;

          &::before {
            position: absolute;
            top: 50%;
            left: 20px;
            transform: none;
            margin-top: -12px;
            content: '';
            display: inline-block;
            width: 24px;
            height: 24px;
            background: url('../../assets/images/stageEvaluation/icon_arrow_left@2x.png') center center no-repeat / 100%;
            vertical-align: top;
          }
        }
      }
    }

    .bg-test {
      @include disableUserSelect();
      background: url("../../assets/images/common/work_board@2x.png") center;

      #border-container {
        top: 3.5%;
        bottom: 45px;
        left: 2%;
        right: 2%;
      }
    }

    .icon-clock {
      width: 16px;
      height: 20px;
      margin-right: 7px;
      background: url("../../assets/images/stageEvaluation/icon_clock@2x.png") 50% no-repeat / 100%;
    }
  }
</style>
