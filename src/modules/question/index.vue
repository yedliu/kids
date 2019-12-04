<template>
  <div class="question-item">
    <AllSelect v-if="question.type === 'singleSelect' || question.type === 'multiSelect'" :question="question" :pagetype="pagetype"></AllSelect>
    <SubjectiveSelect v-if="question.type === 'subjectiveSelect'" :question="question" :pagetype="pagetype"></SubjectiveSelect>
    <TrueOrFalse v-if="question.type === 'trueOrFalse'" :question="question" :pagetype="pagetype"></TrueOrFalse>
    <CompletionSelect v-if="question.type === 'completionSelect'" :question="question" :pagetype="pagetype"></CompletionSelect>
    <TextMatchText v-if="question.type === 'textMatchText'" :question="question" :pagetype="pagetype"></TextMatchText>
    <TextMatchImg v-if="question.type === 'textMatchImg'" :question="question" :pagetype="pagetype"></TextMatchImg>
    <TypeSelect v-if="question.type === 'typeSelect'" :question="question" :pagetype="pagetype"></TypeSelect>
    <ReorderText v-if="question.type === 'reorderText'" :question="question" :pagetype="pagetype"></ReorderText>
    <ReorderImg v-if="question.type === 'reorderImg'" :question="question" :pagetype="pagetype"></ReorderImg>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
    components: {
      AllSelect: () => import('./allSelect/index.vue'),  // 单选题  多选题
      TrueOrFalse: () => import('./trueOrFalse/index.vue'), // 判断题
      CompletionSelect: () => import('./completionSelect/index.vue'), // 选词填空题
      TextMatchText: () => import('./textMatchText/index.vue'),  // 文文配对题
      TextMatchImg: () => import('./textMatchImg/index.vue'), // 图文配对题
      TypeSelect: () => import('./typeSelect/index.vue'), // 分类题
      ReorderText: () => import('./reorderText/index.vue'), // 文字排序题
      ReorderImg: () => import('./reorderImg/index.vue'), // 图片排序题
    },
})

export default class Question extends Vue {
  @Prop({
    type: Object,
    default: ''
  })
  private question: any;

  @Prop({
    type: String,
    default: ''
  })
  private pagetype: any;

  private nameOfQuestion: object = {
    singleSelect: '单选题',
    multiSelect: '多选题',
    subjectiveSelect: '主观选择题',
    trueOrFalse: '判断题',
    completionSelect: '选词填空题',
    textMatchText: '文文配对题',
    textMatchImg: '图文配对题',
    typeSelect: '分类题'
  };

  private created() {
    console.log(this.question);
  }
}
</script>

<style lang="scss">
.question-item {
  padding: 10px;
  height: 100%;
  box-sizing: border-box;
  flex: 1;
  text-align: left;
  position: relative;
  overflow-y: scroll;
  @include scrollHide;
  .option-completion {
    padding: 0 60px 20px 60px;
    font-weight: bold;
    font-size: 20px;
    word-break: break-all;
    white-space: initial;
    @include disableUserSelect();
  }
}
</style>
