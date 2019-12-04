<template>
  <div class="pad-board">
    <div class="pad-board__title" v-if="title">{{title}}</div>
    <div class="pad-board__inner">
      <slot></slot>
    </div>
  </div>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class Board extends Vue {
    @Prop()
    private title: string;
  }
</script>
<style lang="scss">
  .pad-board {
    width: 864px;
    margin: 0 auto;
    &__title {
      display: inline-block;
      position: relative;
      height: 47px;
      font-size: 18px;
      color: $--color-white;
      background: rgba(221, 149, 100, 1);
      border-radius: 8px 100px 0 0;
      padding: 0 40px 0 32px;
      line-height: 47px;
      margin-bottom: -7px;
      &::before {
        position: absolute;
        top: 6px;
        left: -12px;
        content: "";
        width: 39px;
        height: 27px;
        background: url(../images/one-to-one/leaf.png) no-repeat;
        background-size: 100% 100%;
      }
    }
    &__inner {
      position: relative;
      background:rgba(255,249,233,1);
      border-radius: 8px;
    }
  }
</style>
