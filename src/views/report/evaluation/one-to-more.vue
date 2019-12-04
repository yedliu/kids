<template>
  <div v-if="hasReportData" class="evaluation report__content">
    <img class="report__title" src="./images/title.png" alt="">
    <!--基本信息 开始-->
    <number number="1" text="基本信息" class="report__number"></number>
    <div class="evaluation__base-info">
      <img :src="avatarDefault || baseInfo.studentIcon" alt="" class="evaluation__avatar">
      <div class="evaluation__info-wrap">
        <div class="evaluation__info-detail">
          <p>{{baseInfo.studentName}}</p>
          <p>{{baseInfo.courseName}}</p>
          <p>{{baseInfo.studentGrade}}</p>
        </div>
        <div class="evaluation__detail evaluation__time">
          <div class="evaluation__info-inner">
            <p class="evaluation__info-title">上课时间</p>
            <p class="evaluation__info-text">{{baseInfo.timeString}}</p>
          </div>
        </div>
      </div>
    </div>
    <!--基本信息 结束-->

    <!--课堂内容 开始-->
    <template v-if="hasCourseContent">
      <number number="2" text="课堂内容" class="report__number" style="margin-top: 70px;"></number>
      <course-content
        style="margin-top: 15px;"
        :data="courseContent"
        :user="baseInfo"
        :lesson-id="lessonId"
        @error="hasCourseContent = false"
      ></course-content>
    </template>
    <!--课堂内容 结束-->

    <!--课堂表现 开始-->
    <number :number="setIndex(3)" text="课堂表现" class="report__number" style="margin-top: 70px;"></number>
    <shows style="margin-top: 76px;" class="evaluation__rate-wrap">
      <div class="evaluation__rate-wrap__title">该生本节课总体表现</div>
      <rate :star="star"></rate>
    </shows>

    <shows v-if="item.tags.length > 0" v-for="(item, index) in tagsList" :key="index" style="margin-top: 13px;">
      <p class="evaluation__tags-type">{{item.label}}</p>
      <div class="evaluation__tags-wrap">
        <p v-for="(tag, idx) in item.tags" :key="idx" :class="['report__tag', {blue: index > 0}]">{{tag}}</p>
      </div>
    </shows>
    <!--<shows style="margin-top: 13px;">-->
      <!--<p class="evaluation__tags-type">行动类</p>-->
      <!--<div class="evaluation__tags-wrap">-->
        <!--<p v-for="(item, index) in tags2" :key="index" class="report__tag" style="border: 2px solid #73B3FF;box-shadow: 4px 4px 0 0  #DDECFF;color: #73B3FF;">{{item}}</p>-->
      <!--</div>-->
    <!--</shows>-->
    <!--课堂表现 结束-->

    <!--老师点评 开始-->
    <number :number="setIndex(4)" text="老师点评" class="report__number" style="margin-top: 80px;"></number>
    <pad-audio v-if="audio" class="evaluation__audio" :src="audio"></pad-audio>
    <section v-else class="evaluation__remark-text">
      {{remarkText}}
    </section>
    <!--<shows></shows>-->
    <!--老师点评 结束-->

    <!--知识&能力评分 开始-->
    <number :number="setIndex(5)" text="知识&能力评分" class="report__number" style="margin-top: 80px;"></number>
    <analysis :info="abilities" class="evaluation__analysis"></analysis>
    <!--知识&能力评分 结束-->

    <!--课程推荐 开始-->
    <number :number="setIndex(6)" class="report__number" style="margin-top: 80px;">
      <p>课程推荐<span style="font-size: 16px;">（分班建议）</span></p>
    </number>
    <p v-if="classSuggestion" class="evaluation__class-suggestion-tips">经过综合分析，目前最适合{{baseInfo.studentName}}小朋友的班级是<span>{{classSuggestion}}</span></p>
    <div class="evaluation__red-wrap">
      <img :src="courseIntroduction" alt="">
    </div>
    <!--课程推荐 结束-->

    <!--学习方法和经验分享 开始-->
    <number :number="setIndex(7)" text="学习方法和经验分享" class="report__number" style="margin-top: 80px;"></number>
    <div class="evaluation__red-wrap">
      <img :src="learn2Share" alt="" style="width: 80%">
    </div>
    <!--学习方法和经验分享 结束-->

    <!--推荐书单 开始-->
    <number :number="setIndex(8)" text="推荐书单" class="report__number" style="margin-top: 80px;"></number>
    <div class="evaluation__book-wrap">
      <div v-for="(item, index) in books" :key="index" class="evaluation__book">
        <div class="evaluation__book-content">{{item}}</div>
      </div>
    </div>
    <!--推荐书单 结束-->

    <img src="./images/img_wood_left1.png" alt="" class="evaluation__ruler">
    <img src="./images/img_wood_right1.png" alt="" class="evaluation__pencil">
    <img src="./images/img_wood_left2.png" alt="" class="evaluation__bulb">
    <img src="./images/img_wood_right2.png" alt="" class="evaluation__pen">
  </div>
  <default v-else></default>
