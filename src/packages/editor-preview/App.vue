<template>
  <div class="pad-editor">
    <editor-header v-if="displayMode === 1" :fixed="true">{{name}}</editor-header>
    <div class="pad-editor-container">
      <ul v-if="displayMode === 1"  class="pad-editor-user--top">
        <li
          v-for="(user, index) in 5"
          class="pad-editor-user__wrapper is-teacher"
          :class="[
            index === 0 ? 'is-teacher' : 'is-student',
            index === 1 ? 'is-mine' : ''
          ]"
        >
          <div class="pad-editor-user__content">
            <img
              v-if="index === 0"
              src="./images/img_teacher_blank.png"
              alt=""
              srcset="./images/img_teacher_blank.png 1x,
                      ./images/img_teacher_blank@2x.png 2x,
                      ./images/img_teacher_blank@3x.png 3x"
            >
            <template
              v-else
            >
              <div class="pad-editor-user__avatar-wrapper">
                <img
                  v-if="index === 1"
                  src="./images/img_head_zxm.png"
                  alt=""
                  srcset="./images/img_head_zxm.png 1x,
                      ./images/img_head_zxm@2x.png 2x,
                      ./images/img_head_zxm@3x.png 3x"
                >
                <img
                  v-else-if="index === 3"
                  src="./images/img_head_ddx.png"
                  alt=""
                  srcset="./images/img_head_ddx.png 1x,
                      ./images/img_head_ddx@2x.png 2x,
                      ./images/img_head_ddx@3x.png 3x"
                >
                <img
                  v-else
                  src="./images/img_head_mmt.png"
                  alt=""
                  srcset="./images/img_head_mmt.png 1x,
                      ./images/img_head_mmt@2x.png 2x,
                      ./images/img_head_mmt@3x.png 3x"
                >
              </div>
              <div class="pad-editor-user__info">
                <p>{{index === 3 ? '王晨' :
                     index === 4 ? '欧阳平' :
                     index === 5 ? '刘橙' : '常晓雪'}}</p>
                <p>
                  <img
                    src="./images/img_magicfruit.png"
                    alt=""
                    srcset="./images/img_magicfruit.png 1x,
                      ./images/img_magicfruit@2x.png 2x,
                      ./images/img_magicfruit@3x.png 3x"
                  >
                  <span>
                    {{index === 2 ? 12 :
                    index === 3 ? 9 :
                    index === 4 ? 20 : 15}}
                  </span>
                </p>
              </div>
            </template>
          </div>
        </li>
      </ul>
      <player
        :src="playerUrl"
        :mode="displayMode === 0 ? 'fullscreen' : 'window'"
        @display-changed="handleDispalyChanged"
      ></player>
      <ul v-if="displayMode === 1"  class="pad-editor-user--aside">
        <li
          v-for="(user, index) in 5"
          class="pad-editor-user__wrapper"
          :class="[
            index === 0 ? 'is-teacher' : '',
            index === 1 ? 'is-mine' : '',
            index > 1 ? 'is-student' : ''
          ]"
        >
          <div class="pad-editor-user__content">
            <img
              v-if="index === 0"
              src="./images/app/img_teacher_blank.png"
              alt=""
              srcset="./images/app/img_teacher_blank.png 1x,
                      ./images/app/img_teacher_blank@2x.png 2x,
                      ./images/app/img_teacher_blank@3x.png 3x"
            >
            <template
              v-else
            >
              <div class="pad-editor-user__avatar-wrapper">
                <img
                  v-if="index === 1"
                  src="./images/img_head_zxm.png"
                  alt=""
                  srcset="./images/img_head_zxm.png 1x,
                      ./images/img_head_zxm@2x.png 2x,
                      ./images/img_head_zxm@3x.png 3x"
                >
                <img
                  v-else-if="index === 3"
                  src="./images/img_head_ddx.png"
                  alt=""
                  srcset="./images/img_head_ddx.png 1x,
                      ./images/img_head_ddx@2x.png 2x,
                      ./images/img_head_ddx@3x.png 3x"
                >
                <img
                  v-else
                  src="./images/img_head_mmt.png"
                  alt=""
                  srcset="./images/img_head_mmt.png 1x,
                      ./images/img_head_mmt@2x.png 2x,
                      ./images/img_head_mmt@3x.png 3x"
                >
                <p v-if="index > 1">
                  {{index === 2 ? '王晨' :
                  index === 3 ? '欧阳平' :
                  index === 4 ? '刘橙' : '常晓雪'}}
                </p>
              </div>
              <div class="pad-editor-user__info">
                <p>
                  <img
                    src="./images/app/img_magicfruit.png"
                    alt=""
                    srcset="./images/app/img_magicfruit.png 1x,
                      ./images/app/img_magicfruit@2x.png 2x,
                      ./images/app/img_magicfruit@3x.png 3x"
                  >
                  <span>
                    {{index === 2 ? 12 :
                    index === 3 ? 9 :
                    index === 4 ? 20 : 15}}
                  </span>
                </p>
                <p v-if="index === 1">常晓雪</p>
              </div>
            </template>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from './components/header.vue';
import Player from './components/player.vue';
import {displayMode} from './index';
// import { exit } from 'modules/native-tips';

@Component({
  components: {
    EditorHeader: Header,
    Player
  }
})
export default class EditorPreview extends Vue {
  private name: string = '数理逻辑训练';
  private displayMode: displayMode = displayMode.window;
  private playerUrl: string = '';

  private created() {
    // const info: any = this.getUrlQuery();
    // console.log(info);
    //
    // const query: any = {
    //   coursewareId: 'f7bcfc22-5c8a-483a-8a41-054a89937fb5',
    //   versionCode: '7E5A2D8C62ACD169',
    //   // editorPreview: 1
    //   // platform: 3
    // };
    // //test.hdkj.zmlearn.com/zm_course_web/?platform=3&versionCode=7E5A2D8C62ACD169&coursewareId=f7bcfc22-5c8a-483a-8a41-054a89937fb5
    // const queryString: string = Object.keys(query).reduce((accumulator: any, currentValue: string) => {
    //   return `${currentValue}=${query[currentValue]}&${accumulator}`;
    // }, '');
    // const defaultUrl: string = `${process.env.VUE_APP_PLAYER}?${queryString.slice(0, queryString.length - 1)}`;
    const query: any = this.getUrlQuery();
    this.playerUrl = window.location.search ? `${query.url}` : '';
  }

  private getUrlQuery() {
    const i: number = window.location.href.indexOf('?');
    const query: string = window.location.href.substr( i + 1 );
    const queryArray: string[] = query.split('&');
    const queryObject: any = {};
    queryArray.forEach((item: string) => {
      const idx: number = item.indexOf('=');
      const key: string = item.substr(0, idx);
      const value: string = item.substr(idx + 1);
      queryObject[key] = value;
      console.log(queryObject);
    });
    return queryObject;
  }

  private handleDispalyChanged(mode: displayMode) {
    this.displayMode = mode;
  }
}
</script>
