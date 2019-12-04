<template>
  <div :class="[
    'pad-icon',
    {
      'pad-icon--red': type === 'red',
      'pad-icon--blue': type === 'blue',
      'pad-icon--yellow': type === 'yellow',
      'pad-icon--orange': type === 'orange',
    }
  ]">{{text}}</div>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class Icon extends Vue {
    @Prop()
    private text: string;

    @Prop()
    private type: string;
  }
</script>
