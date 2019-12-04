<template>
  <div class="evaluation-performance">
    <board title="课堂表现" class="evaluation-performance__item" v-if="interact.actualTime >= 0 || interact.times >= 0 || interact.goods >= 0">
      <item
        v-if="interact.actualTime > 0" :src="icon1"
        header="课堂互动"
        :footer="`共${secondToMinute(interact.totalTime)}分钟`"
        style="flex: 1;"
      >
        {{`${Math.round(interact.actualTime)}分钟`}}
      </item>
      <item v-else-if="interact.actualTime === 0" :src="icon1" style="flex: 1;" header="多与老师互动，学习提升更快哦" :headerStyle="{marginTop: '20px'}">
        <!--<kids-text slot="header" class="evaluation-performance__interact_default">多与老师互动，学习提升更快哦</kids-text>-->
      </item>
      <item v-if="interact.times >= 0" :src="icon2" header="上台次数" style="margin-left: 20px;">{{interact.times}}次</item>
      <item v-if="interact.goods > 0" :src="icon3" header="能量果">{{interact.goods}}个</item>
      <item v-else-if="interact.goods === 0" :src="icon3" style="flex: 1;" header="继续加油，会有奖励哦" :headerStyle="{marginTop: '20px'}"></item>
    </board>

    <board :title="interact.actualTime >= 0 || interact.times >= 0 || interact.goods >= 0 ? '' : '课堂表现'" v-if="performance.behaviorAssessment" class="evaluation-performance__item">
      <div class="evaluation-performance__evaluation-smallClass">
        <div class="evaluation-performance__evaluation-smallClass-star-wrap">
          <p style="color: rgba(196, 151, 97, 1);font-size: 14px;">总体得分</p>
          <kids-star :star="performance.behaviorAssessment || 4" style="margin: 13px 0;font-size: 0;"></kids-star>
          <p style="color: rgba(125, 88, 45, 1);font-size: 18px;">{{tips}}</p>
        </div>
        <template v-if="performance.tags.length > 0">
          <div class="evaluation-performance__line"></div>
          <div class="evaluation-performance__evaluation-smallClass-tags-wrap">
            <div v-for="item in performance.tags" :key="item" class="evaluation-performance__tags">{{item}}</div>
          </div>
        </template>
      </div>
    </board>

    <board v-if="teacher.voiceRemark || teacher.textRemark" class="evaluation-performance__item">
       <div class="evaluation-performance__comment">
         <div
           v-if="teacher.voiceRemark"
           class="evaluation-performance__comment_audio"
           :class="{'evaluation-performance__comment_audio-only': !teacher.textRemark}"
         >
           <kids-teacher-audio :avatar="teacher.avatar || teacherAvatarDefault" :nick="teacher.name" :audio="teacher.voiceRemark"/>
         </div>
         <div v-if="teacher.voiceRemark && teacher.textRemark" class="evaluation-performance__line"></div>
         <div v-if="teacher.voiceRemark && teacher.textRemark" class="evaluation-performance__comment_text">
           <kids-text>
             <pre style="max-height: 160px;overflow-y: auto;word-break: break-all;white-space: pre-wrap" v-html="teacher.textRemark"></pre>
           </kids-text>
         </div>
         <div v-if="!teacher.voiceRemark && teacher.textRemark" class="evaluation-performance__comment_text-only">
           <div class="evaluation-performance__teacher">
             <kids-avatar :src="teacher.avatar || teacherAvatarDefault"></kids-avatar>
             <p class="evaluation-performance__teacher-name">{{teacher.name}}</p>
           </div>
           <kids-text class="evaluation-performance__text">
             <pre style="max-height: 160px;overflow-y: auto;word-break: break-all;white-space: pre-wrap" v-html="teacher.textRemark"></pre>
           </kids-text>
         </div>
       </div>
    </board>
  </div>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import { TeacherAudio, Avatar, Star, Text } from '@kids/mobile-ui';
  @Component({
    components: {
      Board: () => import('./board.vue'),
      Item: () => import('views/report/common/components/performance__board.vue'),
      Star,
      Avatar,
      TeacherAudio,
      Text
    }
  })
  export default class Performance extends Vue {
    @Prop()
    private interact: any;

    @Prop()
    private performance: any;

    @Prop()
    private teacher: any;

    private icon1: string = require('views/report/evaluation/images/one-to-one/perf1.png');
    private icon2: string = require('views/report/evaluation/images/one-to-one/perf2.png');
    private icon3: string = require('views/report/evaluation/images/one-to-one/perf6.png');
    private teacherAvatarDefault: any = require('../../common/images/avatar_teacher.png');

    private get tips() {
      const starTitle = [
        '表现较差，多动注意力不集中，无法配合老师',
        '表现一般，大部分内容没有掌握',
        '表现良好，基本掌握所学的内容，应用能力上可再提升',
        '表现优秀，能快速掌握课堂知识内容',
        '表现突出，掌握知识的同时能举一反三'
      ];
      return starTitle[(this.performance.behaviorAssessment || 4) - 1];
    }

    private secondToMinute(second: number) {
      console.log(second);
      if (second < 60) {
        return 1;
      } else {
        return (second / 60).toFixed(0);
      }
    }
  }
</script>
<style lang="scss">
  .evaluation-performance {
    .pad-board__inner {
      @include flex();
      padding: 40px 50px;
      &::before, &::after {
        position: absolute;
        bottom: -35px;
        left: 14px;
        content: '';
        width: 22px;
        height: 64px;
        background: url(../images/one-to-one/link.png) no-repeat 100%/100%;
        z-index: 1;
      }
      &::after {
        left: auto;
        right: 14px;
      }
    }
    &__item {
      margin-bottom: 10px !important;
      &:last-of-type {
        .pad-board__inner {
          &::before, &::after {
            content: none;
          }
        }
      }
    }
    &__evaluation-smallClass {
      @include flex();
      width: 100%;
      &-star-wrap {
        flex: 1;
        /*padding-right: 95px;*/
        text-align: center;
        p {
          text-align: center;
          padding-right: 20px;
        }
      }
      &-star-tips {
        color: rgba(125, 88, 45, 1);
        font-size: 18px;
      }
      &-tags-wrap {
        @include flex();
        width: 415px;
        padding-left: 47px;
      }
    }
    &__interact_default {
      max-width: 192px;
      padding-right: 20px;
    }
    &__tags {
      background: rgba(255, 215, 99, 0.3);
      border-radius:16px;
      padding: 6px 20px;
      font-size: 14px;
      line-height: 19px;
      color: rgba(125, 88, 45, 1);
      margin: 0 18px 16px 0;
    }
    &__line {
      width: 1px;
      align-self: stretch;
      background: rgba(239,228,215,1);
    }
    &__comment {
      @include flex();
      width: 100%;
      &_audio {
        /*width: 350px;*/
        flex: 1;
        padding-right: 34px;
        &-only {
          padding-right: 120px;
        }
        .kids-teacher__duration {
          flex: 1;
        }
      }
      &_text {
        width: 415px;
        padding-left: 41px;
        &-only {
          width: 100%;
          @include flex();
        }
      }
    }
    &__teacher {
      margin-right: 50px;
      &-name {
        width: 60px;
        color: rgba(196, 151, 97, 1);
        font-size: 14px;
        margin-top: 8px;
        text-align: center;
      }
    }
    &__text {
      max-width: 650px;
    }
  }
</style>
