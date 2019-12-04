<template>
  <section v-show="currentValue" class="modal" @click="currentValue = false">
    <section class="modal__inner" @click.stop>
      <slot>
        <div class="modal__dialog">
          <img class="modal__icon" src="../../assets/images/homework/report/img_pop_fail.png" alt="">
          <h4 class="modal__title">{{title}}</h4>
          <p class="modal__message">{{message}}</p>
          <button class="modal__confirm" @click.stop="currentValue = false">{{confirmText || '知道了'}}</button>
        </div>
      </slot>
    </section>
  </section>
</template>

<script lang='ts'>
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';

  @Component({
    components: {},
  })

  export default class ErrorModal extends Vue {
    @Prop({
      type: Boolean,
      required: true
    })
    private value: boolean;

    @Prop({
      type: String,
      default: '啊哦，出错了！'
    })
    private title: string;

    @Prop({
      type: String,
      required: true
    })
    private message: string;

    @Prop()
    private confirmText: string;

    private currentValue: boolean = this.value;

    @Watch('value')
    private valueChanged(val: boolean) {
      this.currentValue = val;
    }

    @Watch('currentValue')
    private currentValueCHanged(val: boolean) {
      this.$emit('change', val);
    }

  }
</script>
<style lang="scss">
  .modal {
    @include flex(center);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba($--color-black, 0.5);
    z-index: 999;
    text-align: center;
    &__ {
      &dialog {
        width: 544px;
        height: 385px;
        border: 12px solid #6086FF;
        border-radius: 30px;
        background: $--color-white;
        overflow: hidden;
      }
      &icon {
        width: 100%;
      }
      &title {
        font-size: 28px;
        color: rgba(0,0,0,0.82);
        letter-spacing: -0.67px;
        text-align: center;
        margin-top: 24px;
      }
      &message {
        font-size: 22px;
        color: rgba(0,0,0,0.82);
        letter-spacing: 0;
        text-align: center;
        line-height: 33px;
      }
      &confirm {
        @include bg('../../assets/images/common/btn_160_red@2x.png');
        width: 200px;
        height: 64px;
        font-size: 24px;
        margin: 20px auto;
        color: $--color-white;
        font-weight: bold;
        text-align: center;
      }
    }
  }
</style>
