<template>
  <div class="pad-confirm">
    <div class="pad-confirm__wrapper" :style="$attrs.wrapperStyle">
      <div class="pad-confirm__header" :class="[$attrs.headerClass]" :style="$attrs.headerStyle">
        <slot name="header">{{title}}</slot>
      </div>
      <div class="pad-confirm__content" :class="[$attrs.ContentClass]">
        <slot></slot>
      </div>
      <div class="pad-confirm__footer" :class="[$attrs.footerClass]">
        <slot name="footer">
          <pad-button v-if="showCancel" type="warn" size="large" round class="pad-confirm__btn-cancel" @click="$emit('cancel')">
            {{cancelText || '取消'}}</pad-button>
          <pad-button v-if="showConfirm" type="danger" size="large" round class="pad-confirm__btn-confirm" @click="$emit('confirm')">{{confirmText || '确定'}}</pad-button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Button from 'components/button.vue';

  @Component({
    components: {
      PadButton: Button
    }
  })
  export default class Confirm extends Vue {
    @Prop()
    private title: string;
    @Prop()
    private confirmText: string;
    @Prop()
    private cancelText: string;
    @Prop({
      type: Boolean,
      default: true
    })
    private showCancel: boolean;
    @Prop({
      type: Boolean,
      default: true
    })
    private showConfirm: boolean;
  }
</script>
