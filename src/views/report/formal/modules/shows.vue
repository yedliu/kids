<template>
  <div class="shows">
    <div class="shows__left">
      <button :class="['shows__back', {disabled: first}]" :disabled="first"></button>
    </div>
    <div class="shows__content">
      <div class="shows__inner">
        <img src="undefined" alt="" v-for="index in 3">
      </div>
    </div>
    <div class="shows__right">
      <button :class="['shows__next', {disabled: last}]" :disabled="last"></button>
    </div>
  </div>
</template>

<script lang='ts'>
  import {Component, Vue} from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class Shows extends Vue {
    private first: boolean = false;
    private last: boolean = false;
  }
</script>
<style lang="scss">
  .shows {
    @include flex(space-between);
    height: 145px;
    background: red;
    margin-top: 40px;
    &__ {
      &back, &next {
        width: 52px;
        height: 45px;
      }
      &back {
        @include bg('../images/btn_back_n.png');
        margin-left: 20px;
        &:active {
          @include bg('../images/btn_back_s.png');
        }
        &:disabled {
          @include bg('../images/btn_back_f.png');
        }
      }
      &next {
        @include bg('../images/btn_next_n.png');
        margin-right: 20px;
        &:active {
          @include bg('../images/btn_next_s.png');
        }
        &:disabled {
          @include bg('../images/btn_next_f.png');
        }
      }
      &content {
        flex: 1;
        height: 100%;
        margin: 0 28px;
        background: yellow;
      }
      &inner {
        font-size: 0;
        img {
          width: 260px;
          height: 145px;
          border-radius: 5px;
          margin-right: 10px;
          &:empty {
            display: none;
          }
        }
      }
    }
  }
</style>
