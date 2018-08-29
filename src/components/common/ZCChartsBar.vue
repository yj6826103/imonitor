<template>

  <div :id="idName" ref="chartsbar" style="background-color: #FFFFFF;width: 100%"></div>
  <!--<div class="more" style="text-align: right">-->
  <!--<el-button type="text" v-if="options.showMore">更多</el-button>-->
  <!--</div>-->

</template>

<script>
  import echarts from 'echarts'

  let emphasisColor = ['#3B87F5', '#00c6ff', '#46dd31', '#ffd541', '#ff9241', '#fb5959']
  let rankingNormalColor = ['rgba(250,89,89,0.8)', 'rgba(255,213,65,0.8)', 'rgba(72,221,49,0.8)']
  let rankingEmphasisColor = ['rgba(250,89,89,1)', 'rgba(255,213,65,1)', 'rgba(72,221,49,1)']
  let nomalColor = ['#99acfd', '#7be0fd']

  export default {
    name: "zc-barcharts",
    props: {
      idName: {type: String, require: true},
      height: {type: Number, require: true},
      chartData: {type: Object, require: true},
      options: {
        type: Object,
        require: false,
        default() {
          return {
            // 柱状图方向:可选值 horizontal/vertical
            direction: {type: String, require: false, default: 'horizontal'},
            // 是否展示排行榜
            isRanking: {type: Boolean, require: false, default: false},
            showLegend: {type: Boolean, require: false, default: false},
            //颜色组
            colorArr: {type: Array, require: false},
            //是否出现滚动条，只支持横向
            showSlider: false,
            //出现滚动条时可视范围所显示内容比例 0-100 例如 80则说明柱状图初始化后可见范围内会展示80%的数据隐藏剩余20%通过滚动查看
            sliderAreaScale: 100,
            emphasizeColor: false,
            showRankingList: false,
          }
        }
      }
    },
    data() {
      return {
        eChartsObj: null,
        titleMaxWidth: 0
      }
    },
    watch: {
      chartData(val, oldVal) {
        this.handleYTitle()
        this.eChartsObj.setOption(this.setupOptions());
      }
    },
    methods: {
      //处理标题，给标题添加序号
      handleYTitle() {
        if (this.options.showRankingList && this.chartData.categoryArr) {
          for (var i = 0; i < this.chartData.categoryArr.length; i++) {
            this.chartData.categoryArr[i] = (i + 1) + '. ' + this.chartData.categoryArr[i]
          }
          var maxLength = 0
          for (var i = 0; i < this.chartData.categoryArr.length; i++) {
            maxLength = this.chartData.categoryArr[i].length > maxLength ? this.chartData.categoryArr[i].length : maxLength
          }
          this.titleMaxWidth = maxLength * 10
        } else {
          return
        }
      },
      // 设置柱状图参数
      setupOptions() {
        var thiz = this
        return {
          legend: {
            type: 'plain',
            show: this.options.showLegend,
            right: 0,
            top: 20,
            icon: 'circle',
            selectedMode: false
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              label: {show: false},
              lineStyle: {width: 0},
            },
            padding: 10,
            backgroundColor: 'rgba(255,255,255,1)',
            textStyle: {color: '#444'},
            position: function (point) {
              return [point[0] + 20, point[1] - 20]
            },
            confine: true,
            extraCssText: 'box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.2);',
            formatter(params) {
              if (params[0].componentType == "series") {
                var format = '';
                format += params[0].axisValue+ '<br>'
                params.forEach(function (value, index) {
                  // var formatter = ""
                  // var name = !thiz.baseName?"文章篇数：":thiz.baseName
                  // formatter = formatter + params.name + "："+params.percent +"%<br>"
                  // formatter = formatter + params.marker + name + thiz.handleNum(params.value)

                  format += (value.marker + value.seriesName + ' : ')
                  // 拼接数据
                  format += parseInt(value.data)>=0? parseInt(value.data) :  parseInt(value.data.value);
                  //加换行符
                  if (value.seriesIndex != params.length - 1) {
                    format += '<br>'
                  }
                })
                // var value = params[0].data.value ? params[0].data.value : params[0].value
                // return format + value;
                return format;
              }
            },
          },
          grid: {
            top: 30,
            right: 20,
            bottom: this.options.direction === 'horizontal' ? this.options.showSlider ? 50 : 10 : 0,
            left: 20,
            containLabel: true
          },
          xAxis: this.options.direction === 'horizontal' ? {
            type: 'category',
            // show:false,
            axisLine: {
              lineStyle: {
                color: '#aaa'
              },
              show: true
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: '#444',
              show: true,
              interval: 0,
              // align: "center",
              rotate:30,
              // showMinLabel: true,
              // showMaxLabel: true,
              margin:10,
              // formatter: [
              //   '{a|AAa\nasd}',
              // ].join('\n'),
              // rich: {
              //   a: {
              //     color: '#f0f',
              //     width:"1"
              //   },
              // }
              // formatter: function (params) {
              //   if (thiz.chartData.categoryArr.length < 5) {
              //     return params
              //   }
              //   var newParamsName = "";// 最终拼接成的字符串
              //   var paramsNameNumber = params.length;// 实际标签的个数
              //   var provideNumber = 6;// 每行能显示的字的个数
              //   if (paramsNameNumber > provideNumber) {
              //     newParamsName = params.substr(0, 6) + "..."
              //   } else {
              //     newParamsName = params;
              //   }
              //   return newParamsName
              // }
            },
            data: this.chartData.categoryArr
          } : {
            type: 'value',
            position: 'bottom',
            axisLine:
              {
                show: false,
                lineStyle: {
                  color: '#aaa'
                },
              },
            axisTick: {
              show: false,
              axisTick: {
                interval: 0
              }
            },
            axisLabel: {show: true},
            splitLine: {lineStyle: {type: 'dashed', color: ['#a3a3a3']}},
          },
          yAxis: this.options.direction === 'horizontal' ? {
            type: 'value',
            position: 'left',
            boundaryGap: true,
            axisLine: {show: false},
            axisTick: {show: false},
            axisLabel: {
              show: true,
              color: "#a3a3a3"
            },
            splitLine: {lineStyle: {type: 'dashed', color: ['#a3a3a3']}}
          } : {
            type: 'category',
            inverse: true,
            boundaryGap: true,
            nameTextStyle: {
              align: "left",
              fontSize: 20,
            },
            axisLine: {lineStyle: {color: '#a3a3a3'}},
            axisTick: {show: false},
            axisLabel: this.options.showRankingList ? {
              color: '#444',
              interval: 0,
              margin: this.titleMaxWidth,
              textStyle: {
                align: 'left',
                baseline: 'middle'
              }
            } : {
              formatter: function (value, index) {
               var text = ""
                if(value.length>16){
                  value=value.substr(0,15)+"..."
                }
                if(value.length>8){
                 var herfLength =parseInt(value.length/2)
                  var value1=value.substr(0,herfLength)
                  var value2=value.substr(herfLength,value.length-herfLength)
                  text = value1+"\r\n"+"\r\n"+value2
                }else {
                  text=value
                }
                return text;
              },
              color: '#444',
              margin:10
            },
            data: this.chartData.categoryArr
          },
          itemStyle: this.options.direction === 'horizontal' ? {barBorderRadius: [10, 10, 0, 0]} : {barBorderRadius: [0, 10, 10, 0]},
          barWidth: 16,
          dataZoom: [{
            type: "slider",
            show: this.getShowDataZoom(),
            start: 0,
            end: this.options.sliderAreaScale,
          }],
          series: this.setupSeries(),
        }
      },
      getShowDataZoom() {
        var result = (this.options.direction === 'horizontal' && this.options.showSlider)
        return result === true
      },
      setupSeries() {
        var series = [];
        var valueArr = this.chartData.valueArr;
        if (this.chartData.valueArr.length) {
          var thiz = this
          valueArr.forEach(function (value, index) {
            if (thiz.options.emphasizeColor) {
              for (var i = 0; i < value.value.length; i++) {
                var num = value.value[i]
                if (i < 3) {
                  value.value[i] = {
                    value: num,
                    itemStyle: {
                      color: rankingNormalColor[i]
                    },
                    emphasis: {
                      itemStyle: {
                        color: rankingEmphasisColor[i]
                      },
                    },
                  }
                } else {
                  value.value[i] = {
                    value: num,
                    itemStyle: {
                      color: nomalColor[0]
                    }
                  }
                }
              }
              series.push({
                type: 'bar',
                name: value.name,
                data: value.value,
                itemStyle: {color: nomalColor[index]},
                emphasis: {
                  itemStyle: {
                    color: emphasisColor[index]
                  },
                },
              })
            } else {
              series.push({
                type: 'bar',
                name: value.name,
                data: value.value,
                itemStyle: {color: nomalColor[index]},
                emphasis: {
                  itemStyle: {
                    color: emphasisColor[index]
                  },
                },
              })
            }
          })
        }
        return series;
      }

    },
    mounted() {
      // for (var i = 0; i < this.chartData.categoryArr.length; i++) {
      //   this.chartData.categoryArr[i] = this.chartData.categoryArr[i]+"ASDFS"
      // }
      this.$refs.chartsbar.style.height = this.height + 'px';
      this.handleYTitle();
      //创建柱状图控件
      var barChart = echarts.init(document.getElementById(this.idName));
      //柱状图渲染
      barChart.setOption(this.setupOptions());

      this.eChartsObj = barChart;
      window.addEventListener("resize", function () {
        barChart.resize();
      });

      var thiz = this;
      barChart.on('click', function (params) {
        // this.zc_log(params)
        if (params.componentType == 'series' && params.componentSubType == 'bar') {
          if (params.value) {
            thiz.$emit('click-barchart', {
              name: params.name,
              index: params.dataIndex,
              seriesName: params.seriesName,
            });
          }
        }
      })
    }
  }
</script>

<style scoped>

</style>
