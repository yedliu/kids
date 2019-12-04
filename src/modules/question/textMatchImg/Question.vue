<template>
  <div class="question">
    <div :class="['main-box', 'count-' + firstListCount]" ref="mainBox">
      <div class="part left">
        <div
          v-for="(item, key) in firstList"
          :key="key"
          :id="key"
          ref="first"
          :class="['item-box', 'count-' + firstListCount, {selected: item.status === 1, right: item.status === 2, wrong: item.status === 3}, {min: getContentLength(item.content) > 24}]"
          @click="itemSelect(item, key, 'first')">
          <template v-if="item.type === 'text'">
            {{item.content}}
          </template>
          <template v-else-if="item.type === 'img'">
            <img :src="item.content" class="item-img">
            <div class="item-mengban"></div>
          </template>
        </div>
      </div>
      <div class="part right">
        <div
          v-for="(item, key) in secondList"
          :key="key"
          :id="key"
          ref="second"
          :class="['item-box', 'count-' + secondListCount, {selected: item.status === 1, right: item.status === 2, wrong: item.status === 3}]"
          @click="itemSelect(item, key, 'second')">
          <template v-if="item.type === 'text'">
            {{item.content}}
          </template>
          <template v-else-if="item.type === 'img'">
            <img :src="item.content" class="item-img">
            <div class="item-mengban"></div>
          </template>
        </div>
      </div>
    </div>
    <div v-if="canShowLine" class="line-box">
      <svg v-if="answerType === 'correctAnswer'" xmlns="http://www.w3.org/2000/svg" version="1.1" :width="mainBoxWidth" :height="mainBoxHeight">
        <line
          v-for="(item, key) in firstList"
          :class="['line', {right: item.status === 2, wrong: item.status === 3}]"
          :key="key"
          :x1="item.matchPointPosition.x + 3"
          :y1="item.matchPointPosition.y + 3"
          :x2="secondList['' + item.correctAnswerOrder].matchPointPosition.x + 3"
          :y2="secondList['' + item.correctAnswerOrder].matchPointPosition.y + 3">
        </line>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" version="1.1" :width="mainBoxWidth" :height="mainBoxHeight">
        <line
          v-for="(item, key) in firstList"
          v-if="item.studentAnswer"
          :class="['line', {right: pagetype === 'report' && item.status === 2, wrong: pagetype === 'report' && item.status === 3}]"
          :key="key"
          :x1="item.matchPointPosition.x + 3"
          :y1="item.matchPointPosition.y + 3"
          :x2="secondList['' + item.studentAnswerOrder].matchPointPosition.x + 3"
          :y2="secondList['' + item.studentAnswerOrder].matchPointPosition.y + 3">
          <!--{{secondList[item.studentAnswer]}}-->
        </line>
      </svg>
      <!--<SvgLine v-for="(item, index) in dropLines" :key="index" :points="item" lineStyle="stroke:#FFE174;stroke-width:5;"></SvgLine>-->
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
  import SvgLine from '@/components/svgLine.vue';

  @Component({
    components: {
      SvgLine
    },
  })

  export default class Question extends Vue {
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

    private mainBoxWidth: number = 0;
    private mainBoxHeight: number = 0;

    private firstList: any = {};
    private secondList: any = {};

    private firstListCount: number = 0;
    private secondListCount: number = 0;

    private selectedItem: any = null;
    private selectedType: any = null;
    private matchedLines: any[] = []; // UI配对的元素位置索引
    private matchedSourceList: any[] = []; // UI配对的元素信息

    private canShowLine: boolean = false;

    private created() {
      this.init();
    }

    private mounted() {
      const mainBox: any = this.$refs.mainBox;
      this.mainBoxWidth = mainBox.clientWidth - 10;
      this.mainBoxHeight = mainBox.clientHeight - 10;
      this.initMatchPointPositionList(this.firstList, 'first');
      this.initMatchPointPositionList(this.secondList, 'second');
      this.canShowLine = true;
    }

    private getContentLength(val: string) {
      let len = 0;
      for (let i = 0; i < val.length; i++) {
        const a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) { // \x00-\xff→GBK双字节编码范围
          len += 2;
        } else {
          len += 1;
        }
      }
      return len;
    }

    private init() {
      const firstList: any[] = [...this.question.firstList];
      const firstListCount: number = firstList.length;
      const secondList: any[] = [...this.question.secondList];
      const secondListCount: number = secondList.length;
      const stuAnswer: any = this.stuAnswerInit(this.question.stuAnswer);
      // const stuAnswer: any[] = [...this.question.stuAnswer];
      const correctAnswer: any[] = [...this.question.correctAnswer];
      this.firstListCount = firstListCount;
      this.secondListCount = secondListCount;
      this.firstList = this.normalizeList(firstList, secondList, correctAnswer, stuAnswer, 'firstId');
      this.secondList = this.normalizeList(secondList, firstList, correctAnswer, stuAnswer, 'secondId');
    }

    private stuAnswerInit(stuAnswer: any) {
      if (!stuAnswer) {
        return [];
      }
      if (stuAnswer instanceof Array) {
        return stuAnswer;
      }
      if (stuAnswer.matchList && (stuAnswer.matchList.length < 1)) {
        return [];
      } else {
        const matchParse: any[] = [];
        stuAnswer.matchList.forEach((match: any[]) => {
          matchParse.push([match[0].id, match[1].id]);
        });
        return matchParse;
      }
      return [];
    }

    private idToOrder(list: any[], id: number) {
      const serchObject: any = list.find((item: any) => {
        return item.id === id;
      });
      return serchObject.showOrder;
    }

    private normalizeList(list: any[], anotherList: any[], correctAnswer: any[], stuAnswer: any[], listId: 'firstId' | 'secondId'): {
      content: string;
      type: string;
      correct: string;
      studentAnswer: string;
    } {
      const listObject: any = {};
      list.forEach((element: any) => {
        const correctObject: any = correctAnswer.find((answer: any) => {
          return answer[listId].toString() === element.id.toString();
        });
        const correctAnswerId: number = listId === 'firstId' ? correctObject.secondId : correctObject.firstId;
        const correctAnswerOrder: number = this.idToOrder(anotherList, correctAnswerId);

        let stuAnswerObject: any = null;
        let studentAnswer: number = 0;
        let studentAnswerOrder: number = -1;
        if (stuAnswer.length > 0) {
          stuAnswerObject = stuAnswer.find((answer: any) => {
            const listIdIndex = listId === 'firstId' ? 0 : 1;
            const answerParse = (typeof answer === 'string') ? JSON.parse(answer) : answer;
            // const answerParse = JSON.parse(answer);
            return answerParse[listIdIndex].toString() === element.id.toString();
          });
          if (stuAnswerObject) {
            stuAnswerObject = (typeof stuAnswerObject === 'string') ? JSON.parse(stuAnswerObject) : stuAnswerObject;
            studentAnswer = listId === 'firstId' ? stuAnswerObject[1] : stuAnswerObject[0];
            studentAnswerOrder = this.idToOrder(anotherList, studentAnswer);
          }
        }
        const key: string = `${element.showOrder}`;
        listObject[key] = {
          id: element.id,
          content: element.content,
          type: element.type,
          correctAnswer: correctAnswerId,
          correctAnswerOrder,
          showOrder: element.showOrder,
          studentAnswer,
          studentAnswerOrder,
          status: (studentAnswer && correctAnswerId === studentAnswer ? 2 : 3) || 0
        };
        if (this.answerType === 'correctAnswer') {
          listObject[key].status = 0;
        }

      });
      return listObject;
    }

    private initMatchPointPositionList(list: any, listId: 'first' | 'second') {
      const itemList: any = this.$refs[listId];
      itemList.forEach((item: any) => {
        const itemSource: any = item;
        const id: string = item.getAttribute('id');
        let position: any = {};
        if (listId === 'first') {
          position = {
            x: itemSource.offsetLeft + (itemSource.clientWidth / 2),
            y: itemSource.offsetTop + itemSource.clientHeight,
          };
        } else {
          position = {
            x: itemSource.offsetLeft + (itemSource.clientWidth / 2),
            y: itemSource.offsetParent.offsetTop,
          };
        }
        list[id].matchPointPosition = position;
      });
    }

    private correctAnswerInit() {
      const correctAnswer = this.question.correctAnswer;
      this.answerIdToIndex(correctAnswer);
    }

    private studentAnswerInit() {
      const stuAnswer = this.question.stuAnswer;
      this.answerIdToIndex(stuAnswer);
    }

    private answerIdToIndex(answerList: any[]) {
      const firstList = this.firstList;
      const secondList = this.secondList;
      const matchedLines = answerList.map((item: any, index: any) => {
        let firstIndex: number = -1;
        let secondIndex: number = -1;
        for (let j = 0, len = firstList.length; j < len; j++) {
          if (firstList[j].id === item.firstId) {
            firstIndex = j;
            break;
          }
        }
        for (let j = 0, len = secondList.length; j < len; j++) {
          if (secondList[j].id === item.secondId) {
            secondIndex = j;
            break;
          }
        }
        return {
          firstIndex,
          secondIndex
        };
      });
      this.matchedLines = matchedLines;
      this.matchedSourceList = answerList;
    }

    private itemSelect(item: any, key: string, type: string) {
      // 如果为作业解析则不进行任何操作
      if (this.pagetype === 'report') {
        return;
      }

      // 如果已有配对元素
      if (item.studentAnswer) {
        if (type === 'first') {
          this.secondList[item.studentAnswerOrder].studentAnswer = null;
          this.secondList[item.studentAnswerOrder].studentAnswerOrder = null;
        }
        if (type === 'second') {
          this.firstList[item.studentAnswerOrder].studentAnswer = null;
          this.firstList[item.studentAnswerOrder].studentAnswerOrder = null;
        }
        item.studentAnswer = null;
        if (!this.selectedItem) { // 如果未有选中元素
          this.selectedItem = item;
          this.selectedType = type;
          item.status = 1;
        } else if (this.selectedType === type) { // 如果有选中元素且类型相同
          this.selectedItem.status = 0;
          this.selectedItem = item;
          item.studentAnswer = null;
          item.status = 1;
        } else {
          // 点击元素与已选中元素连线
          item.studentAnswer = this.selectedItem.id;
          item.studentAnswerOrder = this.selectedItem.showOrder;
          if (type === 'first') {
            this.secondList[item.studentAnswerOrder].studentAnswer = item.id;
            this.secondList[item.studentAnswerOrder].studentAnswerOrder = `${item.showOrder}`;
          }
          if (type === 'second') {
            this.firstList[item.studentAnswerOrder].studentAnswer = item.id;
            this.firstList[item.studentAnswerOrder].studentAnswerOrder = `${item.showOrder}`;
          }
          this.selectedItem.status = 0;
          this.selectedItem = null;
          this.selectedType = null;
          item.status = 0;
        }
        this.saveCurrentAnswer();
        return;
      }

      // 如果点击元素之前未有选中元素
      if (!this.selectedItem) {
        this.selectedItem = item;
        this.selectedType = type;
        item.status = 1;
        return;
      }

      // 如果点击元素为已选中元素
      if (this.selectedItem.id === item.id && this.selectedType === type) {
        this.selectedItem = null;
        this.selectedType = null;
        item.status = 0;
        return;
      }

      // 如果点击元素与已选中元素在同一侧
      if (this.selectedType === type) {
        this.selectedItem.status = 0;
        this.selectedItem = item;
        item.status = 1;
        return;
      }

      // 点击元素与已选中元素连线
      item.studentAnswer = this.selectedItem.id;
      item.studentAnswerOrder = this.selectedItem.showOrder;
      if (type === 'first') {
        this.secondList[item.studentAnswerOrder].studentAnswer = item.id;
        this.secondList[item.studentAnswerOrder].studentAnswerOrder = `${item.showOrder}`;
      }
      if (type === 'second') {
        this.firstList[item.studentAnswerOrder].studentAnswer = item.id;
        this.firstList[item.studentAnswerOrder].studentAnswerOrder = `${item.showOrder}`;
      }
      this.selectedItem.status = 0;
      this.selectedItem = null;
      this.selectedType = null;
      this.saveCurrentAnswer();
    }

    private saveCurrentAnswer() {
      const matchList: any[] = [];
      // stuAnswer.push();
      const firstList = this.firstList;
      for (const firstListKey in firstList) {
        if (firstList.hasOwnProperty(firstListKey) === true) {
          if (firstList[firstListKey].studentAnswer) {
            // const match = '[' + firstList[firstListKey].id + ',' + (+firstList[firstListKey].studentAnswer) + ']';
            const match = [{id: firstList[firstListKey].id}, {id: firstList[firstListKey].studentAnswer}];
            matchList.push(match);
          }
        }
      }
      let stuAnswer: any = '';
      let stuAnswerParse = '';
      if (matchList.length > 0) {
        stuAnswer = {
          matchList
        };
        stuAnswerParse = JSON.stringify(stuAnswer);
      } else {
        stuAnswerParse = '';
      }
      const question = this.question;
      this.$store.dispatch('set_current_answer', {id: question.id, type: question.type, stuAnswer: stuAnswerParse});
    }
  }
</script>

<style scoped>

</style>

