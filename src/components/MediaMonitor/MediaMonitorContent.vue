<template>
  <div id="media_monitor" class="media_monitor">

    <!--重点监测媒体转载列表-->
    <div class="block_rzl" v-if="emphasisMediaData.length>0">
      <div class="title_rzl">重点监测媒体转载列表</div>
      <tables :data="emphasisMediaData"
              :columnData="columnData"
              :options="tableOptions"
              @refresh-data="refreshTableData"
              @zctable-update="zctableUpdate"
              @click-tablecell="tablecellClick">
      </tables>
    </div>

    <!--重点监测媒体charts-->
    <div class="block_rzl clearfix" v-if="mediaEmphasisData.categoryArr.length || mediaPlantformData.categoryArr.length">
      <div class="table_wrapper" style="float: left; padding-right:40px;" v-if="mediaEmphasisData.categoryArr.length">
        <div class="title_rzl" style="margin-bottom: 10px">重点监测媒体转载排行</div>
        <!--<div :style="{backgroundColor:this.getRandomColor(),height:'500px'}"></div>-->
        <barChart :height="height"
                  idName="zdjcmtzzph"
                  @click-barchart="mediaHandleClick"
                  :chartData="mediaEmphasisData"
                  :options="{direction:'vertical'}">
        </barChart>
        <el-button type="text" class="button_rzl color_base" @click="moreMediaEmphasisDatas">更多</el-button>
      </div>
      <div class="table_wrapper"  style="float: right; padding-left:40px;" v-if="mediaPlantformData.categoryArr.length">
        <div class="title_rzl" style="margin-bottom: 10px">平台转载排行</div>
        <!--<div :style="{backgroundColor:this.getRandomColor(),height:'500px'}"></div>-->
        <barChart :height="height"
                  idName="ptzzph"
                  @click-barchart="platformHandleClick"
                  :chartData="mediaPlantformData"
                  :options="{direction:'vertical'}">
        </barChart>
        <el-button type="text" class="button_rzl color_base" @click="morePlantformDatas">更多</el-button>
      </div>
    </div>
    <div class="empty_block" v-if="!emphasisMediaData.length">暂无相关数据</div>
  </div>

</template>

