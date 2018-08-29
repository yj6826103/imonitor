<template>
  <div :id="idName" ref="lineChart" @click="stopLoopShow()"></div>
</template>

<script>
  import echarts from 'echarts'

  let emphasisColor = ['#3B87F5', '#00c6ff', '#46dd31', '#ffd541', '#ff9241', '#fb5959']

  export default {
    name: "line-charts",
    data() {
      return {
        eChartsObj: null,
        levelArray: [],
        levelIndex: 0,
        setTimeCode: -1,
        lastSelected: null
      }
    },
    props: {
      idName: {type: String, require: true},
      areaData: {type: Object, require: false},
      height: {type: Number / String, require: true},
      chartData: {type: Object, require: false},
      options: {
        type: Object, require: false, default() {
          return {
            isArea: false
          }
        }
      },
    },
    watch: {
      chartData(val, oldVal) {
        this.eChartsObj.setOption(this.setupOptions());
        this.stopLoopShow()
        this.checkDataOrderOfMagnitudes()
      },
      areaData(val, oldVal) {
        this.eChartsObj.setOption(this.setupOptions());
      }
    },
    methods: {
      getWeek(days) {
        days = days.split("-")
        var C = parseInt(days[0].substr(0, 2))
        var y = parseInt(days[0].substr(2, 4))
        var M = parseInt(days[1])
        if (M < 3) {
          y = y - 1;
          M = M + 12
        }
        var d = parseInt(days[2])
        var W = parseInt(C / 4) - 2 * C + y + parseInt(y / 4) + parseInt(13 * (M + 1) / 5) + d - 1
        var week = W % 7
        switch (week) {
          case 1:
            week = "星期一"
            break
          case 2:
            week = "星期二"
            break
          case 3:
            week = "星期三"
            break
          case 4:
            week = "星期四"
            break
          case 5:
            week = "星期五"
            break
          case 6:
            week = "星期六"
            break
          case 0:
            week = "星期日"
            break
        }
        return week
      },
      //折线图x轴数据
      setupXAxis() {
        return ['2017/12/28', '2017/12/29', '2017/12/30', '2017/12/31', '2018/01/01', '2018/01/02', '2018/01/03']
      },
      //折线图数据
      setupSeries() {
        var isArea = this.options.isArea;
        if (isArea) {
          return [{
            name: this.areaData.valueArr[0].name,
            data: this.areaData.valueArr[0].value,
            type: 'line',
            lineStyle: {
              color: '#3B87F5'
            },
            itemStyle: {
              color: '#3B87F5',
              border: 'solid'
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(70, 66, 255,0.80)'
                }, {
                  offset: 1,
                  color: 'rgba(00, 198, 255,0.3)'
                }])
              }
            },
            smooth: true
          }]
        }
        var series = []
        var seriesArr = this.chartData.valueArr;
        seriesArr.forEach(function (value, index) {
          var seriesItem = {
            name: value.name,
            type: 'line',
            symbolSize: 8,
            animation: true,
            data: value.value,
            emphasis: {
              itemStyle: {
                color: param => {
                  // //this.zc_log(12432536)
                  return "#f0ff0fl"
                }
              }
            },
            areaStyle: {
              color: emphasisColor[index],
              opacity: !isArea ? 0 : 1
            },
            smooth: !isArea
          }
          series.push(seriesItem)
        })
        return series
      },

      //折线图参数
      setupOptions() {
        var thiz = this
        if (this.options.isArea) {
          var a = {
            grid: {
              left: '7%',
              right: '7%',
              top: '50',
              bottom: '50',
            },
            xAxis: {
              show: true,
              type: 'category',
              boundaryGap: false,
              data: this.areaData.categoryArr,
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
                show: true,
                color: "#a3a3a3",
                margin: 10
              }
            },
            tooltip: {
              trigger: 'axis',
              formatter: (params) => {
                var days = params[0].name;
                var week = thiz.getWeek(days)
                if (typeof week != 'string') {
                  week = ""
                }
                return params[0].name + " " + week + "<br>" + params[0].marker + "作品数：" + thiz.handleNum(params[0].value)
              },
              backgroundColor: 'rgba(255,255,255,0.5)',
              textStyle: {
                color: '#444'
              },
              extraCssText: 'box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);padding:10px'
            },
            yAxis: {
              show: true,
              axisLine: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {color: '#a3a3a3', type: 'dashed'}
              },
              axisTick: {
                "show": false
              },
              axisLabel: {
                show: true,
                color: "#a3a3a3",
                margin: 10
              },
              type: 'value'
            },
            series: this.setupSeries(),
          };
          // //this.zc_log(a)
          return a
        }
        return {
          legend: {
            icon: 'circle',
            top: '10',
            right: '100',
            textStyle: {color: '#444'},
            tooltip: {show: false},
            selectedMode: 'multiple'
          },
          grid: {
            left: '7%',
            right: '7%',
            top: '50',
            bottom: '50',
          },
          xAxis: {
            show: !this.options.isArea,
            axisLine: {
              lineStyle: {color: '#afafaf'}
            },
            axisTick: {
              show: false
            },
            boundaryGap: false,
            axisLabel: {
              show: true,
              color: "#a3a3a3",
              margin: 10
            },
            data: this.chartData.categoryArr.length ? this.chartData.categoryArr : this.setupXAxis()
          },
          yAxis: {
            show: true,
            axisLine: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {color: '#a3a3a3', type: 'dashed'}
            },
            axisTick: {
              "show": false
            },
            axisLabel: {
              show: true,
              color: "#a3a3a3",

            },
            type: 'value'
          },
          color: ['#3B87F5', '#00c6ff', '#46dd31', '#ffd541', '#ff9241', '#fb5959'],
          tooltip: {
            trigger: 'axis',
            confine: true,
            backgroundColor: 'rgba(255,255,255,0.8)',
            textStyle: {color: '#444'},
            extraCssText: 'box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);padding:10px',
            formatter: (params) => {
              // this.zc_log(params)
              var days = params[0].name;
              var week = ""
              week = thiz.getWeek(days)
              if (typeof week != 'string') {
                week = ""
              }
              var formatter = days + " " + week + "<br/>"
              params.forEach(function (value, index, array) {
                formatter = formatter + value.marker + value.seriesName + ": " + thiz.handleNum(value.value)
                if (index < array.length - 1) {
                  formatter += "<br/>"
                }
              });
              return formatter
            },
          },
          series: this.setupSeries(),
        }
      },
      //将数据 处理成根据数量级分组的数据
      checkDataOrderOfMagnitudes() {
        if (!this.chartData) {
          return
        }
        var dataArray = this.chartData.valueArr;
        var magnitudesArray = [];
        var maxLevel = 0
        //计算每组数据的数量级（先计算平均数 小于平均数一个数量级的数据 删除掉再次重新计算）
        for (var i = 0; i < dataArray.length; i++) {
          var array = dataArray[i].value.concat()
          var menu = 0
          var level = 0
          //计算平均数
          while (1) {
            var sum = 0;
            for (var j = 0; j < array.length; j++) {
              sum += array[j]
            }
            menu = sum / array.length
            //删除比平均数小一个量级的数据
            var index = []
            for (var j = 0; j < array.length; j++) {
              if (menu / array[j] > 10) {
                index.push(j)
              }
            }
            if (index.length == 0) {
              break
            } else {
              for (var j = index.length - 1; j >= 0; j--) {
                array.splice(index[j], 1)
              }
            }
          }
          //计算level
          while (menu > 1) {
            menu = menu / 10000
            level++
          }
          maxLevel = maxLevel < level ? level : maxLevel
          magnitudesArray.push({name: dataArray[i].name, level: level})
        }
        var levelArray = []
        //根据数量及分组 一个数量级一组
        while (maxLevel > -1) {
          var sameLevelData = []
          for (var i = 0; i < magnitudesArray.length; i++) {
            if (magnitudesArray[i].level == maxLevel) {
              sameLevelData.push(magnitudesArray[i])
            }
          }
          if (sameLevelData.length != 0) {
            levelArray.push(sameLevelData)
          }
          maxLevel--
        }
        this.levelArray = levelArray;
        if (this.levelArray.length > 1) {
          this.levelIndex = 0
          this.startCirculationShow()
        }
      },
      startCirculationShow() {
        // //this.zc_log(this.levelIndex)
        var levelIndex = this.levelArray.length - (this.levelIndex % this.levelArray.length) - 1;
        for (var i = 0; i < this.levelArray.length; i++) {
          var levelDataArray = this.levelArray[i]
          for (var j = 0; j < levelDataArray.length; j++) {
            if (i == levelIndex) {
              this.eChartsObj.dispatchAction({
                type: 'legendSelect',
                name: levelDataArray[j].name
              })
            } else {
              this.eChartsObj.dispatchAction({
                type: 'legendUnSelect',
                name: levelDataArray[j].name
              })
            }
          }
        }
        this.levelIndex++
        var thiz = this;
        this.setTimeCode = setTimeout(function () {
          thiz.startCirculationShow()
        }, 5 * 1000)
      },
      stopLoopShow() {
        if (this.setTimeCode != -1) {
          for (var i = 0; i < this.levelArray.length; i++) {
            var levelDataArray = this.levelArray[i]
            for (var j = 0; j < levelDataArray.length; j++) {
              this.eChartsObj.dispatchAction({
                type: 'legendSelect',
                name: levelDataArray[j].name
              })
            }
          }
          clearTimeout(this.setTimeCode)
          this.setTimeCode = -1
        }
      }
    },
    mounted() {
      this.$refs.lineChart.style.height = this.height + 'px';
      //创建折线图控件
      var lineChart = echarts.init(document.getElementById(this.idName));
      //折线图渲染
      if (this.options.isArea && this.areaData.valueArr.length !== 0 || !this.options.isArea) {
        lineChart.setOption(this.setupOptions());
      }
      window.addEventListener("resize", function () {
        lineChart.resize();
      });
      this.eChartsObj = lineChart;
      this.checkDataOrderOfMagnitudes()
      var thiz = this
      lineChart.on('legendselectchanged', function (params) {
        for (var i = 0; i < thiz.chartData.valueArr.length; i++) {
          var selected = params.selected[thiz.chartData.valueArr[i].name];
          if (selected) {
            thiz.lastSelected = params.selected
            return
          }
        }
        for (var i = 0; i < thiz.chartData.valueArr.length; i++) {
          var selected = thiz.lastSelected[thiz.chartData.valueArr[i].name];
          if (selected) {
            thiz.eChartsObj.dispatchAction({
              type: 'legendSelect',
              name: thiz.chartData.valueArr[i].name
            })
            break
          }
        }
        thiz.$message({
          duration: 1500,
          message: "至少选择一个图例"
        });
      })
    },
  }
</script>

