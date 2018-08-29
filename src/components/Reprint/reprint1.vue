<template>
  <div class="reprint">
    <!--顶部工具-->
    <Topbar></Topbar>

    <!--侧边栏工具-->
    <Sidebar :options="iM_options" @sidebar-item-click="sidebarItemClick"></Sidebar>

    <!--菜单选择工具-->
    <Menu :options="iM_options"></Menu>

    <!--时间范围选择工具-->
    <TimeFrame :options="iM_options" @click-datepicker="clickDatePicker"></TimeFrame>

    <div id="IM_content" class="IM_content" :class="iM_options.showSidebar?'IM_content_showSidebar':'IM_content_hiddenSidebar'">
      <ReprintContent :sidebarType="sidebarType"
                   :plantformId="plantformId"
                   :datePickerParams="datePickerParams"
      ></ReprintContent>
    </div>
  </div>
</template>

<script>
  import Topbar from '../common/ZCTopbar'
  import Menu from '../common/ZCMenu'
  import Sidebar from '../common/ZCSidebar'
  import TimeFrame from '../common/ZCTimeFrame'
  import ReprintContent from './ReprintContent'

  export default {
    name: "reprint_page",
    components: {Topbar, Menu, Sidebar,TimeFrame, ReprintContent},
    data() {
      return {
        iM_options: {
          showMenu: true,
          showSidebar: true,
        },
        /*侧边栏点击属性*/
        sidebarType:null,
        plantformId:'',
        /*时间选择器属性*/
        datePickerParams:{},
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
    },
    created(){
      this.initPageSize()
    },
  }
</script>

<style scoped>

  .IM_content {
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: #fff;
    overflow-y: auto;
  }

  .IM_content_showSidebar{
    top: calc(60px + 70px + 60px);/*topbar:60 memu:70(60高度+10shadow) timeframe:60px*/
    left: 200px;
  }
  .IM_content_hiddenSidebar{
    top: calc(60px + 70px + 60px);
    left: 0;
  }
  .IM_content_showMenu{
    top: calc(60px + 70px + 60px);
  }
  .IM_content_hiddenMenu{
    top:60px
  }
</style>
