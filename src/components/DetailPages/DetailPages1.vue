<template>
  <div class="detailpages" v-title="'详情页'">
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
      <DetailPagesContent></DetailPagesContent>
    </div>
  </div>
</template>

<script>
  import Topbar from '../common/ZCTopbar'
  import Menu from '../common/ZCMenu'
  import Sidebar from '../common/ZCSidebar'
  import TimeFrame from '../common/ZCTimeFrame'
  import DetailPagesContent from './DetailPagesContent';

  export default {
    name: "detail-pages",
    components: {Topbar, Menu, Sidebar,TimeFrame, DetailPagesContent},
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
          {path: '', name: '单篇文章详情页'},
        ]
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
