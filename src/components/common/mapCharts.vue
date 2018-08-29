<template>
  <div :id="idName" ref="map" ></div>
</template>

<script>
  import echarts from 'echarts'
  import china from 'echarts/map/js/china';

  export default {
    // props: ['chartData', 'height', 'idName'],
    props: {
      chartData: {type: Array, require: true},
      height: {type: Number / String, require: true},
      idName: {type: String, require: true},
      showProvice:{type:Boolean,require:false,default:true}
    },
    data() {
      return {
        eChartsObj: null,
        provincesData: [],
        max: 0,
        width:0
      }
    },
    watch: {
      chartData(val, oldVal) {
        this.handleChartsData(val)
        this.eChartsObj.setOption(this.setOption());
      }
    },
    methods: {
      setOption() {
        var thiz = this;
        var option = {
            tooltip: {
              show: true,
              textStyle: {
                color: '#000',
                cursor: 'auto'
              },
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              extraCssText: 'box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);text-align: left',
              formatter(params) {
                var str = ""
                str = params.name + '<br>'+ params.seriesName + ':' + (params.value ? params.value : '-')
                // this.zc_log('地图参数')
                // this.zc_log(params);
                return str
              }
            },
            visualMap: {
              show:false,
              min: 0,
              max: thiz.max,
              left: 'left',
              bottom: 'bottom',
              text: ['高', '低'],
              // seriesIndex: [1],
              inRange: {
                color: ['#fff', '#3B87F5']
              },
              orient: 'horizontal',
              inverse: true,
            },
            geo: {
              show: true,
              map: 'china',
              roam: false,
              // left: '30',
              // right: "30",
              // bottom: 'auto',
              // top:0,
              itemStyle: {
                areaColor: '#f4f4f4',
                borderColor: '#fff',
                borderWidth: 1,
                shadowBlur: 0
              },
              label: {
                show: this.showProvice?true:false,
                verticalAlign: 'top',
                align: 'center',
                fontSize: 10
              }
            },
            series: [
              {
                type: 'map',
                name: '文章转载篇数',
                geoIndex: 0,
                data: thiz.provincesData,
              }
            ]
          }
        ;
        return option;
      },
      handleChartsData(data) {
        var thiz = this;
        this.max = 0;
        this.provincesData = [{name: '北京'}, {name: '天津'}, {name: '上海'}, {name: '重庆'}, {name: '河北'}, {name: '河南'},
          {name: '云南'}, {name: '辽宁'}, {name: '黑龙江'}, {name: '湖南'}, {name: '安徽'}, {name: '山东'}, {name: '新疆'},
          {name: '江苏',}, {name: '浙江'}, {name: '江西'}, {name: '湖北'}, {name: '广西'}, {name: '甘肃'}, {name: '山西'},
          {name: '内蒙古'}, {name: '陕西'}, {name: '吉林'}, {name: '福建'}, {name: '贵州'}, {name: '广东'}, {name: '青海'},
          {name: '西藏'}, {name: '四川'}, {name: '宁夏'}, {name: '海南'}, {name: '台湾'}, {name: '香港'}, {name: '澳门'}
        ];

        this.provincesData.forEach(function (province) {
          data.forEach(function (dataItem) {
            // this.zc_log(`province.name=${province.name},dataItem.name=${dataItem.name}`)
            if (dataItem.name.indexOf(province.name) != -1) {
              province.value = dataItem.value;
            }
            if (dataItem.value > thiz.max) {
              thiz.max = dataItem.value;
            }
          })
        });
        // this.zc_log(this.provincesData)
        // thiz.mapSelected(this.cutProvinceName(data[0].name), 0);
      },

      mapSelected(name, index) {
        this.$emit('click-map', {
          name: name,
          index: index
        });
      }
    },
    mounted() {

      this.$refs.map.style.height = this.height + 'px';
      // this.$refs.map.style.width = this.height*1.06+"px"
      var mapChart = echarts.init(document.getElementById(this.idName));
      this.handleChartsData(this.chartData)
      mapChart.setOption(this.setOption());

      this.eChartsObj = mapChart;
      window.addEventListener("resize", function () {
        mapChart.resize();
      });

      var thiz = this;
      mapChart.on('click', function (params) {
        // this.zc_log(params)
        if (params.componentType == 'series' && params.componentSubType == 'map') {
          if (params.value) {
            thiz.mapSelected(params.name, params.dataIndex)
          }
        }
      })


    }
  }
</script>

<style scoped>

</style>
