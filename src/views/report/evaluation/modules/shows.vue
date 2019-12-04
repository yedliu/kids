<template>
  <div class="shows">
    <slot></slot>
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
    position: relative;
    border: 6px solid #FFDA9A;
    border-radius: 8px;
    padding: 29px;
    width: 878px;
    margin: 0 auto;
    &::before, &::after {
      @include bg('../images/img_xian3.png');
      position: absolute;
      left: 20px;
      top: -35px;
      width: 9px;
      height: 47px;
      content: '';
    }
    &::after {
      left: auto;
      right: 20px;
    }
    &__ {
    }
  }
</style>
