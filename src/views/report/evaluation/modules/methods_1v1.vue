<template>
  <board title="学习方法">
    <div class="study-methods">
      <img :src="`${dataSource}?x-oss-process=image/resize,m_lfit,w_1200`" alt="">
    </div>
  </board>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Board from './board.vue';

  @Component({
    components: {
      Board
    }
  })
  export default class StudyMethods extends Vue {
    @Prop(String)
    private dataSource: string;
  }
</script>
<style lang="scss">
  .study-methods {
    width: 100%;
    /*padding: 17px 47px 46px;*/
    padding: 20px;
    img {
      width: 100%;
    }
  }
</style>
