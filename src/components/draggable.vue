<template>
  <div v-if="forbidden" :class="hidden ? 'common-drag-content hidden' : 'common-drag-content'">
    <slot></slot>
  </div>
  <div v-else-if="!isPC"
    :class="hidden ? 'common-drag-content hidden' : 'common-drag-content'"
    @touchstart.prevent.stop='onDragStart($event)'
    @touchmove.prevent.stop='onDragMove($event)'
    @touchend.stop='onDragEnd($event)'
    @touchcancel.stop='onDragCancel($event)' @scroll.prevent.stop
  >
    <slot></slot>
  </div>
  <div v-else
     :class="hidden ? 'common-drag-content hidden' : 'common-drag-content'"
     @mousedown='onClickDragStart($event)'
  >
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'Draggable',

    props: {
      hidden: null,
      forbidden: false,
      data: null
    },

    data() {
      return {
        drag: null,
        movedDom: null,
        moving: false,
        startX: 0,
        startY: 0,
        touchLongEvent: null,
        isPC: false
      };
    },

    mounted() {
      this.isPC = !('ontouchstart' in document.documentElement);
    },

    methods: {
      onDragStart(e) {
        if (this.forbidden) {
          return;
        }
        const eCopy = e.touches[0];
        this.startX = eCopy.clientX;  // 获取点击点的X坐标
        this.startY = eCopy.clientY;  // 获取点击点的Y坐标
        this.touchLongEvent = setTimeout(() => {
          this.$emit('dragstart', this.data);
          this.moving = true;
          let target = e.target;
          while (target.className.indexOf('drag-item') === -1) {
            target = target.offsetParent;
          }
          this.movedDom = target.cloneNode(true);
          target.classList.add('moving');
          e = e.touches[0];
          this.movedDom.classList.add('moving-clone-source');
          this.movedDom.style.position = 'absolute';
          this.movedDom.style.zIndex = 99;
          this.movedDom.style.left = e.clientX - (target.clientWidth * 1.2) / 2 + 'px';
          this.movedDom.style.top = e.clientY - (target.clientHeight * 1.2) / 2 + 'px';
          document.getElementsByTagName('body')[0].appendChild(this.movedDom);
          clearTimeout(this.touchLongEvent);
          this.touchLongEvent = null;
        }, 200);
      },
      onDragMove(e) {
        // e.preventDefault();
        setTimeout(() => {
          if (this.forbidden) {
            return;
          }
          e = e.touches[0];
          if (this.touchLongEvent && (Math.abs(e.clientX - this.startX) > 20 || Math.abs(e.clientY - this.startY) > 20)) {
            clearTimeout(this.touchLongEvent);
            return;
          }

          if (!this.moving) {
            return;
          }
          this.movedDom.style.left = e.clientX - this.movedDom.clientWidth / 2 + 'px';
          this.movedDom.style.top = e.clientY - this.movedDom.clientHeight / 2 + 'px';
          this.$emit('dragmove', e.clientX, e.clientY);
        });
      },
      onDragEnd(e) {
        // e.preventDefault();
        if (this.forbidden) {
          return;
        }
        if (this.touchLongEvent) {
          clearTimeout(this.touchLongEvent);
          this.touchLongEvent = null;
          return;
        }
        this.moving = false;
        let target = e.target;
        while (target.className.indexOf('drag-item') === -1) {
          target = target.offsetParent;
        }
        target.classList.remove('moving');
        this.movedDom.remove();
        this.$emit('dragend');
      },
      onDragCancel(e) {
        // e.preventDefault()
        if (this.forbidden) {
          return;
        }
        this.moving = false;
        let target = e.target;
        while (target.className.indexOf('drag-item') === -1) {
          target = target.offsetParent;
        }
        target.classList.remove('moving');
        this.movedDom.remove();
        this.$emit('dragcancel');
      },
      onClickDragStart(e) {
        if (this.forbidden) {
          return;
        }
        const eCopy = e.srcElement;
        this.startX = e.clientX;  // 获取点击点的X坐标
        this.startY = e.clientY;  // 获取点击点的Y坐标
        this.$emit('dragstart', this.data);
        this.moving = true;
        let target = e.target;
        while (target.className.indexOf('drag-item') === -1) {
          target = target.offsetParent;
        }
        const movedDom = target.cloneNode(true);
        this.movedDom = movedDom;
        target.classList.add('moving');
        // e = e.target;
        movedDom.classList.add('moving-clone-source');
        movedDom.style.position = 'absolute';
        console.log(e.clientX, e.clientY, eCopy.clientWidth, eCopy.clientHeight);
        movedDom.style.left = e.clientX - (eCopy.clientWidth * 1.2) / 2 + 'px';
        movedDom.style.top = e.clientY - (eCopy.clientHeight * 1.2) / 2 + 'px';
        movedDom.style.zIndex = 99;
        movedDom.onmousemove = (moveEvent) => {
          // const left = moveEvent.clientX + this.movedDom.clientWidth
          // if ((movedDom.clientWidth * 1.2) / 2 + moveEvent.clientX < bodyWidth) {
          //   movedDom.style.left = moveEvent.clientX - this.movedDom.clientWidth / 2 + 'px';
          // }
          movedDom.style.left = moveEvent.clientX - movedDom.clientWidth / 2 + 'px';
          movedDom.style.top = moveEvent.clientY - movedDom.clientHeight / 2 + 'px';
          this.$emit('dragmove', moveEvent.clientX, moveEvent.clientY);
        };
        movedDom.onmouseup = () => {
          target.classList.remove('moving');
          this.moving = false;
          movedDom.remove();
          this.$emit('dragend');
        };
        movedDom.onmouseleave = () => {
          target.classList.remove('moving');
          this.moving = false;
          movedDom.remove();
          this.$emit('dragcancel');
        };
        document.getElementById('homework') && document.getElementById('homework').appendChild(movedDom);
        !document.getElementById('homework') && document.getElementById('stageEvaluation') && document.getElementById('stageEvaluation').appendChild(movedDom);
        // document.getElementsByTagName('body')[0].appendChild(movedDom);
      }
    }
  };
</script>

<style lang="scss">
  .moving {
    opacity: 0.5;
  }

  .common-drag-content {
    display: flex;
    justify-content: center;
    overflow: hidden;
    user-select: none;
    @include disableUserSelect();
  }

  .common-drag-content.hidden {
    visibility: hidden;
  }
</style>
