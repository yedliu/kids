<template>
  <div class="pad-evaluation-staged-detail">
    <div v-if="!isMobile" class="cloud-left"></div>
    <div v-if="!isMobile" class="cloud-right"></div>
    <div class="bg-grassland">
      <div class="bg-grass-arc"></div>
    </div>
    <div class="book-shadow"></div>
    <div class="pad-evaluation-staged-detail__container">
      <div class="pad-evaluation-staged-detail__tabbar">
        <button
          playAudio="true"
          class="pad-tabbar__button"
          :class="[{'pad-tabbar__button--active': active === 1}]"
          @click="handleClick(1)">
          待测评
        </button>
        <button
          playAudio="true"
          class="pad-tabbar__button"
          :class="[{'pad-tabbar__button--active': active === 3}]"
          @click="handleClick(3)">
          已测评
        </button>
      </div>
      <div
        class="pad-evaluation-staged-detail__tabbar-container"
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="loading"
      >
        <template v-if="list.length === 0">
          <img class="pad-evaluation-staged-detail__default-icon" :src="require('packages/theme/assets/stage-evaluation/pic_class_nothing@2x.png')" alt="">
          <p class="pad-evaluation-staged-detail__default-text">暂无{{active === 1 ? '待' : '已'}}测评内容</p>
        </template>
        <ul v-else-if="active === 1">
          <pad-list
            v-for="(item, index) in list"
            :content="item.name"
            :footer="item.createTime.substr(0, 16)"
            :key="index" class="pad-evaluation-staged-detail__item"
          >
            <icon
              slot="prepend"
              :type="item.subjectTypeColor"
              :text="item.subjectTypeText"
              style="align-self: flex-start"
            ></icon>
            <pad-button
              slot="append"
              type="danger"
              size="small"
              round
              link
              style="width: 100px;"
              :to="{
                name: '阶段测评测试',
                query: {
                  id: item.id,
                  duration: item.duration,
                  amount: item.questionCount,
                  from: 'list',
                  active: active
                }
              }"
            >去测评</pad-button>
          </pad-list>
        </ul>
        <ul v-else-if="active === 3">
          <pad-list
            v-for="(item, index) in list"
            :content="item.name"
            :footer="item.createTime.substr(0, 16)"
            :key="index" class="pad-evaluation-staged-detail__item"
          >
            <div slot="header">
              <img v-for="(itm, idx) in 5" class="pad-evaluation-staged-detail__star" :src="star(item.star, idx + 1)" alt="">
            </div>
            <div slot="append">
              <pad-button
                type="warn"
                size="small"
                round
                link
                style="width: 100px;margin-right: 10px;"
                :to="{
                  name: '阶段测评测试',
                  query: {
                    id: item.id,
                    duration: item.duration,
                    amount: item.questionCount,
                    action: 'retry',
                    from: 'list',
                    active: active
                  }
                }"
              >重新测评</pad-button>
              <pad-button
                type="danger"
                size="small"
                round
                link
                style="width: 100px;"
                :to="{
                  name: '阶段测评报告',
                  query: {
                    id: item.id,
                    from: 'list',
                    active: active
                  }
                }"
              >查看报告</pad-button>
            </div>

          </pad-list>
        </ul>
        <p v-show="noMore" class="pad-evaluation-staged-detail__no-more-tips">没有更多了</p>
      </div>
      <img class="pad-evaluation-staged-detail__container--decorator-left" :src="require('packages/theme/assets/stage-evaluation/img_phasetest_grass1@2x.png')" alt="">
      <img class="pad-evaluation-staged-detail__container--decorator-left-bottom" :src="require('packages/theme/assets/stage-evaluation/img_phasetest_grass3@2x.png')" alt="">
      <img class="pad-evaluation-staged-detail__container--decorator-right-bottom" :src="require('packages/theme/assets/stage-evaluation/img_phasetest_grass4@2x.png')" alt="">
      <img class="pad-evaluation-staged-detail__container--decorator-right" :src="require('packages/theme/assets/stage-evaluation/img_phasetest_grass2@2x.png')" alt="">
    </div>
  </div>
</template>

<script lang='ts'>
  import {Component, Watch, Vue} from 'vue-property-decorator';
  import {setHeader} from '@/utils';
  import Button from 'components/button.vue';
  import List from 'components/list-staged.vue';
  import Icon from 'components/icon.vue';
  import infiniteScroll from 'vue-infinite-scroll';
  import {isMobile} from '@/utils/ua';
  Vue.use(infiniteScroll);

  enum subjectType {
    MATH_LOGIC = '数理逻辑',
    MATH = '数学',
    CHINESE_LOGIC = '语文',
    ENGLISH_CONCEPT = '英语',
    LEARNING_ABILITY_TRAINING = '学习力'
  }
  enum subjectColorType {
    MATH_LOGIC = 'blue',
    MATH = 'blue',
    CHINESE_LOGIC = 'red',
    ENGLISH_CONCEPT = 'orange',
    LEARNING_ABILITY_TRAINING = 'yellow'
  }
  Component.registerHooks([
    'beforeRouteEnter'
  ]);

  @Component({
    components: {
      PadButton: Button,
      PadList: List,
      Icon
    }
  })
  export default class StageEvaluationList extends Vue {
    private active: number = 1;
    private list: any[] = [];
    private undoList: any[] = [];
    private doneList: any[] = [];
    private pageIndex: number = 0;
    private loading: boolean = false;
    private total: number = 1000;
    private pageSize: number = 10;
    private noMore: boolean = false;
    private starLight: any = require('packages/theme/assets/stage-evaluation/img_star_fill@2x.png');
    private starDefault: any = require('packages/theme/assets/stage-evaluation/img_star@2x.png');
    private isMobile: boolean = isMobile();
    private flag: boolean = false;
    private handleClick(n: number) {
      this.active = n;
      this.flag = true;
    }

    @Watch('active')
    private activeChanged(val: number) {
      this.pageIndex = 1;
      this.noMore = false;
      this.list = [];
      if (this.flag) {
        this.initialList();
      }
    }

    private beforeRouteEnter(to: any, from: any, next: any) {
      const {from: _from, active} = from.query;
      next((vm: any) => {
        if (active) {
          vm.active = +active;
          vm.flag = false;
        }
      });
    }

    private created() {
      const token = this.$route.query.token || '';
      token && this.$cookie.set('token', token);
      setHeader('阶段学习测评');
      // this.initialList();
    }

    private star(star: number, index: number) {
      return star >= index ? this.starLight : this.starDefault;
    }

    private async initialList() {
      const info: any = await this.$api['evaluationStaged/list']({
        examInfoStatus: this.active,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      });
      info.total > 0 && this.total !== info.total && (this.total = info.total);
      if (info.list && info.list.length > 0) {
        this.loading = false;
        this.list.push(...info.list.map((item: any) => {
          return {
            ...item,
            subjectTypeText: subjectType[item.subjectCode].substr(0, 1),
            subjectTypeColor: subjectColorType[item.subjectCode]
          };
        }));
      }
    }

    private loadMore() {
      this.loading = true;
      if (this.pageIndex * this.pageSize >= this.total) {
        this.noMore = true;
        return;
      }
      this.pageIndex++;
      this.initialList();
    }
  }
</script>
