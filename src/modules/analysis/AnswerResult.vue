<template>
  <div class="answer-result">
    <div class="title">回答结果</div>
    <div class="main">
      <div>
        {{question.correctResult === 0 ? '未作答' : question.correctResult === 1 ? '正确' : (question.correctResult === 2 ? !question.stuAnswer || question.stuAnswer.length === 0 || question.stuAnswer === '[]' ? '未作答' : '错误' : '错误')}}
        <div class="score">
          本题得分：<span>{{question.stuGetScore}}/{{question.score}}</span>
        </div>
      </div>
      <div v-if="isSelect && question.correctResult === 2 && question.stuAnswer && question.stuAnswer.length !== 0 && question.stuAnswer !== '[]'" class="result-compare">
        <span>我的答案：<i>{{question.stuAnswer && initialStuAnswer(question.stuAnswer)}}</i></span><span>正确答案：<i>{{question.correctAnswer && question.correctAnswer.replace(/\|/g, '')}}</i></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component({
    components: {},
  })

  export default class AnswerResult extends Vue {

    @Prop({
      type: Object,
      default: ''
    })
    private question: any;  // question.correctResult: number; // 1：正确 2：错误 3：部分正确

    @Prop({
      type: Boolean,
      default: false
    })
    private isSelect: boolean;

    private initialStuAnswer(stuAnswer: string) {
      if (stuAnswer) {
        return stuAnswer.split('|').sort().join('');
      }
      return '';
    }
  }
</script>

<style scoped>

</style>
