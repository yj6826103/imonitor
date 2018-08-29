<template>
  <div class="trend " id="trend">
    <div class="block_rzl linkPointer" v-if="timeTrendDatas.valueArr.length>0 || comprehensiveData.length>0 ">
      <div class="title_rzl">传播时间趋势</div>
      <lineChart idName="timeTrendCharts"
        :height="400"
        :chartData="timeTrendDatas"
        v-if="timeTrendDatas.valueArr.length>0">
      </lineChart>
      <div class="empty_block"  v-if="timeTrendDatas.valueArr.length==0">暂无相关数据</div>
      <div class="arc-box">
        <span style="font-weight: 600">转载数最高峰: {{comprehensiveDate}}</span>
        <!--<div style="display: inline-block;">-->
          <!--<img src="../../assets/svg/arc_left.svg" class="left-img"/>-->
          <!--<div>转载数最高峰: {{comprehensiveDate}}</div>-->
          <!--<img src="../../assets/svg/arc_right.svg" class="right-img"/>-->
        <!--</div>-->
        <span>当日文章转载数排行Top10</span>
      </div>
      <tables
        :data="comprehensiveData"
        :columnData="comprehensiveColumn"
        :options="options"
        :showPageControl="false"
        @click-tablecell="clickTablecell"
        @refresh-data="refreshData">
      </tables>
    </div>
    <div class="block_rzl linkPointer" >
      <div class="title_rzl">作品数发布时间趋势</div>
      <!--<lineChart idName="zpfbsjqs" :height="400" :chartData="timeTrendData" :options="{isArea:true}"></lineChart>-->
      <lineChart idName="time-lines" :height="450"
                 v-if="publishTrendDatas.categoryArr.length"
                 :options="{isArea:true}"
                 :areaData="publishTrendDatas"></lineChart>
      <div class="empty_block"  v-if="publishTrendDatas.categoryArr.length==0">暂无相关数据</div>

    </div>
    <div class="empty_block" v-if="timeTrendDatas.categoryArr.length==0 && comprehensiveData.length==0 && publishTrendDatas.categoryArr.length==0" >暂无相关数据</div>

  </div>
</template>

