<template>
  <div v-if="hasReportData" class="formal report__content">
    <img class="report__title" src="./images/title.png"/>
    <!--基本信息 开始-->
    <number number="1" text="基本信息" class="report__number"></number>
    <div class="formal__base-info">
      <p>亲爱的<span class="formal__name">{{name}}</span>家长您好！这是<span class="formal__name">{{name}}</span>在掌门少儿参加的第{{times}}节{{subject}}课程，下面是本次课程学习的报告</p>
      <div class="formal__info-detail">
        <div class="formal__detail formal__theme">
          <div class="formal__info-inner">
            <p class="formal__info-title">课程主题</p>
            <p class="formal__info-text">{{theme}}</p>
          </div>
        </div>
        <div class="formal__detail formal__time">
          <div class="formal__info-inner">
            <p class="formal__info-title">上课时间</p>
            <p class="formal__info-text">{{time}}</p>
          </div>
        </div>
      </div>
    </div>
    <!--基本信息 结束-->

    <!--课堂表现 开始-->
    <number number="2" text="课堂表现" class="report__number" style="margin-top: 80px;"></number>
    <evaluate
      :star="star"
      :award="award"
      :tags="tags"
      :audio="audio"
      :remark="remark"
      class="formal__evaluate"></evaluate>
    <!--课堂表现 结束-->

    <!--精彩瞬间 开始-->
    <!--<number number="3" text="精彩瞬间" class="report__number" style="margin-top: 80px;"></number>-->
    <!--<shows></shows>-->
    <!--精彩瞬间 结束-->

    <!--只是&能力评分 开始-->
    <number number="3" text="知识&能力评分" class="report__number" style="margin-top: 80px;"></number>
    <analysis :info="abilities" class="formal__analysis"></analysis>
    <!--只是&能力评分 结束-->

    <img src="./images/img_ruler.png" alt="" class="formal__ruler">
    <img src="./images/img_pencil.png" alt="" class="formal__pencil">
    <img src="./images/img_bulb.png" alt="" class="formal__bulb">
    <img src="./images/img_pen.png" alt="" class="formal__pen">
  </div>
  <default v-else></default>
</template>

<script lang='ts'>
  import {Component, Vue} from 'vue-property-decorator';
  import Analysis from '../common/modules/analysis.vue';

  @Component({
    components: {
      Default: () => import('../common/modules/default.vue'),
      Number: () => import('../common/components/number.vue'),
      Evaluate: () => import('./modules/evaluate.vue'),
      Shows: () => import('./modules/shows.vue'),
      Analysis
    }
  })
  export default class Formal extends Vue {
    private hasReportData: boolean = false;
    private name: string = '';
    private times: number = 0;
    private theme: string = '';
    private time: string = '';
    private subject: string = '';

    private star: number = 0;
    private award: number = 0;

    private remark: string = '';  // 文字评价

    private tags: string[] = [];
    private audio: string = '';

    private abilities: any[] = [];

    private async created() {
      const info: any = await this.$api['report/formal']({param: this.$route.query.data});
      info && (this.hasReportData = true);
      const {baseInfo, performance} = info;
      this.name = baseInfo.stuName;
      this.times = baseInfo.lesCount;
      this.theme = baseInfo.lessonSystem || '无主题';
      this.subject = baseInfo.subject;
      this.time = `${baseInfo.lesStartTime.substr(0, baseInfo.lesStartTime.length - 3)}-${baseInfo.lesEndedTime.substr(baseInfo.lesEndedTime.length - 8, 5)}`;

      this.star = +performance.star || 0;
      this.award = +performance.award || 0;
      this.tags = performance.tags;
      this.audio = performance.remarkUrl;
      this.remark = performance.remark;
      this.abilities = info.abilities;
    }
  }
</script>
<style lang="scss">
  .formal {
    position: relative;
    background: $--color-white;
    font-size: 18px;
    text-align: left;
    padding-bottom: 100px;
    &__ {
      &base-info{
        @include bg('./images/base-info_bg.png');
        width: 808px;
        height: 231px;
        margin: 16px auto 0;
        padding: 45px 53px 62px 64px;
      }
      &name {
        color: #EF4C4F;
      }
      &info-detail {
        @include flex();
        background-color: $--color-white;
        border-radius: 8px;
        margin-top: 27px;
        &>div {
          flex: 1;
        }
      }
      &detail {
        @include flex(flex-start, stretch);
        padding: 16px 14px;
        &::before {
          @include bg('./images/icon_theme.png');
          content: '';
          width: 39px;
          height: 50px;
          margin-right: 7px;
        }
        &.formal__time {
          &::before {
            @include bg('./images/icon_time.png');
            width: 46px;
            height: 46px;
            margin-right: 20px;
          }
        }
      }
      &info-inner {
        @include flex(space-between, flex-start);
        flex-direction: column;
        line-height: 1.2;
      }
      &info-title {
        font-size: 14px;
        color: #999999;
      }
      &evaluate {
        margin: 48px auto 0;
        width: 808px;
      }
      &ruler, &pencil, &bulb, &pen {
        position: absolute;
        width: 120px;
      }
      &ruler, &pencil {
        top: 400px;
      }
      &pencil, &pen {
        right: 0;
      }
      &bulb, &pen {
        top: 1060px;
      }
      &analysis {
        margin-top: 49px;
      }
    }
  }
</style>
