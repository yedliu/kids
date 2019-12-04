<template>
  <li class="pad-list-staged">
    <div class="pad-list-staged__wrapper">
      <div class="pad-list-staged__prepend" style="align-self: flex-start">
        <slot name="prepend">
          {{prepend}}
        </slot>
      </div>
      <div class="pad-list-staged__container">
        <div class="pad-list-staged__header">
          <slot name="header"></slot>
        </div>
        <div class="pad-list-staged__content">
          <slot>{{content}}</slot>
        </div>
        <div class="pad-list-staged__footer">
          <slot name="footer">{{footer}}</slot>
        </div>
      </div>
      <div class="pad-list-staged__append">
        <slot name="append"></slot>
      </div>
    </div>
  </li>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class StagedList extends Vue {
    @Prop()
    private content: string;

    @Prop()
    private footer: string;

    @Prop()
    private prepend: string;
  }
</script>
