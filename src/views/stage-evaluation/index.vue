<template>
  <div id="stageEvaluation" :class="'homework-' + EvaluationType" class="pad-staged">
    <div v-if="!isMobile && !isGuide" class="cloud-left"></div>
    <div v-if="!isMobile && !isGuide" class="cloud-right"></div>
    <div v-if="isGuide" class="cloud-small cloud-small-1"></div>
    <div v-if="isGuide" class="cloud-small cloud-small-2"></div>
    <div v-if="isGuide" class="cloud-small cloud-small-3"></div>
    <div class="bg-grassland">
      <div class="bg-grass-arc"></div>
      <div :class="['bottom-partner', {'partner-mmt': this.partnerName === '美美兔'}, {'partner-ddx': this.partnerName === '呆呆熊'}]" v-if="(EvaluationType === 'test') && isGuide"></div>
    </div>
    <div class="book-shadow" v-if="(EvaluationType === 'report') || !isGuide"></div>

    <div v-if="(EvaluationType === 'test') && showQuestions && isGuide" class="guide-container">
      <div class="guide-bottom-wood wood-left"></div>
      <div class="guide-bottom-wood wood-right"></div>
      <div class="guide-main">
        <p>{{User.name}}宝贝，你好：</p>
        <p style="text-indent: 50px">本套测评试卷共{{homeworkQuestionList.length}}道题，请宝贝在<span style="color: #FF5E65">{{Number.parseInt(countDownData.totalTime / 60)}}分钟内独立完成</span>该测评试卷，建议提前准备好纸和笔：祝宝贝取得好成绩！
        </p>
        <p style="text-align: right">——您的学习伙伴{{this.partnerName}}</p>
        <div class="start-test" playAudio="true" @click="startTest()">开始测评</div>
      </div>
    </div>
    <img v-show="!answerSheetVisible && (!isGuide || EvaluationType === 'report')" class="pad-homework__trigger-menu pad-button pad-button--circle "
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
      <!--<pad-button-->
        <!--v-if="this.allowEdit"-->
        <!--slot="footer"-->
        <!--round-->
        <!--type="danger"-->
        <!--size="large"-->
        <!--@click="handleSubmitClick"-->
        <!--style="width: 200px"-->
      <!--&gt;提交测评-->
      <!--</pad-button>-->
    </answer-sheet>
    <magic-fruit-process
      v-if="EvaluationType === 'test' && !Retry && !isGuide"
      v-bind="magicFruitData"
      @getFruitNumber="getMagicFruitNumber"
    ></magic-fruit-process>
    <div
      v-if="(EvaluationType === 'report') || (showQuestions && !isGuide)"
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
            :style="{width: (questionCount * 100) + '%', transform: 'translateX(-' + currentQuestionIndex * 100 / questionCount + '%)', transition: slideBoxTransformSwitch ? 'transform 1s' : 'none'}"
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
        <button v-show="NextQuestionButtonVisible" class="next-btn" :disabled="NextQuestionButtonDisabled" playAudio="true"
                @click="handleNextButtonClick">{{commandState}}
        </button>
        <button v-show="SubmitButtonVisible" class="next-btn" :disabled="SubmitButtonDisabled" playAudio="true"
                @click="handleSubmitClick">提交测评
        </button>
      </div>
      <div id="loadingSvga" class="svga-loading" v-show="showLoading"></div>

    </div>
    <confirm
      v-show="SuccessDialogVisible"
      @confirm="handleConfirm(0)"
      @cancel="handleCancel(1)"
      headerStyle="padding: 0;"
      cancelText="返回"
      confirmText="查看测评结果"
      wrapperStyle="padding-top: 0;"
    >
      <header class="pad-staged__dialog-header" slot="header">
        <img class="pad-staged__dialog-header-icon"
             :src="require('packages/theme/assets/stage-evaluation/img_pop_success@2x.png')" alt="">
      </header>
      <p class="pad-staged__dialog-title">太棒啦，题目都做完啦~</p>
      <p class="pad-staged__dialog-text">本次测评获得了{{magicFruitNumber}}个能量果，下次继续加油哦</p>
    </confirm>
    <confirm
      v-show="ErrorDialogVisible"
      @confirm="handleConfirm(2)"
      @cancel="handleCancel(3)"
      headerStyle="padding: 0;"
      cancelText="取消"
      confirmText="重新提交"
      wrapperStyle="padding-top: 0;"
    >
      <header class="pad-staged__dialog-header pad-staged__dialog-header--gray" slot="header">
        <img class="pad-staged__dialog-header-icon"
             :src="require('packages/theme/assets/stage-evaluation/img_pop_fail@2x.png')" alt="">
      </header>
      <p class="pad-staged__dialog-title">作业提交失败</p>
      <p class="pad-staged__dialog-text">可能是网络异常导致提交失败，请检查网络</p>
    </confirm>
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
    <confirm
      v-show="AutoSubmitDialogVisible"
      @confirm="handleConfirm(5)"
      @cancel="handleCancel(6)"
      headerStyle="padding: 0;"
      cancelText="返回"
      confirmText="查看测评结果"
      wrapperStyle="padding-top: 0;"
    >
      <header class="pad-staged__dialog-header" slot="header">
        <img class="pad-staged__dialog-header-icon"
             :src="require('packages/theme/assets/stage-evaluation/img_pop_success(1)@2x.png')" alt="">
      </header>
      <p class="pad-staged__dialog-text">答题时间已到，测评已提交<br>点击查看测试结果~</p>
    </confirm>
    <confirm
      v-show="ExitConfirmVisible"
      confirmText="继续测评" cancelText="确认退出"
      @confirm="handleConfirm(7)"
      @cancel="handleCancel(8)"
    >
      <p class="pad-staged__dialog-exit-header" slot="header">当前还未完成测评，确定要退出吗？</p>
      <p class="pad-staged__dialog-exit-content">退出后再次进入需重新开始答题</p>
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
  const startTime: number = Date.now();

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
    private ResetTime: number = 0;                                                                  // 倒计时剩余时间（秒）
    private Retry: boolean = false;
    private User: {
      name: string;
      id?: number;
    } = {
      name: ''
    };
    private isMobile: boolean = isMobile();
    private ErrorIndex: number = 0;
    private partnerName: string = '掌小萌';

    private isGuide: boolean = true;
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
    private loadingSvga = require('../../assets/animation/loading.svga');
    private showLoading = false;
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

    private playAudioForSubmitByUser() {
      // 题目全部做完，弹窗中的文字同步以语音形式播放
      const audioNode = this.$refs['audio-for-submit-by-user'];
      if (audioNode) {
        (audioNode as HTMLAudioElement).play();
      }

    }

    private get NextQuestionButtonVisible() {
      if (this.SubmitState === SubmitState.error) {
        this.NextQuestionButtonDisabled = false;
        return this.currentQuestionIndex < this.ErrorIndex;
      }
      const index: number = this.currentQuestionIndex;
      const n: number = index + 1;
      const questions: any[] = this.$store.state.questionsData.questions || [];
      if (!this.allowEdit) {
        this.NextQuestionButtonDisabled = false;
        return n < questions.length;
      }
      const type = questions[index].type;
      let stuAnswer: any = questions[index].stuAnswer;
      if (type === 'multiSelect') {
        stuAnswer = stuAnswer && stuAnswer.replace(/\|/g, '') || '';
      }
      if (stuAnswer instanceof Array) {
        stuAnswer.length === 0 && (this.NextQuestionButtonDisabled = true);
      } else {
        this.NextQuestionButtonDisabled = !stuAnswer;
      }
      return (n === 1 && Boolean(stuAnswer)) || (index > 0 && n < questions.length);
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

    private async created() {
      this.$register('countDownContinue', this.countDownContinue);
      console.log('countDownContinue register...');
      const token = this.$route.query.token || '';
      token && this.$cookie.set('token', token);
      this.getHomework();
      this.getPartnerInfo();
      this.getMagicFruitOptions();
      window.GLOBAL.vbus.$on('stage-exit', () => {
        if (this.EvaluationType === EvaluationType.test) {
          const pageParam = {
            user: this.User,
            platform: this.isMobile ? 'PAD' : 'PC',
            reportType: 'test',
            duration: `${(Date.now() - startTime) * 0.001}秒`
          };
          window.ZM_JSSDK.sendCustomPage({
            pageId: encodeURI(window.location.href),
            pageName: '阶段测评',
            trackerType: 3,
            pageParam: JSON.stringify(pageParam),
          });
          this.ExitConfirmVisible = true;
        } else {
          const {from} = this.$route.query;
          if (from) {
            return this.$router.go(-1);
          }
          exit();
        }
      });
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
     * 从报告页点击题目序号跳转到对应题目页面
     */
    private showQuestionIndexInit() {
      const {index}: any = this.$route.query;
      if (index > 0) {
        this.currentQuestionIndex = index - 1;
      }
      setTimeout(() => {
        this.slideBoxTransformSwitch = true;
      }, 300);
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
        try {
          await this.submit();
          this.AutoSubmitDialogVisible = true;
          this.SubmitState = SubmitState.done;
        } catch (err) {
          this.ErrorDialogVisible = true;
          this.ErrorIndex = this.currentQuestionIndex;
          this.SubmitState = SubmitState.error;
        }
      }
    }

    private startTest() {
      this.isGuide = false;
      setHeader('');
      if (this.isMobile) {
        testFirstTips(this.countDownPause);
      }
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
        case ActionType.CountDownSuccessConfirm:
          this.AutoSubmitDialogVisible = false;
          this.routerToReport();
          break;
        case ActionType.SuccessConfirm:
          this.SuccessDialogVisible = false;
          this.routerToReport();
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

    private handleCancel(type: number) {
      switch (type) {
        case ActionType.SuccessCancel:
          this.SuccessDialogVisible = false;
          break;
        case ActionType.CountDownCancel:
          this.CountDownDialogVisible = false;
          break;
        case ActionType.ExitCancel:
          this.ExitConfirmVisible = false;
          break;
        case ActionType.ErrorCancel:
          this.ErrorDialogVisible = false;
          return;
      }
      const {from} = this.$route.query;
      if (from) {
        return this.$router.go(-1);
      } else {
        exit();
      }
    }

    private routerToReport() {
      const {from} = this.$route.query;
      const query: any = {
        id: this.$route.query.id,
        active: this.$route.query.active
      };
      if (from) {
        query.from = from;
      }
      this.$router.replace({
        name: '阶段测评报告',
        query
      });
    }

    private stateDependQuestions(questions: any) {
      this.homeworkQuestionList = questions;
      if (this.allowEdit) {
        this.getNoAnswerQuestionIndex(questions);
      }
      if (this.EvaluationType === 'test') {
        this.setAnswerSheetData(questions.length || 0);
      } else {
        this.answerResultSheetInit(questions);
      }
      this.questionCount = questions.length;
    }

    private answerResultSheetInit(questions: any[]) {
      let correctAmount: number = 0;
      let incorrectAmount: number = 0;
      let undoAmount: number = 0;
      this.answerSheetDataSource = questions.map((qus: any) => {
        const correctResult: number = qus.correctResult;
        const stuAnswer: any = qus.stuAnswer;
        let status: string = correctResult === 1 ? 'correct' : 'incorrect';
        if (status === 'correct') {
          correctAmount++;
        } else {
          if (!stuAnswer || ((stuAnswer instanceof Array) && (stuAnswer.length < 1))) {
            status = 'undo';
            undoAmount++;
          } else {
            incorrectAmount++;
          }
        }
        return {
          status
        };
      });
      this.answerSheetText = `正确${correctAmount}题，错误${incorrectAmount}题，未作答${undoAmount}题`;
    }

    /**
     * 获取学伴信息
     */
    private async getPartnerInfo() {
      const partnerResult: any = await this.$api['homework/partner']();
      this.partnerName = partnerResult.partnerName;
    }

    private async getHomework() {
      const {id, action: _action}: any = this.$route.query;
      this.Retry = _action === 'retry';
      this.EvaluationType = _action === 'analysis' ? EvaluationType.report : EvaluationType.test;
      this.allowEdit = this.EvaluationType === EvaluationType.test;
      this.$store.dispatch('set_allow_edit', this.allowEdit ? 0 : 1);

      let questionList: any[] = [];

      if (this.allowEdit) {
        questionList = await this.getQuestionData(id);
      } else {
        questionList = await this.getReport(id);
      }

      const info = new MakeData(questionList);

      this.$store.dispatch('set_questions_data', info.data);

      const data: any = this.$store.getters.questionsData;

      const {questions} = data;

      this.stateDependQuestions(questions);
      this.formatDataWhichDependOnReq(questions);

      this.showQuestionIndexInit();
      this.showQuestions = true;
      this.homeworkId = id;
      this.$cookie.set('homeworkId', id);
    }

    private formatDataWhichDependOnReq(questions: any[]) {
      if (this.allowEdit) {
        this.$set(this.magicFruitData, 'totalSubjectsNumber', questions.length);
      } else {
        this.countDownData.pause = true;
        this.getTotalCompleted(this.homeworkQuestionList);
      }
    }

    /**
     * 获取测评题目信息及用户信息
     * @param id
     */
    private async getQuestionData(id: any) {
      const {name, suggestTime, questionList, userName, userId}: {
        name: string;
        suggestTime: number;                                    // 测试考试时间（分）
        questionList: any[];                                    // 试题列表
        userName: string;
        userId: number;
      } = await this.$api['evaluationStaged/content']({
        examInfoId: id
      });
      setHeader(name);
      this.countDownData.totalTime = suggestTime * 60;
      // this.countDownData.totalTime = 5;
      this.User.name = userName;
      this.User.id = userId;
      return questionList;
    }

    /**
     * 获取报告信息
     * @param id
     */
    private async getReport(id: any) {
      const { youngExamReportOutputVO, baseInfo }: {
        youngExamReportOutputVO: any;                                  // 试题列表, 包含结果
        baseInfo: any;
      } = await this.$api['evaluationStaged/report']({
        examInfoId: id
      });

      let examInfoName: any = '';
      let questionList: any[] = [];

      if (youngExamReportOutputVO) {
        console.log(youngExamReportOutputVO);
        examInfoName = youngExamReportOutputVO.examInfoName;
        questionList = youngExamReportOutputVO.questionList;
      }
      if (!examInfoName) {
        examInfoName = baseInfo && baseInfo.subject + '阶段测评报告';
      }
      setHeader(examInfoName);
      console.log(examInfoName);
      console.log(setHeader(examInfoName));
      return questionList;
    }

    private setAnswerSheetData(totalSubjectsNumber: number) {
      let i = 0;
      while (i < totalSubjectsNumber) {
        this.answerSheetDataSource.push({status: 'undo', enable: false});
        i++;
      }
    }

    private showLoadingAnimate() {
      this.showLoading = true;
      return playSvga('loadingSvga', this.loadingSvga);
    }

    private hideLoadingAnimate(player: any) {
      this.showLoading = false;
      stopSvga(player);
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

    private async handleSubmitClick() {
      console.log('submit question');
      if (this.SubmitState > SubmitState.start && this.SubmitState < SubmitState.error) {
        return;
      }
      try {
        await this.submit();
        // 由于提交时有魔力果动画，避免动画被遮盖，增加延迟
        setTimeout(async () => {
          this.SubmitState = SubmitState.done;
          this.SuccessDialogVisible = true;
          this.playAudioForSubmitByUser();
        }, 500);
      } catch (err) {
        this.ErrorDialogVisible = true;
        this.SubmitState = SubmitState.error;
      }
    }

    private async submit() {
      this.getMagicFruitData(true);
      const {id} = this.$route.query;
      this.countDownData.pause = true;
      const answerTime: number = Math.ceil(this.countDownData.totalTime - this.ResetTime);
      const questions: any[] = this.$store.state.questionsData.questions || [];
      const answerList: any[] = questions.map((qus: any) => {
        return {
          questionId: qus.id,
          stuAnswer: qus.stuAnswer.toString()
        };
      });

      const request: any = {
        examInfoId: id,
        itemNum: this.magicFruitNumber / this.magicFruitData.numberToGetMagicFruit,
        answerEqpType: isMobile() ? 2 : 1,
        answerList,
        submitFlag: 2,                                     // 提交标识，1：保存，2提交
        realDuration: answerTime
      };
      console.log(JSON.stringify(request));
      await this.$api['evaluationStaged/submit'](request);
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
      this.getMagicFruitData();
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
      if (this.SubmitState === SubmitState.error) {
        this.answerSheetVisible = false;
        return index <= this.ErrorIndex && (this.currentQuestionIndex = index);
      }
      if (this.EvaluationType === EvaluationType.report) {
        this.answerSheetVisible = false;
        return this.currentQuestionIndex = index;
      }
      const questionList: any[] = this.$store.state.questionsData.questions;
      let lastIndex: number = -1;
      let i = questionList.length - 1;
      for (i; i >= 0; i--) {
        const done: boolean = this.hasStuAnswer(questionList[i].stuAnswer);
        if (done) {
          lastIndex = i;
          break;
        }
      }
      if (index <= lastIndex + 1) {
        this.answerSheetVisible = false;
        this.currentQuestionIndex = index;
      }
    }

    private changeQuestionPage(index: number, item?: any) {
      this.showQuestions = true;
      // 已做题目，下一题可点击跳转
      if (this.currentQuestionIndex === this.hasAnswerMaxIndex) {
        this.currentQuestionIndex = index;
      }
      this.getTotalCompleted(this.homeworkQuestionList);
    }

    // private showCustomModal(data: any) {
    //   this.showModal = true;
    //   this.modalData = data;
    // }
    //
    // private hideCustomModal() {
    //   this.showModal = false;
    //   this.modalData = this.defaultModalData;
    // }

    // private submitSuccess(data: any) {
    //   exit();
    // }

    // private checkHomeworkReport(data: any) {
    //   if (!this.$store.getters.checkBoxHidden) { this.$store.dispatch('set_select_box_hide', true); }
    //   this.hideCustomModal();
    //   if (this.correctMode === HomeworkCorrectMode.Automatic) {
    //     this.getHomework(true);
    //   } else {
    //     exit();
    //   }
    // }

    private CountDownAction(_action: string) {
      this.countDownData.pause = _action === 'stop';
    }

    private getMagicFruitData(submitAll?: boolean) {
      let cIndex = this.currentQuestionIndex;
      if (submitAll) {
        cIndex += 1;
      }
      this.$set(this.magicFruitData, 'currentIndex', cIndex);
      return '';
    }

    private getMagicFruitNumber(data: number) {
      this.magicFruitNumber = data * this.magicFruitData.addNumberEachTime;
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

    &.homework-report {
      @include disableUserSelect();
    }

    .zmsubline {
      display: inline-block;
      width: 60px;
      border-bottom: 2px solid #2c3e50;
    }

    .cloud-small {
      position: absolute;
      background: url('../../assets/images/stageEvaluation/img_cloud1@2x.png') center no-repeat;
      background-size: contain;
      &.cloud-small-1 {
        left: 13px;
        top: 270px;
        width: 162px;
        height: 89px;
      }
      &.cloud-small-2 {
        left: 281px;
        top: 96px;
        width: 113px;
        height: 62px;
        opacity: 0.6;
      }
      &.cloud-small-3 {
        right: 21px;
        top: 196px;
        width: 146px;
        height: 80px;
        opacity: 0.8;
      }
    }

    .bottom-partner {
      position: absolute;
      width: 400px;
      height: 150px;
      right: 0px;
      bottom: 10px;
      background: url('../../assets/images/stageEvaluation/img_ZXM@2x.png') center no-repeat;
      background-size: contain;
      &.partner-mmt {
        background: url('../../assets/images/stageEvaluation/img_MMT@2x.png') center no-repeat;
        background-size: contain;
      }
      &.partner-ddx {
        background: url('../../assets/images/stageEvaluation/img_DDX@2x.png') center no-repeat;
        background-size: contain;
      }
    }

    .guide-container {
      position: absolute;
      width: 750px;
      height: 470px;
      left: 50%;
      margin-left: -375px;
      background-color: #EC9A5B;
      bottom: 175px;
      border: 12px #FFAE70 solid;
      border-radius: 28px;
      padding: 5px;

      .guide-main {
        width: 100%;
        height: 100%;
        background-color: #fff;
        border-radius: 12px;
        padding: 40px 68px;

        p {
          color: #7E2F0D;
          font-size: 24px;
          line-height: 38px;
          font-weight: bold;
          text-align: left;
          margin-top: 10px;
          margin-bottom: 30px;
        }
      }

      .start-test {
        @include DefaultRedBtn(56px);
        width: 200px;
        display: inline-block;
        margin: auto;
        color: #fff;
        font-size: 24px;
        font-weight: bold;
      }

      .guide-bottom-wood {
        position: absolute;
        width: 160px;
        height: 90px;
        bottom: -101px;
        background: url('../../assets/images/stageEvaluation/img_treestool@2x.png') center no-repeat;
        background-size: contain;

        &.wood-left {
          left: 110px !important;
        }

        &.wood-right {
          right: 110px !important;
          transform: rotateY(180deg);
        }
      }

      &:before {
        position: absolute;
        content: '';
        top: -85px;
        left: 0;
        width: 70px;
        height: 73px;
        background: url('../../assets/images/stageEvaluation/img_bird@2x.png') center no-repeat;
        background-size: contain;
      }
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

    .bg-report {
      @include disableUserSelect();
      background: url("../../assets/images/common/report_board@2x.png") center;

      #border-container {
        top: 3.5%;
        bottom: 8%;
        left: 18px;
        right: 18px;
      }
    }

    .bg-report-info {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: flex-start;
      position: absolute;
      height: 676px;
      width: 968px;
      left: 50%;
      margin-left: -484px;
      bottom: 20px;
      padding: 48px 44px 75px;
      background: url("../../assets/images/common/img_work_book2@2x.png") center;
      background-size: 100% 100%;

      &::before, &::after {
        content: '';
        position: absolute;
        top: 20%;
        left: 50%;
        width: 66px;
        height: 23px;
        transform: translate(-50%, -50%);
        background: url("../../assets/images/homework/report/icon_report_ring@2x.png") center center no-repeat / 100%;
      }

      &::after {
        top: 75%;
      }

      & > div {
        width: 403px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        align-items: center;
      }

      .report-homework-title {
        width: 403px;
        height: 71px;
        padding: 0 39px 0 22px;
        margin: 0 0 19px -60px;
        background: url("../../assets/images/homework/report/img_report_title_bg@2x.png") left center no-repeat/ 391px 71px;

        span {
          display: inline-block;
          width: 330px;
          line-height: 60px;
          overflow: hidden;
          word-break: keep-all;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: left;
          font-family: PingFangSC-Semibold;
          font-size: 22px;
          color: #FFFFFF;
          letter-spacing: 0;
        }

      }

      .report-homework-base-info {
        width: 403px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: flex-start;

        & > div {
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          width: 50%;
          box-sizing: border-box;

          span {
            color: #999;
          }

          [class$='-icon'] {
            width: 66px;
            height: 66px;
          }

          .scores-icon {
            background: url("../../assets/images/homework/report/icon_report_score@2x.png") center center no-repeat / 100%;
          }

          .cost-time-icon {
            background: url("../../assets/images/homework/report/icon_report_time@2x.png") center center no-repeat / 100%;
          }

          [class$='-content'] {
            &.scores-content {
              font-size: 50px;
            }

            span {
              font-family: PingFangSC-Semibold;
              line-height: 70px;
              color: #333333;
              letter-spacing: 0;
              text-align: center;
            }

            i {
              font-family: PingFangSC-Medium;
              font-size: 12px;
              line-height: 17px;
              color: #333333;
              letter-spacing: 0;
              text-align: center;
            }
          }
        }

        .cost-time {
          border-left: 1px solid #DDD;
        }
      }

      .teacher-comments {
        width: 403px;
        height: 200px;
        padding: 20px 20px 18px;
        margin-top: 65px;
        background: #F7F9FC;
        border-radius: 10px;
        text-align: left;

        span {
          display: inline-block;
          padding-bottom: 12px;
          font-family: PingFangSC-Semibold;
          font-size: 18px;
          line-height: 25px;
          color: #333333;
          letter-spacing: 0;
        }

        p {
          @include scrollHide;
          height: 125px;
          overflow-y: scroll;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #333333;
          letter-spacing: 0;
          text-align: justify;
          line-height: 25px;
        }
      }

      .homework-submit-time {
        margin-top: 14px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        line-height: 22px;
        color: #999999;
        letter-spacing: -0.38px;
      }

      .answer-situation-preview {
        width: 308px;

        li {
          display: flex;
          margin: 15px 0;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          list-style-type: none;

          span {
            font-size: 16px;
            letter-spacing: 0;

            &:nth-child(1) {
              font-family: PingFangSC-Regular;
              color: #666666;
              text-align: justify;

              &::before {
                display: inline-block;
                content: '';
                width: 30px;
                height: 30px;
                margin-right: 12px;
                vertical-align: middle;
              }
            }

            &:nth-child(3) {
              font-family: PingFangSC-Semibold;
              color: #333333;
              text-align: right;
            }
          }

          hr {
            flex-grow: 1;
            margin: 0 10px;
            border: none;
            border-bottom: 1px dashed #DDDDDD;
          }

          .icon-total {
            &::before {
              background: url("../../assets/images/homework/report/icon_report_all@2x.png") center center no-repeat/ 100%;
            }
          }

          .icon-right {
            &::before {
              background: url("../../assets/images/homework/report/icon_report_right@2x.png") center center no-repeat/ 100%;
            }
          }

          .icon-wrong {
            &::before {
              background: url("../../assets/images/homework/report/icon_report_wrong@2x.png") center center no-repeat/ 100%;
            }
          }

          .icon-empty {
            &::before {
              background: url("../../assets/images/homework/report/icon_report_no@2x.png") center center no-repeat/ 100%;
            }
          }
        }
      }

      .look-in-analysis {
        position: absolute;
        bottom: 61px;
        width: 360px;
        background: #fff;
        height: 94px;
        padding: 16px 0 14px;
        text-align: center;

        button {
          width: 200px;
          height: 64px;
          font-family: PingFangSC-Semibold;
          font-size: 24px;
          line-height: 64px;
          color: #FFFFFF;
          letter-spacing: 0;
          text-align: center;
          background: url("../../assets/images/homework/report/home_btn_start_biggest@2x.png") center center no-repeat / 100%;
          @include btnScale(1.1);
        }
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
