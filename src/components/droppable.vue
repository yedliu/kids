<template>
  <div class="common-drop-content" ref="dropContent">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'Droppable',

    props: {
      clientPosition: Object,
      dropName: String,
      dragging: Boolean,
      droppedList: Array,
      scrollTop: Number,
      maxCount: Number
    },

    data() {
      return {
        dropArea: {},
        entered: false
      };
    },

    mounted() {
      this.updateDropPosition();
    },

    watch: {
      clientPosition(val) {
        if (!this.dragging) {
          return;
        }
        const dropArea = this.dropArea;
        const scrollTop = this.scrollTop || 0;
        if (!this.entered && val.clientX > dropArea.offsetLeft && val.clientX < dropArea.offsetRight && (val.clientY + scrollTop) > dropArea.offsetTop && (val.clientY + scrollTop) < dropArea.offsetBottom) {
          this.onDropEnter();
          this.entered = true;
        } else if (this.entered && (val.clientX < dropArea.offsetLeft || val.clientX > dropArea.offsetRight || (val.clientY + scrollTop) < dropArea.offsetTop || (val.clientY + scrollTop) > dropArea.offsetBottom)) {
          this.onDropLeave();
          this.entered = false;
        }
      },
      dragging(val) {
        this.updateDropPosition();
      }
    },

    methods: {
      onDropEnter() {
        if (!this.maxCount || this.droppedList.length < this.maxCount) {
          this.$emit('dropenter', this.dropName);
        } else {
          console.log('禁止拖入');
        }
      },
      onDropLeave() {
        this.$emit('dropleave');
      },
      updateDropPosition() {
        let dropContent = this.$refs.dropContent;
        const clientHeight = dropContent.clientHeight;
        const clientWidth = dropContent.clientWidth;

        let offsetTop = dropContent.offsetTop;
        let offsetLeft = dropContent.offsetLeft;

        while (dropContent.offsetParent && dropContent.offsetParent.className.indexOf('question-item') === -1) {
          offsetTop += dropContent.offsetParent.offsetTop;  // 叠加父容器的上边距
          offsetLeft += dropContent.offsetParent.offsetLeft;  // 叠加父容器的左边距
          dropContent = dropContent.offsetParent;
        }
        offsetLeft = offsetLeft + (window.innerWidth - dropContent.offsetParent.clientWidth) / 2;

        while (dropContent.offsetParent) {
          offsetTop += dropContent.offsetParent.offsetTop;  // 叠加父容器的上边距
          dropContent = dropContent.offsetParent;
        }
        const offsetBottom = offsetTop + clientHeight;
        const offsetRight = offsetLeft + clientWidth;
        this.dropArea = {
          offsetTop,
          offsetLeft,
          offsetBottom,
          offsetRight
        };
      }
    }
  };
</script>

<style>
  .common-drop-content {
    display: block;
    width: 100%;
    height: 100%;
  }

  .touch-enter {
    /*border: cadetblue solid 2px;*/
  }

  .touch-enter.touch-forbidden {
    border: red solid 2px;
  }
</style>
