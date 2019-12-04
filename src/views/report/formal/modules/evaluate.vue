<template>
  <div>
    <div class="evaluate">
      <div class="evaluate__inner">
        <div class="evaluate__inner_white scale"></div>
        <div class="evaluate__inner_white scale2"></div>
        <div class="evaluate__inner_white">
          <div class="evaluate__title">总体表现</div>
          <div class="evaluate__info">
            <rate :star="star"></rate>
          </div>
        </div>
      </div>
      <div class="evaluate__inner">
        <div class="evaluate__inner_white scale"></div>
        <div class="evaluate__inner_white scale2"></div>
        <div class="evaluate__inner_white">
          <div class="evaluate__title">获得奖励</div>
          <div class="evaluate__info">
            <img class="evaluate__good-image" src="../images/icon_good.png" alt="">
            <span class="evaluate__good-x">X</span>
            <span class="evaluate__good-number">{{award}}</span>
          </div>
        </div>
      </div>
      <div class="evaluate__circle-inner">
        <img v-for="index in 5" src="../images/img_circle.png" alt="" :key="index">
      </div>
    </div>
    <div class="evaluate__teacher">
      <div class="evaluate__teacher-inner">
        <div class="evaluate__teacher-inner_white scale"></div>
        <div class="evaluate__teacher-inner_white scale2"></div>
        <div class="evaluate__teacher-inner_white">
          <div class="evaluate__title">老师点评</div>
          <div class="evaluate__teacher-info">
            <div class="evaluate__tags">
              <div class="report__tag" v-for="(item, index) in tags" :key="index">{{item}}</div>
            </div>
            <pad-audio v-if="audio" class="evaluate__media" :src="audio"></pad-audio>
            <div v-else  class="evaluate__teacher-remark-wrap">
              <p class="evaluate__teacher-remark">{{remark}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    components: {
      PadAudio: () => import('../../common/components/audio.vue'),
      Rate: () => import('../../common/components/rate.vue')
    }
  })
  export default class Evaluate extends Vue {
    @Prop()
    private star: number;

    @Prop()
    private award: number;

    @Prop()
    private tags: any[];

    @Prop()
    private audio: string;

    @Prop()
    private remark: string;
  }
</script>
<style lang="scss">
  .evaluate {
    @include flex(space-between);
    position: relative;
    &__inner {
      position: relative;
      width: 400px;
      height: 228px;
      background: #F9B588;
      box-shadow: 0 5px 0 0 #E59B6B;
      border-radius: 12px;
      &_white {
        position: absolute;
        top: 8px;
        left: 8px;
        width: 384px;
        height: 200px;
        background: $--color-white;
        /*margin: 8px auto;*/
        border-radius: 5px;
        &.scale {
          top: 18px;
          transform: scale(0.95);
          background: rgba($--color-white, 0.8);
        }
        &.scale2 {
          top: 28px;
          transform: scale(0.90);
          background: rgba($--color-white, 0.5);
        }
      }
    }
    &__info {
      @include flex(center);
      padding-top: 33px;
    }
    &__good {
      &-image {
        width: 50px;
        margin-top: -8px;
      }
      &-x {
        font-size: 24px;
        margin: 0 21px;
      }
      &-number {
        font-size: 40px;
      }
    }
    &__circle-inner {
      position: absolute;
      top: 0;
      left: 50%;
      width: 45px;
      transform: translateX(-50%);
      &>img {
        margin-top: 27px;
        display: block;
        width: 45px;
      }
    }
    &__ {
      &title {
        @include bg('../images/title_bg1.png');
        @include flex(center);
        width: 193px;
        height: 40px;
        margin: 14px auto;
        font-size: 16px;
        color: $--color-white;
      }
      &tags {
        padding: 0 19px;
        width: 50%;
        height: 180px;
        overflow-y: scroll;
        // @include flex(flex-start, flex-start);
        .report__tag {
          margin-right: 24px;
          float: left;
          margin-bottom: 19px;
        }
      }
      &media {
        background-image: linear-gradient(180deg, #ddd, #ddd);
        background-size: 1px 60%;
        background-repeat: no-repeat;
        background-position: 0 20px;
        width: 50%;
        height: 180px;
      }
    }
    &__teacher {
      position: relative;
      height: 285px;
      background: #FFD154;
      box-shadow: 0 5px 0 0 #E7A900;
      border-radius: 14px;
      margin-top: 25px;
      &-inner {
        &_white {
          position: absolute;
          top: 8px;
          left: 8px;
          width: 792px;
          height: 256px;
          background: $--color-white;
          /*margin: 8px auto;*/
          border-radius: 5px;
          &.scale {
            top: 15px;
            transform: scale(0.98);
            background: rgba($--color-white, 0.8);
          }
          &.scale2 {
            top: 22px;
            transform: scale(0.96);
            background: rgba($--color-white, 0.5);
          }
        }
      }
      &-info {
        @include flex();
      }
      &-remark-wrap {
        width: 50%;
        height: 180px;
        overflow-y: scroll;
        font-size: 16px;
        color: #333;
        text-indent: 2em;
        padding-right: 20px;
        word-break: break-all;
      }
    }
  }
</style>
