<template>
  <div
    id="preview-report"
    class="bg-report-info">
    <div>
      <div class="report-homework-title">
        <span>{{homeworkName}}</span>
      </div>
      <div class="report-homework-base-info">
        <div class="scores">
          <i class="scores-icon"></i>
          <div class="scores-content">
            <span>{{score.stu}}</span><i>分</i>
          </div>
          <div><span>总分{{score.total}}分</span></div>
        </div>
        <div  class="cost-time">
          <i class="cost-time-icon"></i>
          <div class="cost-time-content" :style="{fontSize: costTimeFontSize}">
            <!--<span v-if="whichUnitTimeShow===5">{{time.cost.year}}<i>年</i></span>-->
            <!--<span v-if="whichUnitTimeShow>=4" >{{time.cost.month}}<i>个月</i></span>-->
            <span v-if="whichUnitTimeShow>=3" >{{time.cost.day}}<i>天</i></span>
            <span v-if="whichUnitTimeShow>=2" >{{time.cost.hour}}<i>小时</i></span>
            <span v-if="whichUnitTimeShow>=1" >{{time.cost.minute}}<i>分</i></span>
            <span>{{time.cost.second}}<i>秒</i></span>
          </div>
          <div><span>作业用时</span></div>
        </div>
      </div>
      <div
        class="teacher-comments"
        :style="{ background: teacherComment ? '' : 'transparent'}">
        <div v-if="teacherComment">
          <span>老师评语</span>
          <p>{{teacherComment}}</p>
        </div>
      </div>

      <div class="homework-submit-time"><span>作业提交时间： {{time.submit}}</span></div>
    </div>
    <div>
      <ul class="answer-situation-preview">
        <li><span class="icon-total">总题数 </span><hr><span> {{questionNumber.total}}</span></li>
        <li><span class="icon-right">正确答题 </span><hr><span> {{questionNumber.right}}</span></li>
        <li><span class="icon-wrong">错误答题 </span><hr><span> {{questionNumber.wrong}}</span></li>
        <li><span class="icon-empty">未作答 </span><hr><span> {{questionNumber.empty}}</span></li>
      </ul>
      <div class="question-list">
        <div class="item-box" v-for="(item, index) in homeworkQuestionList">
          <div :class="['item-btn', {completed: isCompleted(item.stuAnswer), right:  $attrs.pagetype === 'report' && item.correctResult === 1, wrong: $attrs.pagetype === 'report' && (item.correctResult === 2 || item.correctResult === 3)}]" @click="changeQuestionPage(index)">
            {{index + 1}}
          </div>
        </div>
      </div>
      <div class="look-in-analysis"><button @click="changeQuestionPage(0)">查看作业解析</button></div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    components: {},
  })

  export default class PreviewAnalysis extends Vue {
    @Prop({
      type: Object,
      default: ''
    })
    private questionData: any;

    private testText = '本次作业为系统自动批改';
    private questionCount: number = 0;
    private homeworkName: string = '';
    private homeworkQuestionList: any[] = [];
    private unitTime: any =  {
      eachSecond: 1000,
      eachMinute: 60 * 1000,
      eachHour: 60 * 60 * 1000,
      eachDay: 24 * 60 * 60 * 1000,
      // eachMonth: 30 * 24 * 60 * 60 * 1000,
      // eachYear: 365 * 30 * 24 * 60 * 60 * 1000
    };
    private costTime: number = 0;
    private time: any = {
      cost: {
        year: '',
        month: '',
        day: '',
        hour: '',
        minute: '',
        second: '',

      },
      submit: ''
    };
    private questionNumber: any = {
      total: 0,
      right: 0,
      wrong: 0,
      empty: 0 };
    private score: any = {
      total: 0,
      stu: 0
    };
    private teacherComment: any = '';

    private allowEdit: boolean = this.$store.getters.allowEdit;
    private costTimeFontSize: any  = 16;
    private whichUnitTimeShow: any = 0; //  作业花费时间的显示格式

    private created() {
      this.questionCount = this.questionData.questionAmountNoSub;
      this.homeworkName = this.questionData.name;
      this.homeworkQuestionList = this.questionData.questions;
      this.costTime = this.questionData.costTime;
      const costTime: number = this.costTime;
      this.time = {
          cost: {
            // year: parseInt(String((this.costTime / this.unitTime.eachYear).toFixed(0)), 10),
            // month: parseInt(String((this.costTime / this.unitTime.eachMonth).toFixed(0)), 10) % 12,
            day: parseInt(Math.floor(costTime / this.unitTime.eachDay).toFixed(0), 10),
            hour: parseInt(Math.floor(costTime / this.unitTime.eachHour).toFixed(0), 10) % 24,
            minute: parseInt(Math.floor(costTime / this.unitTime.eachMinute).toFixed(0), 10) % 60,
            second: parseInt(Math.floor(costTime / this.unitTime.eachSecond).toFixed(0), 10) % 60 || 1,
          },
          submit: ''
        };
      this.questionNumber = {
          total: this.questionData.questionAmountNoSub,
          right: this.questionData.rightAmount,
          wrong: 0,
          empty: 0 };
      this.score = {
          total: this.questionData.totalScore,
          stu: this.questionData.stuGetScore
        };
      this.teacherComment = this.questionData.teacherComment || this.testText;

      Array.from(this.questionData.questions, (item: any) => { if (!item.stuAnswer || item.stuAnswer.length === 0) {
          this.questionNumber.empty++;
          return item;
        }
        }
      );
      this.questionNumber.wrong = this.questionNumber.total - this.questionNumber.right - this.questionNumber.empty;
      this.costTimeFontSize = this.time.cost.year || this.time.cost.month ? 50 / 3 : this.time.cost.day || this.time.cost.hour ? 50 / 2 : 50;
      this.costTimeFontSize = window.lib.flexible.px2rem(this.costTimeFontSize) + 'rem';
      // this.whichUnitTimeShow = this.time.cost.year ? 5 : this.time.cost.month ? 4 : this.time.cost.day ? 3 : this.time.cost.hour ? 1 : this.time.cost.minute ? 1 : 0;
      this.whichUnitTimeShow = this.time.cost.day ? 3 : this.time.cost.hour ? 2 : this.time.cost.minute ? 1 : 0;

      const submitDate = new Date(this.questionData.submitTime);
      this.time.submit = submitDate.getFullYear() + '.' + this.addZero(submitDate.getMonth() + 1) + '.' + this.addZero(submitDate.getDate()) + ' ' + this.addZero(submitDate.getHours()) + ':' + this.addZero(submitDate.getMinutes());
    }

    private changeQuestionPage(index: number) {
      this.$emit('changepage', index);
    }
    private addZero(data: number) {
      if (Math.abs(data) < 10) {
        return '0' + data;
      }
      return data;
    }

    private isCompleted(stuAnswer: any) {
      if (!stuAnswer || stuAnswer === '[]') {
        return false;
      }
      if (stuAnswer instanceof Array && stuAnswer.length < 1) {
        return false;
      }
      return true;
    }
  }
</script>


