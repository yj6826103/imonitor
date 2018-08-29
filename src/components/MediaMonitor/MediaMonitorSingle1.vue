<template>
  <div class="detailpages" v-title="title">
    <!--顶部工具-->
    <Topbar></Topbar>

    <!--侧边栏工具-->
    <Sidebar :options="iM_options" @sidebar-item-click="sidebarItemClick"></Sidebar>

    <!--菜单选择工具-->
    <Menu :options="iM_options"></Menu>

    <!--时间范围选择工具-->
    <TimeFrame :options="iM_options"
               :breadcrumbData="headerData"
               @click-datepicker="clickDatePicker"></TimeFrame>

    <div id="IM_content" class="IM_content"
         :class="IM_content_className()">
      <MediaMonitorSingleContent></MediaMonitorSingleContent>
    </div>
  </div>
</template>

<script>
  import Topbar from '../common/ZCTopbar'
  import Menu from '../common/ZCMenu'
  import Sidebar from '../common/ZCSidebar'
  import TimeFrame from '../common/ZCTimeFrame'
  import MediaMonitorSingleContent from './MediaMonitorSingleContent';

  export default {
    name: "detail-pages",
    components: {Topbar, Menu, Sidebar,TimeFrame, MediaMonitorSingleContent},
    data() {
      return {
        iM_options: {
          showMenu: false,
          showSidebar: false,
        },
        /*侧边栏点击属性*/
        sidebarType:null,
        plantformId:'',
        /*时间选择器属性*/
        datePickerParams:{},
        headerData: [
          {path: '/', name: '首页'},
        ],

        title: '',

      }
    },
    methods:{
      /*侧边栏监听点击*/
      sidebarItemClick({type,id}){
        this.sidebarType = type;
        this.plantformId = id;
      },

      /*时间选择器更新方法*/
      clickDatePicker({type,time}){
        // this.zc_log('时间类型:'+type+'\n'+'开始时间:'+time);
        this.datePickerParams = {startTime:time,accountType:type.toString()};

      },

      /*content类名方法*/
      IM_content_className(){
        let result = '';
        if(this.iM_options.showSidebar){
          result += ' IM_content_showSidebar'
        }else{
          result += ' IM_content_hiddenSidebar'
        }
        if(this.iM_options.showMenu){
          result += ' IM_content_showMenu'
        }else{
          result += ' IM_content_hiddenMenu'
        }
        return result;
      }
    },
    mounted(){

      var queryObj = this.getQueryObjectByUrl();
      var name = queryObj.name || '';
      this.headerData.push( {path: queryObj.resourceUrl || '', name: queryObj.resourceName || ''});
      if( name == '' || name == null){
        this.headerData.push( {path: '', name: queryObj.listName || ''});
        this.title = queryObj.listName + '列表';
      }else{
        this.headerData.push( {path: '', name: queryObj.listName  + '_' + name });
        this.title = queryObj.listName + '列表-' + name;
      }
    },
    created(){

    }
  }
</script>

<style scoped>

  .IM_content_showSidebar{
    top: calc(60px + 60px + 70px);/*topbar:60 memu:70(60高度+10marginTop) timeframe:60px*/
    left: 200px;
  }
  .IM_content_hiddenSidebar{
    top: calc(60px + 60px + 70px);
    left: 0;
  }
  .IM_content_showMenu{
    top: calc(60px + 60px + 70px);
  }
  .IM_content_hiddenMenu{
    top: calc(60px + 70px);
  }
</style>
