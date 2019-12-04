<template>
  <div v-show="visible" class="pad-answer-sheet" @click="visible = false">
    <transition
      name="pad-slide"
      @before-enter="$emit('before-enter')"
      @enter="$emit('enter')"
      @leave="$emit('leave')"
      @after-leave="$emit('after-leave')"
    >
      <div v-show="visible" class="pad-answer-sheet__wrapper" @click.stop>
        <div class="pad-answer-sheet__container">
          <div class="pad-answer-sheet__title">
            {{$attrs.title || '答题卡'}}
          </div>
          <div class="pad-answer-sheet__text" v-html="text"></div>
          <div class="pad-answer-sheet__content">
            <div
              v-for="(item, index) in dataSource"
              :class="[
              'pad-answer-sheet__item',
              {
                'pad-answer-sheet__item--done': item.status === 'done',
                'pad-answer-sheet__item--correct': item.status === 'correct',
                'pad-answer-sheet__item--incorrect': item.status === 'incorrect'
              }
            ]"
              v-html="index + 1"
              @click="$emit('child-click', index, item)"
            ></div>
          </div>
          <div class="pad-answer-sheet__footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang='ts'>
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class AnswerSheet extends Vue {
    @Prop()
    private value: boolean;

    @Prop()
    private text: string;

    @Prop({
      type: Array,
      default() {
        return [];
      }
    })
    private dataSource: any[];
    private visible: boolean = this.value;

    @Watch('value')
    private valueChanged(val: boolean) {
      this.visible = val;
    }

    @Watch('visible')
    private visibleChanged(val: boolean) {
      this.$emit('input', val);
    }
  }
</script>
