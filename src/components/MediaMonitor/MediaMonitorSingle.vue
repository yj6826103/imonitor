<template>
  <div class="mediamonitor_single">
    <!--顶部-->
    <iM_Topbar></iM_Topbar>
    <!--头部-->
    <iM_Header :breadcrumbData="headerData"></iM_Header>
    <div id="main">
      <!--侧边栏-->
      <div id="siderbar" v-if="showSiderbar" :style="'width:'+sliderWidth+'px'">
        <iM_Sidebar></iM_Sidebar>
      </div>
      <!--主体部分-->
      <div id="content" :class="showSiderbar?'showSiderbar':'hiddenSiderbar'"
           :style="'margin-left:'+contentMarginLeft+'px'">
        <!--工具栏-->
        <div :style="'width:'+contentWidth+'px;height:calc(100% - 5px);'">
          <div id="menu" v-if="showMenu">
            <iM_Menu></iM_Menu>
          </div>
          <!--详情部分-->
          <div id="content_page" :class="showMenu?'showMenu':'hiddenMenu'">
            <!--此处放置页面-->
            <MediaMonitorSingleContent></MediaMonitorSingleContent>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import iM_Topbar from '@/components/common/iMTopbar.vue'
  import iM_Header from '@/components/common/iMHeader.vue'
  import iM_Sidebar from '@/components/common/iMSidebar1.vue'
  import iM_Menu from '@/components/common/iMMenu.vue'
  import MediaMonitorSingleContent from './MediaMonitorSingleContent';

  export default {
    name: "media-monitor-single",
    components: {iM_Topbar, iM_Header, iM_Sidebar, iM_Menu, MediaMonitorSingleContent},
    data() {
      return {
        showSiderbar: false,
        showMenu: false,
        contentWidth: 0,
        contentMarginLeft: 0,
        sliderWidth: 0,
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
        accountType: '',
        pageNo: 1,//当前页码数
        pageSize: 10,//每页条数
        mediaType: '',
        channel: '',
        name: '',
        queryId: '',
        isGroupPlantform: false,
        headerData: [],
        title: '',
      }
    },
    mounted() {

      this.contentMarginLeft = window.screen.width * 0.15
      this.sliderWidth = window.screen.width * 0.15 - 1
      if (!this.showSiderbar) {
        this.contentMarginLeft = 0
        this.sliderWidth = 0
      }
      this.contentWidth = window.screen.width - this.contentMarginLeft;

      var queryObj = this.getQueryObjectByUrl();
      var name = queryObj.name || '';
      this.headerData.push( {path: '/', name: '首页'});
      this.headerData.push( {path: queryObj.resourceUrl || '', name: queryObj.resourceName || ''});
      if( name == '' || name == null){
        this.headerData.push( {path: '', name: queryObj.listName || ''});
        this.title = queryObj.listName + '列表';
      }else{
        this.headerData.push( {path: '', name: queryObj.listName  + '_' + name });
        this.title = queryObj.listName + '列表-' + name;
      }
      document.title = this.title;

      // test: 首页-转载媒体占比列表(某一媒体)、媒体转载分析-转载媒体占比列表(某一媒体)
      // this.listType = 'synopsisMedia';
      // this.listName = '转载媒体占比';
      // this.resourceUrl = "/";
      // this.resourceName = "传播情况总览";
      // this.name = "官方媒体";

      // test: 首页-转载渠道占比列表(某一渠道)、媒体转载分析-转载渠道占比列表(某一渠道)
      // this.listType = 'synopsisChinnal';
      // this.listName = '转载渠道占比';
      // this.resourceUrl = "/";
      // this.resourceName = "传播情况总览";
      // this.name = "微信";

      // test: 首页-平台转载排行(某一平台)、媒体转载分析-平台转载排行列表(某一平台)
      // this.listType = 'reprintPlantform';
      // this.listName = '平台转载排行';
      // this.resourceUrl = "/";
      // this.resourceName = "传播情况总览";
      // this.name = "名城苏州网";

      // test: 首页-媒体转载排行(某一媒体)、媒体转载分析-媒体转载排行列表(某一媒体)
      // this.listType = 'reprintMedia';
      // this.listName = '媒体转载排行';
      // this.resourceUrl = "/";
      // this.resourceName = "传播情况总览";
      // this.name = "人民日报";

      // test: 媒体转载分析-媒体转载排行列表(更多)
      // this.listType = 'reprintMediaMore';
      // this.listName = '媒体转载排行';
      // this.resourceUrl = "/reprint";
      // this.resourceName = "媒体转载分析";



    }
  }
</script>

<style scoped>
.content_top{
  margin-top: 10px;
  width: 100%;
  height: 98px;
  line-height: 68px;
  padding: 0 50px;
  /* font-size: 16px; */
  color: #444;
  font-weight: bolder;
  background-color: #fff;
  box-sizing: border-box;
}
</style>
