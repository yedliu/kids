<template>
  <div class="pad-active">
    <div class="message-container" v-if="message">
      <div class="message-content">
        <div class="message-text">{{message}}</div>
      </div>
    </div>
    <audio :src="require('../assets/media/voice.mp3')" style="display: none" ref="clickVoiceElm" />
    <img
      src="./assets/title.png"
      alt="教师节快给老师送祝福吧"
      class="pad-active__title"
      srcset="./assets/title.png 1x, ./assets/title@2x.png 2x, ./assets/title@3x.png 3x"
    />
    <div class="pad-active__container">
      <div class="pad-active__wrap--left">
        <div
          v-for="({ thumbnail }, index) of pictures"
          :key="index"
          class="pad-active__left-image-wrap"
          :class="[
            active === index ? 'is-active' : ''
          ]"
          @click="changeActive(index)"
        >
          <img :src="thumbnail" alt />
        </div>
      </div>
      <div class="pad-active__wrap--right">
        <div class="pad-active__right-header">
          <div class="pad-active__right-header-image-wrap">
            <img :src="activePicture" alt />
          </div>
        </div>
        <div class="pad-active__right-content">
          <div class="pad-active__letter-wrap">
            <div class="pad-active__letter-content">
              <div class="pad-active__letter-header">
                <div class="pad-active__letter-text">
                  <span class="pad-active__comma">&#xe603;</span>
                  <p>
                    {{blessContent}}
                    <span class="pad-active__comma">&#xe604;</span>
                  </p>
                </div>
                <button
                  class="pad-active__button--change pad-active__button"
                  playaudio="false"
                  @click="changeBless"
                >
                <img src="./assets/icon__change.png" alt />
                换一句祝福</button>
              </div>
              <div class="pad-active__teacher">
                <!-- <button
                  class="pad-active__button--prev pad-active__button is-circle"
                  playaudio
                  @click="prev"
                  :class="{ 'is-disabled': !canPrev }"
                  :style="{ visibility: teacherList.length < count ? 'hidden' : 'visible'}"
                >&#xe605;</button> -->
                <button
                  class="pad-active__button--prev pad-active__button is-circle img-btn"
                  playaudio
                  @click="prev"
                  :class="{ 'is-disabled': !canPrev }"
                  :style="{ visibility: teacherList.length < count ? 'hidden' : 'visible'}"
                >
                  <img src="./assets/to-left.png" alt v-show="canPrev" />
                  <img src="./assets/to-left-disabled.png" alt v-show="!canPrev" />
                </button>
                <div class="pad-active__teacher-wrap">
                  <div
                    class="pad-active__teacher-wrap-box"
                    :style="{transform: `translateX(${transformPos}px`, 'justify-content': `${teacherList.length < count ? 'center' : '	flex-start'}`}"
                  >
                    <div
                      class="pad-active__teacher-item"
                      v-for="(teacher, index) of teacherList"
                      style="width: 20%;flex-shrink: 0"
                      :key="teacher.id"
                      :class="{'is-checked': selectTeacherIndexs.includes(index)}"
                      @click="selectTeacher(index)"
                    >
                      <div class="pad-active__teacher-avatar">
                        <img
                          :src="teacher.avatar || require('./assets/teacher-default.png')"
                          alt
                        />
                        <div class="pad-active__selected">
                          <img src="./assets/selected.png" alt />
                        </div>
                      </div>
                      <p class="pad-active__teacher-name">{{teacher.nick || teacher.name}}老师</p>
                    </div>
                  </div>
                </div>
                <button
                  class="pad-active__button--next pad-active__button is-circle img-btn"
                  @click="next"
                  playaudio
                  :class="{ 'is-disabled': !canNext }"
                  :style="{ visibility: teacherList.length < count ? 'hidden' : 'visible'}"
                >
                  <img src="./assets/to-right.png" alt v-show="canNext" />
                  <img src="./assets/to-right-disabled.png" alt v-show="!canNext" />
                </button>
                <!-- <button
                  class="pad-active__button--next pad-active__button is-circle"
                  playaudio
                  @click="next"
                  :class="{ 'is-disabled': !canNext }"
                  :style="{ visibility: teacherList.length < count ? 'hidden' : 'visible'}"
                >&#xe606;</button> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="pad-active__footer">
      <button
        class="pad-active__button pad-active__button is-round"
        @click="send"
        :disabled="selectTeacherIndexs.length === 0 || !canSend"
      >发送</button>
    </footer>
    <!--    <img-->
    <!--      src="./assets/footer.png"-->
    <!--      alt=""-->
    <!--      class="pad-active__footer"-->
    <!--      srcset="./assets/footer.png 1x,-->
    <!--              ./assets/footer@2x.png 2x,-->
    <!--              ./assets/footer@3x.png 3x"-->
    <!--    >-->
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { exit } from 'modules/native-tips';

