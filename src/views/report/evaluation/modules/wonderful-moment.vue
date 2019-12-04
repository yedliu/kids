<template>
  <board title="精彩瞬间">
    <div class="wonderful">
      <swiper class="wonderful__container" :options="swiperOption" ref="wonderfulMoment"  >
        <!-- slides -->
        <swiper-slide v-for="(item, index) in dataSource" :key='index+"swiper"' class="wonderful__slide" >
          <img :src="`${item}?x-oss-process=image/resize,m_lfit,w_480`" alt="精彩瞬间" >
        </swiper-slide>
        <!-- Optional controls -->
      </swiper>
      <i class="swiper-button-next"></i>
      <i class="swiper-button-prev"></i>
    </div>
  </board>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import 'swiper/dist/css/swiper.css';

  import Board from './board.vue';


  @Component({
    components: {
      Board,
      swiper,
      swiperSlide
    }
  })
  export default class WonderFulMoment extends Vue {
    @Prop()
    private dataSource: string[];

    private swiperOption: any = {
      speed: 1000,
      adPrevNext: true,
      observer: true,                              // 修改swiper自己或子元素时，自动初始化swiper
      observeParents: true,                        // 修改swiper的父元素时，自动初始化swiper
      autoplay: false,
      uniqueNavElements: true,
      slidesPerView : 3,
      spaceBetween: '1.12%',
      // pagination: {
      //   el: '.pagination',
      //   type: 'fraction',
      //   clickable: true,
      //   bulletClass: 'swiper-custom-circle',
      //   bulletActiveClass: 'swiper-custom-active'
      // },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    };

    private mounted() {
      console.log('mounted');
    }
  }
</script>
<style lang="scss">
  .wonderful {
    padding: 32px 10px;
    &__container{
      width: 752px;
      height:182px;
      border-radius: 15px;
      padding: 8px;
      background:rgba(255,244,200,1);
    }
    &__slide {
      width: 240px;
      height: 166px;
      overflow: hidden;
      img {
        height: 100%;
      }
    }
    .swiper-button-next{
      width: 12px;
      height: 20px;
      margin-top: 0;
      top:50%;
      right: 24px;
      transform: translateY(-50%);
      @include bg('../images/one-to-one/btn_right@2x.png');
      &:active {
        @include bg('../images/one-to-one/btn_right@2x.png');
      }
      &:disabled {
        @include bg('../images/one-to-one/btn_right_white@2x.png');
      }
    }
    .swiper-button-prev{
      width: 12px;
      height: 20px;
      margin-top: 0;
      top:50%;
      left: 24px;
      transform: translateY(-50%);
      @include bg('../images/one-to-one/btn_left@2x.png');
      &:active {
        @include bg('../images/one-to-one/btn_left@2x.png');
      }
      &:disabled {
        @include bg('../images/one-to-one/btn_left_white@2x.png');
      }
    }
  }
</style>
