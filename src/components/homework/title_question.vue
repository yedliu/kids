<template>
  <div class="title_question" v-html="title"></div>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class QuestionTitle extends Vue {
    @Prop()
    private title: string;
  }
</script>
<style lang="scss">
  .title_question {
    @include disableUserSelect();
    padding: 0 60px 20px 60px;
    text-align: left;
    line-height: 30px;
    font-size: 20px;
    word-break: break-all;
    li {
      list-style-position: inside;
      & table {
        vertical-align: middle;  // bug fix 列表中有表格时，序号不垂直居中
      }
    }
    img {
      max-width: 100%;
      vertical-align: top;
    }
    table, tr, td {
      border: 2px solid rgb(204, 204, 204);
      border-spacing: 0;
      border-collapse: collapse;
    }
    table {
      display: inline-table;
    }
    li p {
      display: inline-block;
    }
  }
</style>
