<template>
  <div class="pad-report-staged">
    <div class="pad-report-staged__top">
      <img :src="require('packages/theme/assets/stage-evaluation/img_cloud1@2x.png')" alt="" class="pad-report-staged__cloud--left">
      <img :src="require('packages/theme/assets/stage-evaluation/img_cloud1@2x.png')" alt="" class="pad-report-staged__cloud--right">
      <img :src="require('packages/theme/assets/evaluation-report--staged/img_title@2x.png')" alt="" class="pad-report-staged__title">
    </div>
    <div class="pad-report-staged__container">
      <board bodyClass="pad-report-staged__user-info">
        <user :avatar="baseInfo.stuAvatar || ''" :name="baseInfo.stuName || ''" :subject="baseInfo.subject || ''" :grade="baseInfo.grade || ''"></user>
        <base-info style="margin-right: 24px;" header="测评名称" :content="baseInfo.lessonSystem || ''"></base-info>
        <!-- <base-info header="测评时间" :content="formateTime(baseInfo.lesStartTime, baseInfo.lesEndedTime)"></base-info> -->
        <base-info header="测评时间" :content="contentTime"></base-info>
      </board>
      <board header="测评表现" bodyClass="pad-report-staged__performance" class="pad-report-staged__board">
        <div class="pad-report-staged__performance-text" style="margin-top: 52px;">
          <p class="despice" @click="onLookBasic">本阶段学习评分标准<i></i></p>
        </div>
        <div class="pad-report-staged__performance-star">
          <div class="pad-report-staged__performance-star-bar">
            <img
              v-for="number in 5"
              :key="number"
              :src="star >= number ? require('packages/theme/assets/evaluation-report--staged/img_big_star_fill@2x.png') : require('packages/theme/assets/evaluation-report--staged/img_big_star@2x.png')"
              alt=""
              :class="[
                'pad-report-staged__performance-star-item',
              {
                'pad-report-staged__performance-star-item--mt20': (number === 1 || number === 5),
                'pad-report-staged__performance-star-item--mt40': (number === 2 || number === 4),
                'pad-report-staged__performance-star-item--mt50': number === 3
              }]"
            >
          </div>
        </div>
        <div class="pad-report-staged__performance-text">
          <p>超越了全国{{ youngExamReportOutputVO.winRate || 0}}%的学生</p>
        </div>
        <div class="pad-report-staged__performance-result">
          <div class="pad-report-staged__result-panel">
            <img :src="require('packages/theme/assets/evaluation-report--staged/icon_report_score@2x.png')" alt="" class="pad-report-staged__result-icon">
            <div class="pad-report-staged__result-info">
              <p class="pad-report-staged__result-value">
                {{Number((youngExamReportOutputVO.rightRate * 100).toFixed(2)) || 0}}<i>%</i>
              </p>
              <p class="pad-report-staged__result-text">本次测评正确率</p>
            </div>
          </div>
          <div class="pad-report-staged__result-panel">
            <img :src="require('packages/theme/assets/evaluation-report--staged/icon_report_time@2x.png')" alt="" class="pad-report-staged__result-icon">
            <div class="pad-report-staged__result-info">
              <p class="pad-report-staged__result-value">
                {{Math.floor(youngExamReportOutputVO.realDuration / 60) || 0}}<i>分</i><template>{{Math.floor((youngExamReportOutputVO.realDuration % 60)) || 0}}<i>秒</i></template>
              </p>
              <p class="pad-report-staged__result-text">测评所用时间</p>
            </div>
          </div>
        </div>
      </board>
      <board header="答题详情" bodyClass="pad-report-staged__answer-details" class="pad-report-staged__board" v-if="questionList && questionList.length > 0">
        <div class="pad-report-staged__answer-details-distinguish" style="margin-top: 68px;">
          <div class="pad-report-staged__answer-details-text">共有&nbsp;{{ length }}&nbsp;道题</div>
          <div class="pad-report-staged__answer-details-item">
            <div class="pad-report-staged__answer-details-item-icon pad-report-staged__answer-details-item-icon--right"></div>
            <span>{{ rightCount }}&nbsp;&nbsp;题</span>
          </div>
          <div class="pad-report-staged__answer-details-item">
            <div class="pad-report-staged__answer-details-item-icon pad-report-staged__answer-details-item-icon--wrong"></div>
            <div> {{ wrongCount }}&nbsp;&nbsp;题</div>
          </div>
          <div class="pad-report-staged__answer-details-item">
            <div class="pad-report-staged__answer-details-item-icon pad-report-staged__answer-details-item-icon--dismiss"></div>
            <div>{{ undo }}&nbsp;&nbsp;题</div>
          </div>
        </div>
        <div class="pad-report-staged__answer-details-canjump">
          <div v-for="(option, oIndex) in questionList" :key="oIndex"
            @click.stop="onGoDetail(youngExamReportOutputVO.examInfoId, oIndex)"
          :class="['pad-report-staged__answer-details-jumpitem',
          {
            'pad-report-staged__answer-details-jumpitem--correct': option.correctResult === 1,
            'pad-report-staged__answer-details-jumpitem--incorrect': option.correctResult === 2
          }
          ]"> {{oIndex + 1}} </div>
        </div>
          <button playAudio="true" v-if="length > 0" @click="onGoDetail(youngExamReportOutputVO.examInfoId, 0)" class="pad-button pad-button--danger pad-button--round pad-button--large pad-report-staged__answer-details-button">查看题目解析</button>
          <button playAudio="true" v-else class="pad-button pad-button--danger pad-button--round pad-button--large pad-report-staged__answer-details-button">查看题目解析</button>
      </board>
      <board header="知识掌握情况" bodyClass="pad-report-staged__knowledge" class="pad-report-staged__board">
        <div class="pad-report-staged__knowledge-echars">
          <kids-knowledge-echarts
          :needsData="needsData"
          :styleConfig="{
            xFontSize: 24,
            yFontSize: 24,
            width: 5,
            xSymbolSize: [30, 95],
            ySymbolSize: [30, 95],
            xMargin: 20,
            yMargin: 20
          }">
          </kids-knowledge-echarts>
        </div>
        <div class="pad-report-staged__knowledge-wrapper">
          <div class="pad-report-staged__knowledge-text">
            <div
              class="pad-report-staged__knowledge-detail"
              v-for="n in 3"
              :key="n"
            >
              <i :class="['pad-report-staged__knowledge-circle',{
                'pad-report-staged__knowledge-circle--ok': n === 1,
                'pad-report-staged__knowledge-circle--notok': n === 2,
                'pad-report-staged__knowledge-circle--can': n === 3,
              }]"></i>
              <span v-if="n === 1">知识点已掌握</span>
              <span v-if="n === 2">知识点未掌握</span>
              <span v-if="n === 3">知识点掌握不熟练</span>
            </div>
          </div>
          <div class="pad-report-staged__knowledge-img"></div>
        </div>
      </board>
      <board header="能力掌握情况" bodyClass="pad-report-staged__ability" class="pad-report-staged__board" v-if="baseAbilities.length > 0">
        <div class="pad-report-staged__ability-title">
          <div class="pad-report-staged__ability-text">能力名称</div>
          <div class="pad-report-staged__ability-text">说明</div>
          <div class="pad-report-staged__ability-text">掌握情况</div>
          <div class="pad-report-staged__ability-text">建议</div>
        </div>
        <div class="pad-report-staged__ability-list" v-for="(baseAbilitiesItem, kIndex) in baseAbilities" :key="kIndex">
          <div class="pad-report-staged__ability-item">{{ baseAbilitiesItem.name }}</div>
          <div class="pad-report-staged__ability-item">{{baseAbilitiesItem.abilityRemarks}}</div>
          <div class="pad-report-staged__ability-item pad-report-staged__ability-item--anoher">
            <div :class="['pad-report-staged__ability-item-icon',
              {'pad-report-staged__ability-item-icon--know': baseAbilitiesItem.situation === 3,
              'pad-report-staged__ability-item-icon--unknow': baseAbilitiesItem.situation === 1,
              'pad-report-staged__ability-item-icon--general': baseAbilitiesItem.situation === 2
              }
            ]"></div>
            <span>{{getStuation(baseAbilitiesItem.situation)}}</span>
          </div>
          <div class="pad-report-staged__ability-item pad-report-staged__ability-item--temp">{{baseAbilitiesItem.abilitySuggest}}</div>
        </div>
      </board>
      <board header="阶段测评历程" bodyClass="pad-report-staged__line" class="pad-report-staged__board">
        <div class="pad-report-staged__line-wrapper">
          <kids-chart-line-bent
            :value="exemInfo"
            :stars="stars"
            :starsWidthArray="[24, 50, 76, 102, 124]"
            :options="{
              symbol: ['none', 'path://M3, 40 L5, 40 L5, 6 L8, 6 L4, 0 L0, 6 L3, 6  Z'],
              axisLineWidth: 5,
              xAxisLabelSize: '24',
              yAxisLabelSize: '24',
              symbolSize: 16,
              yMax: 5,
              xMax: 50,
              yMin: 0,
              xMin: -1,
              xBottom: '3%',
              yLeft: '120px',
              lineWidth: 5,
              xLabelRotate: 0,
              xSymbolSize: [30, 100],
              ySymbolSize: [30, 100],
              yIconHeight: 20,
              yMargin: 10,
              xMargin: 10,
          }"
          ></kids-chart-line-bent>
        </div>
      </board>
      <board header="下个阶段学习内容" bodyClass="pad-report-staged__next" class="pad-report-staged__board" v-if="nextLessonContents.length > 0">
        <div class="pad-report-staged__next-title">
          <div class="pad-report-staged__ability-text">序号</div>
          <div class="pad-report-staged__ability-text">课堂名称</div>
          <div class="pad-report-staged__ability-text">上课时间</div>
        </div>
        <div class="pad-report-staged__next-list"
          v-for="(nextItem, idx) in nextLessonContents"
          :key="idx">
          <div class="pad-report-staged__next-list-text">{{ nextItem.id || 0 }}</div>
          <div class="pad-report-staged__next-list-text">{{ nextItem.lessonContentName || '敬请期待'}}</div>
          <div class="pad-report-staged__next-list-text">{{ getFormatDate(nextItem.startTime, 'yyyy-MM-dd hh:mm') || '敬请期待'}}</div>
        </div>
      </board>
    </div>
    <div class="pad-report-staged__bottom"></div>
    <div class="pad-report-staged__masker" v-show="showType">
      <div class="pad-report-staged__masker-content">
        <div class="pad-report-staged__masker-title">评分标准</div>
        <div class="pad-report-staged__masker-continer">
          <div class="pad-report-staged__masker-list" v-for="m in 5" :key="m">
            <div class="pad-report-staged__masker-star">
              <span
              :class="['pad-report-staged__masker-type',
              {
                'pad-report-staged__masker-type--silver2': m === 2,
                'pad-report-staged__masker-type--silver3': m === 3,
                'pad-report-staged__masker-type--silver4': m === 4,
                'pad-report-staged__masker-type--silver5': m === 5,
              }]"
              v-for="n in 5" :key="n"></span>
            </div>
            <div class="pad-report-staged__masker-text" v-if="m === 1">96%-100%，已熟练掌握大部分要点，但不够熟练，请继续努力吧</div>
            <div class="pad-report-staged__masker-text" v-if="m === 2">81%-95%，已熟练掌握大部分要点，但不够熟练，请继续努力吧</div>
            <div class="pad-report-staged__masker-text" v-if="m === 3">71%-80%，大部分知识要点没掌握，需要多多加油哦</div>
            <div class="pad-report-staged__masker-text" v-if="m === 4">61%-70%，已熟练掌握大部分要点，但不够熟练，请继续努力吧</div>
            <div class="pad-report-staged__masker-text" v-if="m === 5">60%以下，未达到单元学习的目标，在理解基础概念存在重要的错误和遗漏，不要灰心，请再努力试试</div>
          </div>
        </div>
        <!-- 可点击区域增大 -->
        <div class="pad-report-staged__masker-bigwrap" @click="showType = !showType">
         <button class="pad-button pad-report-staged__masker-close">
         </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import Board from 'components/evaluation-report--staged__board.vue';
  import User from 'modules/report/user-info.vue';
  import BaseInfo from 'modules/report/base-info.vue';
  import { KnowledgeEcharts, ChartLineBent } from '@kids/mobile-ui';
  const startTime: number = Date.now();
  // Vue.extend(KnowledgeEcharts);
  // Vue.extend(ChartLineBent);
  @Component({
    components: {
      Board,
      User,
      BaseInfo,
      Modal: () => import('modules/modal/index.vue'),
      KnowledgeEcharts,
      ChartLineBent
    },
  })

  export default class StageEvaluationReport extends Vue {
    private star: number = 0;
    private minute: number = 10;
    private second: number = 60;
    private showType: boolean = false;
    private baseAbilities: any = [];
    private baseInfo: object = {};
    private knowledgeVOS: any = [];
    private nextLessonContents: any = [];
    private youngExamReportOutputVO: object = {};
    private length: number = 0;
    private rightCount: number = 0;
    private wrongCount: number = 0;
    private undo: number = 0;
    private needsData: any = [];
    private exemInfo: any = [];
    private questionList: any = [];
    private contentTime: any = '';
    private stars: any = [0,
                        require('../../../packages/theme/assets/evaluation-report--staged/img_small_star1@2x.png'),
                        require('../../../packages/theme/assets/evaluation-report--staged/img_small_star2@2x.png'),
                        require('../../../packages/theme/assets/evaluation-report--staged/img_small_star3@2x.png'),
                        require('../../../packages/theme/assets/evaluation-report--staged/img_small_star4@2x.png'),
                        require('../../../packages/theme/assets/evaluation-report--staged/img_small_star5@2x.png')
                        ];
    private created() {
      this.getReportDetail();
      window.GLOBAL.vbus.$on('stage-report-tracker', () => {
        const pageParam = {
          user: this.baseInfo,
          platform: this.isMobile ? 'PAD' : 'PC',
          reportType: 'report--staged',
          duration: `${(Date.now() - startTime) * 0.001}秒`
        };
        window.ZM_JSSDK.sendCustomPage({
          pageId: encodeURI(window.location.href),
          pageName: '阶段测评报告',
          trackerType: 3,
          pageParam: JSON.stringify(pageParam),
        });
      });
    }
    private async  getReportDetail() {
      const res = await this.$api['evaluationStaged/report']({
        examInfoId: this.$route.query.id
      });
      const { baseAbilities, baseInfo, knowledgeVOS, nextLessonContents, youngExamReportOutputVO } = res;
      this.baseInfo = baseInfo ? baseInfo : {};
      this.star = youngExamReportOutputVO.star ? youngExamReportOutputVO.star : 0;
      this.nextLessonContents = nextLessonContents ? nextLessonContents : [];
      this.baseAbilities = baseAbilities ? baseAbilities : [];
      this.knowledgeVOS = knowledgeVOS ? knowledgeVOS : [];
      this.youngExamReportOutputVO = youngExamReportOutputVO ? youngExamReportOutputVO : {};
      this.questionList = youngExamReportOutputVO.questionList || [];
      this.length = this.questionList.length;
      try {
        if (this.length > 0) {
          let rightCount = 0;
          let wrongCount = 0;
          let undo = 0;
            this.questionList.forEach((item: any) => {
            if (item.correctResult === 1) {
              rightCount ++;
            }
            if (item.correctResult === 2) {
              wrongCount ++;
            } else if (item.correctResult === 0) {
              undo ++;
            }
          });
          this.rightCount = rightCount;
          this.wrongCount = wrongCount;
          this.undo = undo;
        }
        const knowledgeLength = knowledgeVOS ? knowledgeVOS.length : 0;
        if (knowledgeLength > 0) {
          const needsDataTemp: any = [];
          knowledgeVOS.forEach((ele: any, index: number) => {
            const arr: any = [];
            ele.comprehensiveDegree = ele.comprehensiveDegree || 1;
            ele.difficulty = ele.difficulty || 1;
            ele.examFrequency = ele.examFrequency || 1;
            ele.examFrequency = ele.examFrequency || 1;
            ele.situation = ele.situation || 1;
            arr.push(ele.comprehensiveDegree, ele.difficulty, ele.examFrequency, ele.situation, ele.name);
            needsDataTemp.push(arr);
          });
          this.needsData = needsDataTemp;
        }
        const examInfoListLength = youngExamReportOutputVO.examInfoList ? youngExamReportOutputVO.examInfoList.length : 0;
        if (examInfoListLength) {
          const isarr: any = [];
          const obj: any = {};
          youngExamReportOutputVO.examInfoList.forEach((ele: any, index: number) => {
            const exArr = [];
            if (ele.createTime) {
              const dereplication = this.getFormatDate(ele.createTime, 'yyyy-MM-dd');
              const timeUnix = new Date(ele.createTime.replace(/-/g, '/')).getTime();
              const time: any = this.getFormatDate(ele.createTime, 'MM.dd');
              // exArr.push(timeUnix, time, ele.star);
               exArr.push(time, ele.star);
            }
            isarr[index] = exArr;
          });
          // let tamp: any = [];
          // tamp = isarr.sort((a: any, b: any) => {
          //   return b[0] - a[0];
          // });
          // const arr1: any = [];
          // tamp.forEach((item: any) => {
          //   if (!obj[item[1]]) {
          //     obj[item[1]] = 'abc';
          //     arr1.push(item);
          //   }
          // });
          // const arr2 = arr1.sort((c: any, d: any) => {
          //   return c[0] - d[0];
          // });
          // const arr4: any = [];
          // arr2.forEach((idx: any) => {
          //   const arr3: any = [];
          //   arr3.push(idx[1], idx[2]);
          //   arr4.push(arr3);
          // });
          this.exemInfo = isarr;
        }
        if (youngExamReportOutputVO.realExamDate) {
          youngExamReportOutputVO.realDuration = youngExamReportOutputVO.realDuration || 0;
          const tempTime = youngExamReportOutputVO.realExamDate.replace(/\-/g, '/');
          const headStart = new Date(tempTime).getTime();
          const headEnd = new Date(tempTime).getTime() + (youngExamReportOutputVO.realDuration * 1000);
          this.contentTime = this.getFormatDate(headStart, 'yyyy.MM.dd') + ' ' + this.getFormatDate(headStart, 'hh:mm') + '-' + this.getFormatDate(headEnd, 'hh:mm');
        }
      } catch (e) {
        console.log(e);
      }
    }
    private getStuation(state: number) {
      if (state === 1) {
        return '未掌握';
      }
      if (state === 2) {
        return '不熟练';
      }
      if (state === 3) {
        return '已掌握';
      }
      return '未知';
    }
    private onLookBasic() {
      this.showType = !this.showType;
    }
    private onGoDetail(examId: any, index: any) {
      if (examId) {
        index = index + 1;
        this.$router.push({
          name: '阶段测评测试',
          query: {
            id: examId,
            action: 'analysis',
            from: 'report',
            index,
          }});
      }
    }
    private formateTime(str: string, strAn: string) {
      if (str) {
        str = str.replace(/\-/g, '.');
        const hea = str.slice(0, 11);
        const mid = str.slice(11, 16);
        const ens = strAn.slice(11, 16);
        return `${hea} ${mid}-${ens}`;
      }
    }
    private getFormatDate(date: any, format: string) {
      if (date === '0001-01-01 00:00:00') {
        return '';
      }
      if (typeof (date) === 'string') {
          date = date.replace(/-/g, '/');
      }
      if (date === undefined) {
        date = new Date();
      }
      if (format === undefined) {
        format = 'yyyy-MM-dd hh:mm:ss';
      }
      date = new Date(date);
      const o: any = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
      };
      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (const k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
      }
      return format;
    }
  }
</script>