<script>
  import lineChart from '@/components/common/ZCChartsLine'
  import Tables from '@/components/common/ZCTables'
  import echarts from 'echarts'

  export default {
    name: "trend-content",
    components: {lineChart, Tables},
    props: {
      sidebarType: {type: String/Number, require: true},
      plantformId: {type: String / Number, require: true},
      datePickerParams:{type:Object,require:true},
    },
    watch: {
      plantformId(val, oldVal) {

        this.loadTimeTrendData(val);
        this.loadComprehensiveNum(val);
        this.loadPublishData(val);

      },
      datePickerParams(val){
        if (this.plantformId) {
          this.loadTimeTrendData(this.plantformId);
          this.loadComprehensiveNum();
          this.loadPublishData(this.plantformId);
        }
      },
    },
    data() {
      return {

        //传播时间趋势数据
        timeTrendDatas: {categoryArr: [], valueArr: []},

        //当日文章top10
        comprehensiveDate: '',
        comprehensiveData: [],
        comprehensiveColumn: [],
        options: {},

        //作品发布时数据
        publishTrendDatas: {categoryArr: [], valueArr: []},
      }
    },
    methods: {
      refreshData({selected, currentPage, pageSize, sortingIndex}) {
        // //this.zc_log(`筛选项=${selected},当前页=${currentPage},每页数=${pageSize},排序项=${sortingIndex}`);
      },
      clickTablecell({rowIndex, columnIndex}) {
        this.zc_log(`行号=${rowIndex},列号=${columnIndex}`);
        if(columnIndex === 2){
          let uid = this.comprehensiveData[rowIndex].unionId;
          let aid = this.comprehensiveData[rowIndex].articleId;
          window.open('detail?uid='+ uid+'&aid='+ aid);
          // this.$router.push('/detail/'+ uid+'/'+ aid);
        }
      },

      //传播时间趋势
      loadTimeTrendData(ID) {

        let params = {startTime: this.datePickerParams.startTime, accountType: this.datePickerParams.accountType};
        if (this.plantformId && this.plantformId.length > 1) {
          if (this.sidebarType === 1001) {
            params.platformTypeId = ID;
          } else if(this.sidebarType === 1002){
            params.platformId = ID;
          }else if(this.sidebarType === 1003){
            params.groupId = ID;
          }
        }

        this.$http.get(this.baseUrl + '/spreadTrend/timeTrend', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('传播时间趋势数据');
          this.zc_log(response);

          this.timeTrendDatas = {categoryArr: [], valueArr: []};

          if (response.code == 200 && response.data) {
            this.handleData_TimeTrend(response.data)
          }

        }, function (err) {
          this.zc_log('传播时间趋势失败');
          this.zc_log(err);

        })
      },
      handleData_TimeTrend(data) {
        // //this.zc_log('传播时间趋势数据');
        // //this.zc_log(data);

        let categoryArr = [];
        let valueArr = [
          // {name: '综合数值', value: []},
          {name: '转载数', value: []},
          {name: '评论数', value: []},
          {name: '阅读数', value: []},
        ];

        data.forEach(function (value) {
          categoryArr.push(value.create_time);
        });

        valueArr.forEach(function (value, index) {

          data.forEach(function (dataValue) {
            //暂时隐去综合数值
            // if(index == 0){
            //   value.value.push(dataValue.comprehensive_num)
            // }else
            //暂时隐去综合数值
            if (index === 0) {
              value.value.push(dataValue.trans_num)
            } else if (index === 1) {
              value.value.push(dataValue.comment_num)
            } else {
              value.value.push(dataValue.read_num)
            }
          })
        });
        // 获取转载数最高峰的时间点
        var sortData = data.sort(function (obj, next) {
          if(obj.trans_num > next.trans_num){
            return 1
          }else{
            return -1;
          }
        });
        // 当所有转载数为0时，取第一个时间作为最高峰值
        var isZero = false;
        data.forEach(function (item, index) {
          if( item.trans_num !=0 ){
            isZero = true;
            return;
          }
        });
        if(!isZero){
          this.comprehensiveDate = data[0].create_time;
        }else{
          this.comprehensiveDate = sortData.slice(-1)[0].create_time;
        }
        this.timeTrendDatas = {categoryArr: categoryArr, valueArr: valueArr};
      },


      //当日文章top10
      loadComprehensiveNum(ID) {
        let params = {startTime: this.datePickerParams.startTime, accountType: this.datePickerParams.accountType};
        if (this.plantformId && this.plantformId.length > 1) {
          if (this.sidebarType === 1001) {
            params.platformTypeId = ID;
          } else if(this.sidebarType === 1002){
            params.platformId = ID;
          }else if(this.sidebarType === 1003){
            params.groupId = ID;
          }
        }
        // params.orderCode = 1;
        this.zc_log(params);
        this.$http.get(this.baseUrl + '/trans/comprehensiveNum', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('当日文章top10数据');
          this.zc_log(response);
          this.comprehensiveData = [];
          if (response.code == 200 && response.data) {
            this.handleData_comprehensive(response.data)
          }

        }, function (err) {
          this.comprehensiveData = [];
          this.zc_log('当日文章top10失败');
          this.zc_log(err);
        })
      },
      handleData_comprehensive(data) {
        // //this.zc_log('当日文章top10数据')
        // //this.zc_log(data)

        // this.comprehensiveDate = data.top_date;

        data.articles.forEach(function (value, index) {
          value.index = index + 1;
        });

        this.comprehensiveData = data.articles;
        this.comprehensiveColumn = [
          {prop: 'index', label: '排名'},
          {prop: 'publish_time', label: '发布时间'},
          {prop: 'title', label: '文章标题'},
          {prop: 'platform', label: '平台'},
          {prop: 'trans_num', label: '转载数'},
          {prop: 'comment_num', label: '评论数'},
          {prop: 'read_num', label: '阅读数'},
          // {prop: 'comprehensive_num', label: '综合数值'},
        ];


      },


      //作品发布时间趋势
      loadPublishData(ID) {
        let params = {startTime: this.datePickerParams.startTime, accountType: this.datePickerParams.accountType};
        if (this.plantformId && this.plantformId.length > 1) {
          if (this.sidebarType === 1001) {
            params.platformTypeId = ID;
          } else if(this.sidebarType === 1002){
            params.platformId = ID;
          }else if(this.sidebarType === 1003){
            params.groupId = ID;
          }
        }
        this.$http.get(this.baseUrl + '/article/publish/trend/find', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('作品发布时间趋势数据')
          this.zc_log(response);
          this.publishTrendDatas = {categoryArr: [], valueArr: []};
          if (response.code == 200 && response.data) {
            this.handleData_publish(response.data);
          }
        }, function (err) {

          this.zc_log('失败');
          this.zc_log(err);
        })
      },
      handleData_publish(data) {
        // //this.zc_log('作品发布时间趋势数据')
        // //this.zc_log(data)

        let categoryArr = [];
        let valueArr = [
          {name: '作品数', value: []},
        ];

        data.forEach(function (value) {
          categoryArr.push(value.date);
        });
        valueArr.forEach(function (value, index) {
          data.forEach(function (dataValue) {
            value.value.push(dataValue.value)
          })
        });
        this.publishTrendDatas = {categoryArr: categoryArr, valueArr: valueArr}
      },


    },
    mounted() {
      this.comprehensiveColumn = [
        {prop: 'index', label: '排名'},
        {prop: 'publish_time', label: '发布时间'},
        {prop: 'title', label: '文章标题'},
        {prop: 'platform', label: '平台'},
        {prop: 'trans_num', label: '转载数'},
        {prop: 'comment_num', label: '评论数'},
        {prop: 'read_num', label: '阅读数'},
        // {prop: 'comprehensive_num', label: '综合数值'},
      ];
      this.options = {
        id: 'trend_tables',
        total: 10,
        titleStyle: {
          fontSize: '20px',
          color: '#111111',
          paddingBottom: '0'
        },
        showBorder: false,
        //表格列样式
        columnStyle: {
          indexs: [0, 1, 2, 3, 4, 5, 6],
          styles: [
            {width: this.getLineUnitWidth(13)*0.6},
            {width: this.getLineUnitWidth(13) * 2},
            {textAlign: 'left', color: '#3B87F5',cursor:"pointer"},
            {textAlign: 'left',width: this.getLineUnitWidth(13) * 2},
            {width: this.getLineUnitWidth(13)},
            {width: this.getLineUnitWidth(13)},
            {width: this.getLineUnitWidth(13)},
            {width: this.getLineUnitWidth(13)},
          ],
          commons: {textAlign: 'center', color: '#444'}
        },
        //表格表头样式
        headerStyle: {
          indexs: [2,3],
          styles: [{textAlign: 'left'},{textAlign: 'left'}],
          commons: {backgroundColor: '#f4f4f4', textAlign: 'center', padding: '5px 0'}
        },
      }

    },

    created(){
      let data = {
        id:"trend",
        name:document.title
      };
      this.registerCreateReportParams(this.$route.path,data)
    }
  }
</script>

<style scoped>
  @import '../../assets/css/trend/trend.css';
  .empty_block{
    background: white;
    height: 450px;
    line-height: 450px;
    padding-top: 0px;
    margin-top: 0px;
  }
</style>
