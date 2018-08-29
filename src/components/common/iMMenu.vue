<template>

  <div id="iM_menu" v-title="title">

    <div class="menu_item"
         :style="'width:'+100/menuData.length+'%'"
         v-for="(item,index) in menuData"
         @click="menuItemClicked(index)">
      <span :class="activeIndex==index?'menu_item_selected':''">{{item.name}}</span>
    </div>

  </div>
</template>

<script>
  export default {
    name: "i-m-menu",
    data() {
      return {
        menuData:[
          {name:'传播情况总览',path:'/'},
          {name:'作品列表',path:'/hotwork'},
          {name:'传播趋势分析',path:'/trend'},
          {name:'传播地域分析',path:'/region'},
          {name:'媒体转载分析',path:'/reprint'},
          {name:'重点媒体监测',path:'/mediamonitor'},
          {name:'平台对比分析',path:'/platform'},
          {name:'作品对比分析',path:'/works'},
        ],
        activeIndex:0,
        title:''
      }
    },
    methods:{
      menuItemClicked(index){
        if (index == this.activeIndex) {
          return
        }
        var path = this.menuData[index].path;
        this.$router.push(path)
      }
    },
    created(){
      var thiz = this;
      var path = thiz.$route.path;
      this.menuData.forEach(function (value, index, array) {
        if(path == value.path){
          thiz.activeIndex = index
          thiz.title = value.name
        }
      })
    }
  }
</script>

<style scoped>

  #iM_menu {
    height: 58px;
    line-height: 58px;
    background-color: #fff;
    border-top: #E2E3E4 1px solid;
    border-bottom: #E2E3E4 1px solid;
    width: 100%;
    min-width: 1000px;
  }

  .menu_item{
    float: left;
    text-align: center;
    cursor: pointer;
    color: #444444;
    /* font-size: 16px; */
  }
  .menu_item:hover{
    color: #3B87F5;
    font-weight: 900;
  }

  .menu_item span{
    display: inline-block;
    height: 53px;
  }
  .menu_item_selected{
    border-bottom: #3B87F5 5px solid;
  }
</style>
