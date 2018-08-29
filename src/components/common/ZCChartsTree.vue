<template>
  <div class="chartsTree" style="border: 1px solid #e2e3e4;background-color: #f2f2f2">
    <div class="legend">
      <div class="legend_item"><span style="background-color: #C23531;"></span>网站</div>
      <div class="legend_item"><span style="background-color: #31C2BA;"></span>APP</div>
      <div class="legend_item"><span style="background-color: #6BC231;"></span>微信</div>
      <div class="legend_item"><span style="background-color: #C29131;"></span>微博</div>
      <div class="legend_item"><span style="background-color: #787878;"></span>其他</div>
    </div>
    <div ref="zccharts_tree" :id="idName">
    </div>
  </div>

</template>

<script>
  import echarts from 'echarts'

  export default {
    name: "z-c-charts-tree",
    props: {
      height: {type: Number, require: false},
      idName: {type: String, require: false},
      chartData: {type: Array, require: false},
    },
    watch: {
      chartData(val, oldVal) {
        this.eChartsObj.setOption(this.setupOptions());
      },
    },
    data() {
      return {
        eChartsObj: null
      }
    },
    methods: {
      setupData() {
        return [
          {
          "name": "flare",
          "children": [
            {
              "name": "data",
              "children": [
                {
                  "name": "converters",
                  "children": [
                    {"name": "Converters", },
                    {"name": "DelimitedTextConverter",}
                  ]
                },
                {
                  "name": "DataUtil",
                  "value": 3322
                }
              ]
            },
            {
              "name": "display",
              "children": [
                {"name": "DirtySprite", "value": 8833},
                {"name": "LineSprite", "value": 1732},
                {"name": "RectSprite", "value": 3623}
              ]
            },
            {
              "name": "flex",
              "children": [
                {"name": "FlareVis", "value": 4116}
              ]
            },
            {
              "name": "query",
              "children": [
                {"name": "AggregateExpression", "value": 1616},
                {"name": "And", "value": 1027},
                {"name": "Arithmetic", "value": 3891},
                {"name": "Average", "value": 891},
                {"name": "BinaryExpression", "value": 2893},
                {"name": "Comparison", "value": 5103},
                {"name": "CompositeExpression", "value": 3677},
                {"name": "Count", "value": 781},
                {"name": "DateUtil", "value": 4141},
                {"name": "Distinct", "value": 933},
                {"name": "Expression", "value": 5130},
                {"name": "ExpressionIterator", "value": 3617},
                {"name": "Fn", "value": 3240},
                {"name": "If", "value": 2732},
                {"name": "IsA", "value": 2039},
                {"name": "Literal", "value": 1214},
                {"name": "Match", "value": 3748},
                {"name": "Maximum", "value": 843},
                {
                  "name": "methods",
                  "children": [
                    {"name": "add", "value": 593},
                    {"name": "and", "value": 330},
                    {"name": "average", "value": 287},
                    {"name": "count", "value": 277},
                    {"name": "distinct", "value": 292},
                    {"name": "div", "value": 595},
                    {"name": "eq", "value": 594},
                    {"name": "fn", "value": 460},
                    {"name": "gt", "value": 603},
                    {"name": "gte", "value": 625},
                    {"name": "iff", "value": 748},
                    {"name": "isa", "value": 461},
                    {"name": "lt", "value": 597},
                    {"name": "lte", "value": 619},
                    {"name": "max", "value": 283},
                    {"name": "min", "value": 283},
                    {"name": "mod", "value": 591},
                    {"name": "mul", "value": 603},
                    {"name": "neq", "value": 599},
                    {"name": "not", "value": 386},
                    {"name": "or", "value": 323},
                    {"name": "orderby", "value": 307},
                    {"name": "range", "value": 772},
                    {"name": "select", "value": 296},
                    {"name": "stddev", "value": 363},
                    {"name": "sub", "value": 600},
                    {"name": "sum", "value": 280},
                    {"name": "update", "value": 307},
                    {"name": "variance", "value": 335},
                    {"name": "where", "value": 299},
                    {"name": "xor", "value": 354},
                    {"name": "_", "value": 264}
                  ]
                },
                {"name": "Minimum", "value": 843},
                {"name": "Not", "value": 1554},
                {"name": "Or", "value": 970},
                {"name": "Query", "value": 13896},
                {"name": "Range", "value": 1594},
                {"name": "StringUtil", "value": 4130},
                {"name": "Sum", "value": 791},
                {"name": "Variable", "value": 1124},
                {"name": "Variance", "value": 1876},
                {"name": "Xor", "value": 1101}
              ]
            },
            {
              "name": "scale",
              "children": [
                {"name": "IScaleMap", "value": 2105},
                {"name": "LinearScale", "value": 1316},
                {"name": "LogScale", "value": 3151},
                {"name": "OrdinalScale", "value": 3770},
                {"name": "QuantileScale", "value": 2435},
                {"name": "QuantitativeScale", "value": 4839},
                {"name": "RootScale", "value": 1756},
                {"name": "Scale", "value": 4268},
                {"name": "ScaleType", "value": 1821},
                {"name": "TimeScale", "value": 5833}
              ]
            }
          ]
        }]
      },

      setupSeries() {
        return [
          {
            type: 'tree',
            // data: this.setupData(),
            data: this.chartData,
            top: 0,
            left:'5%',
            right:'5%',
            bottom:0,
            // width:document.getElementById(this.idName).style.width,
            layout: 'orthogonal',
            symbol: 'path://M0,18.5 L0,18.5 L0,18.5 C-1.25125444e-15,8.28273213 8.28273213,1.87688166e-15 18.5,0 L80.5,0 L80.5,-1.77635684e-14 C90.7172679,-1.96404501e-14 99,8.28273213 99,18.5 L99,18.5 L99,18.5 C99,28.7172679 90.7172679,37 80.5,37 L18.5,37 L18.5,37 C8.28273213,37 1.25125444e-15,28.7172679 0,18.5 Z',
            symbolSize: [100,100],
            symbolKeepAspect: true,//保持该图形的长宽比
            initialTreeDepth: 3,
            itemStyle: {
              color: "#2d8cf0",
              borderWidth: 0
            },
            label: {
              color:'#fff',
              position: 'inside',
              fontStyle: 'normal',
              fontWeight: 'bold',
              verticalAlign: 'middle',
              align: 'center',
              formatter(params){
                let name = params.data.name;
                let time = params.data.transTime;

                if(name.length>6){
                  name = params.data.name.substr(0,6)+'...'
                }
                return name+'\n'+time
              }
            },
            lineStyle: {
              color: '#999',
              width: 1,
              curveness: 0.6
            },
            edgeSymbol: 'arrow'

          }
        ]
      },

      setupOptions() {
        return {
          tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
          },
          legend:{
            selectedMode:false,
            data:[
              {name:'1',icon:'circle'},
              {name:'2',icon:'circle'},
              {name:'3',icon:'circle'},
            ]
          },
          series: this.setupSeries()
        }
      }

    },
    mounted() {
      this.$refs.zccharts_tree.style.height = this.height + 'px';

      //创建饼图控件
      var treeChart = echarts.init(document.getElementById(this.idName));
      //饼图渲染
      treeChart.setOption(this.setupOptions());

      var container = document.getElementById(this.idName);
      var allNode = 0;
      var nodes = treeChart._chartsViews[0]._data._graphicEls;
      for (var i = 0, count = nodes.length; i < count; i++) {
        var node = nodes[i];
        if (node === undefined)
          continue;
        allNode++;
      }
      var height = window.innerHeight;
      var currentHeight = 35 * allNode;
      var newWidth = Math.max(currentHeight, height);
      // container.style.width = window.innerWidth + 'px';
      container.style.height = newWidth + 'px';
      treeChart.resize();

      window.addEventListener("resize", function () {
        treeChart.resize();
      });

      this.eChartsObj = treeChart;
    }
  }
</script>

<style scoped>

  .chartsTree{
    width: 100%;
    /*overflow-x: hidden;*/
    overflow-y: auto;
    max-height: 600px;
  }
  .legend{
    color: #666;
    /* font-size: 17px; */
    padding: 0 20px;
  }
  .legend_item{
    /*float: left;*/
    display: inline-block;
    /*height: 50px;*/
    /*line-height: 50px;*/
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
