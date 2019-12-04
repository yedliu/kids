<template>
  <transition :name="animationName">
    <div class="modal-container" :class="[showMask ? 'modal-mask' : '', customClass]">
      <div
        class="check-container kids-custom-modal"
        @click.stop >
        <div class="text-msg" v-html="content"></div>
        <slot></slot>
        <div class="btn-box" v-if="dialog">
          <div class="cancel" @click="submitCancelEmit" v-if="cancelText">{{cancelText}}</div>
          <div class="submit" @click="submitOkEmit" v-if="okText">{{okText}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    components: {},
  })

  export default class Modal extends Vue {
    @Prop({
      type: String,
      default: ''
    })
    private content: any; // 主要显示内容，支持 string 和 字符串模板

    @Prop({
      type: Boolean,
      default: false
    })
    private dialog: boolean; // 是否显示 ‘确认和取消按键’

    @Prop({
      type: String,
      default: ''
    })
    private okText: string; // 确定按键显示的文字

    @Prop({
      type: String,
      default: ''
    })
    private cancelText: string;

    @Prop({
      type: String,
      default: ''
    })
    private submitOk: any;

    @Prop({
      type: String,
      default: ''
    })
    private submitCancel: any;

    @Prop({
      type: Number,
      default: 1500
    })
    private duration: any;

    @Prop({
      type: String,
      default: 'slide-fade'
    })
    private animationName: string;

    @Prop({
      type: String,
      default: ''
    })
    private customClass: string;

    @Prop({
      type: Boolean,
      default: false
    })
    private showMask: boolean;

    private submitOkEmit() {
      if (!this.submitOk) { return false; }
      window.GLOBAL.vbus.$emit(this.submitOk);
    }

    private submitCancelEmit() {
      if (!this.submitCancel) { return false; }
      window.GLOBAL.vbus.$emit(this.submitCancel);
    }

    private closeModal() {
      window.GLOBAL.vbus.$emit('closeModal', true);
    }

    private mounted() {
      if (this.dialog) { return false; }
      setTimeout(() => {
        this.closeModal();
      }, this.duration );
    }

  }
</script>

<style lang='scss' scoped>
  .modal-mask{
    background: rgba(0,0,0,.5);
    .check-container{
      top: 25%;
      transform: translate(-50%, -50%);
    }
  }
  .modal-container{
    position: absolute;
    width: 100%;
    height: 200%;
    left: 0;
    z-index: 1001;
    transform: translate(0, 0);
    @include disableUserSelect();
  }
  .check-container {
    width: 520px;
    position: absolute;
    top: 32px;
    left: 50%;
    transform: translate(-50%, 0);
    padding: 23px 32px;
    margin: auto;
    border: 12px #6086FF solid;
    border-radius: 30px;
    background-color: #fff;
    z-index: 999999;
    &:before {
      display: inline-block;
      content: "";
      position: absolute;
      left: 35px;
      top: -12px;
      width: 60px;
      height: 12px;
      background: url("../../assets/images/common/qipao@2x.png") no-repeat;
      background-size: auto 12px;
    }
    .text-msg {
      line-height: 30px;
      text-align: center;
      width: 100%;
      font-size: 22px;
      color: #000;
    }
    .btn-box {
      margin-top: 20px;
      width: 88%;
      height: 60px;
      margin-left: 6%;
      font-size: 24px;
      color: #fff;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }
  }
  .slide-fade-enter-active {
    transition: all .8s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translate(0, -50%);
    opacity: 1;
  }
  .submitFailed,
  .submitSuccess{
    .check-container{
      padding-top:157px;
      background: url("../../assets/images/homework/report/img_pop_fail.png") no-repeat center top / 520px 133px;
      background-color: #fff;
    }
    .text-msg{
      padding-bottom: 20px;
      font-family: PingFangSC-Medium;
      font-size: 28px;
      color: rgba(0,0,0,0.82);
      letter-spacing: -0.67px;
      text-align: center;
    }
  }
  .submitSuccess {
    .check-container {
      background: url("../../assets/images/homework/report/img_foxpop_success_get@2x.png") no-repeat center top / 100% auto;
      background-color: #fff;
    }
  }
</style>
<style lang="scss">
  .kids-custom-modal{
    .btn-box {
      .cancel {
        @include flex(center);
        background: url("../../assets/images/common/btn_160_yellow@2x.png") no-repeat;
        background-size: 100% 100%;
        min-width: 160px;
        cursor: pointer;
      }
      .submit {
        @include flex(center);
        background: url("../../assets/images/common/btn_160_red@2x.png") no-repeat;
        background-size: 100% 100%;
        min-width: 160px;
        padding: 0 20px;
        cursor: pointer;
      }
    }
    .modalSlot{
      span{
        font-family: PingFangSC-Regular;
        font-size: 22px;
        color: rgba(0,0,0,0.82);
        letter-spacing: 0;
        text-align: center;
        line-height: 33px;
        span {
          color: #6086FF;
        }
      }
    }
  }
</style>
