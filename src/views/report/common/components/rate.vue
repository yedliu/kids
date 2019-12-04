<template>
  <div class="rate">
    <img class="rate__star" v-for="index in 5" :src="setEmotion(index)" alt="">
  </div>
</template>

<script lang='ts'>
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class Rate extends Vue {
    private icon0: any = require('../images/biaoxian_0.png');
    private icon1: any = require('../images/biaoxian_1.png');
    private icon2: any = require('../images/biaoxian_2.png');
    private icon3: any = require('../images/biaoxian_3.png');
    private icon4: any = require('../images/biaoxian_4.png');
    private icon5: any = require('../images/biaoxian_5.png');

    @Prop()
    private star: number;

    private setEmotion(index: number) {
      console.log(this.star);
      if (this.star < 1) {
        return this.icon0;
      }
      if (this.star === 1) {
        return index === 1 ? this.icon1 : this.icon0;
      }
      if (this.star === 2) {
        return index < 3 ? this.icon2 : this.icon0;
      }
      if (this.star === 3) {
        return index < 4 ? this.icon3 : this.icon0;
      }
      if (this.star === 4) {
        return index < 5 ? this.icon4 : this.icon0;
      }
      if (this.star === 5) {
        return this.icon5;
      }
    }
  }
</script>
<style lang="scss">
  .rate {
    @include flex(center);
    width: 100%;
    height: 50px;
    &__ {
      &star {
        width: 36px;
        margin: 0 18px;
      }
    }
  }
</style>
