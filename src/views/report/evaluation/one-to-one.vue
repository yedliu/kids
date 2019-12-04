<template>
  <div v-if="hasReportData" class="report-evaluation report__content">
    <div class="report-evaluation__content">
      <img src="./images/one-to-one/footer.png" alt="" class="report-evaluation__footer">
      <div class="report-evaluation__title">
        <img class="report-evaluation__title_bg" src="./images/one-to-one/title.png" alt="">
        <img src="./images/one-to-one/测评课.png" alt="" class="report-evaluation__title_type">
        <div class="tabbar">
          <button :class="[{active: active === 1}]" @click="active = 1">课堂学习报告</button>
          <button :class="[{active: active === 2}]" @click="active = 2">课堂评价</button>
        </div>
      </div>
      <div v-show="active === 1">
        <!--基本信息 开始-->
        <info v-if="baseInfo" :dataSource="baseInfo" class="report-evaluation__info"></info>
        <!--基本信息 结束-->

        <!--课堂表现 开始-->
        <performance
          class="report-evaluation__item"
          :interact="performance.interact"
          :performance="performance.performance"
          :teacher="performance.teacher"
        ></performance>
        <!--课堂表现 结束-->

        <!--答题互动 开始-->
        <interaction class="report-evaluation__item" :dataSource="answerQuestionOnClassroom"></interaction>
        <!--答题互动 结束-->

        <!--课堂活跃状态 开始-->
        <activity v-if="activity.rate" class="report-evaluation__item" :dataSource="activity"></activity>
        <!--课堂活跃状态 结束-->

        <!--学习能力分析 开始-->
        <analysis v-if="analysis.indicator.length > 0" class="report-evaluation__item" :dataSource="analysis"></analysis>
        <!--学习能力分析 结束-->

        <!--课堂内容 开始-->
        <course-content v-if="courseContent.data.length > 0" class="report-evaluation__item" v-bind="courseContent"></course-content>
        <!--课堂内容 结束-->

        <!--精彩瞬间 开始-->
        <wonderful v-if="pictureList.length > 0" class="report-evaluation__item" :dataSource="pictureList"></wonderful>
        <!--精彩瞬间 结束-->

        <!--课程介绍 开始-->
        <introduction v-if="introduction" class="report-evaluation__item" :dataSource="introduction"></introduction>
        <!--课程介绍 结束-->

        <!--学习方法 开始-->
        <methods v-if="studyMethods" class="report-evaluation__item" :dataSource="studyMethods"></methods>
        <!--学习方法 结束-->
      </div>
      <div v-show="active === 2">
        <comment :dataSource="parentEvaluation"></comment>
      </div>

      <img src="./images/one-to-one/grass1.png" alt="" class="report-evaluation__grass">
      <img src="./images/one-to-one/grass2.png" alt="" class="report-evaluation__grass grass2">
      <img src="./images/one-to-one/grass1.png" alt="" class="report-evaluation__grass grass3">
      <img src="./images/one-to-one/grass2.png" alt="" class="report-evaluation__grass grass4">
    </div>
  </div>
  <default v-else :loading="loading"></default>
</template>

