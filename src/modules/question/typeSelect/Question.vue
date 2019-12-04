<template>
  <div class="question">
    <div class="types-area">
      <div class="type" v-for="(type, index) in question.classList" :key="index">
        <div :class="currentDrop === type.title ? 'drop-box-bg touch-enter': 'drop-box-bg'">
          <droppable
            @dropenter="onSourceDropEnter"
            @dropleave="onSourceDropLeave"
            :clientPosition="clientPosition"
            :dragging="dragging"
            :dropName="type.title"
            :droppedList="droppedList[type.title]"
            :maxCount=4
            class="drop-box">
              <div class="question-drop-box">
                <draggable
                  v-for="(item, itemIndex) in droppedList[type.title]"
                  :key="itemIndex"
                  class="item-box"
                  :data="{item, fromList: type.title}"
                  :forbidden="pagetype === 'report'"
                  @dragstart="onSourceDragStart"
                  @dragmove="onSourceDragMove"
                  @dragend="onSourceDragEnd"
                  @dragcancel="onSourceDragCancel">

                  <div :class="['drag-item', 'type-select-option', {wrong: answerType === 'stuAnswer' && item.result === 'wrong'}]">
                    <div class="type-select-option-main">
                      <template v-if="item.type === 'text'" @scroll.prevent.stop>
                        {{getContentShort(item.content, 20)}}
                      </template>
                      <template v-else-if="item.type === 'img'">
                        <img :src="item.content" class="item-img" @scroll.prevent.stop>
                      </template>
                      <div class="select-option-mengban"></div>
                    </div>
                  </div>

                </draggable>
              </div>
              <div class="type-title">
                <div class="text-box">
                  {{type.title}}
                </div>
              </div>
          </droppable>
        </div>
      </div>
    </div>
    <div v-if="pagetype === 'report' && answerType === 'stuAnswer'" class="class-result-area">
      <div v-for="(item, index) in classResultMap" :class="['class-result-item', item.classAnswerResult]"></div>
    </div>
    <div class="items-area">
      <div class="items-row" v-for="(items, index) in itemsList" :key="index">
        <draggable
          v-for="(item, itemIndex) in items"
          :key="itemIndex"
          class="item-box"
          :hidden="item.selected"
          :data="{item, fromList: 'origin'}"
          :forbidden="pagetype === 'report'"
          @dragstart="onSourceDragStart"
          @dragmove="onSourceDragMove"
          @dragend="onSourceDragEnd"
          @dragcancel="onSourceDragCancel">

          <div class="drag-item type-select-option">
            <div class="type-select-option-main">
              <template v-if="item.type === 'text'">
                {{getContentShort(item.content, 20)}}
              </template>
              <template v-else-if="item.type === 'img'">
                <img :src="item.content" class="item-img">
              </template>
              <div class="select-option-mengban"></div>
            </div>
          </div>

        </draggable>
      </div>
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
    private scrollTopNow: any;

    private classMap: any = {};
    private itemsList: any[] = [];
    private dragging: boolean = false;
    private dropping: boolean = false;
    private currentDragSource: any = null;
    private currentDrop: any = null;
    private dragFromName: string = '';
    private clientPosition: any = {};
    private droppedList: any = {};
    private classResultMap: any = {};
    private stuAnswer: any = {};
    private correctAnswer: any = {};
    private optionsIdMap: any = {};

    private mounted() {
      const {stuAnswer, correctAnswer, optionList} = this.question;
      const itemsList = [];
      for (let i = 0, len = optionList.length; i < len; i += 6) {
        itemsList.push(optionList.slice(i, i + 6));
      }
      this.itemsList = itemsList;
      this.stuAnswer = stuAnswer;
      this.correctAnswer = correctAnswer;
      this.droppedListInit();
      this.classMapInit();
      this.optionsIdMapInit();
      this.answerInit();
    }

    private droppedListInit() {
      const droppedList: any = {};
      this.question.classList.forEach((item: any) => {
        droppedList[item.title] = [];
      });
      this.droppedList = droppedList;
    }

    private classMapInit() {
      const classMap: any = {};
      const classResultMap: any = {};
      const classList = this.question.classList;
      classList.forEach((element: any) => {
        classMap[`classId${element.id}`] = element;
        classResultMap[element.title] = element;
      });
      this.classMap = classMap;
      this.classResultMap = classResultMap;
    }

    private optionsIdMapInit() {
      const optionList = this.question.optionList;
      const optionsIdMap: any = {};
      optionList.forEach((element: any) => {
        optionsIdMap[`id${element.id}`] = element;
      });
      this.optionsIdMap = optionsIdMap;
    }

    private answerInit() {
      const {classMap, correctAnswer, optionsIdMap} = this;
      let stuAnswer = this.stuAnswer;
      const optionList = this.question.optionList;
      if (correctAnswer && this.pagetype === 'report' && this.answerType === 'correctAnswer') {
        correctAnswer.forEach((type: any) => {
          type.items.forEach((itemId: any) => {
            this.droppedList[classMap[`classId${type.id}`].title].push(optionsIdMap[`id${itemId}`]);
          });
        });
        return;
      }

      if (stuAnswer && this.answerType === 'stuAnswer') {
        if (!(stuAnswer instanceof Array)) {
          stuAnswer = JSON.parse(stuAnswer);
        }
        if (stuAnswer.length < 1) {
          return;
        }
        stuAnswer.forEach((type: any) => {
          type.items.forEach((itemId: any) => {
            classMap[`classId${type.id}`] && this.droppedList[classMap[`classId${type.id}`].title].push(optionsIdMap[`id${itemId}`]);
            const optionItem = optionList.find((item: any) => {
              return item.id === itemId;
            });
            if (optionItem) {
              optionItem.selected = true;
            }
          });
        });
        if (this.pagetype === 'report') {
          this.checkAnswer(this.droppedList);
        }
        return;
      }
    }

    private classIdToTitle(classId: number) {
      return this.classMap[`classId${classId}`].title;
    }

    private classTitleToId(classTitle: string) {
      const classItem = this.question.classList.find((item: any) => {
        return item.title === classTitle;
      });
      return classItem.id;
    }

    private checkAnswer(droppedList: any) {
      const {classMap, correctAnswer, stuAnswer, optionsIdMap} = this;
      for (const droppedListKey in droppedList) {
        if (droppedList.hasOwnProperty(droppedListKey) === true) {
          let classResult = 'right';
          const classId = this.classTitleToId(droppedListKey);
          const classResultList = correctAnswer.find((answerItem: any) => {
            return answerItem.id === classId;
          });
          if (classResultList.items.length !== droppedList[droppedListKey].length) {
            classResult = 'wrong';
          }
          droppedList[droppedListKey].forEach((item: any) => {
            if (!classResultList.items.includes(item.id)) {
              classResult = 'wrong';
              item.result = 'wrong';
            }
          });
          this.classResultMap[droppedListKey].classAnswerResult = classResult;
        }
      }
    }

    private getContentShort(val: string, maxLength: number) {
      let len = 0;
      let contentShort = '';
      for (let i = 0; i < val.length; i++) {
        contentShort += val.charAt(i);
        const a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) { // \x00-\xff→GBK双字节编码范围
          len += 2;
        } else {
          len += 1;
        }
        if (len >= maxLength) {
          return contentShort + '...';
        }
      }
      return contentShort;
    }
    private onSourceDragStart(data: any) {
      this.dragging = true;
      this.currentDragSource = data.item;
      this.dragFromName = data.fromList;
    }
    private onSourceDragMove(clientX: number, clientY: number) {
      this.clientPosition = {
        clientX,
        clientY: clientY + this.scrollTopNow
      };
    }
    private onSourceDragEnd() {
      if (this.dragging && this.dragFromName !== 'origin' && !this.currentDrop) {
        this.currentDragSource.selected = false;
        this.droppedList[this.dragFromName] = this.droppedList[this.dragFromName].filter((val: any) => {
          return this.currentDragSource !== val;
        });
      }
      if (this.dragging && this.dropping && this.currentDrop !== this.dragFromName) {
        this.currentDragSource.selected = true;
        this.droppedList[this.currentDrop].push(this.currentDragSource);
        if (this.dragFromName !== 'origin') {
          this.droppedList[this.dragFromName] = this.droppedList[this.dragFromName].filter((val: any) => {
            return this.currentDragSource !== val;
          });
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
      this.currentDrop = dropName;
      this.dropping = true;
    }
    private onSourceDropLeave() {
      this.currentDrop = null;
      this.dropping = false;
    }
    private saveCurrentAnswer() {
      const stuAnswer: any[] = [];
      const {droppedList} = this;
      console.log(droppedList);
      // stuAnswer.push();
      for (const droppedListKey in droppedList) {
        if (droppedList.hasOwnProperty(droppedListKey) === true) {
          const classId = this.classTitleToId(droppedListKey);
          const classResultList: any[] = [];
          droppedList[droppedListKey].forEach((item: any) => {
            classResultList.push(item.id);
          });
          if (classResultList.length > 0) {
            const classObj = {
              id: classId,
              items: classResultList
            };
            stuAnswer.push(classObj);
          }
        }
      }
      const question = this.question;
      const stuAnswerParse = JSON.stringify(stuAnswer);
      this.$store.dispatch('set_current_answer', {id: question.id, type: question.type, stuAnswer: stuAnswerParse});
    }
  }
</script>

<style lang="scss">

</style>
