<template>
  <div
    :class="[
      'board-perf',
      layout === 'vertical' ? 'board-perf_vertical' : ''
    ]"
  >
    <img :src="src" alt="">
    <div class="board-perf__info">
      <div :style="$attrs.headerStyle" class="board-perf__header">
        <slot name="header">
          {{$attrs.header}}
        </slot>
      </div>
      <div class="board-perf__content">
        <slot></slot>
      </div>
      <div class="board-perf__footer">
        <slot name="footer">
          {{$attrs.footer}}
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class PerformanceBoard extends Vue {
    @Prop()
    private src: string;

    @Prop()
    private layout: string;
  }
</script>
<style lang="scss">
  .board-perf {
    @include flex();
    img {
      width: 120px;
      height: 102px;
      margin-right: 20px;
    }
    &__info {
      @include flex(center, flex-start);
      flex-direction: column;
    }
    &__header, &__footer {
      width: 102px;
      font-size: 14px;
      color:rgba(196,151,97,1);
      line-height:18px;
      padding-right: 16px;
    }
    &__content {
      font-size: 24px;
      color:rgba(125,88,45,1);
      line-height:32px;
      margin: 12px 0;
    }
    &_vertical {
      display: block !important;
      .board-perf__info {
        @include flex(center, center);
        width: 100%;
        flex-direction: column;
      }
      .board-perf__header, .board-perf__footer {
        text-align: center;
      }
      .board-perf__header {
        margin-top: 10px;
      }
    }
  }
</style>
