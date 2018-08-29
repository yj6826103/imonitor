<template>

  <div class="hotwork" id="hotwork-box" >
    <div class="block_rzl">
      <div class="title_rzl">作品列表</div>
      <tables :data="hotworkData"
              :columnData="hotworkColumn"
              :options="options"
              @refresh-data="refreshData"
              @click-tablecell="clickTablecell">
      </tables>
      <!-- <div class="table_export" @click="dataExport">导出</div> -->
      <el-tooltip class="table_export" effect="light" content="导出当前列表的前一万条数据" placement="top-start" >
        <el-button @click="dataExport">导出</el-button>
      </el-tooltip>
    </div>
  </div>


</template>

<script>
  import Tables from '@/components/common/ZCTables'
  const { export_json_to_excel } = require('../../vendor/Export2Excel')

  export default {
    name: "hot-work-content",
    components: {Tables},
    props: {
      sidebarType: {type: String / Number, require: true},
      plantformId: {type: String / Number, require: true},
      datePickerParams: {type: Object, require: true},

    },
    watch: {
      plantformId(val) {
        //this.zc_log('plantformId改变了')
        this.loadHotWorkData()
      },

      datePickerParams(val){
        if (this.plantformId) {
          //this.zc_log('startTime改变了')
          this.loadHotWorkData();
        }
      },
      pageNo(val) {
        //this.zc_log('pageNo改变了')
        if (this.plantformId) {
          this.loadHotWorkData()
        }
      },
      pageSize(val) {
        // this.zc_log('pageSize改变了')
        if (this.plantformId) {
          this.loadHotWorkData()
        }
      },
      order(val) {
        //this.zc_log('order改变了')
        if (this.plantformId) {

          this.loadHotWorkData()
        }
      },
      original(val) {
        //this.zc_log('original改变了')
        if (this.plantformId) {
          this.loadHotWorkData()
        }
      },
      descOrAsc(){
        if (this.plantformId) {
          this.loadHotWorkData()
        }
      }
    },
    data() {
      return {
        //热门作品数据
        hotworkData: [],
        hotworkColumn: [],
        exportsData: [],
        options: {},
        total: 0,//作品总数
        pageNo: 1,//当前页码数
        pageSize: 10,//每页条数
        order: 2,//排序
        original: 3,//原创非原创排序
        descOrAsc:'1'
      }
    },
    methods: {
      dataExport(){
        if(this.hotworkData.length > 0){
          this.export2Excel();
        }else{
          this.alert('暂无相关数据!');
        }
      },
      export2Excel() {
　　　　require.ensure([], () => {　　
        //  const { export_json_to_excel } = require('../../vendor/Export2Excel')　　　
　　　　　const tHeader = ['序号', '平台', '文章标题', '转载数', '评论数', '阅读数', '点赞数', '发布时间', '作者']; //对应表格输出的title
　　　　　const filterVal = ['inx', 'platformName', 'title', 'transNum', 'commentNum', 'clickNum', 'thumbsNum', 'publishTime', 'author']; // 对应表格输出的数据
         var params = {
            startTime: this.datePickerParams.startTime,
            accountType: this.datePickerParams.accountType,
            pageNo: 1,
            pageSize: 200,
            original: this.original,
            order: this.order
         };
         if (this.plantformId && this.plantformId.length > 1) {
          if (this.sidebarType == 1002) {
            params.platformId = this.plantformId;
            params.platformTypeId = '';
            params.groupId = '';
          } else if (this.sidebarType === 1001 || this.sidebarType === 1003) {
            params.platformTypeId = this.plantformId;
            params.groupId = '';
            params.platformId = '';
          // 查全部
          } else if(this.sidebarType === 1000){
            params.platformTypeId = '';
            params.groupId = '';
            params.platformId = '';
          }
         }
          var total = 0;
          var list = [];
          this.getExportDatas(params, total, [], tHeader, filterVal);
　　　　});
　　　},　　　
      getExportDatas(params, total, list, tHeader, filterVal){
        var dataList = list || [];
        this.$http.get(this.baseUrl + '/hotarticle/find', {params: params}).then(function (res) {
          var response = JSON.parse(res.bodyText)
          if (response.code == 200 && response.data.content) {
            var data = response.data;
            total = data.totalElements;
            response.data.content.forEach(function (item) {
              dataList.push({
                inx: item.inx,
                platformName: item.platformName,
                title: item.title,
                transNum: item.transNum,
                commentNum: item.commentNum,
                clickNum: item.clickNum,
                thumbsNum: item.thumbsNum,
                publishTime: item.publishTime,
                author: item.author,
              });
            });
            if( Math.ceil(total/params.pageSize) == params.pageNo || params.pageNo>50){
              var data = this.formatJson(filterVal, list);
              export_json_to_excel(tHeader, data, '作品_'+ new Date(this.datePickerParams.startTime).Format('yyyy-MM-dd')); // 对应下载文件的名字 　　　　　　
            } else{
              params.pageNo = params.pageNo + 1;
              this.getExportDatas(params, total, dataList, tHeader, filterVal);
            }
          }
        }, function (err) {
          this.$message({message: '导出数据失败！'});
          // this.zc_log(err);
        });
      },
      formatJson(filterVal, list){
        var dataList = [];
        list.forEach(function (item) {
          dataList.push([
            item.inx,
            item.platformName,
            item.title,
            item.transNum,
            item.commentNum,
            item.clickNum,
            item.thumbsNum,
            item.publishTime,
            item.author,
          ]);
        });
        return dataList;
      },
      refreshData({selected, currentPage, pageSize, sortingIndex,descOrAsc}) {
        //this.zc_log(`筛选项=${selected},当前页=${currentPage},每页数=${pageSize},排序项=${sortingIndex}`);
        this.pageNo = currentPage;
        this.pageSize = pageSize;
        if (sortingIndex >= 3 && sortingIndex <= 7) {
          this.order = sortingIndex - 3;
        }
        this.original = selected;
        this.descOrAsc=descOrAsc
      },
      clickTablecell({rowIndex, columnIndex}) {
        this.zc_log(`行号=${rowIndex},列号=${columnIndex}`);
        if (columnIndex == 9) {
          return;
          var data = this.hotworkData[rowIndex]
          if (!data.platformTypeId || !data.articleId) {
            this.$message({
              duration: 1500,
              message: "参数错误"
            });
            return
          }
          window.open("/spreadAnalyze?platformTypeId=" + data.platformTypeId + "&articleId=" + data.articleId)
        }

        if(columnIndex === 2){
          let uid = this.hotworkData[rowIndex].unionId;
          let aid = this.hotworkData[rowIndex].articleId;
          window.open('detail?uid='+ uid+'&aid='+ aid);
          // this.$router.push('/detail/'+ uid+'/'+ aid);
        }

      },

      //热门作品页
      loadHotWorkData() {

        var params = {
          startTime: this.datePickerParams.startTime,
          accountType: this.datePickerParams.accountType,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          original: this.original,
          order: this.order,
          descOrAsc:this.descOrAsc
        };
        if (this.plantformId && this.plantformId.length > 1) {
          if (this.sidebarType === 1001) {
            params.platformTypeId = this.plantformId;
          } else if (this.sidebarType === 1002) {
            params.platformId = this.plantformId;
          } else if (this.sidebarType === 1003) {
            params.groupId = this.plantformId;
          }
        }
        this.zc_log('热门作品页参数')
        this.zc_log(params)

        this.$http.get(this.baseUrl + '/hotarticle/find', {params: params}).then(function (res) {
          var response = JSON.parse(res.bodyText)
          this.zc_log('热门作品数据');
          this.zc_log(response)
          this.hotworkData = [];
          this.total = 0;
          if (response.code == 200 && response.data.content) {
            this.handleData_hotwork(response.data, this.order)
          } else {
            this.getTableOptions()
          }

        }, function (err) {
          //this.zc_log('失败');
          //this.zc_log(err);
          this.getTableOptions()
        })
      },

      handleData_hotwork(data, index) {
        // //this.zc_log('热门作品数据');
        // //this.zc_log(data);
        this.total = data.totalElements;

        this.hotworkData = data.content;

        //筛选数据
        this.hotworkData.forEach(function (value) {
          // 当"作者"为空时显示"-"
          if (value.author == null || value.author.length == 0) {
            value.author = "-";
          }
          if (value.pageRank == null || parseFloat(value.pageRank) === 0) {
            value.pageRank = "-";
          }


        // (转载数＋阅读数＋评论)/(转载数＊4+阅读数＊1.5＋评论)*(100-已发布时间（单位小时，发布时间大于100小时则z为0)
          let x = value.transNum*4+value.clickNum*1.5+value.commentNum;
          let y = value.transNum+value.clickNum+value.commentNum;
          let L = 0;
          let hour = (new Date().getTime() - new Date(value.publishTime).getTime()) / (3600 * 1000);

          if (hour < 12) {
            L = 12;
          } else if (hour >= 12 && hour < 24) {
            L = 24;
          } else if (hour >= 24 && hour < 48) {
            L = 48;
          } else if (hour >= 48 && hour < 96) {
            L = 96;
          } else {
            L = 96;
          }

          let z = hour<96?(L - hour):24;

          // console.log(hour);
          value.analyze = parseInt(((x==0||y==0)?1:(x/y))*z);


        });


        this.getTableOptions();

        // alert(index)
        this.options.columnStyle.styles[index + 3].color = '#444'//'#3B87F5';
        this.options.headerStyle.indexs.push(index + 3);
        this.options.headerStyle.styles.push({color: '#3B87F5'})
      },


      getTableOptions() {
        this.hotworkColumn = [
          {prop: 'inx', label: '序号'},
          {prop: 'platformName', label: '平台'},
          {prop: 'title', label: '文章标题'},
          {prop: 'transNum', label: '转载数',msg:true},
          {prop: 'commentNum', label: '评论数',msg:true},
          {prop: 'clickNum', label: '阅读数',msg:true},
          {prop: 'thumbsNum', label: '点赞数',msg:true},
          {prop: 'publishTime', label: '发布时间',msg:true},
          {prop: 'author', label: '作者'},
          {prop: 'pageRank', label: '传播力'},
        ];
        this.options = {
          id: 'hotwork_content',
          total: this.total,
          showBorder: false,
          //表格列样式
          columnStyle: {
            indexs: [0, 1, 2, 3, 4, 5, 6, 7, 8,9],
            styles: [
              {width: this.getLineUnitWidth(61) * 3},
              {width: this.getLineUnitWidth(61) * 8, textAlign: 'left'},
              {textAlign: 'left', color: '#3B87F5',cursor:"pointer"},
              {width: this.getLineUnitWidth(61) * 5},
              {width: this.getLineUnitWidth(61) * 5},
              {width: this.getLineUnitWidth(61) * 5},
              {width: this.getLineUnitWidth(61) * 5},
              {width: this.getLineUnitWidth(61) * 8},
              {width: this.getLineUnitWidth(61) * 6},
              {width: this.getLineUnitWidth(61) * 4, color: '#3B87F5'},
            ],
            commons: {textAlign: 'center', color: '#444'}
          },
          //表格表头样式
          headerStyle: {
            indexs: [1, 2, 3, 4, 5, 6, 7],
            styles: [
              {textAlign: 'left'},
              {textAlign: 'left'},
              {cursor: 'pointer'},
              {cursor: 'pointer'},
              {cursor: 'pointer'},
              {cursor: 'pointer'},
              {cursor: 'pointer'},
            ],
            commons: {backgroundColor: '#f4f4f4', textAlign: 'center', padding: '5px 0'}
          },
          // 筛选项数据
          selectData: [
            {value: 0, label: '全部'},
            {value: 1, label: '原创'},
            {value: 2, label: '非原创'},
          ]
        };
      }
    },
    mounted() {
      this.getTableOptions();
      // var data = {
      //   id:"hotwork"
      // }
      // this.registerCreateReportParams(this.$route.path,data)
    }
  }
