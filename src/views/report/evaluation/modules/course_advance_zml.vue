<template>
  <board title="课程预告" class="class-advance">
    <div class="advance_container">
      <kids-text class="advance">
        {{desc}}
      </kids-text>
      <div class="class-advance__video-box">
        <iframe frameborder="0" width="100%" height="100%" name="class-content-iframe" class="course__player" :src="url"></iframe>
      </div>
    </div>
  </board>
</template>

<script lang='ts'>
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';
  import { Text } from '@kids/mobile-ui';
  @Component({
    components: {
      Board: () => import('./board.vue'),
      Text
    }
  })
  export default class CourseAdvanceZml extends Vue {
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
      type: String,
      default: ''
    })
    private desc: any;

    @Prop({
      required: true,
      type: Object,
      default: {}
    })
    private user: any;

    private first: boolean = false;
    private last: boolean = false;

    private url: string = '';
    private currentPage: number = 0;
    private totalPage: number = 0;

    private created() {
      console.log(this.data, this.lessonId, this.user);
      this.$log('课件组件created');
      this.getMessageFromChild();
      this.url = `https://${process.env.VUE_APP_ZMG_PLAYER}?role=student&device=PC&usage=preview&hidePreviewNav=false`;
    }

    private async initIframe() {
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
        console.log(item);
        this.$log('课程地址');
        try {
          await this.$axios.get(item.cwUrl.replace('https://image.zmlearn.com', ''), {
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
      // this.postMessage({
      //   action: 'setPagesUrl',
      //   data: JSON.stringify({
      //     url,
      //     type: 'zml'
      //   })
      // });

      console.log(jsonList);

      // this.$log('jonsList is: ');
      // console.log(jsonList);
      this.postMessage({
        action: 'setPages',
        data: JSON.stringify([...jsonList])
      });

    }

    private postMessage(message: any) {
      const frames: any = window.frames;
      frames['class-content-iframe'].postMessage(message, '*');
    }

    // 获取iframe 传递过来的data
    private getMessageFromChild() {
      this.$log('init event listener');
      window.addEventListener('message', (e: any) => {
        const data: any = e.data;
        this.$log('event');
        console.log(e);
        this.$log('消息接收');
        this.$log(data.action);
        console.log(data);
        if (data) {
          const { action } = data;
          switch (action) {
            case 'ready':
              this.$log('course player ready');
              this.initIframe();
              break;
            case 'returnPageNumber':
              this.$log('returnPageNumber');
              console.log(data);
              this.totalPage = data.data;
              this.postMessage({
                action: 'showPage',
                data: this.currentPage
              });
              break;
            case 'currentAvailableHost':
              this.$log(action);
              break;
            case 'sendPageInfo':
              this.currentPage = data.data.pageIndex;
              break;
            default:
              break;
          }
        }
      });
    }

    private handlerBackClick() {
      if (this.currentPage <= 1) {
        this.first = true;
        return;
      }
      this.last = false;
      this.currentPage--;
      const vm = this;
      this.postMessage({
        action: 'showPage',
        data: vm.currentPage
      });
    }

    private handlerNextClick() {
      this.$log(this.currentPage);
      this.$log(this.totalPage);
      if (this.currentPage >= this.totalPage - 1) {
        this.last = true;
        return;
      }
      this.first = false;
      this.currentPage++;
      const vm = this;
      this.postMessage({
        action: 'showPage',
        data: vm.currentPage
      });
    }
  }
</script>
<style lang="scss">
  .class-advance {
    position: relative;
    .kids-text.advance {
      width: 620px;
      margin: 0;
      color: #7D582D;
      font-size: 24px;
      font-weight: bold;
      word-break: break-all;
      margin-left: -10px;
    }
    .advance_container {
      position: absolute;
      top: 40px;
      bottom: 60px;
      left: 132px;
      right: 132px;
    }
    .pad-board__inner {
      overflow: hidden;
      height: 540px;
      background: url('../images/img_yugao@2x.png') no-repeat center;
      background-size: 100% 100%;
    }

    &__inner {
      position: absolute;
      top: 94px;
      left: 162px;
      width: 540px;
      height: 304px;
      border-radius: 8px;
    }

    &__video-box {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 326px;
      border: 8px #caa579 solid;
      border-radius: 18px;
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
