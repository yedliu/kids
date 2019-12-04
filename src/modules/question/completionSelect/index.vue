<template>
  <div :class="'homework-completion-select ' + pagetype" @scroll="scroll($event)" ref="mainBox">
    <Question :pagetype="pagetype" :question="question" :scrollIng="scrollIng" :scrollTop="scrollTop" @scrollup="onScrollUp" @scrollstop="onScrollStop"></Question>
    <Answer v-if="pagetype === 'report'" :question="question">
      <Question :pagetype="pagetype" :question="question" answerType="correctAnswer"></Question>
    </Answer>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import Question from './Question.vue';
  import Answer from '../../analysis/index.vue';

  @Component({
    components: {
      Question,
      Answer
    },
  })

  export default class CompletionSelect extends Vue {
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

    private scrollTop: number = 0;
    private scrollIng: boolean = false;
    private scrollUpInterval: any = null;

    private scroll(e: any) {
      this.scrollTop = e.target.scrollTop;
    }

    private onScrollUp() {
      const mainBox: any = this.$refs.mainBox;
      const scrollTop = this.scrollTop;
      if (this.scrollIng) {
        return;
      }
      this.scrollIng = true;
      this.scrollUpInterval = setInterval(() => {
        if (!(scrollTop > 0)) {
          return;
        }
        mainBox.scrollTop = mainBox.scrollTop - 2;
      }, 10);
    }

    private onScrollStop() {
      console.log('stop');
      this.scrollIng = false;
      clearInterval(this.scrollUpInterval);
    }
  }
</script>

<style scoped>

</style>