<script lang='ts'>
  import {Component, Vue} from 'vue-property-decorator';
  import {reportType} from 'views/report/index.ts';

  @Component({
    components: {
      Default: () => import('../common/modules/default.vue'),
      Info: () => import('./modules/info.vue'),
      Performance: () => import('./modules/performance__1v1.vue'),
      Interaction: () => import('./modules/interaction_1v1.vue'),
      Activity: () => import('./modules/activity_1v1.vue'),
      Analysis: () => import('./modules/analysis_1v1.vue'),
      CourseContent: () => import('./modules/content_class.vue'),
      Introduction: () => import('./modules/introduction_1v1.vue'),
      Methods: () => import('./modules/methods_1v1.vue'),
      Comment: () => import('./modules/comment_1v1.vue'),
      Wonderful: () => import('./modules/wonderful-moment.vue')
    }
  })
  export default class Evaluation extends Vue {
    private active: number = 1;
    private loading: boolean = true;
    private avatarDefault: any = require('./images/one-to-one/avatar.png');
    private courseType: number = 0;                       // 课程类型 0 测评课 1 正式课
    private baseInfo: {                                   // 基本信息
      studentName: string;
      studentAvatar: string;
      studentGrade: string;
      subjectName: string;
      courseName: string;
      startTime: number;
      endTime: number;
      teacherName: string;
    } | null = null;

    private performance: {                                // 课堂表现
      interact: {
        totalTime: number;
        actualTime: number;
        times: number;
        goods: number;
      };
      performance: {
        behaviorAssessment: number;
        tags: string[];
      };
      teacher: {
        voiceRemark: string;
        textRemark: string;
        avatar: string;
        name: string;
        voiceRemarkDuration: string;
      }
    } = {
      interact: {
        totalTime: 0,
        actualTime: 0,
        times: 0,
        goods: 0
      },
      performance: {
        behaviorAssessment: 1,
        tags: []
      },
      teacher: {
        voiceRemark: '',
        textRemark: '',
        avatar: '',
        name: '',
        voiceRemarkDuration: ''
      }
    };

    private answerQuestionOnClassroom: {                  // 学生答题结果
      actualTime: number;
      suggestTime: number;
      correctAnswerCount: number;
      falseAnswerCount: number;
      correctRate: number;
      msg: string;
    } = {
      actualTime: 50,
      suggestTime: 60,
      correctAnswerCount: 0,
      falseAnswerCount: 0,
      correctRate: 0,
      msg: ''
    };

    private activity: {
      chartLine: number[][];
      rate: number;
      msg: string;
    } = {
      chartLine: [],
      rate: 0,
      msg: ''
    };

    private pictureList: string[] = [];

    private analysis: {
      value: number[];
      indicator: Array<{ name: string; max: number; }>;
    } = {
      value: [],
      indicator: []
    };

    private courseContent: {
      lessonId: number | string;
      user: {
        studentName: string;
        studentIcon: string;
        userId: string;
        lessonId: string | number;
      };
      data: any[];
    } = {
      lessonId: '',
      user: {
        studentName: '',
        studentIcon: '',
        userId: '',
        lessonId: ''
      },
      data: []
    };

    private introduction: string = '';                    // 课程介绍, 一张网络图片
    private studyMethods: string = '';                    // 学习方法, 一张网络图片

    private hasReportData: boolean = false;
    private name: string = '';
    private theme: string = '巧解鸡兔同笼问题';
    private time: string = '';
    private remarkText: string = '';
    private hasCourseContent = false;
    private parentEvaluation: {
      evaluationList: Array<{
        descItems: [];
        evaluationLabel: string;
        evaluationStar: number;
        evaluationType: string;
        starDesc: string;
        evaluationContent?: string;
      }>
    } = {
      evaluationList: []
    };


    private created() {
      const query: any = this.$route.query;
      // this.lessonId = query.lessonId;
      // this.baseInfo = {
      //   studentName: '关冰浩'
      // };
      this.getBaseInfo();
      this.getInfo();
      // this.getCourseInfo();
    }

    private setIndex(index: number) {
      if (index <= 2) {
        return index;
      }
      if (this.hasCourseContent) {
        return index;
      } else {
        return index - 1;
      }
    }

    private async getInfo() {
      try {
        const info: any = await this.$api['report/evaluation-1v1']({}, {
          params: {
            encryptParam: this.$route.query.data
          }}, {
          dialog: false
        });
        this.$emit('share', reportType.OneToOneEvaluation, this.$route.query.data);
        const { answerQuestionOnClassroom,
          answerQuestionOnClassroomDetail,
          countryAbilityAnalysisData,
          courseWareHfive,
          homeWorkReport,
          improveStatistic,
          keyPoints,
          knowledgeDistribute,
          lastHomeWorkReport,
          personAbilityAnalysisData,
          whiteboradUsageRate = [],
          studentClassActivityData,
          studentEvaluation,
          parentEvaluation,
          lessonRecommendContentListData
        }: {
          answerQuestionOnClassroom: any;
          answerQuestionOnClassroomDetail: any;
          countryAbilityAnalysisData: any;
          courseWareHfive: any;
          homeWorkReport: any;
          improveStatistic: any;
          keyPoints: any;
          knowledgeDistribute: any;
          lastHomeWorkReport: any;
          personAbilityAnalysisData: any;
          whiteboradUsageRate: any[];
          studentClassActivityData: any;
          studentEvaluation: any;
          parentEvaluation: any;
          lessonRecommendContentListData: any[];
        } = info;
        this.hasReportData = true;
        this.loading = true;
        this.answerQuestionOnClassroom = Object.assign({}, this.answerQuestionOnClassroom, {...answerQuestionOnClassroom});

        if (whiteboradUsageRate) {
          this.activity.chartLine = whiteboradUsageRate.map((element: any) => {
            return [element.time, element.percent * 100];
          }).sort((a: number[], b: number[]) => a[0] - b[0]);
          this.activity.rate = studentClassActivityData.activityRate;
          this.activity.msg = studentClassActivityData.text;
        }

        if (personAbilityAnalysisData) {
          const value: number[] = personAbilityAnalysisData.map((ele: any) => {
            return ele.value;
          });
          const max: number = Math.max(...value) * 1.2;

          const indicator: any[] = personAbilityAnalysisData.map((ele: any) => {
            return {
              name: ele.name,
              max
            };
          });

          console.log(value);

          this.analysis.indicator = indicator;
          this.analysis.value = value;
        }

        courseWareHfive && (this.courseContent.data = courseWareHfive.filter((ele: any) => ele.coursewareType === 1) || []);

        lessonRecommendContentListData.forEach((element: any, index: number) => {
          if (element.moduleName === '课程介绍' || index === 1) {
            this.introduction = element.h5PictureUrl || element.pcPictureUrl;
          }
          if (element.moduleName === '学习方法' || index === 0) {
            this.studyMethods = element.h5PictureUrl || element.pcPictureUrl;
          }
        });

        // this.performance.interact.actualTime = studentClassActivityData.actualStudyTime;
        this.performance.interact.actualTime = 0;

        this.parentEvaluation = {
          evaluationList: parentEvaluation.evaluationList
        };
      } catch (err) {
        this.loading = false;
      }

    }


    /**
     * 获取用户基本信息：用户id，用户姓名，用户年级，课程名称，课程开始时间，课程结束时间
     */
    private async getBaseInfo() {
      const info: any = await this.$api['report/evaluation-base']({}, {
        params: {
          encryptParam: this.$route.query.data
        }
      });
      const basic: any = info.lessonReportBasicInfo;
      const lessonSummaryData: any = info.lessonSummaryData;
      this.courseType = basic.lessonType === 'test-lesson' ? 0 : 1;
      // todo: 学生头像
      this.baseInfo = {
        studentAvatar: '',
        studentName: basic.studentName,
        subjectName: basic.subjectName,
        studentGrade: basic.studentGrade,
        startTime: basic.lessonStartTime,
        endTime: basic.lessonEndTime,
        teacherName: `${basic.teacherName}老师`,
        courseName: basic.lessonKnowledge
      };

      this.pictureList = lessonSummaryData.pictureUrlList || [];

      this.performance.interact.totalTime = Math.floor((basic.lessonEndTime - basic.lessonStartTime) * 0.001);
      this.performance.performance.behaviorAssessment = lessonSummaryData.behaviorAssessment;
      this.performance.teacher.avatar = basic.teacherAvatar;
      this.performance.teacher.name = `${basic.teacherName}老师`;
      this.performance.teacher.textRemark = lessonSummaryData.textRemark;
      this.performance.teacher.voiceRemark = lessonSummaryData.voiceRemarkUrl;
      this.performance.teacher.voiceRemarkDuration = lessonSummaryData.voiceRemarkDuration;

      this.courseContent.lessonId = basic.lessonId;

      this.courseContent.user.studentName = basic.studentName;
      this.courseContent.user.studentIcon = basic.studentAvatar;
      this.courseContent.user.lessonId = basic.lessonId;
      this.courseContent.user.userId = basic.studentId;
    }
  }
