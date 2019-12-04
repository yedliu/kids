<template>
  <board title="课程介绍">
    <div class="course-introduction">
      <div ref="imgDom" class="course-introduction__img-box" :style="imgStyle"></div>
    </div>
  </board>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Board from './board.vue';

  @Component({
    components: {
      Board
    }
  })
  export default class Introduction extends Vue {
    @Prop()
    private dataSource: string;

    private imgStyle: any = {};

    private mounted() {
      this.imgInit();
    }

    private imgInit() {
      const img = new Image();
      img.src = this.dataSource;
      const check = () => {
        // 只要任何一方大于0
        // 表示已经服务器已经返回宽高
        if (img.width > 0 || img.height > 0) {
          console.log(img.width, img.height);
          this.changeImgDomSize(img.width, img.height);
          clearInterval(set);
        }
      };
      const set = setInterval(check, 40);
    }

    private changeImgDomSize(width: number, height: number) {
      const imgDom: any = this.$refs.imgDom;
      console.log(imgDom.offsetWidth);
      this.imgStyle = {
        backgroundImage: `url(${this.dataSource}?x-oss-process=image/resize,m_lfit,w_800)`,
        height: height / (width / imgDom.offsetWidth) + 'px'
      };
    }
  }
</script>
<style lang="scss">
  .course-introduction {
    width: 100%;
    text-align: center;
    padding: 20px;
    &__img-box {
      width: 100%;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      border: none;
    }
  }
</style>
