<template>
  <div class="timeLine" id="timeLine" ref="timeLine">
    <!--自定义图例-->
    <div class="timeLine_legend clearfix" v-if="legendData.length">
      <div class="legend_item" v-for="item in legendData">
    <span class="legend_mark"
          :style="{backgroundColor:item.itemStyle.color,borderColor:item.itemStyle.borderColor?item.itemStyle.borderColor:item.itemStyle.color}"></span>
        <span>{{item.name}}</span>
      </div>
    </div>

    <!--时间线图主体-->
    <div class="timeLine_content">
      <div class="timeLine_chart"
           id="timeLinechart"
           ref="timeLine_chart"
           @mousedown="mouseDown($event)"></div>
    </div>


  </div>
</template>

<script>
  import echarts from 'echarts'

  let baseWidth = 100, multiple = 0.8;
  let baseHeight = 50 * multiple;
  let baseMargin = 50;
  export default {
    name: "z-c-time-line",
    props: {
      data: {type: Array / Object, require: false},
      options: {type: Object, require: false}
    },
    data() {
      return {
        /*图标对象*/
        eChartsObj: null,
        selectedDataIndex: null,
        /*颜色库*/
        colorLibrary: [
          {backgroundColor: '#C23531', name: '网站', code: 1}, /*网站*/
          {backgroundColor: '#6BC231', name: '微信', code: 2}, /*微信*/
          {backgroundColor: '#C29131', name: '微博', code: 3}, /*微博*/
          {backgroundColor: '#31C2BA', name: 'APP', code: 4}, /*APP*/
          {backgroundColor: '#787878', name: '其他', code: 5}, /*其他*/
        ],
        /*自定义图例数据*/
        legendData: [],


        /*X轴刻度数据*/
        XAxisData: [],
        /*x轴每个格子表示的时间长度*/
        eachInterval: 0,

        /*Y轴刻度数据*/
        YAxisData: [],
        /*Y轴最大数量*/
        maxYAxisData: 0,

        /*关系图节点间的关系数据*/
        graphLinksData: [],
        /*节点分类的类目数据*/
        graphCategoryData: [],
        /*关系图数据*/
        graphData: [],

        /*线图数据*/
        linesData: [],

        /*测试数据*/
        testData: {},


      }
    },
    watch: {
      data(val, oldVal) {
        this.eChartsObj.setOption(this.setupOptions());
      },
    },
    methods: {

      /**********************线图逻辑处理********************************/

      // 线图连线信息
      setupLinesData() {

        let thiz = this;
        let result = [];
        let links = this.graphLinksData;

        links.forEach(function (item, index) {
          let source = item.source, target = item.target;
          let start = null, end = null;
          thiz.testData.categories.forEach(function (data) {
            if (data.name === source) {
              start = [data.valueX + baseWidth * multiple / 2, data.valueY];
            }
            if (data.name === target) {
              end = [data.valueX - baseWidth * multiple / 2, data.valueY];
            }
          });


          if (start && end) {
            result.push({name: source + target, coords: [start, end]});
          }

        });

        this.linesData = result;
        return result;

      },

      /**********************关系图逻辑处理********************************/
      /*获取X轴时间范围长度*/
      getXAxisRange() {

        // 计算最早时间和最晚时间
        let categories = this.testData.categories;
        let min = null, max = null;
        //遍历出当前最大值和最小值
        categories.forEach(function (item, index) {
          let time = item.time;
          if (index === 0) {
            min = time;
            max = time;
          }
          //记录当前最大值
          max = time > max ? time : max;
          //记录当前最小值
          min = time < min ? time : min;
        });

        //根据最大最小,计算当前时间跨度
        let totalIntervals = max - min;
        let totalHours = totalIntervals / 3600 + 1;
        let eachInterval = 0;


        /*24小时以内1格1小时 24-48小时内1格2小时 48到72小时内1格4小时 72到120小时内1格6小时 120小时以上1格12小时*/
        if (totalHours <= 24) {
          eachInterval = 3600;
        } else if (totalHours > 24 && totalHours <= 48) {
          eachInterval = 3600 * 2;
        } else if (totalHours > 48 && totalHours <= 72) {
          eachInterval = 3600 * 4;
        } else if (totalHours > 72 && totalHours <= 120) {
          eachInterval = 3600 * 6;
        } else {
          eachInterval = 3600 * 12;
        }

        //记录当前当个格子表示的时间长度
        this.eachInterval = eachInterval;

        //对当前时间跨度按照当个时间长度进行分组
        let XAxisData = [];
        for (let i = 0; i < totalIntervals / eachInterval + 1; i++) {
          XAxisData.push(min + eachInterval * i);
        }

        //记录当前x轴数据
        this.XAxisData = XAxisData;

        return XAxisData
      },

      /*获取Y轴数据*/
      getYAxisRange() {

        let thiz = this;
        let YAxisData = [];

        //为y轴数据建立组的层次,即横轴多少就分多少组
        this.XAxisData.forEach(function () {
          YAxisData.push([]);
        });

        //通过遍历,对每一个数据进行分组放置
        this.testData.categories.forEach(function (item, index) {
          thiz.XAxisData.forEach(function (xItem, xIndex) {
            if (item.time - xItem >= 0 && item.time - xItem <= thiz.eachInterval) {
              YAxisData[xIndex].push(item);
            }
          })
        });

        //当前y轴里,组内数据最多的数量
        let maxYAxisData = 0;
        YAxisData.forEach(function (item) {
          maxYAxisData = item.length > maxYAxisData ? item.length : maxYAxisData;
        });

        //记录y轴分组数据结果
        this.YAxisData = YAxisData;
        //记录当前y轴最高点组的length
        this.maxYAxisData = maxYAxisData;

        return YAxisData;
      },

      /*监听鼠标拖动*/
      mouseDown(event) {

        let thiz = this;
        let timeLinechart = document.getElementById('timeLinechart');

        let disX = event.clientX - timeLinechart.offsetLeft;
        let disY = event.clientY - timeLinechart.offsetTop;

        document.onmousemove = function (event) {
          let l = event.clientX - disX;
          let t = event.clientY - disY;

          if (l < 0 && l >= -timeLinechart.offsetWidth + timeLinechart.parentElement.offsetWidth) {
            timeLinechart.style.left = l + 'px';
          }
          if (t < 0 && t >= -timeLinechart.offsetHeight + timeLinechart.parentElement.offsetHeight) {
            timeLinechart.style.top = t + 'px';
          }
        };

        document.onmouseup = function () {
          document.onmousemove = null;
          document.onmouseup = null;
        };
        return false;//兼容firefox
      },


      /************************关系图参数配置********************/
      /*节点间的关系数据*/
      setupGraphLinks() {
        let result = [];

        this.testData.links.forEach(function (item, index) {
          if (item.source.length && item.target.length && item.source !== item.target) {
            result.push({source: item.source, target: item.target})
          }
        });
        this.graphLinksData = result;
        return result;
      },


      /*关系图的节点数据列表*/
      setupGraphData() {

        let thiz = this;

        let result = [];
        this.testData.categories.forEach(function (item, index) {
          let x = null, y = null;
          for (let i = 0; i < thiz.XAxisData.length; i++) {
            let XAxis = thiz.XAxisData[i];
          }


          //计算当前数据所属x轴的坐标index
          let valueX = null;
          thiz.XAxisData.forEach(function (xitem, xindex) {

            let date = new Date(item.time * 1000),
              M = date.getMonth() + 1,
              D = date.getDate(),
              h = date.getHours(),
              m = date.getMinutes();
            /*显示样式 例如:08-20 12*/
            let aaa = M + '-' + D + ' ' + (h < 10 ? ('0' + h) : h) + ':' + (m < 10 ? ('0' + m) : m);

            if (item.time - xitem >= 0 && item.time - xitem <= thiz.eachInterval) {
              valueX = xindex;
              /*记录当前的x的index*/
              item.valueX = valueX * baseWidth + baseWidth / 2;
              /*记录当前的x坐标*/
            }
          });


          //计算当前数据所属y轴的坐标index
          let valueY = null;
          thiz.YAxisData.forEach(function (yItem, yIndex) {
            yItem.forEach(function (data, dataIndex) {
              if (item.name === data.name && item.id === data.id) {
                valueY = dataIndex;
                /*记录当前的y的index*/
                item.valueY = valueY * baseHeight + baseHeight / 2;
                /*记录当前的y坐标*/
              }
            })
          });

          //重新生成data数据

          let dataItem = {
            name: item.name,
            showName: item.id,
            category: item.category,
            value: [valueX * baseWidth + baseWidth / 2, valueY * baseHeight + baseHeight / 2],
            transTime: item.time
          };

          if (item.isTenant) {
            dataItem.itemStyle = {
              color: '#fff',
              borderColor: '#000',
              borderWidth: 1
            };
            dataItem.label = {
              color: '#000'
            }
          }
          result.push(dataItem);

        });

        this.graphData = result;
        return result;
      },


      /*节点分类的类目*/
      setupGraphCategory() {

        let thiz = this;
        let categoryArr = [];

        this.testData.categories.forEach(function (item) {
          /*判断是否包含该项*/
          if (categoryArr.indexOf(item.category) < 0) {
            categoryArr.push(item.category)
          }
        });


        let result = [];
        categoryArr.forEach(function (category) {

          thiz.colorLibrary.forEach(function (colorItem) {

            if (colorItem.name === category) {
              result.push({
                name: colorItem.name,
                label: colorItem.name,
                itemStyle: {color: colorItem.backgroundColor}
              })
            }
          })
        });

        //增加当前"租户"样式
        result.push({
          name: '租户',
          label: '租户',
          itemStyle: {color: '#fff', borderColor: '#000'}
        });

        /*记录图例数据*/
        this.legendData = result;

        this.graphCategoryData = result;
        return result;
      },


      /*系列列表*/
      setupSeries() {
        return [
          {
            type: 'graph',
            coordinateSystem: 'cartesian2d', /*该系列使用的坐标系*/
            hoverAnimation: false,
            layout: 'none', /*采用x y 确定位置*/
            draggable: false, /*节点是否可拖拽*/
            focusNodeAdjacency: false, /*高亮突出节点及邻节点*/
            symbol: 'path://M0,18.5 L0,18.5 L0,18.5 C-1.25125444e-15,8.28273213 8.28273213,1.87688166e-15 18.5,0 L80.5,0 L80.5,-1.77635684e-14 C90.7172679,-1.96404501e-14 99,8.28273213 99,18.5 L99,18.5 L99,18.5 C99,28.7172679 90.7172679,37 80.5,37 L18.5,37 L18.5,37 C8.28273213,37 1.25125444e-15,28.7172679 0,18.5 Z',
            symbolSize: [baseWidth * multiple, baseWidth * multiple],
            symbolKeepAspect: true,//保持该图形的长宽比
            edgeSymbol: ['none', 'none'], /*边两端的标记类型*/
            edgeSymbolSize: 10, /*边两端的标记大小*/
            itemStyle: {
              color: "#2d8cf0",
              borderWidth: 0
            },
            lineStyle: {
              color: '#999',
              width: 0,
              curveness: 0.1
            },
            label: {
              show: true,
              color: '#fff',
              position: 'inside',
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontSize: 10,
              verticalAlign: 'middle',
              align: 'center',
              formatter(params) {
                let name = params.data.showName;

                if (name.length > 6) {
                  name = params.data.showName.substr(0, 6) + '...'
                }

                let date = new Date(params.data.transTime * 1000),
                  M = date.getMonth() + 1,
                  D = date.getDate(),
                  h = date.getHours(),
                  m = date.getMinutes();
                /*显示样式 例如:08-20 12*/
                let time = M + '-' + D + ' ' + (h < 10 ? ('0' + h) : h) + ':' + (m < 10 ? ('0' + m) : m);

                return name + '\n' + time
              }
            },
            categories: this.graphCategoryData, /*节点分类的类目*/
            data: this.graphData, /*关系图的节点数据列表*/
            links: this.graphLinksData, /*节点间的关系数据*/
            top: baseMargin,
            left: baseMargin,
            right: baseMargin,
            bottom: baseMargin,
            animation: false
          },
          {
            type: 'lines',
            coordinateSystem: 'cartesian2d',
            symbol: ['none', 'arrow'],
            lineStyle: {
              color: '#999',
              width: 1,
              curveness: 0.1
            },
            data: this.linesData,
          }
        ]
      },


      /*设置配置项*/
      setupOptions() {
        return {
          //背景颜色
          backgroundColor: '#f2f2f2',
          //图例参数
          legend: {
            show: false,
            left: baseMargin,
            top: baseMargin / 2,
            align: 'left'
          },
          //直角坐标系网格
          grid: {
            show: false,
            top: baseMargin,
            left: baseMargin * 2,
            right: baseMargin * 2,
            bottom: baseMargin,
          },
          //直角坐标系X轴
          xAxis: [
            //数值x轴
            {
              show: false,
              type: 'value',
              //最小间隔大小
              minInterval: 1,
              //强制分割间隙
              interval: baseWidth,
              min: 0,
              max: baseWidth * (this.XAxisData.length - 1),
              scale: false,
              axisLabel: {
                show: true,
                color: '#ff0000'
              },
              axisTick: {
                alignWithLabel: true,
                lineStyle: {
                  color: '#ff0000'
                }
              }
            },
            //类别x轴
            {
              show: true,
              type: 'category',
              position: 'bottom',
              boundaryGap: false,
              //强制设置间隔大小
              interval: baseWidth,
              //坐标轴的分割段数
              splitNumber: this.XAxisData.length,
              data: this.getXAxisRange(),
              axisLabel: {
                formatter(value, index) {
                  let date = new Date(value * 1000),
                    M = date.getMonth() + 1,
                    D = date.getDate(),
                    h = date.getHours();
                  /*显示样式 例如:08-20 12*/
                  return M + '-' + D + ' ' + (h < 10 ? ('0' + h) : h);
                }
              }
            }
          ],
          //直角坐标系Y轴
          yAxis: {
            show: false,
            type: 'value',
            interval: baseHeight,
            min: 0,
            max: baseHeight * this.maxYAxisData,
            scale: false,
          },

          //系列列表数组
          series: this.setupSeries(),

        }
      },

      /************************其他********************/


    },
    mounted() {

      let line = document.getElementById('timeLinechart');

      line.style.width = this.XAxisData.length * baseWidth + 2 * baseMargin + 'px';
      line.style.height = this.maxYAxisData * baseHeight + 2 * baseMargin + 'px';

      line.style.left = 0;
      line.style.bottom = 0;

      //创建折线图控件
      let graphChart = echarts.init(line);

      //折线图渲染
      graphChart.setOption(this.setupOptions());


      let thiz = this;
      graphChart.on('click', function (params) {

        if (params.dataType !== 'node') {
          return;
        }

        if (params.dataIndex && params.dataIndex !== thiz.selectedDataIndex) {
          thiz.selectedDataIndex = params.dataIndex;
          graphChart.dispatchAction({
            type: 'focusNodeAdjacency',
            dataIndex: params.dataIndex
          })
        } else {
          graphChart.dispatchAction({
            type: 'unfocusNodeAdjacency',
          });
          thiz.selectedDataIndex = null;
        }
      });


      this.eChartsObj = graphChart;
      window.addEventListener("resize", function () {
        graphChart.resize();
      });


    },
    created() {

      // this.testData = {
      //   links: [
      //     {
      //       "source": "凤凰新闻",
      //       "target": "绥江警方"
      //     },
      //     {
      //       "source": "凤凰新闻",
      //       "target": "彩虹映天山"
      //     },
      //     {
      //       "source": "凤凰新闻",
      //       "target": "大河网"
      //     },
      //   ],
      //
      //   categories: [
      //     {
      //       "name":"中国阳泉",
      //       "id":"中国阳泉",
      //       "time":1534429717,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"最高人民检察院",
      //       "id":"最高人民检察院",
      //       "time":1534915344,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"观察者网",
      //       "id":"观察者网",
      //       "time":1534331590,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"文汇报",
      //       "id":"文汇报",
      //       "time":1534331274,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"网易-首页-新闻（要闻）",
      //       "id":"网易-首页-新闻（要闻）",
      //       "time":1534323221,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"中国访谈网",
      //       "id":"中国访谈网",
      //       "time":1534323824,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"淮电微风",
      //       "id":"淮电微风",
      //       "time":1534514699,
      //       "category":"微信"
      //     },
      //     {
      //       "name":"延安干部培训学院",
      //       "id":"延安干部培训学院",
      //       "time":1534932078,
      //       "category":"微信"
      //     },
      //     {
      //       "name":"南报网",
      //       "id":"南报网",
      //       "time":1534322520,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"中国农业发展银行",
      //       "id":"中国农业发展银行",
      //       "time":1534350541,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"凤凰新闻",
      //       "id":"凤凰新闻",
      //       "time":1534322880,
      //       "category":"APP"
      //     },
      //     {
      //       "name":"无锡新传媒",
      //       "id":"无锡新传媒",
      //       "time":1534335288,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"新华报业网",
      //       "id":"新华报业网",
      //       "time":1534326672,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"光明网",
      //       "id":"光明网",
      //       "time":1534323120,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"珠海市卫计局党建之声",
      //       "id":"珠海市卫计局党建之声",
      //       "time":1534409917,
      //       "category":"微信"
      //     },
      //     {
      //       "name":"阿拉尔富丽达零距离",
      //       "id":"阿拉尔富丽达零距离",
      //       "time":1534646287,
      //       "category":"微信"
      //     },
      //     {
      //       "name":"中国日报网",
      //       "id":"中国日报网",
      //       "time":1534324298,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"大河网",
      //       "id":"大河网",
      //       "time":1534520419,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"央广网",
      //       "id":"央广网",
      //       "time":1534326180,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"扬子晚报网",
      //       "id":"扬子晚报网",
      //       "time":1534326675,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"南通网",
      //       "id":"南通网",
      //       "time":1534325970,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"红山网",
      //       "id":"红山网",
      //       "time":1534262400,
      //       "category":"网站"
      //     },
      //     {
      //       "isTenant":true,
      //       "name":"inews",
      //       "id":"inews",
      //       "time":1534322640,
      //       "category":"其他"
      //     },
      //     {
      //       "name":"吉林电视网",
      //       "id":"吉林电视网",
      //       "time":1534324095,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"上观新闻",
      //       "id":"上观新闻",
      //       "time":1534323660,
      //       "category":"APP"
      //     },
      //     {
      //       "name":"京报网",
      //       "id":"京报网",
      //       "time":1534322847,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"北方网",
      //       "id":"北方网",
      //       "time":1534326670,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"老友网",
      //       "id":"老友网",
      //       "time":1534325233,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"广佛都市网",
      //       "id":"广佛都市网",
      //       "time":1534323420,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"山东省海阳市党建网",
      //       "id":"山东省海阳市党建网",
      //       "time":1534262400,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"中国唐尧网",
      //       "id":"中国唐尧网",
      //       "time":1534576620,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"北方网新闻频道",
      //       "id":"北方网新闻频道",
      //       "time":1534436494,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"德宏州纪委州监委网站",
      //       "id":"德宏州纪委州监委网站",
      //       "time":1534383427,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"中国网头条",
      //       "id":"中国网头条",
      //       "time":1534323684,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"内蒙古电视台",
      //       "id":"内蒙古电视台",
      //       "time":1534262400,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"环球网头条",
      //       "id":"环球网头条",
      //       "time":1534322520,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"搜狐头条",
      //       "id":"搜狐头条",
      //       "time":1534323060,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"青海网络广播电视台",
      //       "id":"青海网络广播电视台",
      //       "time":1534262400,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"红网",
      //       "id":"红网",
      //       "time":1534326670,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"泰山热力",
      //       "id":"泰山热力",
      //       "time":1534410420,
      //       "category":"微信"
      //     },
      //     {
      //       "name":"新浪新闻",
      //       "id":"新浪新闻",
      //       "time":1534341739,
      //       "category":"APP"
      //     },
      //     {
      //       "name":"中国山东网",
      //       "id":"中国山东网",
      //       "time":1534324317,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"海口晚报网",
      //       "id":"海口晚报网",
      //       "time":1534322591,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"临溟旗帜",
      //       "id":"临溟旗帜",
      //       "time":1534310550,
      //       "category":"微信"
      //     },
      //     {
      //       "name":"盈江县纪委县监委网站",
      //       "id":"盈江县纪委县监委网站",
      //       "time":1534422852,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"华龙网",
      //       "id":"华龙网",
      //       "time":1534262400,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"中国抚州网",
      //       "id":"中国抚州网",
      //       "time":1534322700,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"中国西藏网",
      //       "id":"中国西藏网",
      //       "time":1534322400,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"彩虹映天山",
      //       "id":"彩虹映天山",
      //       "time":1534418370,
      //       "category":"微信"
      //     },
      //     {
      //       "name":"今日湖北网",
      //       "id":"今日湖北网",
      //       "time":1534325049,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"平凉市公安局",
      //       "id":"平凉市公安局",
      //       "time":1534325943,
      //       "category":"微信"
      //     },
      //     {
      //       "name":"科尔沁左翼后旗人民政府",
      //       "id":"科尔沁左翼后旗人民政府",
      //       "time":1534262400,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"凤凰网",
      //       "id":"凤凰网",
      //       "time":1534322927,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"澎湃",
      //       "id":"澎湃",
      //       "time":1534324380,
      //       "category":"网站"
      //     },
      //     {
      //       "name":"双柏警方",
      //       "id":"双柏警方",
      //       "time":1534412846,
      //       "category":"微信"
      //     },
      //     {
      //       "name":"绥江警方",
      //       "id":"绥江警方",
      //       "time":1534412117,
      //       "category":"微信"
      //     },
      //     {
      //       "name":"山西共青团",
      //       "id":"山西共青团",
      //       "time":1534387451,
      //       "category":"网站"
      //     }
      //   ],
      // };

      this.testData = this.data;

      this.getXAxisRange();
      this.getYAxisRange();
      this.setupGraphLinks();
      this.setupGraphCategory();
      this.setupGraphData();
      this.setupLinesData();

    }
  }

</script>

<style scoped>

  /*自定义图例*/
  .timeLine_legend {
    background-color: #f2f2f2;
    color: #666;
    font-size: 17px;
    padding: 0 20px;
  }

  .legend_item {
    float: left;
    line-height: 50px;
    margin-right: 10px;
  }

  .legend_item .legend_mark {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 5px;
    font-size: 0;
    border-width: 1px;
    border-style: solid;
  }

  /*路径时间线图*/
  .timeLine_content {
    position: relative;
    padding-bottom: calc(100% * 6 / 16);
    background-color: #f2f2f2;
    overflow: hidden;
  }

  .timeLine_chart {
    position: absolute;
    height: 100%;
  }
</style>
