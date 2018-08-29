<template>
  <div class="platform">
    <!--顶部-->
    <iM_Topbar></iM_Topbar>
    <!--头部-->
    <iM_Header  @click-datepicker="clickDatePicker"></iM_Header>

    <div id="main">
      <!--侧边栏-->
      <div id="siderbar" v-if="showSiderbar" :style="'width:'+sliderWidth+'px'">
        <iM_Sidebar @sidebar-item-click="sidebarItemClick"></iM_Sidebar>
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
            <PlatformContent :isGroupPlantform="isGroupPlantform"
                             :plantformId="plantformId"
                             :datePickerParams="datePickerParams"/>
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
  import PlatformContent from './PlatformContent';

  export default {
    name: "platform",
    components: {iM_Topbar, iM_Header, iM_Sidebar, iM_Menu, PlatformContent},
    data() {
      return {
        showSiderbar: false,
        showMenu: true,
        contentWidth: 0,
        contentMarginLeft: 0,
        sliderWidth: 0,
        isGroupPlantform:false,
        plantformId:'',
        datePickerParams:null,
      }
    },
    methods:{
      clickDatePicker({type, time}) {
        this.datePickerParams = {startTime:time,accountType:type.toString()};
      },
      sidebarItemClick({isGroup,id}){
        // this.zc_log('类型:'+isGroup+'\n'+'id:'+id);
        this.isGroupPlantform = isGroup;
        this.plantformId = id;
      },
    },
    created(){
      this.initPageSize()
    },
  }
</script>
