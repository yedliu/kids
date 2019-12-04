<template>
  <div class="chart">
    <div class="chart__inner">
      <div class="chart__main" ref="chart"></div>
    </div>
  </div>
</template>

<script lang='ts'>
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator';
  import echarts from 'echarts';

  @Component({
    components: {}
  })
  export default class Chart extends Vue {
    @Prop({
      type: Array,
      default() {
        return [];
      }
    })
    private data: any[];

    private chartInstance: any = null;

    @Watch('data')
    private dataChanged(newValue: any, old: any) {
      // this.$log('chart info changed');
      // console.log(newValue);
      const value: number[] = [];
      const indicator: any[] = [];
      newValue.forEach((element: any) => {
        if (element) {
          value.push(element.score);
          indicator.push({
            name: element.ability,
            max: 5
          });
        }
      });
      this.setOption({
        value,
        indicator
      }, this.chartInstance);
    }


    private initChart() {
      const main: any = this.$refs.chart;
      this.chartInstance = echarts.init(main);
      this.chartInstance.showLoading();
      // this.$log('initial chart data');
      // console.log(this.data);
      if (this.data.length > 0) {
        const value: number[] = [];
        const indicator: any[] = [];
        this.data.forEach((element: any) => {
          if (element) {
            value.push(element.score);
            indicator.push({
              name: element.ability,
              max: 5
            });
          }
        });
        this.setOption({
          value,
          indicator
        }, this.chartInstance);
      } else {
        this.setOption({
          value: [0],
          indicator: [0]
        }, this.chartInstance);
      }
    }

    private setOption(data: any, chart: any) {
      const {value, indicator} = data;
      chart.setOption({
        radar: {
          center: ['51%', '55%'],
          name: {
            textStyle: {
              color: '#666',
              backgroundColor: '#fff',
              // borderRadius: 3,
              fontSize: `${12}px`,
              padding: [3, 5],
            },
            formatter(v: string) {
              if (!v) { return ''; }
              if (v.length > 4) {
                return `${v.substring(0, 4)}\n${v.substring(4, 20)}`;
              }
              return v;
            }
          },
          indicator,
          shape: 'circle',
          nameGap: 12
        },
        series: [{
          type: 'radar',
          name: '知识和能力图谱',
          lineStyle: {
            color: '#FF6C6E',
            width: 2,
            type: 'solid'
          },
          areaStyle: {
            color: 'rgba(255, 108, 110, 0.60)'
          },
          data : [
            {
              value,
            }
          ],
        }]
      });
      chart.hideLoading();
    }

    private mounted() {
      this.initChart();
    }
  }
</script>
<style lang="scss">
  .chart {
    width: 400px;
    height: 300px;
    &__ {
      &main {
        height: 300px;
      }
    }
  }
</style>