interface Picture {
  id: number;
  picture: string;
  thumbnail: string;
}

interface Teacher {
  id: number;
  userId: number;
  name: string;
  nick: string;
  avatar: string;
}

interface Bless {
  id: number;
  content: string;
}

@Component
export default class Active extends Vue {
  private active: number = 0;
  private pictureList: Picture[] = [];
  private teacherList: Teacher[] = [];
  private blessList: Bless[] = [];

  // 祝福的索引
  private blessIndex: number = 0;
  // 一列教师显示的个数
  private count: number = 5;
  // 滚动位置的索引
  private teacherIndex: number = 0;
  // 容器宽度
  private teacherListWidth = 415;
  // 是否能够点击上一个
  private canPrev = false;
  // 是否能够点击下一个
  private canNext = false;
  // 选中的教师index
  private selectTeacherIndexs: any = [];
  // 提示信息
  private message: string = '';
  // 防重复提交
  private canSend: boolean = true;

  get pictures(): Picture[] {
    return this.pictureList.slice(0, 3);
  }

  // 当前的祝福语
  get blessContent(): string {
    const item = this.blessList[this.blessIndex];
    return item && item.content ? item.content : '';
  }

  // 教师内容滚动的位置
  get transformPos(): number {
    return -this.teacherIndex * (this.teacherListWidth / this.count);
  }

  // 当前的图片
  get activePicture(): string {
    const acitveObj = this.pictureList[this.active];
    return acitveObj && acitveObj.picture ? acitveObj.picture : '';
  }

  private created() {
    const [, query] = window.location.search.split('?');

    if (query) {
      const [, value] = query.split('=');
      if (value) {
        document.cookie = 'token=' + value;
      }
    }

    this.bindEvent();
    this.getBaseInfo();
  }

  private mounted() {
    this.$nextTick(() => {
      const height = document.body.clientHeight;

      // 重新计算比例,防止页面超出,此处的670防止按钮超出
      if (height < 670 && height > 0) {
        const app: any = document.getElementById('app');
        const _height: number = height * 0.8;
        const rate = _height / 620;
        app.setAttribute(
          'style',
          `transform: scale(${rate}, ${rate}) translateY(-${50 / rate}%)`
        );
      }
    });
  }

  private bindEvent() {
    window.document.onclick = (e: any) => {
      if (
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.hasAttribute('playAudio')
      ) {
        const clickVoiceElm: any = this.$refs.clickVoiceElm;
        clickVoiceElm.play();
      }
    };
    window.GLOBAL.vbus.$on('exit', () => {
      exit();
    });
  }

  private async getBaseInfo() {
    const info: any = await this.$api['active/baseInfo']();

    if (info) {
      this.pictureList = info.pictureList || [];
      this.teacherList = info.teacherList ? info.teacherList.map((teacher: any) => {
        return {
          id: teacher.teacherId,
          userId: teacher.teacherUserId,
          name: teacher.teacherName,
          nick: teacher.teacherNickName,
          avatar: teacher.avatar
        };
      }) : [];

      this.blessList = info.blessList || [];

      // 默认所有老师都选中
      this.selectTeacherIndexs = this.teacherList.map(
        (item: any, index: number) => index
      );

      // 如果老师的人数大于显示的人数,则可以点击下一个
      if (this.teacherList.length > this.count) {
        this.canNext = true;
      }
    }
  }

  private changeActive(index: number) {
    this.active = index;
  }

