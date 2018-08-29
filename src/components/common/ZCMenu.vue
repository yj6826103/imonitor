<template>
  <div id="IM_menu"
       class="IM_menu bgc_rzl"
       :class="options.showSidebar?(options.showMenu?'':'IM_menu_hiddenMenu'):(options.showMenu?'IM_menu_hiddenSidebar':'IM_menu_hiddenMenu IM_menu_hiddenSidebar')"
       v-title="title">

    <div class="IM_menu_content clearfix">

      <div class="IM_menu_item"
           :style="'width:'+100/menuData.length+'%'"
           v-for="(item,index) in menuData"
           @click="menuClick(index)">

        <!--文字部分-->
        <span class="item_content" :title="item.name">
          {{item.name}}
          <!--底部标记块-->
          <span :class="activeIndex===index?'IM_menu_item_selected':'IM_menu_item_unselected'"></span>
        </span>

      </div>

    </div>
  </div>

</template>

<script>
  export default {
    name: "z-c-menu",
    props: {
      options: {
        type: Object,
        require: true,
        default() {
          return {
            showMenu: true,
            showSidebar: true,
          }
        }
      }
    },
    data() {
      return {
        menuData: [
          {name: '传播情况总览', path: '/'},
          {name: '作品列表', path: '/hotwork'},
          {name: '传播趋势分析', path: '/trend'},
          {name: '传播地域分析', path: '/region'},
          {name: '媒体转载分析', path: '/reprint'},
          {name: '重点媒体监测', path: '/mediamonitor'},
          {name: '平台对比分析', path: '/platform'},
          {name: '作品对比分析', path: '/works'},
        ],
        activeIndex: null,
        title: null

      }
    },
    methods: {
      menuClick(index) {
        if (index === this.activeIndex) {
          return;
        }
        let path = this.menuData[index].path;
        this.$router.push(path);
      },
    },
    created() {
      let thiz = this;
      let path = this.$route.path;
      this.menuData.forEach(function (value, index) {
        if (path === value.path) {
          thiz.activeIndex = index;
          thiz.title = value.name
        }
      })
    }
  }
</script>

<style scoped>

  .IM_menu {
    position: absolute;
    top: 60px;
    bottom: 0;
    left: 200px;
    right: 0;
  }

  .IM_menu_hiddenSidebar {
    left: 0;
  }
  .IM_menu_hiddenMenu{
    display: none;
    width: 0;
  }
  .IM_menu_content {
    width: 100%;
    height: 60px;
    line-height: 60px;
    background-color: #fff;
    text-align: center;
    /* font-size: 18px; */
    /*box-shadow: 0 4px 8px 0 #E2E3E4;*/
  }

  .IM_menu_item {
    float: left;
    cursor: pointer;
    color: #444;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .IM_menu_item .item_content {
    position: relative;
  }

  .IM_menu_item_selected {
    position: absolute;
    background-color: #3B87F5;
    bottom: -18px;
    left: 0;
    width: 100%;
    height: 8px;
    border-radius: 4px;
  }

  .IM_menu_item_unselected {
    display: none;
  }

</style>
