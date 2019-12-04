<template>
  <board>
    <div class="report-info">
      <img :src="data.studentAvatar || avatarDefault" alt="" class="report-evaluation__avatar_user">
      <div class="report-info_user">
        <p class="report-info_user-name">{{data.studentName || '掌小萌'}}</p>
        <p>
          <span>{{data.subjectName}}</span> |
          <span>{{data.studentGrade}}</span>
        </p>
      </div>
      <div class="report-info_class class-name">
        <p>课程名称</p>
        <p>{{data.courseName}}</p>
      </div>
      <div class="report-info_class">
        <p>上课时间</p>
        <p>{{data.timeString}}</p>
      </div>
      <div class="report-info_class">
        <p>上课老师</p>
        <p>{{data.teacherName}}</p>
      </div>
    </div>
  </board>
</template>

<script lang='ts'>
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';
  import Board from './board.vue';

  @Component({
    components: {
      Board
    }
  })
  export default class Info extends Vue {
    @Prop({
      type: Object,
      required: true
    })
    private dataSource: any;

    private data: any = null;

    private avatarDefault: any = require('../images/one-to-one/avatar.png');

    @Watch('dataSource')
    private dataSourceChanged() {
      this.init();
    }

    private created() {
      this.init();
    }

    private init() {
      if (this.dataSource === null || this.dataSource === undefined) {
        this.data = {};
        throw new Error('获取用户信息失败');
      }
      !this.dataSource.hasOwnProperty('studentAvatar') && console.warn('用户头像获取失败');
      !this.dataSource.hasOwnProperty('studentName') && console.warn('学生名称获取失败');
      !this.dataSource.hasOwnProperty('subjectName') && console.warn('科目获取失败');
      !this.dataSource.hasOwnProperty('studentGrade') && console.warn('学生年级及班级信息获取失败');
      !this.dataSource.hasOwnProperty('courseName') && console.warn('课程名称获取失败');
      !this.dataSource.hasOwnProperty('startTime') && console.warn('上课开始时间获取失败');
      !this.dataSource.hasOwnProperty('endTime') && console.warn('上课结束时间获取失败');
      !this.dataSource.hasOwnProperty('teacherName') && console.warn('老师名称获取失败');
      this.data = {
        ...this.dataSource,
        timeString: this.formatTime(this.dataSource.startTime, this.dataSource.endTime)
      };
    }

    private formatTime(startTimestamp: number, endTimestamp: number) {
      const start: Date = new Date(startTimestamp);
      const end: Date = new Date(endTimestamp);
      const startDate: string = `${start.getFullYear()}.${start.getMonth() + 1}.${start.getDate()}`;
      // const endDate: string = end.toLocaleDateString();

      const startTime: string = start.toTimeString();
      const endTime: string = end.toTimeString();

      const format: string = `${startDate} ${startTime.substr(0, 5)}-${endTime.substr(0, 5)}`;
      console.log(format);
      return format;
    }
  }
</script>
<style lang="scss">
  .report-info {
    @include flex();
    padding: 20px 62px 20px 40px;
    &_user {
      width: 204px;
      padding: 0 20px;
      color: rgba(196, 151, 97, 1);
      font-size: 14px;
      line-height: 18px;
      &-name {
        font-size: 18px;
        color: rgba(125, 88, 45, 1);
        line-height: 32px;
      }
    }
    &_class {
      width: 120px;
      height: 90px;
      padding: 12px 20px;
      background: rgba(255, 244, 200, 1);
      border-radius: 6px;
      margin-right: 20px;
      color:rgba(125,88,45,1);
      line-height:22px;
      font-size: 14px;
      p:first-child {
        font-size: 12px;
        color:rgba(196,151,97,1);
      }
      p:nth-of-type(2) {
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      &.class-name {
        width: 198px;
      }
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
</style>
