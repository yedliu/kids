<template>
  <div class="knowledge">
    <div class="knowledge__inner">
      <div class="knowledge__content scale"></div>
      <div class="knowledge__content scale1"></div>
      <div class="knowledge__content">
        <div class="knowledge__scroll">
          <div class="knowledge__wrap" v-for="(item, index) in $attrs.data">
            <p class="knowledge__index">{{item.ability}}:</p>
            <p class="knowledge__text">{{item.remark}}</p>
          </div>
        </div>
      </div>
      <div class="knowledge__title">
        知识&能力维度详解
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
  import {Component, Vue} from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class Knowledge extends Vue {
  }
</script>
<style lang="scss">
  .knowledge {
    width: 400px;
    height: 300px;
    &__ {
      &inner {
        position: relative;
        width: 100%;
        height: 100%;
        background: #FFD154;
        border-radius: 16px;
      }
      &title {
        @include flex(space-between);
        position: absolute;
        width: 218px;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 38px;
        background: #C26B1E;
        box-shadow: 0 7px 0 0 rgba(0,0,0,0.07), 0 3px 0 0 #B25400;
        border-radius: 19px;
        color: $--color-white;
        font-size: 16px;
        padding: 0 10px;
        &::before, &::after {
          content: '';
          width: 12px;
          height: 12px;
          background: #9B4604;
          box-shadow: 0 1px 0 0 rgba(255,255,255,0.20);
          border-radius: 50%;
        }
      }
      &content {
        position: absolute;
        top: 16px;
        left: 14px;
        width: 372px;
        height: 261px;
        background: $--color-white;
        border-radius: 4px;
        padding: 36px 20px;
        /*overflow-y: scroll;*/
        &.scale {
          top: 28px;
          transform: scale((261 - 12) / 261);
          background: rgba($--color-white, 0.8);
        }
        &.scale1 {
          top: 40px;
          transform: scale((261 - 24) / 261);
          background: rgba($--color-white, 0.8);
        }
      }
      &scroll {
        height: 100%;
        overflow-y: scroll;
      }
      &wrap {
        @include flex(flex-start, flex-start);
        font-size: 16px;
      }
      &index {
        width: 80px;
        font-weight: bold;
      }
      &text {
        flex: 1;
      }
    }
  }
</style>
