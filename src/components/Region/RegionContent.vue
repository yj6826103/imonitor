<template>
  <div id="region" class="region">
    <div v-if="areaData.length >0 || provienceTransList.length > 0 ">
      <div class="block_rzl clearfix linkPointer">
        <div class="title_rzl">传播地域分布</div>
        <div class="region_map" v-if="areaData.length > 0">
          <mapCharts idName="map1" height="600" :chartData="areaData" @click-map="areaMapClick"></mapCharts>
        </div>
        <div class="region_chart" v-if="areaData.length > 0">
          <div class="region_chart_title clearfix">
            <div class="region_chart_title_l">
              <div>覆盖地域数量</div>
              <span>{{areaData.length}}</span>
            </div>
            <div class="region_chart_title_r">
              <div>{{cutProvinceName(provienceTransName)}}地区转载数量</div>
              <span>{{provienceTransnumData?provienceTransnumData:'无'}}</span>
            </div>
          </div>

          <barChart :height="550"
                    idName="cbdyfx"
                    :chartData="areaRankData"
                    @click-barchart="clickBarchart"
                    :options="{direction:'vertical',showRankingList:true,emphasizeColor:true}">
          </barChart>
          <div class="fontSize14" style="text-align: center;color: #444;margin-top: 20px">注：此地域是指媒体地域属性</div>
        </div>


        <div class="empty_block" v-if="areaData.length ==0">暂无相关数据</div>

      </div>
      <div class="block_rzl">
        <div class="title_rzl" style="margin-bottom: 25px">{{cutProvinceName(provienceTransName)}}地区转载列表</div>
        <tables :data="provienceTransList"
                :columnData="provienceTransListColumn"
                :options="options"
                @click-tablecell="clickTablecell"
                @refresh-data="refreshData">
        </tables>

      </div>
    </div>
    <div class="empty_block" v-if="areaData.length ==0 && provienceTransList.length == 0 ">暂无相关数据</div>
  </div>
</template>