</script>

<style scoped>
.block_rzl{
  position: relative;
}
.hotwork >>> .el-pagination__rightwrapper{
  padding-right: 70px;
}
.table_export{
  position: absolute;
  right: 50px;
  bottom: 33px;
  text-align: center;
  width: 60px;
  /* font-size: 13px; */
  min-width: 35.5px;
  height: 28px;
  /* line-height: 28px; */
  letter-spacing: 2px;
  color: #fff;
  background-color: #3B87F5;
  /* border-radius: 4px; */
  box-sizing: border-box;
  cursor: pointer;
  overflow: hidden;
}
.hotwork >>> .el-button{
  padding: 0;
  background-color: #3B87F5;
}
.table_export:hover{
  filter: opacity(80%);
}
/*复写弹窗的样式*/
.hotwork >>> .el-tooltip__popper.is-light{
  border: 1px solid #909399;
  box-shadow: 0 5px 10px 0 rgba(49, 49, 51, 0.50);
  /* background: #fff;
  color: #444; */
}
/*.hotwork >>> .el-button:active{*/
  /*!* filter: opacity(80%) ; *!*/
  /*color: #fff ;*/
  /*box-shadow: 0 5px 10px 0 rgba(70, 66, 255, 0.50);*/
/*}*/
/*.hotwork >>> .el-button:hover{*/
  /*color: #fff ;*/
  /*background-color: #3B87F5;*/
/*}*/
</style>
