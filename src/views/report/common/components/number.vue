<template>
  <div class="number">
    <div class="number__inner">
      <p class="number__number" v-text="number"></p>
      <p class="number__text">
        <slot>{{text}}</slot>
      </p>
    </div>
  </div>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class Number extends Vue {
    @Prop()
    private number: string | number;

    @Prop(String)
    private text: string;
  }
</script>
<style lang="scss">
  .number {
    @include flex(flex-start, stretch);
    height: 42px;
    font-size: 18px;
    color: $--color-white;
    &__ {
      &inner {
        @include flex();
        border-radius: 26.5px;
        background: #91BFFF;
      }
      &number {
        @include flex(center);
        width: 36px;
        height: 36px;
        background: #FFBD00;
        border: 3px solid $--color-white;
        border-radius: 50%;
        margin-left: 3px;
      }
      &text {
        @include flex(center);
        padding: 0 20px 0 10px;
      }
    }
  }
</style>
