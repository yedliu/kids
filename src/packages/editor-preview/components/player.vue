<template>
  <section
    class="pad-editor-player"
    :class="[
      mode === 0 ? 'is-fullscreen' : ''
    ]"
  >
    <iframe :src="src" frameborder="0"></iframe>
    <button class="pad-editor-player__button--fullscreen" @click="handleFullScreenClick">
      <img
        v-if="mode === 0"
        src="../icons/icon_fullscreen.png"
        alt="取消全屏"
        srcset="../icons/icon_fullscreen.png 1x,
                      ../icons/icon_fullscreen@2x.png 2x,
                      ../icons/icon_fullscreen@3x.png 3x"
      >
      <img
        v-else
        src="../icons/icon_non_fullscreen.png"
        alt="全屏"
        srcset="../icons/icon_non_fullscreen.png 1x,
                      ../icons/icon_non_fullscreen@2x.png 2x,
                      ../icons/icon_non_fullscreen@3x.png 3x"
      >
    </button>
  </section>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {displayMode} from '@/packages/editor-preview';

  @Component({
    components: {}
  })
  export default class Player extends Vue {
    @Prop({
      required: true
    })
    private src: string;

    private mode: displayMode = displayMode.window;

    private handleFullScreenClick() {
      this.mode = this.mode === displayMode.window ? displayMode.fullscreen : displayMode.window;
      this.$emit('display-changed', this.mode);
    }
  }
</script>