  private changeBless() {
    const length = this.blessList.length;

    if (this.blessIndex === length - 1) {
      this.blessIndex = 0;
    } else {
      this.blessIndex++;
    }
  }

  private prev() {
    // 如果下一个不能点击,直接返回
    if (!this.canPrev) {
      return;
    }

    // 判断剩下的还能不能展示一列或者刚好展示一列, 此时下一个不能再点击,并且位移剩下的数量
    if (this.teacherIndex - this.count <= 0) {
      this.teacherIndex = 0;
      this.canPrev = false;
    } else {
      this.teacherIndex -= this.count;
    }

    this.canNext = true;
  }

  private next() {
    // 如果下一个不能点击,直接返回
    if (!this.canNext) {
      return;
    }

    const len = this.teacherList.length;

    const _teacherIndex2 = this.teacherIndex + this.count * 2;
    const _teacherIndex1 = this.teacherIndex + this.count;
    // 判断剩下的还能不能展示一列或者刚好展示一列, 此时下一个不能再点击,并且位移剩下的数量
    if (_teacherIndex2 >= len) {
      this.teacherIndex += len - _teacherIndex1;
      this.canNext = false;
    } else {
      this.teacherIndex += this.count;
    }

    this.canPrev = true;
  }

  // 选中教师,再次点击取消,保存的时索引
  private selectTeacher(index: number) {
    const itemIndex = this.selectTeacherIndexs.indexOf(index);
    if (itemIndex !== -1) {
      this.selectTeacherIndexs.splice(itemIndex, 1);
    } else {
      this.selectTeacherIndexs.push(index);
    }
  }

  private async send() {
    const content = this.blessContent;
    const pictureItem = this.pictureList[this.active];

    let picture = '';
    let thumbnail = '';

    if (pictureItem) {
      picture = pictureItem.picture;
      thumbnail = pictureItem.thumbnail;
    }

    if (
      this.selectTeacherIndexs.length === 0 ||
      !picture ||
      !thumbnail ||
      !content
    ) {
      return;
    }

    this.canSend = false;

    const teachers = this.teacherList.filter((teacher, index) =>
      this.selectTeacherIndexs.includes(index)
    );

    const body = {
      // 祝福语
      content,
      // 祝福卡片
      picture,
      // 老师的信息
      teachers: teachers.map(({ name, userId }) => ({
        // 老师名称
        teaName: name,
        // 老师userId
        teaUserId: userId
      })),
      // 祝福卡片缩略图片
      thumbnail
    };

    try {
      await this.$api['active/content'](body);

      this.message = '发送成功,老师已经收到你的祝福啦~';
      setTimeout(() => {
        this.message = '';
        this.canSend = true;
        exit();
      }, 2000);
    } catch (err) {
      // 正常的错误
      if (err && err.code && err.message) {
        this.message = err.message;

        if (err.code === '910020') {
          // 祝福过了
          setTimeout(() => {
            this.message = '';
            this.canSend = true;
            exit();
          }, 2000);
        } else {
          // 祝福失败
          setTimeout(() => {
            this.message = '';
            this.canSend = true;
          }, 2000);
        }
      } else {
        // 由于网路原因或者其他js错误导致
        this.message = '发送失败再试一次吧~';
        setTimeout(() => {
          this.message = '';
          this.canSend = true;
        }, 2000);
      }
    }
  }
}
</script>

<style lang="scss">
.pad-active {
  .message-container {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.7);

    .message-content {
      position: fixed;
      z-index: 10;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border: 7px solid #6086ff;
      border-radius: 12px;
      background-color: #fff;
      .message-text {
        padding: 16px 20px;
        color: #333;
        font-size: 20px;
        border-radius: 5px;
        letter-spacing: 1px;
      }
    }
  }

  .pad-active__selected {
    display: none;
  }
  .is-checked {
    .pad-active__selected {
      display: block;
    }
  }

  .pad-active__button:disabled {
    background-color: #cbcbd6;
    box-shadow: 0px -5px 0px 0px rgba(175, 179, 195, 1) inset;
  }

  .img-btn {
    img {
      width: 100%;
      display: inline-block;
      vertical-align: middle;
    }
  }
}
</style>
