<template>
  <div class="pad-report-user">
    <img :src="avatar || require('packages/theme/assets/evaluation-report--staged/img_default_headsculpture@2x.png')" alt="" class="pad-report-user__avatar">
    <div class="pad-report-user__info">
      <p class="pad-report-user__name">{{name}}</p>
      <div class="pad-report-user__class-info">
        <span class="pad-report-user__subject">{{subject}}</span><i>|</i><span class="pad-report-user__grade">{{grade}}</span>
      </div>
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
    private avatar: string;

    @Prop()
    private name: string;

    @Prop()
    private grade: string;

    @Prop()
    private subject: string;
  }
</script>
