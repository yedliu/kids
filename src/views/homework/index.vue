<template>
  <div id="homework" :class="'homework-' + pagetype">
    <div v-if="!isMobile" class="cloud-left"></div>
    <div v-if="!isMobile" class="cloud-right"></div>
    <div class="bg-grassland">
      <div class="bg-grass-arc"></div>
    </div>
    <div class="book-shadow"></div>
    <answer-sheet
      v-model="answerSheetVisible"
      :dataSource="answerSheetDataSource"
      :text="answerSheetText"
      @child-click="changeQuestionPage"
      :pagetype="this.allowEdit ? 'test' : 'report'"
    >
      <pad-button
        v-if="this.allowEdit"
        slot="footer"
        playAudio="true"
        round
        type="danger"
        size="large"
        @click="handleSubmit"
        style="width: 200px;margin-top: 40px"
      >提交作业</pad-button>
    </answer-sheet>
    <transition name="pad-fade">
      <img v-show="!answerSheetVisible" class="pad-homework__trigger-menu pad-button pad-button--circle" :src="require('packages/theme/assets/answer-sheet/trigger-menu@2x.png')" alt="" @click="answerSheetVisible = true">
    </transition>
    <div
      v-if="showQuestions"
      id="main-container"
      :class="'bg-' + pagetype"
      @touchstart="onTouchStart($event)"
      @touchend="onTouchEnd($event)">
      <div id="border-container">
        <!--<div class="skip-btn" @click="goNext" v-if="pagetype === 'test' && currentQuestionIndex + 1 < questionCount"></div>-->
        <div class="question-number"><div>{{currentQuestionIndex + 1}}/{{questionCount}}</div></div>
        <div class="question-window">
          <div class="slide-box"
               :style="{width: (questionCount * 100) + '%', transform: 'translateX(-' + currentQuestionIndex * 100 / questionCount + '%)'}">
            <Question
              :pagetype="pagetype"
              v-for="(question, index) in homeworkQuestionList"
              :question="question"
              :key="index"/>
          </div>
        </div>
      </div>
      <div id="command">
        <button v-if="currentQuestionIndex" playAudio="true" @click="goLast($event)" class="last-btn" id="lastSubject">上一题</button>
        <button v-if="commandState.commandText" playAudio="true" @click="goNext($event)" class="next-btn" id="commandButton">{{commandState.commandText}}</button>
      </div>
      <div id="loadingSvga" class="svga-loading" v-show="showLoading"></div>
    </div>
    <PreviewAnalysis
      v-if="!showQuestions && questionsData"
      @changepage="changeQuestionPage"
      :question-data="questionsData"
      :pagetype="pagetype"
    ></PreviewAnalysis>
    <confirm
      v-show="submitConfirmVisible"
      :title="`还有${undoAmount}道题未完成哦，确认提交作业吗？`"
      confirmText="确认提交"
      @cancel="handleCancel('confirm')"
      @confirm="handleConfirm('confirm')"
    >
      <div :class="isMobile ? 'pad-answer-sheet__content pad-homework__submit-confirm-answer-sheet-content' : 'pad-answer-sheet__content pc pad-homework__submit-confirm-answer-sheet-content'">
        <div
          v-for="(item, index) in answerSheetDataSource"
          :class="[
              'pad-answer-sheet__item',
              {
                'pad-answer-sheet__item--done': item.status === 'done',
                'pad-answer-sheet__item--correct': item.status === 'correct',
                'pad-answer-sheet__item--incorrect': item.status === 'incorrect'
              }
            ]"
          v-html="index + 1"
          @click="changeQuestionPage(index, item)"
        ></div>
      </div>
    </confirm>
    <confirm
      v-show="exitConfirmVisible"
      confirmText="退出" cancelText="继续做作业"
      @cancel="handleCancel('exit')"
      @confirm="handleConfirm('exit')"
    >
      <p slot="header" class="pad-homework__confirm-exit-header">你当前作业还未完成提交，确认退出吗？</p>
    </confirm>
    <Modal
      v-bind="modalData"
      :content="modalData.content"
      v-if="showModal"
      :custom-class="modalData.modalStyleName"
    >
      <div v-if="modalData.showSlot" class="modalSlot">
        <span v-html="modalData.slotContent"></span>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
  import {Component, Provide, Vue} from 'vue-property-decorator';
  import Question from 'modules/question/index.vue';
  import MakeData from 'service/data/';
  import {firstTips, questionDialog, exit} from 'modules/native-tips';
  import { playSvga, stopSvga } from 'plugins/svga.ts';
  import { HomeworkCorrectMode } from 'views/homework/index.ts';
  import { setHeader } from '@/utils';
  import PadButton from 'components/button.vue';
  import Confirm from 'components/confirm.vue';
  import {isMobile} from '@/utils/ua';

  enum homeworkType {
    test = 'test',
    report = 'report'
  }

  @Component({
    components: {
      Question,
      PreviewAnalysis: () => import('modules/preview-analysis/index.vue'),
      Modal: () => import('modules/modal/index.vue'), // 弹窗
      AnswerSheet: () => import('components/answer-sheet.vue'),
      Confirm,
      PadButton
    },
  })

  export default class Test extends Vue {
    private answerSheetVisible: boolean = false;
    private answerSheetDataSource: any[] = [];
    private answerSheetText: string = '';
    private submitConfirmVisible: boolean = false;
    private exitConfirmVisible: boolean = false;
    private undoAmount: number = 0;
    private pagetype: homeworkType.test | homeworkType.report = homeworkType.test;
    private questionsData: any = '';
    private currentQuestionIndex: number = 0;
    private questionCount: number = 0;
    private homeworkName: string = '';
    private homeworkId: number = 0;
    private homeworkQuestionList: any[] = [];
    private touchStartX: number;
    private touchStartY: number;
    private canTouchSlide: boolean = true;
    private allowEdit: boolean = this.$store.getters.allowEdit;
    private isPreviewingReport: boolean = true; // 正在预览 作业报告
    private showQuestions: boolean = false;
    private totalCompleted: number = 0;
    private costTimeFontSize: any  = 16;
    private correctMode: number = 2;
    private whichUnitTimeShow: any = 0; //  作业花费时间的显示格式
    private modalData: any = '';
    private isMobile: boolean = isMobile();
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
    @Provide() private goNextPage = this.goNext;

    private created() {
      const token = this.$route.query.token || '';
      token && this.$cookie.set('token', token);
      this.getHomework();
      window.GLOBAL.vbus.$on('closeModal', this.hideCustomModal);
      window.GLOBAL.vbus.$on('showModal', this.showCustomModal);
      window.GLOBAL.vbus.$on('checkHomeworkReport', this.checkHomeworkReport);
      window.GLOBAL.vbus.$on('getOutOfHomeWork', this.exitHomework);
      window.GLOBAL.vbus.$on('submitSuccess', this.submitSuccess);
      window.GLOBAL.vbus.$on('homework-exit', () => {
        if (this.allowEdit) {
          this.exitConfirmVisible = true;
        } else if (this.showQuestions) {
          this.showPreviewPage(true);
        } else {
          exit();
        }
      });
    }

    private async getHomework(refresh?: any) {
      let data: any = '';
      if (!refresh) { data = this.$store.getters.questionsData; }

      if (!data) {
        const dataRemote = await this.$api['homework/info']({
          id: this.$route.query.id
        });
        const info = new MakeData(dataRemote);
        // this.$store.dispatch('set_questions_data', dataRemote || info.data);
        this.$store.dispatch('set_questions_data', info.data);
        data = this.$store.getters.questionsData;
        this.questionsData = data;
        if (info.data.state !== 2) { // state 2 已作答
          this.$api['homework/list']({
            id: this.$route.query.id
          });
        }
      }
      const {id, name, questionAmountNoSub, questions, state, costTime, submitTime, rightAmount, wrongAmount, totalScore, stuGetScore, teacherComment} = data;
      this.questionCount = questionAmountNoSub;
      setHeader(name || '数理逻辑');
      this.homeworkId = id;
      this.$cookie.set('homeworkId', id);
      this.homeworkQuestionList = questions;
      this.$store.dispatch('set_allow_edit', state);
      // this.$store.dispatch('set_allow_edit', 0);
      this.pagetype = this.$store.getters.allowEdit ? homeworkType.test : homeworkType.report;
      this.allowEdit = this.$store.getters.allowEdit;
      if (this.pagetype === homeworkType.report) {
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
            }
          }
          return {
            status
          };
        });
        incorrectAmount = questions.length - correctAmount - undoAmount;
        this.answerSheetText = `正确${correctAmount}题，错误${incorrectAmount}题，未作答${undoAmount}题`;
      } else {
        this.answerSheetDataSourceChange();
      }
      this.showPreviewPage(!this.allowEdit);
      this.showQuestions = this.allowEdit;
      this.getNoAnswerQuestionIndex(questions);

      if (!this.isPreviewingReport) {
        firstTips(); }
      // this.pagetype = 'report';
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

    private showLoadingAnimate() {
      this.showLoading = true;
      return  playSvga('loadingSvga', this.loadingSvga);
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
      // this.currentQuestionIndex = 13;
    }

    private async goNext($event: any) {
      this.getTotalCompleted(this.homeworkQuestionList);
      if (this.currentQuestionIndex > this.questionCount - 1) {
        return;
      } else if (this.currentQuestionIndex === this.questionCount - 1) {
        if ($event && $event.target.id === 'commandButton') {
          // await this.saveEachSubject();
          // this.$logUpload({
          //   trackerType: 2,
          //   eventId: 'zuoye_tijiao',
          //   eventType: 1,
          //   eventValue: 1
          // });
          if (this.homeworkQuestionList.length === this.totalCompleted) {
            this.handleConfirm('confirm');
          } else {
            this.submitConfirmVisible = true;
          }
        }
        return;
      }
      if (this.allowEdit) {
        this.saveResult($event);
      }
      if (this.pagetype === 'test') {
        this.$logUpload({
          trackerType: 2,
          eventId: 'zuoye_tiaoguo',
          eventType: 1,
          eventValue: 1,
          eventPara: {questionId: this.homeworkQuestionList[this.currentQuestionIndex].id}
        });
      }
      this.currentQuestionIndex++;
    }

    private goLast($event: any) {
      if (this.currentQuestionIndex <= 0) {
        return;
      }
      if (this.allowEdit) {
        this.saveResult($event);
      }
      this.getTotalCompleted(this.homeworkQuestionList);
      if (this.pagetype === 'test') {
        this.$logUpload({
          trackerType: 2,
          eventId: 'zuoye_tiaoguo',
          eventType: 1,
          eventValue: 1,
          eventPara: {questionId: this.homeworkQuestionList[this.currentQuestionIndex].id}
        });
      }
      this.currentQuestionIndex--;
    }

    private onTouchStart(e: any) {
      e = e.touches[0];
      this.touchStartX = e.clientX;  // 获取点击点的X坐标
      this.touchStartY = e.clientY;  // 获取点击点的Y坐标
    }

    private onTouchEnd(e: any) {
      e = e.changedTouches[0];
      const touchDirection = this.getTouchDirection(this.touchStartX, this.touchStartY, e.clientX, e.clientY);
      if (!this.canTouchSlide) {
        return;
      }
      this.canTouchSlide = false;
      setTimeout(() => {
        this.canTouchSlide = true;
      }, 1000);
      if (touchDirection === 'right') {
        this.goLast(false);
      }
      if (touchDirection === 'left') {
        this.goNext(false);
      }
    }

    private getTouchDirection(startX: number, startY: number, endX: number, endY: number) {
      const movedX = endX - startX;
      const movedY = endY - startY;
      // noinspection JSSuspiciousNameCombination
      if (Math.abs(movedX) >= Math.abs(movedY) && movedX > 150) {
        return 'right';
      }
      // noinspection JSSuspiciousNameCombination
      if (Math.abs(movedX) >= Math.abs(movedY) && movedX < -150) {
        return 'left';
      }
      // noinspection JSSuspiciousNameCombination
      if (Math.abs(movedX) < Math.abs(movedY) && movedY > 50) {
        return 'down';
      }
      // noinspection JSSuspiciousNameCombination
      if (Math.abs(movedX) < Math.abs(movedY) && movedY < -50) {
        return 'up';
      }
      return 'else';
    }

    private async saveEachSubject() {
      const index = this.currentQuestionIndex;
      const infos = this.$store.getters.questionsData;

      if (infos.questions && infos.questions[index]) {

        const question = infos.questions[index];
        let stuAnswer = question.stuAnswer;
        const currentSubjectId = question.id;
        if (typeof stuAnswer === 'object' && question.type !== 'textMatchImg' && question.type !== 'textMatchText') {
          stuAnswer = JSON.stringify([...stuAnswer]);
        } else if (typeof stuAnswer === 'object') {
          stuAnswer = JSON.stringify(stuAnswer);
        }
        try {
          const res = await this.$api['homework/optional']({
            id: infos.id, // homeworkId: any,
            state: 3,
            stuAnswerItemDTOList: [
              {
                id: currentSubjectId, // infos.questions[index].id,
                stuAnswer, // stuAnswer
              }
            ]
          }, {});
          this.getTotalCompleted(this.homeworkQuestionList);
        } catch (e) {
          this.showCustomModal({ content: '网络信号差，作业保存失败！' });
        }
      }

    }

    private async submitAllSubjects() {
      const infos = this.$store.getters.questionsData;
      const allAnswers = Array.from(infos.questions, (item: any) => ({
        id: item.id,
        stuAnswer: (item.stuAnswer instanceof Array) ? JSON.stringify([...item.stuAnswer]) : (typeof item.stuAnswer === 'object' ? JSON.stringify(item.stuAnswer) : item.stuAnswer)
      }));
      const player = this.showLoadingAnimate();
      try {
        const homeWorkRes = await this.$api['homework/optional']({
          id: infos.id, // homeworkId: any,
          state: 1,
          stuAnswerItemDTOList: allAnswers
        }, {});
        this.correctMode = homeWorkRes.correctMode;
        let obtainValue: number = 0;
        try {
          const energyResult: any = await this.$api['homework/energy']({
            lessonId: infos.lessonId,
            bizId: infos.id, // homeworkId: any,
            userId: infos.stuUserId
          }, {});
          obtainValue = energyResult.obtainValue || 0;
        } catch (e) {
          console.log(e);
          obtainValue = 0;
        }
        this.hideLoadingAnimate(player);
        console.log(this.correctMode === HomeworkCorrectMode.Automatic);
        this.showCustomModal({
          content: '作业提交成功啦~',
          slotContent: obtainValue ? `奖励爱学习的你<span>${obtainValue}</span>能量果哦，继续努力哈～` : (this.correctMode === HomeworkCorrectMode.Automatic ? '点击查看作业报告，查看作业批改情况吧' : '待老师批改完成后，可查看作业报告哦~'),
          showSlot: true,
          dialog: true,
          okText: this.correctMode === HomeworkCorrectMode.Automatic ? '查看作业报告' : '确定', // 确定按键显示的文字
          cancelText: this.correctMode === HomeworkCorrectMode.Automatic ? '完成' : '', // 取消按键显示的文字
          submitOk: 'checkHomeworkReport', // 点击确定调用的函数
          submitCancel: 'getOutOfHomeWork', // 点击取消调用的函数
          customClass: 'submitSuccess',
          showMask: true
        });
      } catch (e) {
        this.hideLoadingAnimate(player);
        this.showCustomModal({
          content: '作业提交失败~',
          slotContent: '可能是网络异常导致提交失败，请检查网络',
          showSlot: true,
          dialog: true,
          okText: '知道了', // 确定按键显示的文字
          submitOk: 'closeModal', // 点击确定调用的函数
          customClass: 'submitFailed',
          showMask: true
        });
        // window.GLOBAL.vbus.$on('')
      }

    }

    private async saveResult($event: any) {
      this.answerSheetDataSourceChange();
      if (!this.allowEdit) { return false; }
      const index = this.currentQuestionIndex;
      await this.saveEachSubject(); // 保存当前题目结果
      if (index === this.questionCount - 1) {
        if ($event && $event.target.id === 'commandButton') {
          const data = await this.submitAllSubjects(); // 如果当前题目是最后一题，则提交所有答案
          console.log(data);
        }
        // this.$store.dispatch('set_questions_data', makeData.data);
      }
    }

    private changeQuestionPage(index: number) {
      this.showQuestions = true;
      this.currentQuestionIndex = index;
      if (this.pagetype === 'test') {
        this.$logUpload({
          trackerType: 2,
          eventId: 'zuoye_shaixuan',
          eventType: 1,
          eventValue: 1,
          eventPara: {goPageIndex: index, goQuestionId: this.homeworkQuestionList[index].id}
        });
      }
      this.getTotalCompleted(this.homeworkQuestionList);
    }

    private showPreviewPage(state: boolean) {
      this.isPreviewingReport = state;
      this.showQuestions = !state;
    }

    private showCustomModal(data: any) {
      this.showModal = true;
      this.modalData = data;
    }

    private hideCustomModal() {
      this.showModal = false;
      this.modalData = this.defaultModalData;
    }

    private submitSuccess(data: any) {
      exit();
    }

    private exitHomework() {
      exit();
    }

    private checkHomeworkReport(data: any) {
      if (!this.$store.getters.checkBoxHidden) { this.$store.dispatch('set_select_box_hide', true); }
      this.hideCustomModal();
      if (this.correctMode === HomeworkCorrectMode.Automatic) {
        this.getHomework(true);
      } else {
        exit();
      }
    }

    private getHasDoneNumber(notEmpty: boolean, index: number) {
      this.$set(this.answerSheetDataSource, index, {status: notEmpty ? 'done' : 'undo', enable: true});
    }

    private get commandState() {
      const index = this.currentQuestionIndex;
      const infos = this.$store.getters.questionsData;
      const type = infos.questions && infos.questions[index].type;
      if (!this.isPreviewingReport) { questionDialog(type, () => {console.log(type + 'is dialog'); }); }
      let stuAnswer = infos.questions && (infos.questions[index].stuAnswer || '');
      if (type === 'multiSelect') { stuAnswer = stuAnswer && stuAnswer.replace(/\|/g, '') || ''; }
      // const hideNextButton = index === 0 && !stuAnswer;
      const isArray = stuAnswer instanceof Array && stuAnswer.length > 0;
      const notEmpty = !(stuAnswer instanceof Array) && stuAnswer !== '[]' && stuAnswer !== '{}' && !!stuAnswer;
      let commandText = '';
      if (index === this.questionCount - 1) {
        if (this.allowEdit) {
          commandText = '提交作业';
        }
      } else {
        commandText = '下一题';
      }
      const enable = isArray || notEmpty;
      console.log(this.allowEdit);
      if (this.allowEdit) {
        this.getHasDoneNumber(enable, index);
        this.answerSheetDataSourceChange();
      }
      return {enable, commandText};
    }

    private handleCancel(type: 'exit' | 'confirm') {
      type === 'exit' ? this.exitConfirmVisible = false : this.submitConfirmVisible = false;
    }

    private async handleConfirm(type: 'exit' | 'confirm') {
      if (type === 'exit') {
        console.log(type);
        this.exitConfirmVisible = false;
        exit();
      } else {
        this.submitConfirmVisible = false;
        const data = await this.submitAllSubjects(); // 如果当前题目是最后一题，则提交所有答案
        console.log(data);
      }
    }

    private handleSubmit() {
      this.submitConfirmVisible = true;
      this.answerSheetVisible = false;
    }


  }
