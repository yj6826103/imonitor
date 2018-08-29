<template>
  <div class="spreadAnalyze">
    <!--顶部-->
    <iM_Topbar></iM_Topbar>
    <!--头部-->
    <!--<iM_Header ></iM_Header>-->

    <div id="main">
      <!--侧边栏-->
      <div id="siderbar" v-if="showSiderbar" :style="'width:'+sliderWidth+'px'">
        <iM_Sidebar @sidebar-item-click="sidebarItemClick"></iM_Sidebar>
      </div>
      <!--主体部分-->
      <div id="content" :class="showSiderbar?'showSiderbar':'hiddenSiderbar'"
           :style="'margin-left:'+contentMarginLeft+'px'"
           style=" height: calc(100% - 45px);">
        <!--工具栏-->
        <div :style="'width:'+contentWidth+'px;height:calc(100% - 0px);'">
          <div id="menu" v-if="showMenu">
            <iM_Menu></iM_Menu>
          </div>
          <!--详情部分-->
          <div id="content_page" :class="showMenu?'showMenu':'hiddenMenu'" style="background: white">
            <!--此处放置页面-->
            <SearchListContent />
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
  import SearchListContent from './SearchListContent';

  export default {
    name: "reprint",
    components: {iM_Topbar, iM_Header, iM_Sidebar, iM_Menu, SearchListContent},
    data() {
      return {
        showSiderbar: false,
        showMenu: false,
        contentWidth: 0,
        contentMarginLeft: 0,
        sliderWidth: 0,
        isGroupPlantform: false,
        plantformId: ''
      }
    },
    methods: {
      sidebarItemClick({isGroup, id}) {
        // this.zc_log('类型:'+isGroup+'\n'+'id:'+id);
        this.isGroupPlantform = isGroup;
        this.plantformId = id;
      }
    },
    created() {
      this.initPageSize()
    },
  }
</script>