</script>

<style lang="scss">
  .report-evaluation {
    position: relative;
    background: $--color-white;
    font-size: 18px;
    text-align: left;
    border-radius: 20px;
    z-index: 0;
    overflow: hidden;
    &__content {
      position: relative;
      background: rgba(255, 231, 117, 1);
      padding-bottom: 78px;
      min-height: 638px;
      overflow: hidden;
    }
    &__title {
      position: relative;
      &_bg {
        width: 100%;
      }
      &_type {
        position: absolute;
        top: 24px;
        left: 566px;
        width: 52px;
      }
      .tabbar {
        position: absolute;
        left: 18px;
        bottom: 8px;
        width: 880px;
        height: 50px;
        z-index: 2;
        padding-left: 32px;
        button {
          height:34px;
          border-radius:17px;
          padding: 0 16px;
          color:rgba(255,244,200,1);
          font-size: 16px;
          margin-right: 16px;
          margin-top: 6px;
          &.active {
            background:rgba(193,129,85,1);
          }
        }
      }
    }
    &__avatar_user {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
    &__info {
      margin-top: -7px !important;
      .pad-board__inner {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
    }
    &__item {
      margin-top: 10px !important;
    }
    &__grass {
      position: absolute;
      top: 290px;
      right: 0;
      width: 120px;
      &.grass2 {
        top: 1042px !important;
      }
      &.grass3 {
        top: 1752px;
      }
      &.grass4 {
        top: 2620px;
      }
    }
    &__footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 0;
    }
  }
</style>
