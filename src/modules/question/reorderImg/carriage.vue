<template>
  <div class="carriage">
    <div class="carriage__cap"></div>
    <div class="carriage__main">
      <div class="carriage__window">
        <slot></slot>
      </div>
    </div>
    <div class="carriage__bottom">
      <div class="result-icon"></div>
    </div>
    <div class="carriage__wheel"></div>
  </div>
</template>

<script lang="ts">
  import { Prop, Vue } from 'vue-property-decorator';

  export default class Carriage extends Vue {
    @Prop({
      type: Number,
      default: 0
    })
    private itemIndex: any;
  }
</script>

<style lang="scss">

</style>

