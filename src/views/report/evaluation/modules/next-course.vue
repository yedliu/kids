<template>
  <board title="课堂内容" class="next-course">
    <div class="next-course__inner">
      <iframe v-if="data.length > 0" :src="url" frameborder="0" name="next-course-iframe" class="player__zml"></iframe>
    </div>
    <div class="next-course__player-decorate">
      <ul v-if="cousreType === 0">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <div v-else-if="device === 'pc'" class="next-course__control">
        <button :class="['button_back', {disabled: first}]" :disabled="first" @click="handleBackClick"></button>
        <p class="next-course__pages">{{`${currentPage + 1}/${totalPage}`}}</p>
        <button :class="['button_next', {disabled: last}]" :disabled="last" @click="handleNextClick"></button>
      </div>
      <div v-else class="next-course__control">
        <button :class="['button_back', {disabled: first}]" :disabled="first" @touchstart="handleBackClick"></button>
        <p class="next-course__pages">{{`${currentPage + 1}/${totalPage}`}}</p>
        <button :class="['button_next', {disabled: last}]" :disabled="last" @touchstart="handleNextClick"></button>
      </div>
    </div>
  </board>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    components: {
      Board: () => import('./board.vue')
    }
  })
  export default class ContentClass extends Vue {
    @Prop({
      type: Array,
      default: []
    })
    private data: any[];

    @Prop({
      required: true
    })
    private lessonId: string;

    @Prop({
      required: true,
      type: Object,
      default: {}
    })
    private user: any;

    private get first() {
      return this.currentPage <= 0;
    }
    private get last() {
      return this.currentPage >= this.totalPage - 1;
    }

    private courseType: string = '0';                                       // 课程类型  0 测评课 1正式课
    private device: string = 'pc';

    private url: string = '';
    private currentPage: number = 0;                                        // 当前页数, 0开头
    private totalPage: number = 0;


    private created() {
      this.$log('课件组件created');
      this.getMessageFromChild();
      this.url = `https://${process.env.VUE_APP_ZMG_PLAYER}?role=student&device=PC&usage=preview&hidePreviewNav=true`;
      const {query}: {query: any} = this.$route;
      if (query.device) {
        this.device = query.device.toLowerCase();
      }
    }

    private async initIframe() {
      // const jsonList: any[] = this.data.map((ele: any) => ele.content);
      const jsonList: any[] = [];
      this.$log('init iframe');
      this.postMessage({
        action: 'setUserInfo',
        data: {
          name: this.user.studentName,
          lessonId: this.user.lessonId,
          avatar: this.user.studentIcon,
          id: this.user.userId
        }
      });
      this.postMessage({
        action: 'setUsersInfo',
        data: {
          students: [{
            name: this.user.studentName,
            lessonId: this.user.lessonId,
            avatar: this.user.studentIcon,
            id: this.user.userId
          }]
        }
      });
      this.postMessage({
        action: 'setLessonInfo',
        data: {
          lessonId: this.lessonId,
        }
      });
      /*tslint:disable*/
      for (const item of this.data) {
        this.$log('课程地址');
        try {
          await this.$axios.get(item.content.replace('https://image.zmlearn.com', ''), {
            dialog: false
          });
        } catch (error) {
          this.$log('json data');
          console.log(error);
          if (Array.isArray(error.data)) {
            jsonList.push(...error.data);
          } else if (Array.isArray(error)){
            jsonList.push(...error);
            // this.$emit('error');
            // throw new Error('课件数据格式错误');
          }
        }
      }

      this.postMessage({
        action: 'setPages',
        data: JSON.stringify([...jsonList])
      });

    }

    private postMessage(message: any) {
      const frames: any = window.frames;
      frames['next-course-iframe'].postMessage(message, '*');
    }

    // 获取iframe 传递过来的data
    private getMessageFromChild() {
      this.$log('init event listener');
      window.addEventListener('message', ({ data }) => {
        this.$log('消息接收');
        this.$log(data.action);
        console.log(data.data);
        if (data) {
          const { action } = data;
          switch (action) {
            case 'ready':
              this.$log('course player ready');
              this.initIframe();
              break;
            case 'returnPageNumber':
              this.$log('returnPageNumber');
              // console.log(data);
              this.totalPage = data.data;
              // this.postMessage({
              //   action: 'showPage',
              //   data: this.currentPage
              // });
              break;
            case 'currentAvailableHost':
              this.$log(action);
              break;
            case 'sendPageInfo':
              // this.currentPage = data.data.pageIndex;
              break;
            default:
              break;
          }
        }
      });
    }

    private handleBackClick() {
      this.$log(this.currentPage);
      this.$log(this.totalPage);
      if (this.currentPage <= 0) {
        return;
      }
      const vm = this;
      this.postMessage({
        action: 'showPage',
        data: vm.currentPage--
      });
    }

    private handleNextClick() {
      this.$log(this.currentPage);
      this.$log(this.totalPage);
      if (this.currentPage >= this.totalPage - 1) {
        return;
      }
      // this.currentPage++;
      const vm = this;
      this.postMessage({
        action: 'showPage',
        data: vm.currentPage++
      });
    }
  }
</script>
<style lang="scss">
  .next-course {
    .pad-board__inner {
      overflow: hidden;
      height: 540px;
      background: url('../images/one-to-one/content_bg.png') no-repeat 100%/100%;
    }
    &__inner {
      position: absolute;
      top: 94px;
      left: 162px;
      width: 540px;
      height: 304px;
      border-radius: 8px;
    }
    &__player-decorate {
      position: absolute;
      width: 540px;
      height: 48px;
      top: 398px;
      left: 50%;
      transform: translate(-50%, 0);
      ul {
        @include flex();
        height: 100%;
        list-style-type: none;
        li {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #FDE084;
          margin-right: 18px;
          &:first-of-type {
            @include flex(center);
            width: 28px;
            height: 28px;
            margin-right: 49px;
            margin-left: 85px;
            &::before {
              content: '';
              display: block;
              height: 5px;
              width: 90%;
              background: rgba(#FECB4C, 0.9);
              transform: rotateZ(-60deg);
            }
          }
        }
      }
    }
    &__control {
      @include flex(center);
      width: 100%;
      height: 100%;
      p {
        width: 114px;
        text-align: center;
      }
    }
  }
  .player__zml {
    width: 100%;
    height: 100%;
  }
  .button {
    &_ {
      &back, &next {
        @include disableUserSelect();
        width: 14px;
        height: 24px;
        /*margin: 0 30px;*/
      }
      &back {
        @include bg('../images/one-to-one/btn_prev.png');
        margin-left: 20px;
        &:active {
          opacity: 0.5;
        }
        &:disabled {
          opacity: 0.25;
        }
      }
      &next {
        @include bg('../images/one-to-one/btn_next.png');
        margin-right: 20px;
        &:active {
          opacity: 0.5;
        }
        &:disabled {
          opacity: 0.5;
        }
      }
    }
  }
</style>
