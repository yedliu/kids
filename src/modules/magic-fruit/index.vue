<template>
  <div class="magic-fruit-process">
    <div class="magic-fruit-process__bar-container" :style="currentProcess" ref="bar"><i class="magic-fruit-process__bar"></i></div>
    <magic-fruit v-for="n in magicFruitNumber" :key="'fruit' + n" :add-one="activeState[n]" :number="addNumberEachTime"></magic-fruit>
  </div>
</template>
<script lang="ts">
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';
  import MagicFruit from './fruit.vue';
  import {playSvga, stopSvga} from 'plugins/svga';
  import togglePraise from 'modules/praiseByZhangXiaoMeng/index';
  import {showPraisePartner} from 'modules/native-tips';
  @Component({
    components: {MagicFruit},
  })
  export default class MagicFruitProcess extends Vue {
    @Prop({
      type: Number,
      required: true,
    })
    private addNumberEachTime: number; // 每做 numberToGetMagicFruit 题 获得 addNumberEachTime 个魔力果


    @Prop({
      type: Number,
      required: true,
    })
    private currentIndex: number;

    @Prop({
      type: Number,
      required: true,
    })
    private numberToGetMagicFruit: number; // 每做 numberToGetMagicFruit 题 可以获得 addNumberEachTime 个魔力果

    @Prop({
      type: Number,
      required: true,
    })
    private totalSubjectsNumber: number; // 总题目数


    // private magicFruitNumber: number; // 最大魔力果数目
    private activeState: any[] = [];
    private currentDoneIndex: number = 0; // 当前已完成题目索引
    private hasGotFruitNumber: number = 0;
    private totalNumber: number = 0; // 关卡数向上取整之后乘以 numberToGetMagicFruit 得到的题目书，用以计算进度条百分比

    private togglePraiseIn() {
      showPraisePartner();
    }

    private toggleAnimation(currentIndex: number) {
      let activeIndex = Math.floor(currentIndex / this.numberToGetMagicFruit);
      if (currentIndex === this.totalSubjectsNumber) {
        activeIndex = Math.ceil(currentIndex / this.numberToGetMagicFruit);
      }
      if (activeIndex >= 0 && this.hasGotFruitNumber < activeIndex) {
        this.hasGotFruitNumber = activeIndex;
        this.$set(this.activeState, activeIndex, true);
        this.togglePraiseIn();
        setTimeout(() => {
          this.$set(this.activeState, activeIndex, false);
        }, 1000);
        this.$emit('getFruitNumber', this.hasGotFruitNumber);
      }
    }

    private get currentProcess() {

      if (this.currentIndex === this.totalSubjectsNumber) {
        // 题目进行到最后一题后并且提交时，进度条进行至100%；
        this.currentIndex = this.totalNumber;
      }
      const sIndex = this.currentIndex;
      // const isCurrentStuAnswerEmpty = this.$store.getters.currentStuAnswerState[sIndex];


      // if (isCurrentStuAnswerEmpty)

      let width: any = '0';
      const barNode: any = this.$refs.bar;
      if (barNode) {
        width = barNode.style.width;
        if (sIndex > this.currentDoneIndex) {
          this.currentDoneIndex = sIndex;
          width = sIndex / this.totalNumber * 100 + '%';
          console.log('width, sIndex, this.totalNumber: ', width, sIndex, this.totalNumber);
          this.toggleAnimation(sIndex);
        }
      }
      return {width};
    }

    private get magicFruitNumber() {
      const eachNumber =  this.numberToGetMagicFruit;
      const magicFruitNumber = Math.ceil(this.totalSubjectsNumber / eachNumber);
      this.totalNumber = magicFruitNumber * eachNumber;
      return magicFruitNumber;
    }
  }
</script>
<style lang="scss" scoped>
  .magic-fruit-process{
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-end;
    position: absolute;
    top: 46px;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 21px;
    border: 3px solid #FFf;
    background:#8D8DA9;
    /*box-shadow:0 1px 2px 0 #A0A0A0,0 5px 0 0 #707099;*/
    border-radius:11px;
    &__bar-container{
      position: absolute;
      top:0;
      left: 0;
      width: 0;
      height: 15px;
      border-radius:8px;
      overflow: hidden;
      transition: width .5s;
    }
    &__bar{
      /*display: inline-block;*/
      @include flex(flex-end);
      width: 100%;
      height: 100%;
      background: url("../../assets/images/stageEvaluation/img_progressbar_blue@2x.png") center center repeat / 59px 15px;
    }
    &__svga_container{
      position: fixed;
      left: 0;
      bottom: 0;
    }
  }
</style>
