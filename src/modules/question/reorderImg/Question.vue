<template>
  <div class="question" ref="optionBox">
    <div class="reorder-area">
      <div class="item-box" v-for="index in (disOrderItemList.length)">
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
          <div :class="['item-drop-main', {dropping: currentDrop === ('position' + index)}, {dropped: droppedList['position' + index] && droppedList['position' + index].length > 0}]">
            <Carriage :class="getItemResult(index)" :itemIndex="index">
              <div class="item-box-index">{{index}}</div>
              <draggable
                v-for="(item, itemIndex) in droppedList['position' + index]"
                :key="itemIndex"
                :data="{item, fromList: 'position' + index}"
                :forbidden="pagetype === 'report'"
                @dragstart="onSourceDragStart"
                @dragmove="onSourceDragMove"
                @dragend="onSourceDragEnd"
                @dragcancel="onSourceDragCancel">

                <div class="drag-item reorder-img-option">
                  <img :src="item.content" alt="">
                  <div class="item-mengban"></div>
                </div>

              </draggable>
            </Carriage>
          </div>
        </droppable>
      </div>
      <hr class="carriage__line" :style="`width: ${disOrderItemList.length * 200}px;`" />
      <div class="bg-rail">
        <div class="rail-hr"></div>
        <div class="rail-hr"></div>
      </div>
    </div>
    <div class="before-order-area" v-if="!(answerType === 'correctAnswer') && !(pagetype === 'report' && !stuAnswerList.includes(''))">
      <div class="items-row">
        <draggable
          v-for="(item, itemIndex) in disOrderItemList"
          :key="itemIndex"
          class="item-box"
          :style="item.reordered ? 'opacity: 0;' : 'opacity: 1;'"
          :data="{item, fromList: 'origin'}"
          :forbidden="pagetype === 'report'"
          @dragstart="onSourceDragStart"
          @dragmove="onSourceDragMove"
          @dragend="onSourceDragEnd"
          @dragcancel="onSourceDragCancel">

          <div class="drag-item reorder-img-option">
            <img :src="item.content" alt="">
            <div class="item-mengban"></div>
          </div>

        </draggable>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import Carriage from './carriage.vue';
  import Draggable from '@/components/draggable.vue';
  import Droppable from '@/components/droppable.vue';

  @Component({
    components: {
      Draggable,
      Droppable,
      Carriage
    },
  })

  export default class TypeSelect extends Vue {
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
    private answerType: any;

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

    private dragging: boolean = false;
    private dropping: boolean = false;
    private currentDragSource: any = null;
    private currentDrop: any = null;
    private dragFromName: string = '';
    private clientPosition: any = {};
    private droppedList: any = {};
    private scrollTopArea: number = 0;

    private disOrderItemList: any[] = [];
    private stuAnswerList: any[] = [];

    private mounted() {
      this.disOrderItemListInit();
      this.scrollAreaInit();
      if (this.answerType === 'correctAnswer') {
        this.correctAnswerInit();
      } else {
        this.stuAnswerInit();
      }
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

    private correctAnswerInit() {
      this.disOrderItemList.forEach((item: any, index: number) => {
        item.reordered = true;
        this.droppedList['position' + (item.correctOrder + 1)].push(item);
      });
    }

    private stuAnswerInit() {
      const stuAnswerList = this.question.stuAnswer.split('|');
      this.stuAnswerList = stuAnswerList;
      stuAnswerList.forEach((item: string, index: number) => {
        const orderedItem = this.disOrderItemList.filter((val: any) => {
          return val.id.toString() === item;
        });
        orderedItem.length > 0 && (orderedItem[0].reordered = true);
        orderedItem.length > 0 && this.droppedList['position' + (index + 1)].push(orderedItem[0]);
      });
    }

    private getItemResult(index: number) {
      if (this.pagetype === 'test') {
        return '';
      }
      if (this.answerType === 'correctAnswer') {
        return 'right';
      }
      // console.log(this.droppedList['position' + index].length > 0 );
      if ((this.droppedList['position' + index].length > 0) && (this.droppedList['position' + index][0].correctOrder === (index - 1))) {
        return 'right';
      }
      return 'wrong';
    }

    private disOrderItemListInit() {
      const disOrderItemList: any[] = this.question.optionElementList.map((item: any, index: number) => {
        return {
          id: item.id,
          content: item.optionElementContent,
          correctOrder: item.optionElementOrder,
          type: item.optionElementType,
          questionId: item.questionId
        };
      });
      for (let i = 0; i < disOrderItemList.length; i++) {
        this.droppedList['position' + (i + 1)] = [];
      }
      this.disOrderItemList = disOrderItemList;
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
      if (this.dragging && this.dragFromName !== 'origin' && !this.currentDrop) {
        this.currentDragSource.selected = false;
        this.droppedList[this.dragFromName] = this.droppedList[this.dragFromName].filter((val: any) => {
          return this.currentDragSource !== val;
        });
        this.currentDragSource.reordered = false;
      }
      if (this.dragging && this.dropping && this.currentDrop !== this.dragFromName) {
        this.currentDragSource.selected = true;
        this.droppedList[this.currentDrop].push(this.currentDragSource);
        if (this.dragFromName !== 'origin') {
          this.droppedList[this.dragFromName] = this.droppedList[this.dragFromName].filter((val: any) => {
            return this.currentDragSource !== val;
          });
        } else {
          // this.disOrderItemList = this.disOrderItemList.filter((val: any) => {
          //   return this.currentDragSource !== val;
          // });
          // this.orderedItemList.push(this.currentDragSource);
          this.currentDragSource.reordered = true;
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
      this.dragging = false;
      this.currentDrop = null;
      this.dropping = false;
    }
    private onSourceDropEnter(dropName: any) {
      console.log(dropName);
      this.currentDrop = dropName;
      this.dropping = true;
    }
    private onSourceDropLeave() {
      console.log('DropLeave');
      this.currentDrop = null;
      this.dropping = false;
    }
    private saveCurrentAnswer() {
      console.log('saveCurrentAnswer');
      const stuAnswer: any[] = [];
      console.log(this.droppedList);
      let isEmpty: boolean = true;
      for (let i = 1; i <= this.disOrderItemList.length; i++) {
        isEmpty = isEmpty && !(this.droppedList['position' + i] && this.droppedList['position' + i][0] && this.droppedList['position' + i][0].id.toString());
        stuAnswer.push((this.droppedList['position' + i] && this.droppedList['position' + i][0] && this.droppedList['position' + i][0].id.toString()) || '');
      }
      console.log(stuAnswer);
      const question = this.question;
      let stuAnswerParse: string = '';
      if (!isEmpty) {
        stuAnswerParse = stuAnswer.join('|');
      } else {
        stuAnswerParse = '';
      }
      this.$store.dispatch('set_current_answer', {id: question.id, type: question.type, stuAnswer: stuAnswerParse});
    }
  }
</script>

<style lang="scss">

</style>
