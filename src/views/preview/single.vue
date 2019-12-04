<template>
  <div id="homework" class="homework-test">
    <div v-if="!isMobile" class="cloud-left"></div>
    <div v-if="!isMobile" class="cloud-right"></div>
    <div class="bg-grassland">
      <div class="bg-grass-arc"></div>
    </div>
    <div class="book-shadow"></div>
    <div id="main-container" class="bg-test">
      <div id="border-container">
        <!--<div class="skip-btn" @click="goNext" v-if="pagetype === 'test' && currentQuestionIndex + 1 < questionCount"></div>-->
        <div class="question-number"><div>1/1</div></div>
        <div class="question-window">
          <div class="slide-box" style="width: 100%">
            <Question
              pagetype="test"
              v-for="(question, index) in questionList"
              :question="question"
              :key="index"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Provide, Vue} from 'vue-property-decorator';
  import Question from 'modules/question/index.vue';
  import MakeData from 'service/data/stage-evaluation-data';

  @Component({
    components: {
      Question
    },
  })

  export default class Single extends Vue {
    private questionList: any[] = [];
    private questionData: any = {};
    private postMessageReady: boolean = false;

    private mounted() {
      window.addEventListener('message', (event) => { // 子获取父消息
        if (event.data.action && event.data.action === 'questionPreview') {
          this.questionDataFormat(event.data.data);
        }
      }, false);
      window.parent.postMessage({
        action: 'ready',
        data: {
          origin: 'questionPreview',
        }
      }, '*');
    }

    private questionDataFormat(originData: any) {
      const questionOriginList: any[] = [];
      questionOriginList.push(originData);
      const questionListData = new MakeData(questionOriginList);
      this.questionList = questionListData.data.questions;
      this.$store.dispatch('set_questions_data', questionListData.data);
    }

  }
</script>

<style lang="scss">
  #homework {
    position: relative;
    height: 100%;
    width: 100%;
    color: #2c3e50;
    background: linear-gradient(to bottom, #8EB2FF, #F6FFF2);
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    .zmsubline {
      display: inline-block;
      width: 60px;
      border-bottom: 2px solid #2c3e50;
    }
    #main-container {
      position: absolute;
      height: 630px;
      width: 960px;
      bottom: 55px;
      background-size: 100% 100%;
      left: 50%;
      margin-left: -480px;
      #border-container {
        position: absolute;
        .skip-btn {
          position: absolute;
          width: 11%;
          height: 7%;
          top: -7%;
          right: 5%;
          background: url("../../assets/images/common/btn_work_skip@2x.png") center center no-repeat / cover;
          @include btnScale(1.1);
        }
        .question-number {
          position: absolute;
          background-color: #FF6969;
          color: #fff;
          border-radius: 0 14px 14px 0;
          font-size: 16px;
          line-height: 30px;
          width: 50px;
          text-align: center;
          top: 24px;
          left: 0;
          padding-right: 6px;
          z-index: 2;
          @include disableUserSelect();
        }
        .question-window {
          height: 100%;
          position: relative;
          overflow: hidden;
          padding-top: 14px;
          .slide-box {
            height: 100%;
            width: 200%;
            display: flex;
            flex-direction: row;
            position: absolute;
            transition: transform 1s;
          }
        }
      }
    }
    .bg-test {
      @include disableUserSelect();
      background: url("../../assets/images/common/work_board@2x.png") center;
      #border-container {
        top: 3.5%;
        bottom: 45px;
        left: 2%;
        right: 2%;
      }
    }
  }
</style>
