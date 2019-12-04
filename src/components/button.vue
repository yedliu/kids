<template>
  <router-link
    v-if="link"
    playAudio="true"
    :to="to"
    :class="[
      'pad-button',
      type ? `pad-button--${type}`: '',
      buttonSize ? `pad-button--${buttonSize}` : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-round': round,
        'is-circle': circle,
        'is-highlight': highlight
      }
    ]"
    :disabled="buttonDisabled || loading"
    @click="$emit('click')"
  >
    <slot></slot>
  </router-link>
  <button
    v-else
    playAudio="true"
    :class="[
      'pad-button',
      type ? `pad-button--${type}`: '',
      buttonSize ? `pad-button--${buttonSize}` : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-round': round,
        'is-circle': circle,
        'is-highlight': highlight
      }
    ]"
    :disabled="buttonDisabled || loading"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class Button extends Vue {
    @Prop({
      type: String,
      default: 'default'
    })
    private type: string;

    @Prop(String)
    private size: string;

    @Prop(Boolean)
    private disabled: boolean;

    @Prop(Boolean)
    private loading: boolean;

    @Prop(Boolean)
    private round: boolean;

    @Prop(Boolean)
    private circle: boolean;

    @Prop(Boolean)
    private highlight: boolean;

    @Prop(Boolean)
    private link: boolean;

    @Prop({
      type: undefined,
    })
    private to: any;

    private get buttonSize() {
      return this.size || (this.$pad || {}).size;
    }

    private get buttonDisabled() {
      return this.disabled || (this.$pad || {}).disabled;
    }
  }
</script>