<script>

  import mapCharts from '@/components/common/mapCharts.vue'
  import Tables from '@/components/common/ZCTables'
  import barChart from '@/components/common/ZCChartsBar'

  export default {
    name: "region-content",
    components: {mapCharts, Tables, barChart},
    props: {
      sidebarType: {type: String / Number, require: true},
      plantformId: {type: String / Number, require: true},
      datePickerParams: {type: Object, require: true}
    },

    watch: {
      plantformId(val) {
        this.loadAreaData(val)
      },
      datePickerParams(val) {
        if (this.plantformId.length) {
          this.loadAreaData(this.plantformId);
        }
      },
      pageNo(val) {
        // this.zc_log('pageNo改变了')
        if (this.plantformId.length) {
          this.loadProvienceTransList(this.plantformId, this.provienceTransName);
        }
      },
      pageSize(val) {
        //this.zc_log('pageSize改变了')
        if (this.plantformId.length) {
          this.loadProvienceTransList(this.plantformId, this.provienceTransName);
        }
      },
    },
    data() {
      return {

        //表格数据
        options: {},
        //传播地域分析数据
        areaOriginalData: [],
        areaOriginalName: '',
        areaData: [],
        provienceTransnumData: 0,
        provienceTransName: '',
        areaRankData: {categoryArr: [], valueArr: []},
        //列表
        provienceTransList: [],
        provienceTransListColumn: [],
        total: 0,//作品总数
        pageNo: 1,//当前页码数
        pageSize: 10,//每页条数
      }
    },
    methods: {
      refreshData({selected, currentPage, pageSize, sortingIndex}) {
        // this.zc_log(`筛选项=${selected},当前页=${currentPage},每页数=${pageSize},排序项=${sortingIndex}`);
        this.provienceTransName = this.areaOriginalName;
        this.pageNo = currentPage;
        this.pageSize = pageSize;
      },
      clickTablecell({rowIndex, columnIndex}) {
        // this.zc_log(`行号=${rowIndex},列号=${columnIndex}`);
        if (columnIndex === 4) {
          let uid = this.provienceTransList[rowIndex].unionId;
          let aid = this.provienceTransList[rowIndex].articleId;
          if(uid == '' || uid == null || aid == '' || aid == null){
            this.$message({message: '链接已失效！'});
          }else{
            window.open('detail?uid=' + uid + '&aid=' + aid);
          }
          // this.$router.push('/detail/'+ uid+'/'+ aid);
        }else if(columnIndex === 2){
          let url = this.provienceTransList[rowIndex].url || '';
          if(url == ''){
            this.$message({message: '链接已失效！'});
          }else{
            window.open(url);
          }
        }
      },

      //传播地域分析
      loadAreaData(ID) {
        let params = {startTime: this.datePickerParams.startTime, accountType: this.datePickerParams.accountType};
        if (this.plantformId && this.plantformId.length > 1) {
          if (this.sidebarType === 1001) {
            params.platformTypeId = ID;
          } else if (this.sidebarType === 1002) {
            params.platformId = ID;
          } else if (this.sidebarType === 1003) {
            params.groupId = ID;
          }
        }
        this.zc_log('=======传播地域分析');
        this.zc_log(params);
        this.zc_log('=======传播地域分析');

        this.$http.get(this.baseUrl + '/spread/area/current', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('传播地域分析数据');
          this.zc_log(response);
          this.areaData = [];
          this.areaRankData = {categoryArr: [], valueArr: []};
          this.provienceTransList = [];

          if (response.code == 200 && response.data) {
            this.handleData_area(response.data);
            this.handleData_areaRank(response.data);
          }
        }, function (err) {
          //this.zc_log('传播地域分析数据失败');
          //this.zc_log(err);
        })
      },
      handleData_area(data) {
        // //this.zc_log('传播地域分析数据')
        // //this.zc_log(data)
        this.areaOriginalData = [];
        let areaData = [];
        let thiz = this;
        data.forEach(function (value, index) {
          if (value.province) {
            // areaData.push({name: thiz.cutProvinceName(value.province), value: value.transNum})
            areaData.push({name: thiz.cutProvinceName(value.province), value: value.transNum});
            thiz.areaOriginalData.push(value)
          }
        });
        this.areaData = areaData;

        this.loadTenantData();//动态获取当前地区转载数量

      },
      handleData_areaRank(data) {
        // //this.zc_log('传播地域分析排行数据')
        // //this.zc_log(data)

        let categoryArr = [];
        let valueArr = [
          {name: '文章转载篇数', value: []},
        ];

        let thiz = this;
        data.forEach(function (value) {
          if (value.province) {
            categoryArr.push(thiz.cutProvinceName(value.province));
          }
        });

        valueArr.forEach(function (value, index) {
          data.forEach(function (dataValue) {
            if (dataValue.province) {
              value.value.push(dataValue.transNum)
            }
          })
        });

        if (categoryArr.length > 10) {
          valueArr.forEach(function (item) {
            item.value = item.value.slice(0,10);
          });

          categoryArr = categoryArr.slice(0,10);

          this.areaRankData = {categoryArr: categoryArr, valueArr: valueArr};

        } else {
          this.areaRankData = {categoryArr: categoryArr, valueArr: valueArr}
        }

        // //this.zc_log(this.areaRankData)
      },
      areaMapClick({name, index}) {
        // alert(`name=${name},index=${index}`);
        let thiz = this;
        this.pageNo = 1;
        this.pageSize = 10;
        this.areaOriginalData.forEach(function (value, index) {
          // //this.zc_log('++++++++'+index)
          // //this.zc_log(value)

          if (value.province.indexOf(name) != -1) {
            thiz.loadProvienceTransList(thiz.plantformId, value.province);
          }
        })

      },
      clickBarchart({name, index}) {
        this.pageNo = 1;
        this.loadProvienceTransList(this.plantformId, this.areaOriginalData[index].province);
        this.loadProvienceTransnumData(this.plantformId, this.areaOriginalData[index].province)
      },


      //租户信息
      loadTenantData() {
        this.$http.get(this.baseUrl + '/tenant/find').then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('加载租户信息数据');
          this.zc_log(response);
          this.sidebarData_top = null;
          if (response.code == 200) {
            this.loadProvienceTransnumData(this.plantformId, response.data.region);
            this.loadProvienceTransList(this.plantformId, response.data.region);
          }
        }, function (res) {
          this.zc_log('加载租户信息error');
          this.zc_log(res);
        });
      },

      //某地区转载数量
      loadProvienceTransnumData(ID, province) {
        let params = {startTime: this.datePickerParams.startTime, accountType: this.datePickerParams.accountType};
        if (this.plantformId && this.plantformId.length > 1) {
          if (this.sidebarType === 1001) {
            params.platformTypeId = ID;
          } else if (this.sidebarType === 1002) {
            params.platformId = ID;
          } else if (this.sidebarType === 1003) {
            params.groupId = ID;
          }
        }
        params.province = province;
        this.areaOriginalName = province;
        this.provienceTransName = this.cutProvinceName(province);

        this.zc_log('=======某地区转载数量参数');
        this.zc_log(params);
        this.zc_log('=======某地区转载数量参数');

        let thiz = this;
        this.$http.get(this.baseUrl + '/spread/provience/transnum', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('某地区转载数量数据');
          this.zc_log(response);
          this.provienceTransnumData = 0;
          if (response.code == 200 && response.data) {
            this.handleData_provienceTransnum(response.data)
          }
        }, function (err) {

          //this.zc_log('某地区转载数量数据失败');
          //this.zc_log(err);
        })
      },
      handleData_provienceTransnum(data) {
        // this.zc_log('某地区转载数量数据')
        // this.zc_log(data)

        this.provienceTransnumData = data;
      },

      //某地区转载列表
      loadProvienceTransList(ID, privince) {
        let params = {
          startTime: this.datePickerParams.startTime,
          accountType: this.datePickerParams.accountType,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        };
        if (this.plantformId && this.plantformId.length > 1) {
          if (this.sidebarType === 1001) {
            params.platformTypeId = ID;
          } else if (this.sidebarType === 1002) {
            params.platformId = ID;
          } else if (this.sidebarType === 1003) {
            params.groupId = ID;
          }
        }
        params.province = privince;
        // params.province = this.areaOriginalName;
        this.zc_log('=======某地区转载列表');
        this.zc_log(params);
        this.zc_log('=======某地区转载列表');
        let thiz = this;
        this.$http.get(this.baseUrl + '/spread/area/trans/list', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('某地区转载列表数据');
          this.zc_log(response);
          this.provienceTransList = [];
          this.provienceTransName = '';
          this.total = 0;
          if (response.code == 200 && response.data.resultList) {
            this.total = response.data.count;
            this.handleData_provienceTransList(response.data.resultList);
            this.provienceTransName = thiz.cutProvinceName(privince);
          }
        }, function (err) {
          //this.zc_log('某地区转载列表数据失败');
          //this.zc_log(err);
        })
      },
      handleData_provienceTransList(data) {
        // this.zc_log('某地区转载列表数据')
        // this.zc_log(data)
        // 由于后端抓取的原文标题存在为空的现象且无法处理，故前端显示时进行优化
        data.forEach(function (item, index) {
          var obj = item;
          for (var key in obj) {
            if (obj[key] == null || obj[key].length == 0) {
              item[key] = "-";
            }
          }
        });
        this.provienceTransList = data || [];
        this.provienceTransListColumn = [
          {prop: 'rowNum', label: '序号'},
          {prop: 'transMeida', label: '转载媒体'},
          {prop: 'transTitle', label: '转载标题'},
          {prop: 'platformName', label: '平台'},
          {prop: 'originalTitle', label: '原文标题'},
          {prop: 'transTime', label: '转载时间'},
        ];
        let total = this.total;
        this.options = {
          id: 'region_tables',
          total: total,
          titleStyle: {
            fontSize: '20px',
            color: '#111111',
            paddingBottom: '0'
          },
          showBorder: false,
          //表格列样式
          columnStyle: {
            indexs: [0, 1, 2, 3, 4, 5],
            styles: [
              {width: this.getLineUnitWidth(12) * 0.8},
              {width: this.getLineUnitWidth(12) * 1.5, textAlign: 'left'},
              {textAlign: 'left', color: '#3B87F5', cursor: 'pointer'},
              {textAlign: 'left', width: this.getLineUnitWidth(12) * 1.5},
              {textAlign: 'left', color: '#3B87F5', cursor: 'pointer'},
              {width: this.getLineUnitWidth(12) * 1.7},
            ],
            commons: {textAlign: 'center', color: '#444'}
          },
          //表格表头样式
          headerStyle: {
            indexs: [1, 2, 3, 4],
            styles: [{textAlign: 'left'}, {textAlign: 'left'}, {textAlign: 'left'}, {textAlign: 'left'}],
            commons: {backgroundColor: '#f4f4f4', textAlign: 'center', padding: '5px 0'}
          },
        };

      }
    },
    mounted() {
      this.options = {
        id: 'region_tables',
        total: 0,
        titleStyle: {
          fontSize: '20px',
          color: '#111111',
          paddingBottom: '0'
        },
        showBorder: false,
        //表格列样式
        columnStyle: {
          indexs: [0, 1, 2, 3, 4, 5],
          styles: [
            {width: this.getLineUnitWidth(12) * 0.8},
            {width: this.getLineUnitWidth(12) * 1.5, textAlign: 'left'},
            {textAlign: 'left', color: '#3B87F5', cursor: 'pointer'},
            {textAlign: 'left', width: this.getLineUnitWidth(12) * 1.5},
            {textAlign: 'left', color: '#3B87F5', cursor: 'pointer'},
            {width: this.getLineUnitWidth(12) * 1.7},
          ],
          commons: {textAlign: 'center', color: '#444'}
        },
        //表格表头样式
        headerStyle: {
          indexs: [1, 2, 3, 4],
          styles: [{textAlign: 'left'}, {textAlign: 'left'}, {textAlign: 'left'}, {textAlign: 'left'}],
          commons: {backgroundColor: '#f4f4f4', textAlign: 'center', padding: '5px 0'}
        },
      };
      this.provienceTransListColumn = [
        {prop: 'rowNum', label: '序号'},
        {prop: 'transMeida', label: '转载媒体'},
        {prop: 'transTitle', label: '转载标题'},
        {prop: 'platformName', label: '平台'},
        {prop: 'originalTitle', label: '原文标题'},
        {prop: 'transTime', label: '转载时间'},
      ];
    },

    created(){
      let data = {
        name: document.title,
        id: "region",
      };
      this.registerCreateReportParams(this.$route.path, data);
    }
  }
</script>

<style scoped>
  .region {
    width: 100%;
    height: 100%;
  }

  /*传播地域分析*/
  .region .region_map {
    float: left;
    width: 60%;
  }

  .region .region_chart {
    float: left;
    width: 40%;
  }

  .region_chart_title_l, .region_chart_title_r {
    text-align: center;
    float: left;
    width: 50%;
  }

  .region_chart_title_l div, .region_chart_title_r div {
    color: #444;
    /* font-size: 18px; */
    font-weight: 900;
  }

  .region_chart_title_l span, .region_chart_title_r span {
    color: #3B87F5;
    /* font-size: 18px; */
    font-weight: 900;
  }

  .region_chart_ranking {
    margin-top: 10px;
    height: 550px;
  }

  .empty_block {
    height: 450px;
    line-height: 450px;
    padding-top: 0px;
    margin-top: 0px;
  }
</style>