<script>
  import Tables from '@/components/common/ZCTables'
  import barChart from '@/components/common/ZCChartsBar'

  export default {
    name: "media-monitor-content",
    components: {Tables, barChart},
    props: {
      sidebarType: {type: String / Number, require: true},
      plantformId: {type: String / Number, require: true},
      datePickerParams: {type: Object, require: true},
    },
    watch: {
      plantformId(val, oldVal) {
        this.zc_log('plantformId改变了');
        this.loadEmphasisMediaTableData();
        this.loadEmphasisMediaBarData();
        this.loadMediaPlantformBarData();
      },
      datePickerParams(val){
        if(this.plantformId){
          this.zc_log('startTime改变了');
          this.loadEmphasisMediaTableData();
          this.loadEmphasisMediaBarData();
          this.loadMediaPlantformBarData();
        }
      },
    },
    data() {
      return {
        // 默认横道图高度
        height: 500,
        //表格数据
        emphasisMediaData: [],
        emphasisMediaColumn: [],
        startTime: '',
        endTime: '',
        total: 0,//转载总数
        pageNo: 1,//当前页码数
        pageSize: 10,//每页条数
        //表格表头数据
        columnData: [],
        //表格参数列表
        tableOptions: {},
        // 重点监测媒体转载排行(横道图)
        mediaEmphasisData: {
          categoryArr: [],
          mediaEmphasisIdArr: [],
          valueArr: [
            {name: '首页', value: []},
            {name: '非首页', value: []}
          ]
        },
        // 平台转载排行(横道图)
        mediaPlantformData: {
          categoryArr: [],
          platformIdArr: [],
          valueArr: [
            {name: '首页', value: []},
            {name: '非首页', value: []}
          ]
        },
        //传播地域分析数据
        timeData: {
          categoryArr: ['网易', '凤凰网', '腾讯网', '搜狐', '人民网'],
          platformIdArr: ['1fd584f6rf', '2fd584f6rf', '3fd584f6rf', '4fd584f6rf', '5fd584f6rf'],
          valueArr: [
            {name: '首页', value: [1, 20, 9, 5, 5]},
            {name: '非首页', value: [7, 4, 6, 8, 10]},
          ]
        },
      }
    },
    methods: {
      refreshTableData({selected, currentPage, pageSize, sortingIndex}) {
        this.zc_log(`筛选项=${selected},当前页=${currentPage},每页数=${pageSize},排序项=${sortingIndex}`);
        this.pageNo = currentPage;
        this.pageSize = pageSize;
        this.loadEmphasisMediaTableData();
      },
      zctableUpdate({selected, pageNum, counts}) {
        // alert('筛选项='+selected+','+'当前页='+pageNum+','+'每页数='+counts);
        this.zc_log('筛选项=' + selected + ',' + '当前页=' + pageNum + ',' + '每页数=' + counts);

      },
      tablecellClick({rowIndex,columnIndex}){
        // this.zc_log('行=' + rowIndex + ',' + '列=' + columnIndex);
        // 原文标题点击：打开新页面跳转到单篇文章分析
        if(columnIndex && columnIndex == 2){
          var unionId = this.emphasisMediaData[rowIndex].unionId;
          var originalId = this.emphasisMediaData[rowIndex].originalId;
          if(unionId == '-' || originalId == '-'){
            this.$message({message: '链接已失效！'});
          }else{
            var url = 'detail?uid='+unionId + '&aid=' + originalId;
            window.open(url);
          }
        // 转载标题点击：打开新页面跳转到文章链接页面
        }else if(columnIndex && columnIndex == 4){
          var reprintUrl = this.emphasisMediaData[rowIndex].transUrl;
          // 如果不存在外链接则跳转至本系统首页
          if(reprintUrl == '-'){
            this.$message({message: '链接已失效！'});
          }else{
            window.open(reprintUrl);
          }
        }
        // this.$router.push({path:'/single/mediamonitor'});
      },
      // 统一获取列表的数据
      _getEmphasisMediaTableData(params,dataFn){
        this.$http.get(this.baseUrl +'/focalmedia/findTransPage', {params: params}).then(function (res) {
          var response = JSON.parse(res.bodyText);
          if (response.code == 200 && response.data) {
            dataFn(response.data, params);
          }else{
            this.emphasisMediaData = [];
          }
        }, function (err) {
          this.emphasisMediaData = [];
          this.zc_log(err);
        });
      },
      // 统一获取横道图的数据
      _getMediaChartsBarData(params, dataFn){
        this.$http.get(this.baseUrl + '/focalmedia/findTransCount', {params: params}).then(function (res) {
          var response = JSON.parse(res.bodyText);
          if(params.queryType == 1){
             this.mediaEmphasisData = {categoryArr: [], mediaEmphasisIdArr: [], valueArr: []};
          }else if(params.queryType == 2){
            this.mediaPlantformData = {categoryArr: [], mediaEmphasisIdArr: [], valueArr: []};
          }

          if (response.code == 200 && response.data.content) {
            dataFn(response.data.content, params);
          }else{
            dataFn(null, params);
          }
        }, function (err) {
          this.zc_log(err);
          dataFn(null, params);
        });
      },
      // 重点监测媒体转载列表
      loadEmphasisMediaTableData(){

        // 计算结束时间
        let accountType = this.datePickerParams.accountType;
        let date = new Date(this.datePickerParams.startTime);
        var timeObj = this.getTimeObj(accountType, date);
        // 默认查全部,如果点击左侧菜单:则queryType为1,queryId为侧边栏的ID, 默认为0
        var params = {
          queryType: 0,
          queryId: '',
          groupId: '',
          mainGroup: '',
          startTime: timeObj.startTime,
          endTime: timeObj.endTime,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        };
        // groupId: 指组ID, queryId：指具体ID， 2者不能同时存在
        if(this.sidebarType == 1002){
          // 1002表示查具体ID
          params.groupId = '';
          params.queryId = this.plantformId;
          params.queryType = 2; // 具体ID表示查平台
        }else if(this.sidebarType == 1001){ //普通组
          params.mainGroup = this.plantformId;
          params.groupId = '';
          params.queryId = '';
        }else if(this.sidebarType == 1003){ //自定义组
          params.mainGroup = '';
          params.groupId = this.plantformId;
        }

        this.zc_log('上方媒体转载列表');
        this.zc_log(params);
        this._getEmphasisMediaTableData(params, this._computedEmphasisMediaTableData);
      },
      _computedEmphasisMediaTableData(datas, params){
        var data = datas.pageResult;
        if( data == null || typeof(data) == "undefined"){
          this.emphasisMediaData = [];
          return ;
        }
        this.total = data.totalElements;
        this.emphasisMediaData = data.content || [];
        var indexNum = (params.pageNo -1) * params.pageSize;
        var medias = datas.medias;
        var platforms = datas.platforms;
        //筛选数据：空数据全部显示为- ,如果当前刊登状态不是首页和非首页这2种状态则统一显示为'-'
        this.emphasisMediaData.forEach(function (item,index) {
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
              if( obj[key] == 0){
                item[key] = '-';
              }else if( obj[key] < 60 && obj[key] > 0 ){
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
          item.platformName = '-';
          // 查找该媒体ID对应的媒体名称
          medias.forEach(function (media) {
            if( media.id == item.mediaId){
              item.mediaName = media.name + '_' + media.typeName;
              return false;
            }
          });
          platforms.forEach(function (plantForm) {
            if( plantForm.id == item.platformId){
              item.platformName = plantForm.name + '_' + plantForm.platformTypeName;
              return false;
            }
          });
          item.indexNum = index + indexNum + 1;
        });
        this.columnData = [
          {prop: 'indexNum', label: '序号'},
          {prop: 'platformName', label: '平台'},
          {prop: 'originalTitle', label: '原文标题'},
          {prop: 'mediaName', label: '转载媒体'},
          {prop: 'transTitle', label: '转载标题'},
          {prop: 'transTime', label: '转载时间'},
          {prop: 'publishStatus', label: '当前刊登状态'},
          {prop: 'homePageSeconds', label: '首页刊登时长'}
        ];
        this.tableOptions = {
          id:'mediamonitor_content',
          total: this.total,
          //表格列样式
          columnStyle: {
            indexs: [0, 1, 2, 3, 4, 5, 6, 7],
            styles: [
              {width: this.getLineUnitWidth(100)*5, color: '#444444'},
              {width: this.getLineUnitWidth(100)*10, color: '#444444', textAlign: 'left'},
              {textAlign: 'left', color: '#3B87F5',cursor:'pointer'},
              {width: this.getLineUnitWidth(100)*12, textAlign: 'left', color: '#444444'},
              {textAlign: 'left', color: '#3B87F5',cursor:'pointer'},
              {width: this.getLineUnitWidth(100)*13, color: '#444444'},
              {width: this.getLineUnitWidth(100)*10, color: '#444444'},
              {width: this.getLineUnitWidth(100)*10, color: '#444444'},
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
            styles: [ {textAlign: 'left'}, {textAlign: 'left'}, {textAlign: 'left'}, {textAlign: 'left'}],
            commons: {backgroundColor: '#f4f4f4', textAlign: 'center', padding: '5px 0', color: '#444444'}
          },
          selectData: null
        };
      },
      // 重点监测媒体转行排行(横道图)
      loadEmphasisMediaBarData(){
        // 计算结束时间
        let accountType = this.datePickerParams.accountType;
        let date = new Date(this.datePickerParams.startTime);
        var timeObj = this.getTimeObj(accountType, date);
        // 默认查全部,如果点击左侧菜单:则queryType为1,queryId为侧边栏的ID, 默认为0
        var params = {
          queryType: 1,
          queryId: '',
          startTime: '',
          pageNo: 1,
          pageSize: 5,
          startTime: timeObj.startTime,
          endTime: timeObj.endTime,
        };
        // groupId: 指组ID, queryId：指具体ID， 2者不能同时存在
        if(this.sidebarType == 1002){
          // 1002表示查具体ID
          params.groupId = '';
          params.queryId = this.plantformId;
          params.queryType = 3; // 具体ID表示查平台
        }else if(this.sidebarType == 1001){ //普通组
          params.mainGroup = this.plantformId;
          params.groupId = '';
          params.queryId = '';
        }else if(this.sidebarType == 1003){ //自定义组
          params.mainGroup = '';
          params.groupId = this.plantformId;
        }

        // 后端查全部时 groupId为空且queryId也为空
        if(params.groupId == 0 && params.queryId == ''){
          params.groupId = '';
          params.queryType = 3;
        }
        this.zc_log('左侧媒体横道图');
        this.zc_log(params);
        this._getMediaChartsBarData(params, this._computedEmphasisMediaBarData);
      },
      _computedEmphasisMediaBarData(data, params){
        var categoryArr = [];
        var mediaEmphasisIdArr = [];
        var valueArr = [
          {name: '首页', value: []},
          {name: '非首页', value: []},
        ];
        // 先清一次数据
        this.mediaEmphasisData = {categoryArr: [], mediaEmphasisIdArr: [], valueArr: valueArr};
        if(data == null){
          return false;
        }
        data.forEach(function (value) {
          categoryArr.push(value.mediaName);
          mediaEmphasisIdArr.push(value.mediaId);
        });
        valueArr.forEach(function (item, itemId) {
          if( itemId == 0){
            data.forEach(function (dataValue) {
              item.value.push(dataValue.homePageTrans || 0);
            });
          }else if( itemId == 1){
            data.forEach(function (dataValue) {
              item.value.push(dataValue.nonHomeTrans || 0);
            });
          }
        });
        this.mediaEmphasisData = {categoryArr: categoryArr, mediaEmphasisIdArr:mediaEmphasisIdArr, valueArr: valueArr};
        // this.zc_log('重点监测媒体转行排行(横道图)');
        // this.zc_log(this.mediaEmphasisData);
      },
      // 平台转载排行(横道图)
      loadMediaPlantformBarData(){
        // 计算结束时间
        let accountType = this.datePickerParams.accountType;
        let date = new Date(this.datePickerParams.startTime);
        var timeObj = this.getTimeObj(accountType, date);
        // 默认查全部,如果点击左侧菜单:则queryType为1,queryId为侧边栏的ID, 默认为0
        var params = {
          queryType: 2,
          queryId: '',
          startTime: '',
          pageNo: 1,
          pageSize: 5,
          startTime: timeObj.startTime,
          endTime: timeObj.endTime,
        };
        if(this.sidebarType == 1002){
          // 1002表示查具体ID
          params.groupId = '';
          params.queryId = this.plantformId;
          params.queryType = 2; // 具体ID表示查平台
        }else if(this.sidebarType == 1001){ //普通组
          params.mainGroup = this.plantformId;
          params.groupId = '';
          params.queryId = '';
        }else if(this.sidebarType == 1003){ //自定义组
          params.mainGroup = '';
          params.groupId = this.plantformId;
        }
        // 后端查全部时 groupId为空且queryId也为空
        if(params.groupId == 0 && params.queryId == ''){
          params.groupId = '';
          params.queryType = 2;
        }
        this.zc_log('右侧平台横道图');
        this.zc_log(params);

        this._getMediaChartsBarData(params, this._computedMediaPlantformBarData);
      },
      _computedMediaPlantformBarData(data,params){
        var categoryArr = [];
        var platformIdArr = [];
        var valueArr = [
          {name: '首页', value: []},
          {name: '非首页', value: []},
        ];

        // 先清空数据
        this.mediaPlantformData = {categoryArr: categoryArr,platformIdArr: platformIdArr, valueArr: valueArr};
        if(data == null){
          return false;
        }
        data.forEach(function (value) {
          categoryArr.push(value.platformName);
          platformIdArr.push(value.platformId);
        });

        valueArr.forEach(function (item, itemId) {
          if( itemId == 0){
            data.forEach(function (dataValue) {
              item.value.push(dataValue.homePageTrans || 0);
            });
          }else if( itemId == 1){
            data.forEach(function (dataValue) {
              item.value.push(dataValue.nonHomeTrans || 0);
            });
          }
        });
        this.mediaPlantformData = {categoryArr: categoryArr,platformIdArr: platformIdArr, valueArr: valueArr};
        // this.zc_log(this.mediaPlantformData);
      },
      // 重点监测媒体转载排行(更多按钮)
      moreMediaEmphasisDatas (){
        // 计算结束时间
        let accountType = this.datePickerParams.accountType;
        let date = new Date(this.datePickerParams.startTime);
        var timeObj = this.getTimeObj(accountType, date);
        var params = {
          queryType: 3,
          listName: '重点监测媒体转载排行',
          listType: 'mediaEmphasisMore',
          resourceUrl: '/mediamonitor',
          resourceName: '重点媒体监测',
          plantformId: this.plantformId,
          startTime: timeObj.startTime,
          endTime: timeObj.endTime,
          accountType: '',
          pageNo: 1,
          pageSize: 10,
          name: '',
          queryId: '',
        };
        // groupId: 指组ID, queryId：指具体ID， 2者不能同时存在
        if(this.sidebarType == 1002){
          // 1002表示查具体ID
          params.groupId = '';
          params.queryId = this.plantformId;
          params.queryType = 3; // 具体ID表示查平台
        }else if(this.sidebarType == 1001){ //普通组
          params.mainGroup = this.plantformId;
          params.groupId = '';
          params.queryId = '';
        }else if(this.sidebarType == 1003){ //自定义组
          params.mainGroup = '';
          params.groupId = this.plantformId;
        }
        var newUrl = 'mediaMonitorSingle?';
        for(var key in params){
           newUrl += key +'=' + params[key] + '&';
        }
        newUrl = newUrl.substring(0, newUrl.length-1);
        this.zc_log(params);
        window.open(newUrl);
      },
      // 平台转载排行(更多按钮)
      morePlantformDatas (){
        // 计算结束时间
        let accountType = this.datePickerParams.accountType;
        let date = new Date(this.datePickerParams.startTime);
        var timeObj = this.getTimeObj(accountType, date);
        var params = {
            queryType: 2,
            listName: '平台转载排行',
            listType: 'mediaPlantformMore',
            resourceUrl: '/mediamonitor',
            resourceName: '重点媒体监测',
            plantformId: '',
            startTime: timeObj.startTime,
            endTime: timeObj.endTime,
            accountType: '',
            pageNo: 1,
            pageSize: 10,
            name: '',
            queryId: '',
        };
        // groupId: 指组ID, queryId：指具体ID， 2者不能同时存在
        if(this.sidebarType == 1002){
          // 1002表示查具体ID
          params.groupId = '';
          params.queryId = this.plantformId;
          params.queryType = 3; // 具体ID表示查平台
        }else if(this.sidebarType == 1001){ //普通组
          params.mainGroup = this.plantformId;
          params.groupId = '';
          params.queryId = '';
        }else if(this.sidebarType == 1003){ //自定义组
          params.mainGroup = '';
          params.groupId = this.plantformId;
        }

        var newUrl = 'mediaMonitorSingle?';
        for(var key in params){
           newUrl += key +'=' + params[key] + '&';
        }
        newUrl = newUrl.substring(0, newUrl.length-1);
        this.zc_log(params);
        window.open(newUrl);
      },
      // 重点监测媒体转载排行(某一媒体点击)
      mediaHandleClick(barObj){
        this.zc_log("媒体转载排行");
        var name = barObj.name;
        var mediaEmphasisId = this.mediaEmphasisData.mediaEmphasisIdArr[barObj.index];
        var publishStatus = '';
        if( barObj.seriesName == '首页'){
          publishStatus = 1;
        }else if( barObj.seriesName == '非首页'){
          publishStatus = 0;
        }
        // 计算结束时间
        let accountType = this.datePickerParams.accountType;
        let date = new Date(this.datePickerParams.startTime);
        var timeObj = this.getTimeObj(accountType, date);
        //  queryType : 1查媒体
         var params = {
          queryType: 1,
          listName: '重点媒体监测转载排行',
          listType: 'mediaEmphasis',
          resourceUrl: '/mediamonitor',
          resourceName: '重点媒体监测',
          plantformId: '',
          startTime: timeObj.startTime,
          endTime: timeObj.endTime,
          accountType: '',
          pageNo: 1,
          pageSize: 10,
          name: name,
          queryId: '',
          mediaId: mediaEmphasisId,
          groupId : '',
          publishStatus: publishStatus,
        };

        // groupId: 指组ID, queryId：指具体ID， 2者不能同时存在
        if(this.sidebarType == 1002){
          // 1002表示查具体ID
          params.groupId = '';
          params.queryId = this.plantformId;
        }else if(this.sidebarType == 1001){ //普通组
          params.mainGroup = this.plantformId;
          params.groupId = '';
          params.queryId = '';
        }else if(this.sidebarType == 1003){ //自定义组
          params.mainGroup = '';
          params.groupId = this.plantformId;
        }else if(this.sidebarType == 1000){
          params.mediaId = '';
          params.queryId = mediaEmphasisId;
        }


        var newUrl = 'mediaMonitorSingle?';
        for(var key in params){
           newUrl += key +'=' + params[key] + '&';
        }
        newUrl = newUrl.substring(0, newUrl.length-1);
        this.zc_log(params);
        window.open(newUrl);
      },
      // 平台转载排行(某一平台点击)
      platformHandleClick(barObj){
        this.zc_log("平台转载排行");
        var name = barObj.name;
        var plantformId = this.mediaPlantformData.platformIdArr[barObj.index];
        var publishStatus ='';
        if( barObj.seriesName == '首页'){
          publishStatus = 1;
        }else if( barObj.seriesName == '非首页'){
          publishStatus = 0;
        }
        // 计算结束时间
        let accountType = this.datePickerParams.accountType;
        let date = new Date(this.datePickerParams.startTime);
        var timeObj = this.getTimeObj(accountType, date);
        var params = {
          queryType: 2,
          listName: '平台转载排行',
          listType: 'mediaPlantform',
          resourceUrl: '/mediamonitor',
          resourceName: '重点媒体监测',
          plantformId: plantformId,
          startTime: timeObj.startTime,
          endTime: timeObj.endTime,
          accountType: this.accountType,
          pageNo: 1,
          pageSize: 10,
          name: name,
          queryId: plantformId,
          publishStatus: publishStatus,
        };

        var newUrl = 'mediaMonitorSingle?';
        for(var key in params){
           newUrl += key +'=' + params[key] + '&';
        }
        newUrl = newUrl.substring(0, newUrl.length-1);
        this.zc_log(params);
        window.open(newUrl);
      },
      // 横道图小屏适配
      layoutSubviews(){
        var width = screen.width;
        if(width <= 1440){
          this.height = 400;
        }
      },
      getTimeObj(accountType, date){
        let time = date.Format('yyyy-MM-dd');
        var timeObj = {};
        // 计算一天的开始和结束时间
        if (accountType == 0) {
          timeObj.startTime = new Date(time + ' 00:00:00').getTime();
          timeObj.endTime = new Date(time + ' 23:59:59').getTime();
        // 计算本周的第一天和最后一天
        } else if (accountType == 3) {
          timeObj.startTime = new Date(time + ' 00:00:00').getTime();
          date.setDate(date.getDate() + 6);
          timeObj.endTime = new Date(date.Format('yyyy-MM-dd') + ' 23:59:59').getTime();
        //计算月的第一天和最后一天
        } else if (accountType == 2) {
          date.setDate(1);
          var end = new Date(date);
          end.setMonth(date.getMonth() + 1);
          end.setDate(0);
          timeObj.startTime = new Date(date.Format('yyyy-MM-dd') + ' 00:00:00').getTime();
          timeObj.endTime = new Date(end.Format('yyyy-MM-dd') + ' 23:59:59').getTime();
        // 计算年的第一天和最后一天
        } else  if(accountType == 1) {
          date.setMonth(0);
          date.setDate(1);
          // 当年第一天
          timeObj.startTime = new Date(date.Format('yyyy-MM-dd') + ' 00:00:00').getTime();
          date.setFullYear(date.getFullYear() + 1);
          date.setDate(date.getDate() - 1);
          // 当年最后一天
          timeObj.endTime = new Date(date.Format('yyyy-MM-dd') + ' 23:59:59').getTime();
        }
        return timeObj;
      },
    },
    created(){
      this.layoutSubviews();

      var data = {
        name: document.title,
        id:"media_monitor",
      };
      this.registerCreateReportParams(this.$route.path, data);
    },
  }
</script>
<style scoped>

.button_rzl{
  margin-top: 10px;
  width: 100%;
  height: 22px;
  padding: 0 10px 0;
  text-align: right;
  border: none;
  box-sizing: border-box;
}
.table_wrapper{
  width: 48%;
  box-sizing: border-box;
}
.media_monitor >>>.el-table{
  min-height: 514px;
}
.empty_block{
  height: 450px;
  line-height: 450px;
  padding-top: 0;
  margin-top: 0
}
</style>


