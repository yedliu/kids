<template>
  <div class="course">
    <div class="course__content">
      <img src="../images/content__bg_title.png" alt="" class="course__title">
      <iframe :src="url" frameborder="0" name="class-content-iframe" class="course__player"></iframe>
    </div>
    <div class="course__btn-wrap" v-if="hasReady">
      <button :class="['course__back', {disabled: first}]" :disabled="first" @touchstart="handlerBackClick"></button>
      <button :class="['course__next', {disabled: last}]" :disabled="last" @touchstart="handlerNextClick"></button>
    </div>
  </div>
</template>

<script lang='ts'>
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class CourseContent extends Vue {
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

    private first: boolean = false;
    private last: boolean = false;

    private url: string = '';
    private currentPage: number = 1;
    private totalPage: number = 0;
    private hasReady: boolean = false;

    private created() {
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
      window.addEventListener('message', ({ data }) => {
        this.$log('消息接收');
        this.$log(data.action);
        console.log(data.data);
        if (data) {
          const { action } = data;
          switch (action) {
            case 'ready':
              this.$log('course player ready');
              this.hasReady = true;
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
  .course {
    &__ {
      &content {
        height: 600px;
        width: 848px;
        margin: 0 auto;
        background: url('../images/content__bg_bottom_left.png') no-repeat 0 100%/200px,
        url('../images/content__bg_bottom-right.png') no-repeat 100% 100%/88px;
      }
      &title {
        width: 100%;
      }
      &player {
        width: 100%;
        height: 400px;
        margin-top: 50px;
      }
      &btn-wrap {
        @include flex(center);
        margin-top: 15px;
      }
      &back, &next {
        @include disableUserSelect();
        width: 110px;
        height: 45px;
        margin: 0 30px;
      }
      &back {
        @include bg('../images/btn_back_n.png');
        margin-left: 20px;
        &:active {
          @include bg('../images/btn_back_s.png');
        }
        &:disabled {
          @include bg('../images/btn_back_f.png');
        }
      }
      &next {
        @include bg('../images/btn_next_n.png');
        margin-right: 20px;
        &:active {
          @include bg('../images/btn_next_s.png');
        }
        &:disabled {
          @include bg('../images/btn_next_f.png');
        }
      }
    }
  }
</style>
