<template>
  <div class="pad-report-base">
    <div class="pad-report-base__header">
      <slot name="header">{{header}}</slot>
    </div>
    <div class="pad-report-base__content">
      <slot>{{content}}</slot>
    </div>
  </div>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class ReportUserInfo extends Vue {
    @Prop()
    private header: string;

    @Prop()
    private content: string;
  }
</script>
