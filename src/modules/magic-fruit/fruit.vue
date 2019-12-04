<template>
  <div class="magic-fruit">
   <span class="magic-fruit__container">
     <i :class="['magic-fruit__icon', iconAnimate]"></i><i :class="['magic-fruit__bg', bgAnimate]"></i>
   </span><span v-show="addOne" class="magic-fruit__add-one">+{{number}}</span>
  </div>
</template>
<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  @Component({
    components: {},
  })
  export default class  MagicFruit extends Vue {
    @Prop({
      type: Boolean,
      required: true,
      default: false
    })
    private addOne: boolean; // +1
    @Prop({
      type: Number,
      required: false,
      default: 1
    })
    private number: number;

    private get iconAnimate() {
      const state = this.addOne;
      return state && 'magic-fruit__icon_animate' || '';
    }

    private get bgAnimate() {
      const state = this.addOne;
      return state && 'magic-fruit__bg_animate' || '';
    }
  }
</script>
<style lang="scss" scoped>
  .magic-fruit{
    position: relative;
    height: 33px;
    flex-grow: 1;
    &__container{
      position: relative;
      display: flex;
      height: 33px;
    }
    &__bg{
      position: absolute;
      top: -28px;
      right: -44px;
      width: 88px;
      height: 88px;
      background: url("../../assets/images/stageEvaluation/img_img_energyfruit_brighten.png") 50% no-repeat / 0;
      transform-origin: 50% 50%;
      &_animate{
        animation: addOneMagicFruitBg .5s linear 0s 2 alternate forwards;
      }
    }
    &__icon{
      position: absolute;
      top: 0;
      right: -20px;
      width: 30px;
      height: 33px;
      transform-origin: 50% 50%;
      background: url("../../assets/images/stageEvaluation/img_magicfruit@2x(3).png") 50% no-repeat/ 100%;
      &_animate{
        animation: addOneMagicFruit .5s linear 0s 2 alternate forwards;
      }
    }
    &__add-one{
      position: absolute;
      top: -40px;
      right: -16px;
      font-size: 18px;
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: rgba(255,234,84,1);
      line-height: 25px;
      text-shadow: 0 2px 5px rgba(92,92,92,1)
    }
    @keyframes addOneMagicFruit
    {
      from {
        width: 30px;
        height: 33px;
      }
      to {
        width: 40px;
        height: 44px;
      }
    }
    @keyframes addOneMagicFruitBg
    {
      0% {
        background-size: 0;
        transform: rotateZ(0);
      }
      10% {
        background-size: 10%;
        transform: rotateZ(18deg);
      }
      100% {
        background-size: 100%;
        transform: rotateZ(180deg);
      }
    }
  }
</style>
