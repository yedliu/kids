<template>
  <div class="evaluation-comment">
    <template v-if="dataSource.evaluationList.length > 0">
      <board
        v-for="(item, index) in dataSource.evaluationList"
        :key="index"
        :title="index === 0 ? '家长评价' : ''"
        v-if="item.evaluationType !== 'TEXT'"
        class="evaluation-comment__item"
      >
        <div class="evaluation-comment__wrap">
          <template>
            <div class="evaluation-comment__left">
              <p style="color: rgba(196, 151, 97, 1);font-size: 14px;">{{item.evaluationLabel}}</p>
              <kids-star :star="item.evaluationStar" type="1" style="margin: 13px 0;font-size: 0;"></kids-star>
              <p class="evaluation-comment__star-tips">{{item.starDesc}}</p>
            </div>
            <div class="evaluation-comment__line" v-if="item.descItems && item.descItems.length > 0"></div>
            <div class="evaluation-comment__right evaluation-performance__evaluation-tags-wrap">
              <p
                v-for="(tag, idx) in item.descItems"
                :key="idx"
                class="evaluation-comment__tags"
              >{{tag.descLabel}}</p>
            </div>
          </template>
        </div>
      </board>
      <board v-if="text" class="evaluation-comment__item">
        <kids-text >{{text}}</kids-text>
      </board>
    </template>
    <board v-else title="家长评价" key="default" class="evaluation-comment__item">
      <div class="evaluation-comment_default">
        <img src="../../common/images/comment_default.png" alt="">
        <p>暂无数据，看看其他的吧~</p>
      </div>
    </board>
  </div>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import { Star, Text } from '@kids/mobile-ui';
  @Component({
    components: {
      Board: () => import('./board.vue'),
      Item: () => import('views/report/common/components/performance__board.vue'),
      Star,
      Text
    }
  })
  export default class Comment extends Vue {
    @Prop()
    private dataSource: any;

    private get text() {
      if (this.dataSource.evaluationList && this.dataSource.evaluationList.length > 0) {
        const parentAdvise: any = this.dataSource.evaluationList.find((child: any) => child.evaluationType === 'TEXT');
        console.log(parentAdvise);
        return parentAdvise && parentAdvise.evaluationContent;
      }
      return;
    }
  }
</script>
<style lang="scss">
  .evaluation-comment {
    .pad-board__inner {
      @include flex();
      padding: 40px 40px;
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
    &__wrap {
      @include flex();
    }
    &__left {
      /*padding-right: 95px;*/
      text-align: center;
      padding-left: 0 !important;
      padding-right: 40px;
      width: auto !important;
      flex: 1;
      p {
        text-align: center;
        max-width: 350px;
      }
    }
    &__star-tips {
      color: rgba(125, 88, 45, 1);
      font-size: 18px;
    }
    &__right {
      @include flex();
      width: 490px;
      flex: initial !important;
      padding-left: 40px !important;
    }
    &__tags {
      background: rgba(255, 215, 99, 0.3);
      border-radius:16px;
      padding: 6px 20px;
      font-size: 14px;
      line-height: 19px;
      color: rgba(125, 88, 45, 1);
      margin: 0 12px 16px 0;
    }
    &__line {
      width: 1px;
      align-self: stretch;
      background: rgba(239,228,215,1);
    }
    &_default {
      width: 100%;
      text-align: center;
      img {
        width: 136px;
        margin-top: 23px;
      }
      p {
        color: rgba(196, 151, 97, 1);
        font-size: 14px;
        margin-top: 16px;
      }
    }
  }
</style>
