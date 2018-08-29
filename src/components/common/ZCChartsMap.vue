<template>
  <div :id="idName" ref="mapChart"></div>
</template>

<script>
  export default {
    name: "z-c-charts-map",
    props:{
      idName: {type: String, require: true},
      height: {type: Number/String, require: true},
      chartData: {type: Object, require: true},
      options: {type: Object, require: false},
    },

    methods:{
      setupOptions(){
        return{

        }
      }
    },


    mounted(){
      this.$refs.mapChart.style.height = this.height + 'px';
      //创建地图控件
      var mapChart = echarts.init(document.getElementById(this.idName));
      //地图渲染
      mapChart.setOption(this.setupOptions());

      window.addEventListener("resize", function () {
        mapChart.resize();
      });
    }
  }
</script>

<style scoped>

</style>
