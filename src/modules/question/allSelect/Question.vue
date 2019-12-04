<template>
  <div class="subjectContent">
    {{question}}
    <!--<slot name="pictureInStem"></slot>-->
    <!--<ul class="options">-->
      <!--<li-->
        <!--v-for="(option, index) in question.optionList"-->
        <!--:key="index"-->
      <!--&gt;-->
        <!--<slot :option="{question, index}"></slot>-->
      <!--</li>-->
    <!--</ul>-->
  </div>
</template>

<script lang="ts">
  import {Prop, Vue } from 'vue-property-decorator';

  export default class SingleSelectContent extends Vue {
    @Prop({
      type: Object,
      default: () => {
        return null;
      },
    })
    private question: any;

    private currentQuestion: any = {};
    private created() {
      this.currentQuestion = this.question;
    }
  }
</script>

<style lang="scss" scoped>

</style>
