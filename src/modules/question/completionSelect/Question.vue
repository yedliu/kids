<template>
  <div>
    <div class="option-completion" ref="optionBox">
      【填空题】
      <template v-for="(text, index) in stemCutList">
        <span class="stem-text" :key="index">{{text}}</span>
        <div v-if="index !== stemCutList.length - 1" :class="getDropBoxClass(index)">
          <droppable
            :key="'position' + index"
            :scrollTop="scrollTop"
            @dropenter="onSourceDropEnter"
            @dropleave="onSourceDropLeave"
            :clientPosition="clientPosition"
            :dragging="dragging"
            :dropName="'position' + index"
            :droppedList="droppedList['position' + index]"
            :maxCount=1>
            <draggable
              v-for="(dragText, itemIndex) in droppedList['position' + index]"
              :key="itemIndex"
              :data="{item: dragText, fromList: 'position' + index}"
              :forbidden="pagetype === 'report'"
              @dragstart="onSourceDragStart"
              @dragmove="onSourceDragMove"
              @dragend="onSourceDragEnd"
              @dragcancel="onSourceDragCancel">

              <div class="drag-item completion-select-option">
                <div class="completion-select-option-main">
                  <span class="content-text">{{dragText}}</span>
                  <div class="select-option-mengban"></div>
                </div>
              </div>

            </draggable>
          </droppable>
        </div>
      </template>
    </div>
    <div class="items-area">
      <draggable
        v-for="(item, itemIndex) in optionList"
        :key="itemIndex"
        class="item-box"
        :data="{item, fromList: 'origin'}"
        :forbidden="pagetype === 'report'"
        @dragstart="onSourceDragStart"
        @dragmove="onSourceDragMove"
        @dragend="onSourceDragEnd"
        @dragcancel="onSourceDragCancel">

        <div class="drag-item completion-select-option">
          <div class="completion-select-option-main">
            <span class="content-text">{{item}}</span>
            <div class="select-option-mengban"></div>
          </div>
        </div>

      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import Draggable from '@/components/draggable.vue';
  import Droppable from '@/components/droppable.vue';

  @Component({
    components: {
      Draggable,
      Droppable
    },
  })

  export default class CompletionSelect extends Vue {
    @Prop({
      type: Object,
      default: ''
    })
    private question: any;

    @Prop({
      type: String,
      default: ''
    })
    private pagetype: any;

    @Prop({
      type: String,
      default: ''
    })
    private answerType: string;

    @Prop({
      type: Number,
      default: 0
    })
    private scrollTop: number;

    @Prop({
      type: Boolean,
      default: false
    })
    private scrollIng: boolean;

    private stemCutList: any[] = [];
    private dragging: boolean = false;
    private dropping: boolean = false;
    private currentDragSource: any = null;
    private currentDrop: any = null;
    private dragFromName: string = '';
    private clientPosition: any = {};
    private droppedList: any = {};
    private optionList: any[] = [];
    private stuAnswer: any[] = [];
    private correctAnswer: any[] = [];
    private scrollTopArea: number = 0;

    private mounted() {
      this.scrollAreaInit();
      const stem = this.question.title;
      this.stemCutList = stem.split('__');
      const droppedList: any = {};
      this.stemCutList.forEach((item: any, index: any) => {
        droppedList['position' + index] = [];
      });
      this.droppedList = droppedList;
      this.optionList = this.question.optionList;
      this.correctAnswer = this.question.correctAnswer;
      if (this.pagetype === 'report' && this.answerType === 'correctAnswer') {
        this.correctAnswerInit(droppedList);
      } else {
        this.stuAnswer = this.question.stuAnswer;
        this.stuAnswerInit(droppedList);
      }
    }

    private stuAnswerInit(droppedList: any) {
      const stuAnswer = this.question.stuAnswer;
      if (!stuAnswer || !(stuAnswer instanceof Array)) {
        return;
      } else if (stuAnswer.length < 1) {
        return;
      }
      stuAnswer.forEach((item: any, index: number) => {
        if (item) {
          droppedList['position' + index].push(item);
          this.optionList = this.optionList.filter((val: any) => {
            return item !== val;
          });
        }
      });
      this.droppedList = droppedList;
    }

    private correctAnswerInit(droppedList: any) {
      const correctAnswer = this.correctAnswer;
      if (!correctAnswer) {
        return;
      }
      correctAnswer.forEach((item: any, index: number) => {
        if (item) {
          droppedList['position' + index].push(item);
          this.optionList = this.optionList.filter((val: any) => {
            return item !== val;
          });
        }
      });
      this.droppedList = droppedList;
    }

    private droppedListInit() {
      const droppedList: any = {};
      this.question.classList.forEach((item: any) => {
        droppedList[item.title] = [];
      });
      this.droppedList = droppedList;
    }

    private scroll(e: any) {
      console.log(e);
    }

    private scrollAreaInit() {
      let optionBox: any = this.$refs.optionBox;
      let offsetTop = 0;
      while (optionBox.offsetParent) {
        offsetTop += optionBox.offsetParent.offsetTop;  // 叠加父容器的上边距
        optionBox = optionBox.offsetParent;
      }
      this.scrollTopArea = offsetTop + 20;
    }

    private onSourceDragStart(data: any) {
      this.dragging = true;
      this.currentDragSource = data.item;
      this.dragFromName = data.fromList;
    }
    private onSourceDragMove(clientX: number, clientY: number) {
      this.clientPosition = {
        clientX,
        clientY
      };
      if (this.scrollTop > 0 && clientY <= this.scrollTopArea) {
        this.$emit('scrollup');
      } else if (this.scrollIng) {
        this.$emit('scrollstop');
      }
    }
    private onSourceDragEnd() {
      if (this.scrollIng) {
        this.$emit('scrollstop');
      }
      if (!this.dragging) {
        return;
      }

      if (this.currentDrop && this.dropping && this.currentDrop !== this.dragFromName) {
        this.droppedList[this.currentDrop].push(this.currentDragSource);
        if (this.dragFromName === 'origin') {
          this.optionList = this.optionList.filter((val: any) => {
            return this.currentDragSource !== val;
          });
        } else {
          this.droppedList[this.dragFromName] = this.droppedList[this.dragFromName].filter((val: any) => {
            return this.currentDragSource !== val;
          });
        }
      }

      if (!this.currentDrop) {
        if (this.dragFromName !== 'origin') {
          this.droppedList[this.dragFromName] = this.droppedList[this.dragFromName].filter((val: any) => {
            return this.currentDragSource !== val;
          });
          this.optionList.push(this.currentDragSource);
        }
      }

      setTimeout(() => {
        this.dragging = false;
        this.currentDrop = null;
        this.dropping = false;
        this.saveCurrentAnswer();
      }, 0);
    }
    private onSourceDragCancel() {
      if (this.scrollIng) {
        this.$emit('scrollstop');
      }
      this.dragging = false;
      this.currentDrop = null;
      this.dropping = false;
    }
    private onSourceDropEnter(dropName: any) {
      this.currentDrop = dropName;
      this.dropping = true;
    }
    private onSourceDropLeave() {
      this.currentDrop = null;
      this.dropping = false;
    }
    private getDropBoxClass(index: number) {
      let className: string = '';
      if (this.pagetype === 'report' && this.answerType !== 'correctAnswer') {
        return this.stuAnswer[index] === this.correctAnswer[index] ? 'drop-box right' : 'drop-box wrong';
      }
      className = this.currentDrop === 'position' + index ? 'drop-box touch-enter' : 'drop-box';
      if (this.droppedList['position' + index].length > 0) {
        className = className + ' dropped';
      }
      return className;
    }
    private saveCurrentAnswer() {
      const question = this.question;
      const stuAnswer: any[] = [];
      let stemCutListEmptyCount: number = 0;
      for (let index: number = 0; index < this.stemCutList.length - 1; index++) {
        if (!this.droppedList[`position${index}`][0]) {
          stemCutListEmptyCount++;
        }
      }
      if (stemCutListEmptyCount === (this.stemCutList.length - 1)) {
        this.$store.dispatch('set_current_answer', {id: question.id, type: question.type, stuAnswer: ''});
        return;
      }

      for (let index: number = 0; index < this.stemCutList.length - 1; index++) {
        stuAnswer.push(this.droppedList[`position${index}`][0] || '');
      }
      // stuAnswer.push();
      const stuAnswerParse = JSON.stringify(stuAnswer);
      this.$store.dispatch('set_current_answer', {id: question.id, type: question.type, stuAnswer: stuAnswerParse});
    }
  }
</script>

<style scoped>

</style>
