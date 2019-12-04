<template>
  <div v-if="hasReportData" class="report-evaluation report__content">
    <div class="report-evaluation__content">
      <img src="./images/one-to-one/footer.png" alt="" class="report-evaluation__footer">
      <div class="report-evaluation__title">
        <img class="report-evaluation__title_bg" src="./images/one-to-one/title.png" alt="">
        <img v-if="couseType === 0" src="./images/one-to-one/测评课.png" alt="" class="report-evaluation__title_type">
        <div class="tabbar">
          <button :class="[{active: active === 1}]" @click="active = 1">课堂学习报告</button>
          <button :class="[{active: active === 2}]" @click="active = 2">课堂评价</button>
        </div>
      </div>
      <div v-show="active === 1">
        <!--基本信息 开始-->
        <info v-if="baseInfo" :dataSource="baseInfo" class="report-evaluation__info"></info>
        <!--基本信息 结束-->

        <!--课堂内容：zmg 开始-->
        <course-content-zmg v-if="courseContentVideo" class="report-evaluation__item" :url="courseContentVideo" :poster="courseContentVideoPoster"></course-content-zmg>
        <!--课堂内容 结束-->

        <!--课堂表现 开始-->
        <performance
          class="report-evaluation__item"
          :interact="performance.interact"
          :performance="performance.performance"
          :teacher="performance.teacher"
        ></performance>
        <!--课堂表现 结束-->

        <!--答题互动 开始-->
        <interaction v-if="(answerQuestionOnClassroom.gamePracticeCount || answerQuestionOnClassroom.avgGamePracticeTime) && (courseWareType === 3)" class="report-evaluation__item" :dataSource="answerQuestionOnClassroom"></interaction>
        <!--答题互动 结束-->

        <!--答题互动zml 开始-->
        <interaction-zml v-if="(answerQuestionOnClassroom.correctAnswerCount || answerQuestionOnClassroom.falseAnswerCount) && (courseWareType === 2)" class="report-evaluation__item" :dataSource="answerQuestionOnClassroom"></interaction-zml>
        <!--答题互动 结束-->

        <!--课堂活跃状态 开始-->
        <activity v-if="activity.rate || (activity.chartLine.length > 0)" class="report-evaluation__item" :dataSource="activity"></activity>
        <!--课堂活跃状态 结束-->

        <!--学习能力分析 开始-->
        <analysis v-if="analysis.indicator.length > 0" class="report-evaluation__item" :dataSource="analysis"></analysis>
        <!--学习能力分析 结束-->

        <!--课堂内容：zml 开始-->
        <course-content v-if="courseContent.data.length > 0 && !courseContentVideo" class="report-evaluation__item" v-bind="courseContent"></course-content>
        <!--课堂内容 结束-->

        <!--课程介绍 开始-->
        <introduction v-if="courseIntroduction" class="report-evaluation__item" :dataSource="courseIntroduction"></introduction>
        <!--课程介绍 结束-->

        <!--学习方法 开始-->
        <methods v-if="learn2Share" class="report-evaluation__item" :dataSource="learn2Share"></methods>
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
      Performance: () => import('./modules/performance_smallClass.vue'),
      Interaction: () => import('./modules/interaction_smallClass.vue'),
      InteractionZml: () => import('./modules/interaction_smallClass_zml.vue'),
      Activity: () => import('./modules/activity_1v1.vue'),
      Analysis: () => import('./modules/analysis_smallClass.vue'),
      CourseContent: () => import('./modules/content_class.vue'),
      CourseContentZmg: () => import('./modules/content_smallClass.vue'),
      Introduction: () => import('./modules/introduction_1v1.vue'),
      Methods: () => import('./modules/methods_1v1.vue'),
      Comment: () => import('./modules/comment_1v1.vue')
    }
  })

  export default class Evaluation extends Vue {
    private courseWareType: number = 1;
    private active: number = 1;
    private avatarDefault: any = require('./images/avatar_default.png');
    private hasReportData: boolean = false;
    private name: string = '';
    private theme: string = '巧解鸡兔同笼问题';
    private time: string = '';
    private remarkText: string = '';
    private hasZmgCourseContent = false;
    private star: number = 0;
    private tags1: string[] = [];
    private tags2: string[] = [];
    private tagsList: any[] = [];
    private award: number = 0;
    private courseIntroduction: string = '';

    private couseType: number = 0;

    private loading: boolean = true;

    // private courseContent: any[] = [];

    private classSuggestion: string = '';

    private learn2Share: string = '';
    private lessonId: number | string = '';
    private audio: string = '';

    private abilities: any[] = [];

    private books: string[] = [];

    private baseInfo: any = {};

    private biInfo: any = {
      answerDuration: 0, // 作答时长
      answerFailCount: 0, // 作答错误题目数
      answerRightCount: 0, // 作答正确题目数
      avgGamePracticeTime: 0, // 平均训练时长
      esimatedAnswerDuration: 0, // 预估作答时长
      gameActiveDuration: 0, // 游戏活跃时长
      gamePracticeCount: 0, // 训练次数
      onStageCount: 0, // 上台次数
      practiceSpeedOverPCT: 0, // 训练速度超过同年级小孩百分比
      videoPraiseCount: 0, // 点赞次数
      wbActiveDistribution: 0, // 返回信息json
      wbActiveDistributionList: 0, // 返回信息合集 {percent 百分比, time}
      wbActiveDuration: 0 // 白板活跃时长
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
        behaviorAssessment: 4,
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

    private courseContentZmg: string = '';
    private courseContentVideo: string = '';
    private courseContentVideoPoster: string = '';

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

    private answerQuestionOnClassroom: {                  // 学生答题结果
      gamePracticeCount: number,
      avgGamePracticeTime: number,
      answerRightPCT: number,
      answerRightDesc: string,
      practiceSpeedOverPCT: number,
      actualTime: number;
      suggestTime: number;
      correctAnswerCount: number;
      falseAnswerCount: number;
      correctRate: number;
      msg: string;
    } = {
      gamePracticeCount: 0,
      avgGamePracticeTime: 0,
      answerRightPCT: 0,
      answerRightDesc: '',
      practiceSpeedOverPCT: 0,
      actualTime: 0,
      suggestTime: 0,
      correctAnswerCount: 0,
      falseAnswerCount: 0,
      correctRate: 0,
      msg: ''
    };

    private analysis: {
      value: number[];
      indicator: Array<{ name: string; max: number; }>;
      comment: string[];
    } = {
      value: [],
      indicator: [],
      comment: []
    };

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
      // this.getBaseInfo();
      this.getInfo();
      // this.getCourseInfo();
    }

    private setIndex(index: number) {
      if (index <= 2) {
        return index;
      }
      if (this.hasZmgCourseContent) {
        return index;
      } else {
        return index - 1;
      }
    }

    private formatTime() {
      const start: Date = new Date(this.baseInfo.lessonStartTime);
      const end: Date = new Date(this.baseInfo.lessonEndTime);
      const startDate: string = start.toLocaleDateString();
      const endDate: string = end.toLocaleDateString();

      const startTime: string = start.toTimeString();
      const endTime: string = end.toTimeString();

      const format: string = `${startDate.replace(/\//g, '-')} ${startTime.substr(0, 5)}-${endTime.substr(0, 5)}`;
      this.baseInfo = Object.assign({}, this.baseInfo, {timeString: format});
    }

    private async getInfo() {
      this.loading = true;
      try {
        const info: any = await this.$api['report/evaluation-small-class']({param: this.$route.query.data}, {
          dialog: false
        });
        if (JSON.stringify(info) === '{}') {
          throw new Error('数据为空');
          return;
        }
        if (!info.baseInfo || JSON.stringify(info.baseInfo) === '{}') {
          throw new Error('课程基本数据为空');
          return;
        }
        if ((!info.assessCaseDTO || JSON.stringify(info.assessCaseDTO) === '{}') && this.inner24Hour(info.baseInfo)) {
          throw new Error('课程基本数据为空');
          return;
        }
        // if (!info.parentAssessCaseDTO) {
        //   return;
        // }
        this.courseWareType = info.courseWareType || 0;
        this.getBaseInfo(info.baseInfo, info.assessCaseDTO);
        this.getBiInfo(info.smallLessonBiReportDTO);
        if (info.kidLessonCswareVO) {
          this.getZmgCourseVideo(info.kidLessonCswareVO);
        } else if (info.courseWareContent) {
          const cwType = info.courseWareContent.cwType || 0;
          if (cwType === 2) {
            const courseWareContentList: any[] = [];
            courseWareContentList.push(info.courseWareContent);
            this.getCourseInfo(courseWareContentList);
          }
        }
        if (info.parentAssessCaseDTO) {
          this.getParentAssess(info.parentAssessCaseDTO.assessTemplateDTO.conditionLists);
        }
        const data: any[] = (info.assessCaseDTO && info.assessCaseDTO.assessTemplateDTO.conditionLists) || [];
        this.hasReportData = true;
        if (data.length > 0) {
          data.forEach((element: any) => {
            // 课堂表现
            if (element.filedName === 'classroomPerformance') {
              element.conditionList.forEach((condition: any) => {
                if (condition.filedName === 'behavingStar') {
                  this.performance.performance.behaviorAssessment = +condition.value || 4;
                } else {
                  const tags: string[] = [];
                  condition.config.children.forEach((tagsObject: any) => {
                    if (condition && condition.value && condition.value.indexOf(tagsObject.value) > -1) {
                      tags.push(tagsObject.label);
                      this.performance.performance.tags.push(tagsObject.label);
                    }
                  });
                  this.tagsList.push({
                    label: condition.text,
                    tags
                  });
                  // this.$log('标签列表');
                  // console.log(this.tagsList);
                }
                if (condition.filedName === 'behaving1') {
                  condition.config.children.forEach((tag: any) => {
                    this.tags1.push(tag.label);
                  });
                }
                if (condition.filedName === 'behaving2') {
                  condition.config.children.forEach((tag: any) => {
                    this.tags2.push(tag.label);
                  });
                }
              });
            }

            // 总体表现
            if (element.filedName === 'behavingStar') {
              this.performance.performance.behaviorAssessment = +element.value || 0;
            }

            // 老师语音点评
            if (element.filedName === 'remark') {
              // this.audio = element.value;
              this.performance.teacher.voiceRemark = element.value;
            }

            // 老师文字点评
            if (element.filedName === 'remarkText') {
              // this.remarkText = element.value;
              this.performance.teacher.textRemark = element.value;
            }

            // 能力评分
            if (element.filedName === 'ability') {
              const abilities: any[] = [];
              for (const key in element.value) {
                if (element.value.hasOwnProperty(key)) {
                  const score: string = element.value[key][0];
                  // console.log(element.config);
                  // 新数据格式
                  if (Array.isArray(element.config)) {
                    element.config.forEach((config: any) => {
                      if (config.value === key) {
                        const ability: string = config.label;
                        config.children.forEach((child: any) => {
                          if (child.value === score) {
                            const remark: string = child.label;
                            abilities.push({
                              ability,
                              score,
                              remark
                            });
                          }
                        });
                      }
                    });
                  }

                  // 老数据格式
                }
              }
              if (abilities) {
                const value: number[] = abilities.map((ele: any) => {
                  return ele.score;
                });
                // const max: number = Math.max(...value) * 1.2;

                const indicator: any[] = abilities.map((ele: any) => {
                  return {
                    name: ele.ability,
                    max: 5
                  };
                });

                const comment: any[] = abilities.map((ele: any) => {
                  return `${ele.ability}：${ele.remark}`;
                });

                this.analysis.indicator = indicator;
                this.analysis.value = value;
                this.analysis.comment = comment;
              }
              // console.log(this.abilities);
            }

            // 分班建议
            if (element.filedName === 'classSuggestion') {
              const value: any = element.value;
              if (value) {
                element.config.children.forEach((classType: any) => {
                  if (classType.value === value) {
                    this.classSuggestion = classType.label || '远航班';
                    return false;
                  }
                });
              }
            }

            //
            if (element.filedName === 'courseIntroduction') {
              this.courseIntroduction = element.config;
            }

            // 学习方法
            if (element.filedName === 'learn2Share') {
              this.learn2Share = element.config;
            }

            // 推荐书单
            if (element.filedName === 'recommoned') {
              const value: string = element.value;
              element.config.children.forEach((book: any) => {
                value.indexOf(book.value) > -1 && this.books.push(book.label);
              });
            }
          });
        }
        if (!this.$route.query.from || this.$route.query.from !== 'teacher') {
          this.$emit('share', reportType.OneToMoreFormal, this.$route.query.data);
        }
      } catch (e) {
        this.loading = false;
        console.log(e);
      }
    }

    private async getZmgCourseVideo(info: any) {
      if (!info) {
        return;
      }
      this.courseContentVideo = info.videoUrl;
      this.courseContentVideoPoster = info.videoPoster;
    }

    private async getCourseInfo(info: any[]) {
      if (!info) {
        return;
      }
      const courseList: any[] = info.filter((course: any) => {
        return course.cwType === 2;
      });
      // this.$log('课程列表获取成功');
      // console.log(courseList);
      if (courseList.length > 0) {
        this.courseContent.lessonId = this.lessonId;
        this.courseContent.data = courseList.map((course: any) => {
          return {
            cwName: course.cwName,
            cwType: course.cwType,
            content: course.content || course.cwUrl,
            id: course.id
          };
        });
        this.courseContent.user.studentName = this.baseInfo.studentName;
        this.courseContent.user.studentIcon = this.baseInfo.studentAvatar;
        this.courseContent.user.userId = this.baseInfo.studentName;
        this.courseContent.user.lessonId = this.lessonId;
      }
    }

    private async getZmgCourseInfo(info: any[]) {
      if (!info) {
        return;
      }
      const courseList: any[] = info.filter((course: any) => {
        return course.cwType === 3 || course.cwType === 4;
      });
      if (!courseList || courseList.length === 0) {
        return;
      }
      this.hasZmgCourseContent = courseList.length > 0;
      console.log(courseList);
      this.courseContentZmg = courseList[0].cwUrl || '';
    }

    private inner24Hour(basic: any) {
      if (!basic) {
        return;
      }
      let endTime: number = 0;
      if (basic.lesEndedTime * 1) {
        endTime = Number(basic.lesEndedTime);
      } else {
        endTime = new Date(basic.lesEndedTime.replace(/-/g, '/')).getTime();
      }
      const nowTime = new Date().getTime();
      return (nowTime - endTime) / (1000 * 60 * 60) < 24;
    }


    /**
     * 获取用户基本信息：用户id，用户姓名，用户年级，课程名称，课程开始时间，课程结束时间
     */
    private getBaseInfo(basic: any, assessCaseDTO: any) {
      if (!basic) {
        return;
      }
      this.lessonId = assessCaseDTO ? assessCaseDTO.bizId : '';
      let startTime: number = 0;
      let endTime: number = 0;
      if (basic.lesStartTime * 1) {
        startTime = Number(basic.lesStartTime);
      } else {
        startTime = new Date(basic.lesStartTime.replace(/-/g, '/')).getTime();
      }
      if (basic.lesEndedTime * 1) {
        endTime = Number(basic.lesEndedTime);
      } else {
        endTime = new Date(basic.lesEndedTime.replace(/-/g, '/')).getTime();
      }
      const baseInfo = {
        studentAvatar: '',
        studentName: basic.stuName,
        subjectName: basic.subject,
        studentGrade: basic.grade,
        startTime,
        endTime,
        lessonId: assessCaseDTO ? assessCaseDTO.bizId : (basic.lessonId || ''),
        teacherName: (basic.teacherNickName || basic.teacherName) + '老师',
        courseName: basic.lessonSystem,
        studentId: assessCaseDTO ? assessCaseDTO.bizIdSub : (basic.studentId || '')
      };
      this.baseInfo = baseInfo;
      this.$emit('baseInfoInit', baseInfo);
      this.performance.teacher.name = (basic.teacherNickName || basic.teacherName) + '老师';
      this.formatTime();
    }

    private getBiInfo(biInfo: any) {
      if (!biInfo) {
        return;
      }
      const {
        answerDuration, // 作答时长
        answerFailCount, // 作答错误题目数
        answerRightCount, // 作答正确题目数
        answerRightPCT, // 作答正确率
        answerRightDesc, // 作答正确率描述
        avgGamePracticeTime, // 平均训练时长
        esimatedAnswerDuration, // 预估作答时长
        gameActiveDuration, // 游戏活跃时长
        gamePracticeCount, // 训练次数
        onStageCount, // 上台次数
        videoPraiseCount, // 点赞次数
        wbActiveDistribution, // 返回信息json
        wbActiveDistributionList, // 返回信息合集 {percent 百分比, time}
        wbActiveDuration, // 白板活跃时长
        activeOverPCT, // 活跃度超过百分比
        activeOveDesc, // 活跃度评语
        practiceSpeedOverPCT, // 训练速度超过同年级小孩百分比
        practiceSpeedOverDesc // 训练速度评语
      } = biInfo;
      this.biInfo = biInfo;
      this.answerQuestionOnClassroom = {
        gamePracticeCount,
        avgGamePracticeTime,
        answerRightPCT,
        answerRightDesc,
        practiceSpeedOverPCT,
        actualTime: answerDuration,
        suggestTime: esimatedAnswerDuration,
        correctAnswerCount: answerRightCount,
        falseAnswerCount: answerFailCount,
        correctRate: Math.round(answerFailCount / answerFailCount),
        msg: practiceSpeedOverDesc
      };
      if (wbActiveDistributionList && wbActiveDistributionList.length > 0) {
        this.activity.chartLine = wbActiveDistributionList.map((element: any) => {
          return [element.time, element.percent * 100];
        }).sort((a: number[], b: number[]) => a[0] - b[0]);
      }
      this.activity.rate = activeOverPCT;
      this.activity.msg = activeOveDesc;
      let actualTime: number = 0;
      if (gameActiveDuration >= 0) {
        actualTime = actualTime + gameActiveDuration;
      }
      if (wbActiveDuration >= 0) {
        actualTime = actualTime + wbActiveDuration;
      }
      if (!(gameActiveDuration >= 0) && !(wbActiveDuration >= 0)) {
        actualTime = -1;
      }
      this.performance.interact = {
        totalTime: Math.floor((new Date(this.baseInfo.endTime).getTime() - new Date(this.baseInfo.startTime).getTime()) * 0.001),
        actualTime,
        times: onStageCount >= 0 ? onStageCount : -1,
        goods: videoPraiseCount >= 0 ? videoPraiseCount : -1
      };
    }

    private getParentAssess(info: any[]) {
      if (info && info.length > 0) {
        const evaluationList: any[] = [];
        info.forEach((element: any) => {
          const evaluation: any = {
            evaluationType: element.type,
            evaluationLabel: element.text,
            evaluationStar: +element.value.level_1
          };
          if (element.type === 'TEXT') {
            evaluation.evaluationContent = element.value;
          }
          if (element.config.children) {
            const filter: any = element.config.children.find((child: any) => child.value === element.value.level_1);
            const tagList: string[] = filter.children.filter((child: any) => element.value.level_2.indexOf(child.value) > -1 || child.checked).map((child: any) => {
              return {
                descLabel: child.label
              };
            });
            console.log(filter);
            evaluation.starDesc = filter.label;
            evaluation.descItems = tagList;
          }
          evaluationList.push(evaluation);
        });
        this.parentEvaluation.evaluationList = evaluationList;
      }
      console.log(this.parentEvaluation);
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
    /*overflow-y: hidden;*/
    &__content {
      position: relative;
      background: rgba(255, 231, 117, 1);
      padding-bottom: 78px;
      min-height: 638px;
      /*overflow: hidden;*/
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