</template>

<script lang='ts'>
  import {Component, Vue} from 'vue-property-decorator';

  @Component({
    components: {
      Rate: () => import('../common/components/rate.vue'),
      Number: () => import('../common/components/number.vue'),
      PadAudio: () => import('../common/components/audio.vue'),
      CourseContent: () => import('./modules/course-content.vue'),
      Shows: () => import('./modules/shows.vue'),
      // Evaluate: () => import('./modules/evaluate.vue'),
      // Shows: () => import('./modules/shows.vue'),
      Analysis: () => import('../common/modules/analysis.vue'),
      Default: () => import('../common/modules/default.vue')
    }
  })
  export default class Evaluation extends Vue {
    private avatarDefault: any = require('./images/avatar_default.png');
    private hasReportData: boolean = false;
    private name: string = '';
    private theme: string = '巧解鸡兔同笼问题';
    private time: string = '';
    private remarkText: string = '';
    private hasCourseContent = false;

    private star: number = 0;
    private tags1: string[] = [];
    private tags2: string[] = [];
    private tagsList: any[] = [];
    private award: number = 0;
    private courseIntroduction: string = '';

    private courseContent: any[] = [];

    private classSuggestion: string = '';

    private learn2Share: string = '';
    private lessonId: string | string[] = '';
    private audio: string = '';

    private abilities: any[] = [];

    private books: string[] = [];

    private baseInfo: any = {};

    private created() {
      const query: any = this.$route.query;
      this.lessonId = query.lessonId;
      this.getBaseInfo();
      this.getInfo();
      this.getCourseInfo();
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
      const info: any = await this.$api['report/evaluation']({param: this.$route.query.data}, {
        dialog: false
      });
      const data: any[] = info.assessTemplateDTO.conditionLists || [];
      this.hasReportData = true;
      if (data.length > 0) {
        data.forEach((element: any) => {
          // 课堂表现
          if (element.filedName === 'classroomPerformance') {
            element.conditionList.forEach((condition: any) => {
              if (condition.filedName === 'behavingStar') {
                this.star = +condition.value || 0;
              } else {
                const tags: string[] = [];
                condition.config.children.forEach((tagsObject: any) => {
                  if (condition && condition.value && condition.value.indexOf(tagsObject.value) > -1) {
                     tags.push(tagsObject.label);
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

          // 老师语音点评
          if (element.filedName === 'remark') {
            this.audio = element.value;
          }

          // 老师文字点评
          if (element.filedName === 'remarkText') {
            this.remarkText = element.value;
          }

          // 能力评分
          if (element.filedName === 'ability') {
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
                          this.abilities.push({
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
    }

    private async getCourseInfo() {
      const info: any = await this.$api['course/detail']({
        type: 1,
        lessonId: this.lessonId
      });
      const courseList: any[] = info.filter((course: any) => {
        return course.cwType === 2;
      });
      this.hasCourseContent = courseList.length > 0;
      // this.$log('课程列表获取成功');
      // console.log(courseList);
      this.courseContent = courseList || [];
    }


    /**
     * 获取用户基本信息：用户id，用户姓名，用户年级，课程名称，课程开始时间，课程结束时间
     */
    private async getBaseInfo() {
      const info: any = await this.$api['course/info']({
        lessonId: this.lessonId
      });
      this.baseInfo = info;
      this.formatTime();
    }
  }
</script>

<style lang="scss">
  .evaluation {
    position: relative;
    background: $--color-white;
    font-size: 18px;
    text-align: left;
    padding-bottom: 100px;
    .number__inner {
      background: #FF6C6E;
    }
    &__ {
      &base-info{
        @include flex();
        width: 848px;
        height: 190px;
        margin: -21px auto 0;
        padding: 40px 53px 62px 64px;
        background: #FFFBF1;
      }
      &avatar {
        display: block;
        width: 120px;
        height: 120px;
        border: 5px solid $--color-white;
        border-radius: 50%;
        box-shadow: 0 3px 10px 0 rgba($--color-black, 0.1);
      }
      &name {
        color: #EF4C4F;
      }
      &info-wrap {

      }
      &info-detail {
        @include flex();
        font-size: 22px;
        padding: 0 20px;
        font-weight: bold;
        p {
          @include ellipsis();
          padding: 0 20px;
          background-image: linear-gradient(180deg, #333, #333);
          background-size: 2px 70%;
          background-repeat: no-repeat;
          background-position: 100% 5px;
          &:last-of-type {
            background: none;
          }
        }
      }
      &detail {
        @include flex(flex-start, stretch);
        padding: 16px 14px;
        font-size: 16px;
        &.evaluation__time {
          &::before {
            @include bg('./images/icon_time.png');
            content: '';
            width: 40px;
            height: 40px;
            margin-right: 20px;
            margin-left: 20px;
          }
        }
      }
      &info-inner {
        @include flex(space-between, flex-start);
        flex-direction: column;
        line-height: 1.2;
      }
      &info-title {
        font-size: 13px;
        color: #999999;
      }
      &rate-wrap {
        @include flex(center);
        &__title {
          @include bg('./images/rate-title.png');
          color: $--color-white;
          padding-top: 6px;
          text-align: center;
          font-size: 18px;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, -65%);
          width: 265px;
          height: 47px;
        }
      }
      &tags-type {
        font-size: 18px;
        font-weight: bold;
      }
      &tags-wrap {
        @include flex();
        margin-top: 12px;
        .report__tag {
          margin: 0 30px 16px 0;
          &.blue {
            border: 2px solid #73B3FF;
            box-shadow: 4px 4px 0 0  #DDECFF;
            color: #73B3FF;
          }
        }
      }
      &audio {
        margin-top: 30px;
        &>img {
          margin-left: 20px !important;
        }
      }
      &remark-text {
        padding: 10px 30px;
        word-break: break-all;
      }
      &class-suggestion-tips {
        color: #430707;
        padding: 20px 20px 0;
        span {
          color: #ef4c4f;
        }
      }
      &red-wrap {
        position: relative;
        @include flex(center);
        width: 878px;
        min-height: 140px;
        background: #FFF4F4;
        font-size: 16px;
        border-radius: 8px;
        margin: 20px auto 0;
        img {
          width: 98%;
        }
        &::after {
          content: '';
          position: absolute;
          background: rgba(0,0,0,0);
          width: 100%;
          height: 100%;
        }
      }
      &book-wrap {
        @include flex(flex-start);
        width: 878px;
        margin: 32px auto 0;
      }
      &book {
        @include bg('./images/img_book.png');
        width: 124px;
        height: 152px;
        margin-right: 20px;
        margin-bottom: 20px;
        &-content {
          @include flex(center);
          width: 106px;
          height: 116px;
          margin-left: 18px;
          color: $--color-white;
          overflow: hidden;
          padding: 5px;
        }
      }
      &evaluate {
        margin: 48px auto 0;
        width: 808px;
      }
      &ruler, &pencil, &bulb, &pen {
        position: absolute;
        width: 100px;
      }
      &pencil {
        top: 200px;
      }
      &ruler {
        top: 265px;
      }
      &pencil, &pen {
        right: 0;
      }
      &bulb {
        top: 1100px;
      }
      &pen {
        top: 1080px;
      }
      &analysis {
        margin-top: 49px;
      }
    }
  }
</style>
