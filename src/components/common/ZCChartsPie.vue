<template>

  <div :id="idName" ref="zccharts_pie" :style="{backgroundColor:'#fff',width:'100%'}"></div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: "z-c-charts-pie",
    props: {
      height: {type: Number, require: true},
      idName: {type: String, require: true},
      chartData: {type: Array, require: true},
      baseName: {type: String, require: false},
    },
    data() {
      return {
        eChartsObj: null
      }
    },
    watch: {
      chartData(val, oldVal) {
        this.eChartsObj.setOption(this.setupOptions());
      }
    },
    methods: {

      setupData() {
        var data = [];
        this.chartData.forEach(function (value, index) {
          data.push({name: value.name, value: value.value})
        });
        return data;
      },
      setupSeries() {
        return [{
          itemStyle: {
            borderColor: "#ffffff",
            borderWidth: this.chartData.length>1?5:0,
          },
          type: 'pie',
          hoverOffset: 5,
          minAngle: 5,
          avoidLabelOverlap: true,
          center: ['50%', '50%'],
          radius: this.chartData.length>1?['80%', '95%']:['85%','95%'],
          label:{show:false,},
          data: this.setupData(),
        }];
      },

      setupOptions() {
        let data = this.setupData();
        let thiz = this;
        return {
          color: [
            '#3B87F5', '#E5833B', '#6BC231', '#41CBF3', '#E14F5B', '#9D71EA',
            '#9659fb', '#99acf6', '#7be0fd', '#6fff5b', '#ffd541', '#ffa664',
            '#ff7777', '#b080ff'
          ],
          tooltip: {
            show: true,
            padding: 10,
            backgroundColor: 'rgba(255,255,255,1)',
            textStyle: {color: '#444'},
            extraCssText: 'box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.2);',
            formatter(params) {
              //this.zc_log(params);
              var formatter = ""
              var name = !thiz.baseName?"文章篇数：":thiz.baseName
              formatter = formatter + params.name + "："+params.percent +"%<br>"
              formatter = formatter + params.marker + name + thiz.handleNum(params.value)
              return formatter
            },
          },
          legend:{
            show:true,
            left:0,
            top:0,
            orient:'vertical',
            formatter(params){
              let total = 0;
              let current = 0;
              thiz.chartData.forEach(function (item,index) {
                total += parseInt(item.value);
                if(item.name === params){
                  current = parseInt(item.value);
                }
              });
              thiz.zc_log('total='+total);
              thiz.zc_log('current='+current);

              if(total === 0){
                return params + ' 0.00%'
              }else {
                return params+' '+(current/total*100).toFixed(2)+'%';
              }
            }
          },
          series: this.setupSeries()
        }
      }
    },
    mounted() {

      this.$refs.zccharts_pie.style.height = this.height + 'px';

      //创建饼图控件
      var pieChart = echarts.init(document.getElementById(this.idName));
      //饼图渲染
      pieChart.setOption(this.setupOptions());

      window.addEventListener("resize", function () {
        pieChart.resize();
      });

      this.eChartsObj = pieChart;

      var thiz = this;
      pieChart.on('pieselectchanged ', function (params) {
        //this.zc_log(params);
      });
      pieChart.on('pieselected ', function (params) {
        //this.zc_log(params);
      });
      pieChart.on('pieunselected ', function (params) {
        //this.zc_log(params);
      });

      pieChart.on('click', function (params) {
        // //this.zc_log(params)
        if (params.componentType == 'series' && params.componentSubType == 'pie') {
          if (params.value) {
            thiz.$emit('click-piechart', {
              name: params.name,
              index: params.dataIndex
            });
          }
        }
      })

    }
  }
</script>

