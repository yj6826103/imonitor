<template>

  <div>
    <div class="legend" v-if="legendData.length">
      <div class="legend_item" v-for="item in legendData">
        <span :style="'background-color:'+item.itemStyle.color">
        </span>{{item.name}}
      </div>
    </div>

    <div id="graphCharts" ref="graphCharts" style="background-color: #f2f2f2;"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: "z-c-graph-charts",
    props: {
      chartData: {type: Object, require: true},
      height: {type: Number / String, require: true},
    },
    data(){
      return{
        eChartsObj: null,
        legendData:[]
      }
    },
    watch: {
      chartData(val, oldVal) {
        this.eChartsObj.setOption(this.setupOptions());
      },
    },
    methods: {

      setupOptions() {

        return {
          backgroundColor: '#f2f2f2',
          // animationDuration: 2000,
          // animationEasingUpdate: 'circularInOut',
          //设置提示框属性
          tooltip: {
            show: false,
            position:function (point) {
              return[point[0]+20,point[1]-10]
            }},
          //设置图例组件属性
          legend: {
            show: false,
            top: "20",
            left: '30',
            orient: 'horizontal',
            icon:'circle',
            textStyle:{
              color:'#666',
              fontSize:17,
            }
          },
          legendHoverLink: true,
          hoverAnimation: true,
          //系列列表数组
          series: this.setupSeries(),
        }
      },

      //系列列表
      setupSeries() {
        return [{
          name: '传播路径',
          type: 'graph',
          layout: 'force',
          top:'60',
          force: {
            initLayout: 'circular',
            repulsion: 400,
            gravity: 0.3,
            edgeLength: 100,
            layoutAnimation: true,
          },
          //提示框属性
          tooltip: {
            show: false,
            showContent: false,
            formatter: function (params) {
              if (params.dataType == "node") {
                return params.name;
              }
            },
            backgroundColor: '#fff',
            textStyle: {color: '#000000'},
            confine: true,
            extraCssText: 'box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.1);'
          },
          //关系节点两端标记为箭头
          edgeSymbol: ['none', 'arrow'],
          //全局设置文字属性
          label: {color: '#666', position: 'right', show: true, fontStyle: 'oblique'},
          //全局设置是否可拖动
          draggable: true,
          hoverAnimation:true,
          roam : 'move',
          nodeScaleRatio : 0.5,
          //全局设置连接线属性
          lineStyle: {type: 'solid', color: '#979797',width:2, opacity: 1, curveness: 0.2},
          //
          // itemStyle:{shadowColor:'rgba(0,0,0,0.5)',shadowBlur:10,shadowOffsetX:0,shadowOffsetY:0},
          //高亮图形样式
          emphasis: {label: {show: true,position:'right',color:'#979797'}},
          //高亮是否显示节点关系
          focusNodeAdjacency: true,
          legendHoverLink:true,
          categories: this.setupCategories(),
          data: this.setupData(),
          links: this.setupLinks(),
        }];
      },

      //节点分类的类目
      setupCategories() {
        this.legendData = this.chartData.array01;
        return this.chartData.array01;
        // return [
        //   {name: '苏州台发布', itemStyle: {color: '#9DACF7'}},
        //   {name: '爆发点', itemStyle: {color: '#E8645F'}},
        //   {name: '传播点', itemStyle: {color: '#59C3F9'}},
        // ];
      },

      //关系图的节点数据列表
      setupData() {
        // var labelSize = 70;

        return this.chartData.array03;
        // return [
        //   {
        //     name: '苏州电视台',
        //     category: '苏州台发布',
        //     symbol: 'diamond',
        //     symbolSize: labelSize,
        //     label: {show: true},
        //     tooltip: {show: false}
        //   },
        //   {
        //     name: '华西都市报',
        //     category: '爆发点',
        //     symbol: 'circle',
        //     symbolSize: labelSize,
        //     label: {show: true},
        //     tooltip: {show: false}
        //   },
        //   {name: '苏1', category: '传播点'},
        //   {name: '苏2', category: '传播点'},
        //   {name: '苏3', category: '传播点'},
        //   {name: '苏4', category: '传播点'},
        //   {name: '苏5', category: '传播点'},
        //   {name: '苏6', category: '传播点'},
        //   {name: '苏7', category: '传播点'},
        //   {name: '华1', category: '传播点'},
        //   {name: '华2', category: '传播点'},
        //   {name: '华3', category: '传播点'},
        //   {name: '华4', category: '传播点'},
        //   {name: '华5', category: '传播点'},
        //   {name: '华6', category: '传播点'},
        //   {name: '华7', category: '传播点'},
        //   {name: '华8', category: '传播点'},
        //   {name: '华9', category: '传播点'},
        //   {name: '精品购物指南', category: '爆发点', symbolSize: labelSize, label: {show: true}, tooltip: {show: false}},
        //   {name: '精1', category: '传播点'},
        //   {name: '精2', category: '传播点'},
        //   {name: '精3', category: '传播点'},
        //   {name: '精4', category: '传播点'},
        //   {name: '上海证券报', category: '爆发点', symbolSize: labelSize, label: {show: true}, tooltip: {show: false}},
        //   {name: '上1', category: '传播点'},
        //   {name: '上2', category: '传播点'},
        //   {name: '上3', category: '传播点'},
        //   {name: '上4', category: '传播点'},
        //   {name: '上5', category: '传播点'},
        //   {name: '上6', category: '传播点'},
        //   {name: '上7', category: '传播点'},
        //   {name: '上8', category: '传播点'},
        //   {name: '上9', category: '传播点'},
        //   {name: '上10', category: '传播点'},
        //   {name: '上11', category: '传播点'},
        //   {name: '上12', category: '传播点'},
        //   {name: '网易', category: '爆发点', symbolSize: labelSize, label: {show: true}, tooltip: {show: false}},
        //   {name: '网1', category: '传播点'},
        //   {name: '网2', category: '传播点'},
        //   {name: '网3', category: '传播点'},
        //   {name: '网4', category: '传播点'},
        //   {name: '网5', category: '传播点'},
        //   {name: '网6', category: '传播点'},
        //   {name: '网7', category: '传播点'},
        //   {name: '网8', category: '传播点'},
        //   {name: '中国新闻出版广电报', category: '爆发点', symbolSize: labelSize, label: {show: true}, tooltip: {show: false}},
        //   {name: '中1', category: '传播点'},
        //   {name: '中2', category: '传播点'},
        //   {name: '中3', category: '传播点'},
        //   {name: '中4', category: '传播点'},
        //   {name: '中5', category: '传播点'},
        //   {name: '中6', category: '传播点'},
        //   {name: '中7', category: '传播点'},
        //   {name: '中8', category: '传播点'},
        // ]
      },

      //节点间的关系数据
      setupLinks() {
        return this.chartData.array02;
        // return [
        //   {source: '苏州电视台', target: '苏1',},
        //   {source: '苏州电视台', target: '苏2',},
        //   {source: '苏州电视台', target: '苏3'},
        //   {source: '苏州电视台', target: '苏4'},
        //   {source: '苏州电视台', target: '苏5'},
        //   {source: '苏州电视台', target: '苏6'},
        //   {source: '苏州电视台', target: '苏7'},
        //   {source: '苏州电视台', target: '华西都市报'},
        //   {source: '华西都市报', target: '华1'},
        //   {source: '华西都市报', target: '华2'},
        //   {source: '华西都市报', target: '华3'},
        //   {source: '华西都市报', target: '华4'},
        //   {source: '华西都市报', target: '华5'},
        //   {source: '华西都市报', target: '华6'},
        //   {source: '华西都市报', target: '华7'},
        //   {source: '华西都市报', target: '华8'},
        //   {source: '华西都市报', target: '华9'},
        //   {source: '华西都市报', target: '华9'},
        //   {source: '苏2', target: '精品购物指南'},
        //   {source: '精品购物指南', target: '精1'},
        //   {source: '精品购物指南', target: '精2'},
        //   {source: '精品购物指南', target: '精3'},
        //   {source: '精品购物指南', target: '精4'},
        //   {source: '精品购物指南', target: '上海证券报'},
        //   {source: '上海证券报', target: '上1'},
        //   {source: '上海证券报', target: '上2'},
        //   {source: '上海证券报', target: '上3'},
        //   {source: '上海证券报', target: '上4'},
        //   {source: '上海证券报', target: '上5'},
        //   {source: '上海证券报', target: '上6'},
        //   {source: '上海证券报', target: '上7'},
        //   {source: '上海证券报', target: '上8'},
        //   {source: '上海证券报', target: '上9'},
        //   {source: '上海证券报', target: '上10'},
        //   {source: '上海证券报', target: '上11'},
        //   {source: '上海证券报', target: '上12'},
        //   {source: '上海证券报', target: '网易'},
        //   {source: '上海证券报', target: '中国新闻出版广电报'},
        //   {source: '网易', target: '网1'},
        //   {source: '网易', target: '网2'},
        //   {source: '网易', target: '网3'},
        //   {source: '网易', target: '网4'},
        //   {source: '网易', target: '网5'},
        //   {source: '网易', target: '网6'},
        //   {source: '网易', target: '网7'},
        //   {source: '网易', target: '网8'},
        //   {source: '中国新闻出版广电报', target: '中1'},
        //   {source: '中国新闻出版广电报', target: '中2'},
        //   {source: '中国新闻出版广电报', target: '中3'},
        //   {source: '中国新闻出版广电报', target: '中4'},
        //   {source: '中国新闻出版广电报', target: '中5'},
        //   {source: '中国新闻出版广电报', target: '中6'},
        //   {source: '中国新闻出版广电报', target: '中7'},
        //   {source: '中国新闻出版广电报', target: '中8'},
        // ]
      },
    },
    mounted() {
      this.$refs.graphCharts.style.height = this.height + 'px';

      //创建折线图控件
      var graphChart = echarts.init(document.getElementById('graphCharts'));
      //折线图渲染
      graphChart.setOption(this.setupOptions());

      this.eChartsObj = graphChart;
      // this.zc_log(graphChart.getHeight());
      //浏览器大小改变时重置大小

      window.addEventListener("resize", function () {
        graphChart.resize();
      });
    },
  }
</script>

<style scoped>

  #graphCharts {
    background-color: white;
  }
  .legend{
    color: #666;
    /* font-size: 17px; */
    padding: 0 20px;
    background-color: #f2f2f2;
  }
  .legend_item{
    /*float: left;*/
    display: inline-block;
    line-height: 50px;
    margin-right: 10px;
  }

  .legend_item span {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    margin-right: 5px;
  }
</style>