</script>

<style lang="scss">
  #homework {
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
    &.homework-report{
      @include disableUserSelect();
    }
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
        .skip-btn {
          position: absolute;
          width: 11%;
          height: 7%;
          top: -7%;
          right: 5%;
          background: url("../../assets/images/common/btn_work_skip@2x.png") center center no-repeat / cover;
          @include btnScale(1.1);
        }
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
            transition: transform 1s;
          }
        }
      }
      #command{
        position: absolute;
        bottom: -40px;
        left: 50%;
        transform: translateX(-50%);
        @include disableUserSelect();
        .next-btn{
          @include DefaultRedBtn(56px);
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
          padding: 0 10px 0 0;
          &::before{
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
        .last-btn{
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
          &::before{
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
    .bg-report-info{
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: flex-start;
      position: absolute;
      height: 635px;
      width: 968px;
      left: 50%;
      margin-left: -484px;
      bottom: 45px;
      padding: 48px 44px 75px;
      background: url("../../assets/images/common/book_board@2x.png") center;
      background-size: 100% 100%;
      &::before,&::after{
        content: '';
        position: absolute;
        top: 20%;
        left: 50%;
        width: 66px;
        height: 23px;
        transform: translate(-50%,-50%);
        background: url("../../assets/images/homework/report/icon_report_ring@2x.png") center center no-repeat / 100%;
      }
      &::after{
        top: 75%;
      }
      &>div{
        width: 403px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        align-items: center;
      }
      .report-homework-title{
        width: 403px;
        height: 71px;
        padding: 0 39px 0 22px;
        margin:0 0 19px -60px;
        background: url("../../assets/images/homework/report/img_report_title_bg@2x.png") left center no-repeat/ 391px 71px;
        span{
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
      .report-homework-base-info{
        width: 403px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: flex-start;
        &>div{
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          width: 50%;
          box-sizing: border-box;
          span {
            color: #999;
          }
          [class$='-icon']{
            width: 66px;
            height: 66px;
          }
          .scores-icon{
            background: url("../../assets/images/homework/report/icon_report_score@2x.png") center center no-repeat / 100%;
          }
          .cost-time-icon{
            background: url("../../assets/images/homework/report/icon_report_time@2x.png") center center no-repeat / 100%;
          }
          [class$='-content']{
            &.scores-content{
              font-size: 50px;
            }
            span{
              font-family: PingFangSC-Semibold;
              line-height: 70px;
              color: #333333;
              letter-spacing: 0;
              text-align: center;
            }
            i{
              font-family: PingFangSC-Medium;
              font-size: 12px;
              line-height: 17px;
              color: #333333;
              letter-spacing: 0;
              text-align: center;
            }
          }
        }
        .cost-time{
          border-left: 1px solid #DDD;
        }
      }
      .teacher-comments{
        width: 403px;
        height: 200px;
        padding: 20px 20px 18px;
        margin-top: 45px;
        background: #F7F9FC;
        border-radius: 10px;
        text-align: left;
        span{
          display: inline-block;
          padding-bottom: 12px;
          font-family: PingFangSC-Semibold;
          font-size: 18px;
          line-height: 25px;
          color: #333333;
          letter-spacing: 0;
        }
        p{
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
      .homework-submit-time{
        margin-top: 14px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        line-height: 22px;
        color: #999999;
        letter-spacing: -0.38px;
      }
      .answer-situation-preview{
        width: 308px;
        li{
          display: flex;
          margin:15px 0;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          list-style-type: none;
          span{
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
            &:nth-child(3){
              font-family: PingFangSC-Semibold;
              color: #333333;
              text-align: right;
            }
          }
          hr{
            flex-grow: 1;
            margin: 0 10px;
            border: none;
            border-bottom: 1px dashed #DDDDDD;
          }
          .icon-total{
            &::before{
              background: url("../../assets/images/homework/report/icon_report_all@2x.png") center center no-repeat/ 100%;
            }
          }
          .icon-right{
            &::before{
              background: url("../../assets/images/homework/report/icon_report_right@2x.png") center center no-repeat/ 100%;
            }
          }
          .icon-wrong{
            &::before{
              background: url("../../assets/images/homework/report/icon_report_wrong@2x.png") center center no-repeat/ 100%;
            }
          }
          .icon-empty{
            &::before{
              background: url("../../assets/images/homework/report/icon_report_no@2x.png") center center no-repeat/ 100%;
            }
          }
        }
      }
      .look-in-analysis{
        position: absolute;
        bottom: 61px;
        width: 360px;
        background: #fff;
        height: 94px;
        padding: 16px 0 14px;
        text-align: center;
        button{
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
    .base {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-flow: row wrap;
      width: 100%;
      align-content: stretch;
    }
    .mord{
      flex-grow: 1;
      flex-shrink: 0;
      margin-right: 1px;
      margin-bottom: 10px;
    }
  }
</style>
