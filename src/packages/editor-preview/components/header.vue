<template>
  <header
    class="pad-editor-header"
    :class="[
      fixed ? 'is-fixed' : ''
    ]"
  >
    <div class="pad-editor-header__left" @click="handleLeftClick">
      <slot name="left">
        <img
          src="../icons/icon_back.png"
          alt="返回"
          srcset="../icons/icon_back.png 1x,
                  ../icons/icon_back@2x.png 2x,
                  ../icons/icon_back@3x.png 3x"
        >
      </slot>
    </div>
    <div class="pad-editor-header__center">
      <slot></slot>
    </div>
    <div class="pad-editor-header__right" @click="handleRightClick">
      <slot name="right">
        <img
          src="../icons/icon_refresh.png"
          alt="返回"
          srcset="../icons/icon_refresh.png 1x,
                  ../icons/icon_refresh@2x.png 2x,
                  ../icons/icon_refresh@3x.png 3x"
        >
      </slot>
    </div>
  </header>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {exit} from 'modules/native-tips';

  @Component({
    components: {}
  })
  export default class Header extends Vue {
    @Prop()
    private fixed: boolean;
    @Prop(Function)
    private onLeft: any;
    @Prop(Function)
    private onRight: any;

    private mounted() {
      window.callhandler('ready');
    }
    private handleLeftClick() {
      if (this.onLeft) {
        return this.onLeft();
      }
      exit();
    }

    private handleRightClick() {
      if (this.onRight) {
        return this.onRight();
      }
      window.location.reload();
    }
  }
</script>
