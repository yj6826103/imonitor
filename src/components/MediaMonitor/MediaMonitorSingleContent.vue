<template>

  <div class="block_rzl">
    <div class="title_rzl">{{showName}}</div>
    <div class="single_tables" v-if="tableData.length>0">
      <tables :data="tableData"
              :columnData="columnData"
              :options="tableOptions"
              @refresh-data="refreshTableData"
              @zctable-update="zctableUpdate"
              @click-tablecell="tablecellClick"
              @handle-cell-click="handleCellClick">
      </tables>
    </div>
    <div class="empty_block" v-if="tableData.length ==0 ">暂无相关数据</div>
  </div>
</template>

<script>

  import Tables from '@/components/common/ZCTables'

  export default {
    name: "media-monitor-single-content",
    components:{Tables},
    watch: {
      // plantformId(val) {
      //   this.zc_log('plantformId改变了');
      //   // this.loadEmphasisMediaData();
      // },
      // startTime(val) {
      //   if (this.startTime) {
      //     this.zc_log('startTime改变了');
      //     // this.loadEmphasisMediaData();
      //   }
      // },
      // accountType(val) {
      //   if (this.accountType) {
      //     this.zc_log('accountType改变了');
      //     // this.loadEmphasisMediaData();
      //   }
      // },
      // pageNo(val) {
      //   this.zc_log('pageNo改变了');
      //   this.unifyLoad();
      // },
      // pageSize(val) {
      //   this.zc_log('pageSize改变了');
      //   this.unifyLoad();
      // }
    },
    data(){
      return {
        // 判断展示的是那个类型的数据(在跳转页面定义)
        queryType: 0,
        listType: '',
        listName: '',
        resourceUrl: '',
        resourceName: '',
        groupId: '',
        platformTypeId: '',
        plantformId: '',
        startTime: '',
        endTime: '',
        accountType: '',
        pageNo: 1,//当前页码数
        pageSize: 10,//每页条数
        mediaType: '',
        channel: '',
        name: '',
        queryId: '',
        mediaId: '',
        publishStatus: '',
        mainGroup: '',
        isGroupPlantform: false,
        total: 0,//转载总数
        //表格数据
        tableData: [],
        //表格表头数据
        columnData: [],
        //表格参数列表
        tableOptions: {},
        headerData: [],
        showName: '',
      }
    },
    methods: {
      zctableUpdate({selected, pageNum, counts}) {
        // alert(`筛选项=${selected},当前页=${pageNum},每页数=${counts}`);
      },

      tablecellClick({rowIndex,columnIndex}){
        // 媒体转载占比的跳转 转载渠道占比的跳转
        if( (this.listType == "synopsisMedia" || this.listType == "synopsisChinnal" ) && (columnIndex == 2 ||columnIndex == 4) ){
          // 原文标题点击：打开新页面跳转到单篇文章分析
          if(columnIndex && columnIndex == 4){
            var unionId = this.tableData[rowIndex].unionId;
            var articleId = this.tableData[rowIndex].articleId;
            if(unionId == '-' || articleId == '-'){
              this.$message({message: '链接已失效！'});
            }else{
              var url = 'detail?uid='+unionId + '&aid=' + articleId;
              window.open(url);
            }
          // 转载标题点击：打开新页面跳转到文章链接页面
          }else if(columnIndex && columnIndex == 2){
            var reprintUrl = this.tableData[rowIndex].transUrl;
            // 如果不存在外链接则跳转至本系统首页
            if(reprintUrl == '-'){
              this.$message({message: '链接已失效！'});
            }else{
              window.open(reprintUrl);
            }
          }
        }
        // 媒体转载排行
        else if( this.listType == "reprintMedia" && (columnIndex == 1 ||columnIndex == 3) ){
          // 原文标题点击：打开新页面跳转到单篇文章分析
          if(columnIndex && columnIndex == 3){
            var unionId = this.tableData[rowIndex].unionId;
            var articleId = this.tableData[rowIndex].articleId;
            if(unionId == '-' || articleId == '-'){
              this.$message({message: '链接已失效！'});
            }else{
              var url = 'detail?uid='+unionId + '&aid=' + articleId;
              window.open(url);
            }
          // 转载标题点击：打开新页面跳转到文章链接页面
          }else if(columnIndex && columnIndex == 1){
            var reprintUrl = this.tableData[rowIndex].transUrl;
            // 如果不存在外链接则跳转至本系统首页
            if(reprintUrl == '-'){
              this.$message({message: '链接已失效！'});
            }else{
              window.open(reprintUrl);
            }
          }
        }
        // 平台转载排行
        else if( this.listType == "reprintPlantform" && (columnIndex == 1 ||columnIndex == 3) ){
          // 原文标题点击：打开新页面跳转到单篇文章分析
          if(columnIndex && columnIndex == 1){
            var unionId = this.tableData[rowIndex].unionId;
            var articleId = this.tableData[rowIndex].articleId;
            if(unionId == '-' || articleId == '-'){
              this.$message({message: '链接已失效！'});
            }else{
              var url = 'detail?uid='+unionId + '&aid=' + articleId;
              window.open(url);
            }
          // 转载标题点击：打开新页面跳转到文章链接页面
          }else if(columnIndex && columnIndex == 3){
            var reprintUrl = this.tableData[rowIndex].transUrl;
            // 如果不存在外链接则跳转至本系统首页
            if(reprintUrl == '-'){
              this.$message({message: '链接已失效！'});
            }else{
              window.open(reprintUrl);
            }
          }
        }
        // 重点媒体监测-媒体转载
        else if( this.listType == "mediaEmphasis" && (columnIndex == 1 ||columnIndex == 3) ){
          // 原文标题点击：打开新页面跳转到单篇文章分析
          if(columnIndex && columnIndex == 3){
            var unionId = this.tableData[rowIndex].unionId;
            var originalId = this.tableData[rowIndex].originalId;
            if(unionId == '-' || originalId == '-'){
              this.$message({message: '链接已失效！'});
            }else{
              var url = 'detail?uid='+unionId + '&aid=' + originalId;
              window.open(url);
            }
          // 转载标题点击：打开新页面跳转到文章链接页面
          }else if(columnIndex && columnIndex == 1){
            var reprintUrl = this.tableData[rowIndex].transUrl;
            // 如果不存在外链接则跳转至本系统首页
            if(reprintUrl == '-'){
              this.$message({message: '链接已失效！'});
            }else{
              window.open(reprintUrl);
            }
          }
        }
        // 重点媒体监测-平台转载
        else if( this.listType == "mediaPlantform" && (columnIndex == 1 ||columnIndex == 3) ){
          // 原文标题点击：打开新页面跳转到单篇文章分析
          if(columnIndex && columnIndex == 1){
            var unionId = this.tableData[rowIndex].unionId;
            var originalId = this.tableData[rowIndex].originalId;
            if(unionId == '-' || originalId == '-'){
              this.$message({message: '链接已失效！'});
            }else{
              var url = 'detail?uid='+unionId + '&aid=' + originalId;
              window.open(url);
            }
          // 转载标题点击：打开新页面跳转到文章链接页面
          }else if(columnIndex && columnIndex == 3){
            var reprintUrl = this.tableData[rowIndex].transUrl;
            // 如果不存在外链接则跳转至本系统首页
            if(reprintUrl == '-'){
              this.$message({message: '链接已失效！'});
            }else{
              window.open(reprintUrl);
            }
          }
        }
        // 重点媒体监测--媒体（更多）
        else if( this.listType == "mediaEmphasisMore" && (columnIndex == 2 ||columnIndex == 3) ){
          // 跳转至媒体转载列表
          var  mediaId = this.tableData[rowIndex].mediaId;
          var name = this.tableData[rowIndex].originMediaName;
          var params = {
            queryType: 1, //queryType : 1查媒体
            listName: '重点监测媒体转载排行',
            listType: 'mediaEmphasis',
            resourceUrl: '/mediamonitor',
            resourceName: '重点媒体监测',
            plantformId: '',
            startTime: this.startTime,
            endTime: this.endTime,
            accountType: '',
            pageNo: 1,
            pageSize: 10,
            name: name,
            groupId : '',
            queryId: mediaId,
            mediaId: '',
          };
          if( columnIndex == 2){
            params.publishStatus = 1;
          }else if(columnIndex == 3){
            params.publishStatus = 0;
          }
          var newUrl = 'mediaMonitorSingle?';
          for(var key in params){
            newUrl += key +'=' + params[key] + '&';
          }
          newUrl = newUrl.substring(0, newUrl.length-1);
          this.zc_log(params);
          window.open(newUrl);
        }
        // 重点媒体监测--平台（更多）
        else if( this.listType == "mediaPlantformMore" && (columnIndex == 2 ||columnIndex == 3) ){
          var  plantformId = this.tableData[rowIndex].platformId;
          var  name = this.tableData[rowIndex].originPlatformName;
          var params = {
            queryType: 2,
            listName: '平台转载排行',
            listType: 'mediaPlantform',
            resourceUrl: '/mediamonitor',
            resourceName: '重点媒体监测',
            plantformId: '',
            startTime: this.startTime,
            endTime: this.endTime,
            accountType: this.accountType,
            pageNo: 1,
            pageSize: 10,
            name: name,
            queryId: plantformId,
          };
          if( columnIndex == 2){
            params.publishStatus = 1;
          }else if(columnIndex == 3){
            params.publishStatus = 0;
          }
          var newUrl = 'mediaMonitorSingle?';
          for(var key in params){
            newUrl += key +'=' + params[key] + '&';
          }
          newUrl = newUrl.substring(0, newUrl.length-1);
          this.zc_log(params);
          window.open(newUrl);
        }
        else if( this.listType == "reprintMediaMore" && (columnIndex == 2 ||columnIndex == 5) ){
          var  mediaName = '';
          if( columnIndex == 2){
            mediaName = this.tableData[rowIndex].mediaNameFirst || '';
          }else if(columnIndex == 5){
            mediaName = this.tableData[rowIndex].mediaNameLast || '';
          }
          if(mediaName == ''){
            return false;
          }
          var params = {
            queryType: 1, //queryType : 1查媒体
            listName: '媒体转载排行',
            listType: 'reprintMedia',
            resourceUrl: '/reprint',
            resourceName: '媒体转载分析',
            groupId: '',
            platformTypeId: '',
            platformId: this.plantformId,
            accountType: this.accountType,
            startTime: this.startTime,
            pageNo: 1,
            pageSize: 10,
            name: mediaName,
          };
          var newUrl = 'mediaMonitorSingle?';
          for(var key in params){
            newUrl += key +'=' + params[key] + '&';
          }
          newUrl = newUrl.substring(0, newUrl.length-1);
          this.zc_log(params);
          window.open(newUrl);
        }
      },

      handleCellClick({rowIndex}){
        // alert(`点击了第${rowIndex}行的操作键`);
      },
      refreshTableData({selected, currentPage, pageSize, sortingIndex}) {
        this.zc_log(`筛选项=${selected},当前页=${currentPage},每页数=${pageSize},排序项=${sortingIndex}`);
        this.pageNo = currentPage;
        this.pageSize = pageSize;
        this.unifyLoad();
      },
      // 首页--转载媒体占比和转载渠道占比公用样式
      // 媒体转载分析--转载媒体占比和转载渠道占比公用样式
      _synopsisTableOptions(){
        this.columnData = [
          {prop: 'indexNum', label: '序号'},
          {prop: 'tranMediaName', label: '转载媒体'},
          {prop: 'transTitle', label: '转载标题'},
          {prop: 'originalPlatform', label: '平台'},
          {prop: 'originalTitle', label: '原文标题'},
          {prop: 'transPublishTime', label: '转载时间'},
        ];
        this.tableOptions = {
          id: 'single_content',
          title: this.listName,
          total: this.total,
          //表格列样式
          columnStyle: {
            indexs: [0, 1, 2, 3, 4, 5],
            styles: [
              {width: '80px'},
              {width: '160px',textAlign: 'left'},
              {textAlign: 'left', color: '#3B87F5', cursor: 'pointer'},
              {width: '160px',textAlign: 'left'},
              {textAlign: 'left', color: '#3B87F5', cursor: 'pointer'},
              {width: '140px'},
            ],
            commons: {textAlign: 'center'}
          },
          //表格行样式
          rowStyle: {
            indexs: [],
            styles: [],
            commons: {}
          },
          //表格表头样式
          headerStyle: {
            indexs: [1, 2, 3, 4],
            styles: [{textAlign: 'left'}, {textAlign: 'left'},{textAlign: 'left'},{textAlign: 'left'}],
            commons: {backgroundColor: '#f4f4f4', textAlign: 'center', padding: '5px 0', color: '#444444'}
          },
        };
      },
      // 重点媒体监测-重点监测媒体转载排行和平台转载排行(更多)公用样式
      _EmphasisMediaMoreTableOptions(){
        this.columnData = [
          {prop: 'platform', label: ''},
          {prop: 'mediaName', label: '转载媒体'},
          {prop: 'homePageTrans', label: '首页转载数'},
          {prop: 'nonHomeTrans', label: '非首页转载数'}
        ];
        this.tableOptions = [];
        this.tableOptions = {
          id: 'single_content',
          title: this.listName,
          total: this.total,
          titleStyle: {fontSize: '20px', color: '#111111', width: '100%'},
          //表格列样式
          columnStyle: {
            indexs: [0, 1, 2, 3],
            styles: [
              {width: '200px',textAlign: 'left', padding:'0 0 0 50px'},
              {textAlign: 'center'},
              {textAlign: 'center', color: '#3B87F5', cursor: 'pointer'},
              {textAlign: 'center', color: '#3B87F5', cursor: 'pointer'},
            ],
            commons: {textAlign: 'center'}
          },
          //表格行样式
          rowStyle: {
            indexs: [],
            styles: [],
            commons: {}
          },
          //表格表头样式
          headerStyle: {
            indexs: [0, 1, 2],
            styles: [{textAlign: 'center'}, {textAlign: 'center'}, {textAlign: 'center'}],
            commons: {backgroundColor: '#f4f4f4', textAlign: 'center', padding: '5px 0', color: '#444444'}
          }
        };
      },
      // 统一请求表格数据的接口
      _getTableData(params, dataFn, dataUrl){
        this.$http.get(this.baseUrl + dataUrl, {params: params}).then(function (res) {
          var response = JSON.parse(res.bodyText);
          if (response.code == 200 && response.data) {
            dataFn(response.data, params);
          }
        }, function (err) {
          this.zc_log(err);
        });
      },
      // 获取重点媒体列表的数据的入口
      _getEmphasisMediaTableData(params,dataFn, dataUrl){
        this.$http.get(this.baseUrl + dataUrl, {params: params}).then(function (res) {
          var response = JSON.parse(res.bodyText);
          if (response.code == 200 && response.data) {
            dataFn(response.data, params);
          }
        }, function (err) {
          this.zc_log(err);
        });
      },
      // 数据加载的统一入口
      unifyLoad(){
        // 首页-转载媒体占比列表(某一媒体)
        // 媒体转载分析-转载媒体占比列表(某一媒体)
        if(this.listType == 'synopsisMedia'){
          this.loadSynopsisMediaData();
        }
        // 首页-转载渠道占比列表(某一渠道)
        // 媒体转载分析-转载渠道占比列表(某一渠道)
        else if(this.listType == 'synopsisChinnal'){
          this.loadSynopsisChinnalData();
        }
        // 首页-平台转载排行列表(某一平台)
        // 媒体转载分析-平台转载排行列表(某一平台)
        else if(this.listType == 'reprintPlantform'){
          this.loadReprintPlantformData();
        }
        // 首页-媒体转载排行列表(某一媒体)
        // 媒体转载分析-媒体转载排行列表(某一媒体)
        else if(this.listType == 'reprintMedia'){
          this.loadReprintMediaData();
        }
        // 媒体转载分析-媒体转载排行列表(更多)
        else if(this.listType == 'reprintMediaMore'){
          this.loadMoreReprintMediaData();
        }
        // 重点媒体监测--重点监测媒体转载排行(更多)
        else if(this.listType == 'mediaEmphasisMore'){
          this.loadMoreMediaEmphasisData();
        }
        // 重点媒体监测--重点监测媒体转载排行(某一媒体)
        else if(this.listType == 'mediaEmphasis'){
          this.loadMediaEmphasisData();
        }
        // 重点媒体监测--平台转载排行(更多)
        else if(this.listType == 'mediaPlantformMore'){
          this.loadMoreMediaPlantformData();
        }
        // 重点媒体监测--平台转载排行(某一平台)
        else if(this.listType == 'mediaPlantform'){
          this.loadMediaPlantformData();
        }
      },

      // 首页-转载媒体占比列表(某一媒体)
      // 媒体转载分析-转载媒体占比列表(某一媒体)
      loadSynopsisMediaData(){
        var params = {
          groupId: this.groupId,
          platformTypeId: this.platformTypeId,
          platformId: this.plantformId,
          accountType: this.accountType,
          startTime: this.startTime,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          mediaType: this.mediaType,
        };
        // 后端查全部时 groupId为空
        if(params.groupId == 0){
          params.groupId = '';
        }
        this.zc_log("转载媒体占比列表--参数");
        this.zc_log(params);
        this._getTableData(params, this._computedSynopsisMediaData, '/articleList/transMediaType');
      },
      _computedSynopsisMediaData(datas, params){
        var data = datas.content;
        this.total =datas.totalElements;
        var tableArr = [];
        var indexNum = (params.pageNo -1) * params.pageSize;

         //筛选数据：空数据全部显示为- ,如果当前刊登状态不是首页和非首页这2种状态则统一显示为'-'
        data.forEach(function (item,index) {
          var obj = item;
          for(var key in obj){
            if(obj[key] == null || obj[key].length == 0){
              obj[key] = "-";
            }
            // 处理转载时间
            if( key == 'transPublishTime' && obj[key] != "-"){
              obj[key] = obj[key].toString().substring(0, obj[key].toString().lastIndexOf(":"));
            }
          }

          tableArr.push({
            indexNum: index + indexNum + 1,
            tranMediaName: item.tranMediaName,
            transTitle: item.transTitle,
            originalPlatform: item.originalPlatform,
            originalTitle: item.originalTitle,
            transPublishTime: item.transPublishTime,
            transUrl: item.transUrl,
            articleId: item.articleId,
            unionId: item.unionId,
          });
        });
        this.tableData = tableArr;
        this._synopsisTableOptions();
      },
      // 首页-转载渠道占比列表(某一渠道)
      // 媒体转载分析-转载渠道占比列表(某一渠道)
      loadSynopsisChinnalData(){
        var params = {
          platformId: this.plantformId,
          platformTypeId: this.platformTypeId,
          groupId: this.groupId,
          startTime: this.startTime,
          accountType: this.accountType,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          channel: this.channel,
        };
        // 后端查全部时 groupId为空
        if(params.groupId == 0){
          params.groupId = '';
        }
        this.zc_log("转载渠道占比列表--参数");
        this.zc_log(params);
        this._getTableData(params, this._computedSynopsisMediaData, '/articleList/transChannel');
      },
      _computedSynopsisChinnalData(datas){
        var data = datas.content;
        this.total = datas.totalElements;
        var tableArr = [];
         //筛选数据：空数据全部显示为- ,如果当前刊登状态不是首页和非首页这2种状态则统一显示为'-'
        data.forEach(function (item,index) {
          var obj = item;
          for(var key in obj){
            if(obj[key] == null || obj[key].length == 0){
              obj[key] = "-";
            }
            // 处理转载时间
            if( key == 'transPublishTime' && obj[key] != "-"){
              obj[key] = obj[key].toString().substring(0, obj[key].toString().lastIndexOf(":"));
            }
          }
          tableArr.push({
            webpageCode:　item.webpageCode,
            transUrl: item.transUrl,
            originalId: item.originalId,
            originalUrl: item.originalUrl,
            tranMediaName: item.tranMediaName,
            transTitle: item.transTitle,
            originalPlatform: item.originalPlatform,
            originalTitle: item.originalTitle,
            transPublishTime: item.transPublishTime,
            articleId: item.articleId,
            unionId: item.unionId,
          });
        });
        this.tableData = tableArr;
        this._synopsisTableOptions();
        // this.zc_log(this.tableData);
      },
      // 首页-平台转载排行(某一平台)
      // 媒体转载分析-平台转载排行列表(某一平台)
      loadReprintPlantformData(){
          var params = {
          platformId: this.plantformId,
          accountType: this.accountType,
          startTime: this.startTime,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        };
        this.zc_log("平台转载排行列表--参数");
        this.zc_log(params);
        this._getTableData(params, this._computedReprintPlantformData, '/articleList/transPlatform');
      },
      _computedReprintPlantformData(datas, params){
        var data = datas.content;
        this.total = datas.totalElements;
        var tableArr = [];
        var indexNum = (params.pageNo -1) * params.pageSize;
         //筛选数据：空数据全部显示为- ,如果当前刊登状态不是首页和非首页这2种状态则统一显示为'-'
        data.forEach(function (item,index) {
          var obj = item;
          for(var key in obj){
            if(obj[key] == null || obj[key].length == 0){
              item[key] = "-";
            }
            // 处理转载时间
            if( key == 'transPublishTime' && obj[key] != "-"){
              item[key] = obj[key].toString().substring(0, obj[key].toString().lastIndexOf(":"));
            }
          }
          tableArr.push({
            indexNum: index + indexNum + 1,
            webpageCode:　item.webpageCode,
            transUrl: item.transUrl,
            originalId: item.originalId,
            originalUrl: item.originalUrl,
            tranMediaName: item.tranMediaName,
            transTitle: item.transTitle,
            originalPlatform: item.originalPlatform,
            originalTitle: item.originalTitle,
            transPublishTime: item.transPublishTime,
            articleId: item.articleId,
            unionId: item.unionId,
          });
        });
        this.tableData = tableArr;
        this.columnData = [
          {prop: 'indexNum', label: '序号'},
          {prop: 'originalTitle', label: '原文标题'},
          {prop: 'tranMediaName', label: '转载媒体'},
          {prop: 'transTitle', label: '转载标题'},
          {prop: 'transPublishTime', label: '转载时间'},
        ];
        this.tableOptions = {
          id: 'single_content',
          title: this.listName,
          total: this.total,
          //表格列样式
          columnStyle: {
            indexs: [0, 1, 2, 3, 4],
            styles: [
              {width: '80px'},
              {textAlign: 'left', color: '#3B87F5', cursor:'pointer'},
              {width: '140px', textAlign: 'left'},
              {textAlign: 'left', color: '#3B87F5', cursor:'pointer'},
              {width: '140px'},
            ],
            commons: {textAlign: 'center'}
          },
          //表格行样式
          rowStyle: {
            indexs: [],
            styles: [],
            commons: {}
          },
          //表格表头样式
          headerStyle: {
            indexs: [ 1, 2, 3],
            styles: [{textAlign: 'left'}, {textAlign: 'left'}, {textAlign: 'left'}],
            commons: {backgroundColor: '#f4f4f4', textAlign: 'center', padding: '5px 0', color: '#444444'}
          },
        };
        // this.zc_log(this.tableData);
      },
      // 首页-媒体转载排行(某一媒体)
      // 媒体转载分析-媒体转载排行列表(某一媒体)
      loadReprintMediaData(){
        var params = {
          groupId: this.groupId,
          platformTypeId: this.platformTypeId,
          platformId: this.plantformId,
          accountType: this.accountType,
          startTime: this.startTime,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          mediaName: this.name,
        };
        this.zc_log("媒体转载排行列表--参数");
        this.zc_log(params);
        this._getTableData(params, this._computedReprintMediaData, '/articleList/transMediaOrder');
      },
      _computedReprintMediaData(datas, params){
        var data = datas.content;
        this.total = datas.totalElements;
        var tableArr = [];
        var indexNum = (params.pageNo -1) * params.pageSize;
         //筛选数据：空数据全部显示为- ,如果当前刊登状态不是首页和非首页这2种状态则统一显示为'-'
        data.forEach(function (item,index) {
          var obj = item;
          for(var key in obj){
            if(obj[key] == null || obj[key].length == 0){
              item[key] = "-";
            }
            // 处理转载时间
            if( key == 'transPublishTime' && obj[key] != "-"){
              item[key] = obj[key].toString().substring(0, obj[key].toString().lastIndexOf(":"));
            }
          }
          tableArr.push({
            indexNum: index + indexNum + 1,
            webpageCode:　item.webpageCode,
            transUrl: item.transUrl,
            originalId: item.originalId,
            originalUrl: item.originalUrl,
            tranMediaName: item.tranMediaName,
            transTitle: item.transTitle,
            originalPlatform: item.originalPlatform,
            originalTitle: item.originalTitle,
            transPublishTime: item.transPublishTime,
            articleId: item.articleId,
            unionId: item.unionId,
          });
        });
        this.tableData = tableArr;
        this.columnData = [
          {prop: 'indexNum', label: '序号'},
          {prop: 'transTitle', label: '转载标题'},
          {prop: 'originalPlatform', label: '平台'},
          {prop: 'originalTitle', label: '原文标题'},
          {prop: 'transPublishTime', label: '转载时间'},
        ];
        this.tableOptions = {
          id: 'single_content',
          title: this.listName,
          total: this.total,
          //表格列样式
          columnStyle: {
            indexs: [0, 1, 2, 3, 4],
            styles: [
              {width: '80px'},
              {textAlign: 'left', color: '#3B87F5', cursor:'pointer'},
              {width: '160px', textAlign: 'left'},
              {textAlign: 'left', color: '#3B87F5', cursor:'pointer'},
              {width: '140px'},
            ],
            commons: {textAlign: 'center'}
          },
          //表格行样式
          rowStyle: {
            indexs: [],
            styles: [],
            commons: {}
          },
          //表格表头样式
          headerStyle: {
            indexs: [1, 2, 3],
            styles: [{textAlign: 'left'}, {textAlign: 'left'}, {textAlign: 'left'}],
            commons: {backgroundColor: '#f4f4f4', textAlign: 'center', padding: '5px 0', color: '#444444'}
          },
        };
        this.zc_log(this.tableData);
      },
      // 媒体转载分析-媒体转载排行列表(更多)
      loadMoreReprintMediaData(){
        var params = {
          mediaType: this.mediaType,
          channel: this.channel,
          groupId: this.groupId,
          platformTypeId: this.platformTypeId,
          platformId: this.plantformId,
          accountType: this.accountType,
          startTime: this.startTime,
          pageNo: this.pageNo,
          pageSize: this.pageSize,

        };
        this.zc_log("媒体转载排行列表--更多");
        this.zc_log(params);
        this._getTableData(params, this._computedMoreReprintMediaData, "/spreadTrend/mediaOrderSuper");
      },
      _computedMoreReprintMediaData(datas, params){
        var data = datas.mediaList;
        this.total = datas.mediaCover;
        var tableArr = [];
        // var indexNum = (params.pageNo - 1) * params.pageSize;
         //筛选数据：空数据全部显示为- ,如果当前刊登状态不是首页和非首页这2种状态则统一显示为'-'
        data.forEach(function (item,index) {
          var obj = item;
          for(var key in obj){
            if(obj[key] == null || obj[key].length == 0){
              item[key] = "-";
            }
          }
        });


        var tableFirst= [];
        var tableLast= [];
        // 最后一页的情况
        if(data.length%2 != 0){
          tableFirst = data.slice(0, parseInt(data.length/2)+1) ;
          tableLast = data.slice(parseInt(data.length/2)+1, data.length) ;
          // 少了一列,补全
          tableLast.push({indexLast: '', mediaNameLast: '', transNumlast: ''});
        }else{
          tableFirst = data.slice(0, parseInt(data.length/2)) ;
          tableLast = data.slice(parseInt(data.length/2), data.length) ;
        }
        // 构造表格数据结构
        tableFirst.forEach(function (item, index) {
          tableArr.push({
            indexFirst: item.order,
            mediaNameFirst:　item.media_name,
            transNumFirst: item.trans_num,
          });
        });
        var indexLast = tableFirst.length ;
        tableLast.forEach(function (item, index) {
          tableArr[index].indexLast = item.order;
          tableArr[index].mediaNameLast = item.media_name;
          tableArr[index].transNumlast = item.trans_num;
          indexLast = indexLast + 1;
        });

        this.tableData = tableArr;
        this.columnData = [
          {prop: 'indexFirst', label: ''},
          {prop: 'mediaNameFirst', label: '转载媒体'},
          {prop: 'transNumFirst', label: '转载数'},
          {prop: 'indexLast', label: ''},
          {prop: 'mediaNameLast', label: '转载媒体'},
          {prop: 'transNumlast', label: '转载数'},
        ];
        this.tableOptions = {
          id: 'single_content',
          title: this.listName,
          total: this.total,
          //表格列样式
          columnStyle: {
            indexs: [0, 1, 2, 3, 4, 5],
            styles: [
              {width: '120px'},
              {textAlign:'left'},
              { color: '#3B87F5',cursor:'pointer'},
              {width: '120px'},
              {textAlign: 'left'},
              {color: '#3B87F5',cursor:'pointer'},
            ],
            commons: {textAlign: 'center'}
          },
          //表格行样式
          rowStyle: {
            indexs: [],
            styles: [],
            commons: {}
          },
          //表格表头样式
          headerStyle: {
            indexs: [1,4],
            styles: [{textAlign: 'left'},{textAlign: 'left'}],
            commons: {backgroundColor: '#f4f4f4', textAlign: 'center', padding: '5px 0', color: '#444444'}
          },
        };
      },
      // 重点媒体监测-重点监测媒体转载排行(更多)
      loadMoreMediaEmphasisData(){
        var params = {
          queryType: this.queryType,
          startTime: this.startTime,
          endTime: this.endTime,
          queryId: this.queryId,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          mainGroup: this.mainGroup,
        };
        this._getEmphasisMediaTableData(params, this._computedMoreMediaEmphasisData, "/focalmedia/findTransCount");
      },
      _computedMoreMediaEmphasisData(data){
        if(data.content == null){
          return;
        }
        this.total = data.totalElements;
        var tableArr = [];
        data.content.forEach(function (item,index) {
          var obj = item;
          for(var key in obj){
            if(obj[key] == null || obj[key].length == 0){
              obj[key] = "-";
            }
            // 处理转载时间
            if( key == 'transTime' && obj[key] != "-"){
              obj[key] = new Date(obj[key]).Format("yyyy-MM-dd hh:mm");
            }
            // 处理刊登状态
            if( key == 'publishStatus' && obj[key] != "-"){
              if( obj[key] == 0){
                obj[key] = "首页";
              }else if( obj[key] == 1){
                obj[key] = "非首页";
              }
            }
            // 处理刊登时长
           if( key == 'percent' && obj[key] != "-"){
              if( obj[key] < 60){
                obj[key] = obj[key] + '分钟';
              }else if( obj[key] >=60 && obj[key] <1440){
                obj[key] = parseInt(obj[key]/60) + '小时';
              }else if( obj[key] > 24 ){
                obj[key] = parseInt(obj[key]/1440) + '天';
              }
            }
          }
          tableArr.push({
            platform: index + 1,
            mediaName: item.mediaName,
            homePageTrans: item.homePageTrans,
            nonHomeTrans: item.nonHomeTrans,
            mediaId: item.mediaId,
            originMediaName: item.originMediaName,
          });
        });
        this.tableData = tableArr;
        this._EmphasisMediaMoreTableOptions();
      },
       // 重点媒体监测-重点监测媒体转载排行(某一媒体)
      loadMediaEmphasisData(){
        var params = {
          queryType: this.queryType,
          startTime: this.startTime,
          endTime: this.endTime,
          queryId: this.queryId,
          mediaId: this.mediaId,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          publishStatus: this.publishStatus,
          mainGroup: this.mainGroup,
        };
        this.zc_log(params);
        this._getEmphasisMediaTableData(params, this._computedMediaEmphasisData, "/focalmedia/findTransPage");
      },
      _computedMediaEmphasisData(data, params){
        if( !data.pageResult){
          return false;
        }
        this.total = data.pageResult.totalElements;
        var plantFormArr = data.platforms;
        var tableArr = [];
        var indexNum = (params.pageNo -1) * params.pageSize;
        // 筛选数据：空数据全部显示为- ,如果当前刊登状态不是首页和非首页这2种状态则统一显示为'-'
        data.pageResult.content.forEach(function (item,index) {
          var obj = item;
          for(var key in obj){
            if(obj[key] == null || obj[key].length == 0){
              item[key] = "-";
            }
            // 处理转载时间
            if( key == 'transTime' && obj[key] != "-"){
              item[key] = new Date(obj[key]).Format("yyyy-MM-dd hh:mm");
            }
            // 处理刊登状态
            if( key == 'publishStatus' && obj[key] != "-"){
              if( obj[key] == 1){
                item[key] = "首页";
              }else if( obj[key] == 0 || obj[key] == 2 || obj[key] == 3){
                item[key] = "非首页";
              }else {
                item[key] = "-";
              }
            }
            // 处理刊登时长（单位秒）
           if( key == 'homePageSeconds' && obj[key] != "-"){
              if( obj[key] < 60){
                item[key] = '1分钟';
              }else if( obj[key] >=60 && obj[key] <3600){
                item[key] = parseInt(obj[key]/60) + '分钟';
              }else if( obj[key] >=3600 && obj[key] <86400){
                item[key] = parseInt(obj[key]/3600) + '小时';
              }else if( obj[key] > 86400 ){
                item[key] = parseInt(obj[key]/86400) + '天';
              }
            }
          }
          item.platformName = '-';
          // 查找该平台ID对应的平台名称
          plantFormArr.forEach(function (plantForm) {
            if( plantForm.id == item.platformId){
              item.platformName = plantForm.name;
              return false;
            }
          });
          tableArr.push({
            indexNum: index + indexNum + 1,
            transTitle: item.transTitle,
            platformName: item.platformName,
            originalTitle: item.originalTitle,
            transTime: item.transTime,
            publishStatus: item.publishStatus,
            homePageSeconds: item.homePageSeconds,
            transUrl: item.transUrl,
            originalId: item.originalId,
            unionId: item.unionId,
          });
        });
        this.tableData = tableArr;
        // this.zc_log(this.tableData);
        this.columnData = [
          {prop: 'indexNum', label: '序号'},
          {prop: 'transTitle', label: '转载标题'},
          {prop: 'platformName', label: '平台'},
          {prop: 'originalTitle', label: '原文标题'},
          {prop: 'transTime', label: '转载时间'},
          {prop: 'publishStatus', label: '当前刊登状态'},
          {prop: 'homePageSeconds', label: '首页刊登时长'}
        ];
        this.tableOptions = [];
        this.tableOptions = {
          id: 'single_content',
          title: this.listName,
          total: this.total,
          //表格列样式
          columnStyle: {
            indexs: [0, 1, 2, 3, 4, 5, 6],
            styles: [
              {width: '80px'},
              {textAlign: 'left', color: '#3B87F5', cursor: 'pointer'},
              {width: '160px',textAlign: 'left'},
              {textAlign: 'left', color: '#3B87F5', cursor: 'pointer'},
              {width: '140px'},
              {width: '110px'},
              {width: '110px'},
            ],
            commons: {textAlign: 'center'}
          },
          //表格行样式
          rowStyle: {
            indexs: [],
            styles: [],
            commons: {}
          },
          //表格表头样式
          headerStyle: {
            indexs: [1, 2, 3],
            styles: [{textAlign: 'left'}, {textAlign: 'left'}, {textAlign: 'left'}],
            commons: {backgroundColor: '#f4f4f4', textAlign: 'center', padding: '5px 0', color: '#444444'}
          },
        };
      },
      // 重点媒体监测-平台转载排行(更多)
      loadMoreMediaPlantformData(){
         var params = {
          queryType: this.queryType,
          startTime: this.startTime,
          endTime: this.endTime,
          queryId: this.queryId,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          mainGroup: this.mainGroup,
        };
        this._getEmphasisMediaTableData(params, this._computedMoreMediaPlantformData, "/focalmedia/findTransCount");
      },
      _computedMoreMediaPlantformData(data){
        if(data.content == null){
          return;
        }
        this.total = data.totalElements;
        var tableArr = [];
        data.content.forEach(function (item,index) {
          var obj = item;
          for(var key in obj){
            if(obj[key] == null || obj[key].length == 0){
              obj[key] = "-";
            }
            // 处理转载时间
            if( key == 'transTime' && obj[key] != "-"){
              obj[key] = new Date(obj[key]).Format("yyyy-MM-dd hh:mm");
            }
            // 处理刊登状态
            if( key == 'publishStatus' && obj[key] != "-"){
              if( obj[key] == 0){
                obj[key] = "首页";
              }else if( obj[key] == 1){
                obj[key] = "非首页";
              }
            }
            // 处理刊登时长
           if( key == 'percent' && obj[key] != "-"){
              if( obj[key] < 60){
                obj[key] = obj[key] + '分钟';
              }else if( obj[key] >=60 && obj[key] <1440){
                obj[key] = parseInt(obj[key]/60) + '小时';
              }else if( obj[key] > 24 ){
                obj[key] = parseInt(obj[key]/1440) + '天';
              }
            }
          }
          tableArr.push({
            platform: index + 1,
            platformName: item.platformName,
            homePageTrans: item.homePageTrans,
            nonHomeTrans: item.nonHomeTrans,
            mediaId: item.mediaId,
            mediaName: item.mediaName,
            platformId: item.platformId,
            originPlatformName: item.originPlatformName,
          });
        });
        this.tableData = tableArr;
        this.columnData = [
          {prop: 'platform', label: ''},
          {prop: 'platformName', label: '平台'},
          {prop: 'homePageTrans', label: '首页转载数'},
          {prop: 'nonHomeTrans', label: '非首页转载数'}
        ];
        this.tableOptions = [];
        this.tableOptions = {
          id: 'single_content',
          title: this.listName,
          total: this.total,
          titleStyle: {fontSize: '20px', color: '#111111', width: '100%'},
          //表格列样式
          columnStyle: {
            indexs: [0, 1, 2, 3],
            styles: [
              {width: '200px',textAlign: 'left', padding:'0 0 0 50px'},
              {textAlign: 'center'},
              {textAlign: 'center', color: '#3B87F5', cursor: 'pointer'},
              {textAlign: 'center', color: '#3B87F5', cursor: 'pointer'},
            ],
            commons: {textAlign: 'center'}
          },
          //表格行样式
          rowStyle: {
            indexs: [],
            styles: [],
            commons: {}
          },
          //表格表头样式
          headerStyle: {
            indexs: [0, 1, 2],
            styles: [{textAlign: 'center'}, {textAlign: 'center'}, {textAlign: 'center'}],
            commons: {backgroundColor: '#f4f4f4', textAlign: 'center', padding: '5px 0', color: '#444444'}
          }
        };
      },
      // 重点媒体监测-平台转载排行(某一平台)
      loadMediaPlantformData(){
        var params = {
          queryType: this.queryType,
          startTime: this.startTime,
          endTime: this.endTime,
          queryId: this.queryId,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          publishStatus: this.publishStatus,
          mainGroup: this.mainGroup,
        };
        this.zc_log(params);
       this._getEmphasisMediaTableData(params, this._computedMediaPlantformData, '/focalmedia/findTransPage');
      },
      _computedMediaPlantformData(data, params){
        if( !data.pageResult){
          return false;
        }
        this.total = data.pageResult.totalElements;
        var tableArr = [];
        var medias = data.medias;
        var indexNum = (params.pageNo -1) * params.pageSize;
        // 筛选数据：空数据全部显示为- ,如果当前刊登状态不是首页和非首页这2种状态则统一显示为'-'
        data.pageResult.content.forEach(function (item,index) {
          var obj = item;
          for(var key in obj){
            if(obj[key] == null || obj[key].length == 0){
              obj[key] = "-";
            }
            // 处理转载时间
            if( key == 'transTime' && obj[key] != "-"){
              item[key] = new Date(obj[key]).Format("yyyy-MM-dd hh:mm");
            }
            // 处理刊登状态
            if( key == 'publishStatus' && obj[key] != "-"){
              if( obj[key] == 1){
                item[key] = "首页";
              }else if( obj[key] == 0 || obj[key] == 2 || obj[key] == 3){
                item[key] = "非首页";
              }else {
                item[key] = "-";
              }
            }
           // 处理刊登时长（单位秒）
           if( key == 'homePageSeconds' && obj[key] != "-"){
              if( obj[key] < 60){
                item[key] = '1分钟';
              }else if( obj[key] >=60 && obj[key] <3600){
                item[key] = parseInt(obj[key]/60) + '分钟';
              }else if( obj[key] >=3600 && obj[key] <86400){
                item[key] = parseInt(obj[key]/3600) + '小时';
              }else if( obj[key] > 86400 ){
                item[key] = parseInt(obj[key]/86400) + '天';
              }
            }
          }
          item.mediaName = '-';
          // 查找该媒体ID对应的媒体名称
          medias.forEach(function (media) {
            if( media.id == item.mediaId){
              item.mediaName = media.name;
              return false;
            }
          });
          tableArr.push({
            indexNum: index + indexNum + 1,
            transTitle: item.transTitle,
            mediaName: item.mediaName,
            originalTitle: item.originalTitle,
            transTime: item.transTime,
            publishStatus: item.publishStatus,
            homePageSeconds: item.homePageSeconds,
            transUrl: item.transUrl,
            originalId: item.originalId,
            unionId: item.unionId,
          });
        });
        this.tableData = tableArr;
        this.columnData = [
          {prop: 'indexNum', label: '序号'},
          {prop: 'originalTitle', label: '原文标题'},
          {prop: 'mediaName', label: '转载媒体'},
          {prop: 'transTitle', label: '转载标题'},
          {prop: 'transTime', label: '转载时间'},
          {prop: 'publishStatus', label: '当前刊登状态'},
          {prop: 'homePageSeconds', label: '首页刊登时长'}
        ];
        this.tableOptions = [];
        this.tableOptions = {
          id: 'single_content',
          title: this.listName,
          total: this.total,
          //表格列样式
          columnStyle: {
            indexs: [0, 1, 2, 3, 4, 5, 6],
            styles: [
              {width: '80px'},
              {textAlign: 'left', color: '#3B87F5', cursor:'pointer'},
              {width: '160px',textAlign: 'left'},
              {textAlign: 'left', color: '#3B87F5', cursor:'pointer'},
              {width: '140px'},
              {width: '110px'},
              {width: '110px'},
            ],
            commons: {textAlign: 'center'}
          },
          //表格行样式
          rowStyle: {
            indexs: [],
            styles: [],
            commons: {}
          },
          //表格表头样式
          headerStyle: {
            indexs: [1, 2, 3],
            styles: [{textAlign: 'left'}, {textAlign: 'left'}, {textAlign: 'left'}],
            commons: {backgroundColor: '#f4f4f4', textAlign: 'center', padding: '5px 0', color: '#444444'}
          },
        };
      }
    },
    mounted(){
      var queryObj = this.getQueryObjectByUrl();
      this.queryType = queryObj.queryType;
      this.listType = queryObj.listType || '';
      this.listName = queryObj.listName || '';
      this.resourceUrl = queryObj.resourceUrl || '';
      this.resourceName = queryObj.resourceName || '';
      this.startTime = queryObj.startTime || '';
      this.endTime = queryObj.endTime || '';
      this.groupId = queryObj.groupId || '';
      this.platformTypeId = queryObj.platformTypeId || '';
      this.plantformId = queryObj.plantformId || '';
      this.accountType = queryObj.accountType || '';
      this.pageNo = queryObj.pageNo || 1;
      this.pageSize = queryObj.pageSize || 10;
      this.mediaType = queryObj.mediaType || 0;
      this.name = queryObj.name || '';
      this.channel = queryObj.channel || 0;
      this.queryId = queryObj.queryId || '';
      this.mediaId = queryObj.mediaId || '';
      this.mainGroup = queryObj.mainGroup || '';
      this.publishStatus = queryObj.publishStatus || '';

      if( this.name == '' || this.name == null){
        this.showName = this.listName + '列表';
      }else{
        this.showName = this.listName + '列表-' + this.name;
      }
      this.unifyLoad();
    }
  }
</script>

<style scoped>
  .single_content{
    background-color: #fff;
    padding: 20px 50px;
    margin-top: 5px;
    border-top: #E2E3E4 1px solid;
    border-bottom: #E2E3E4 1px solid;
  }
  /*重设表头的高度*/
  .single_tables>.el-table thead>tr{
    height: 35px;
  }
</style>
