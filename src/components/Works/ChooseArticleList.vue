<template>
  <div class="choose-article-list">
    <div class="list-header">
      <div class="index">序号</div>
      <div class="title">文章标题</div>
      <div class="url">文章链接</div>
      <div class="delete"></div>
    </div>
    <div class="item" v-for="(item,index) in listData">
      <div class="item-index">{{index+1}}</div>
      <div class="item-title" @click="clickTitle(item)">{{item.name}}</div>
      <div class="item-url">
        <a :href="item.url" target="view_window"> {{item.url?item.url:'-'}}</a>
      </div>
      <div class="item-delete" @click="deleteItem(item.articleId)">
        <span>删除</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "choose-article-list",
    props: ['listData', 'deleteListener'],
    methods: {
      clickTitle(item){
        if(item.unionId!=""){
          window.open( '/detail?uid='+ item.unionId+"&aid="+item.articleId)
        }else {
          this.$message({message:"暂无文章详情"})
        }
      },
      deleteItem: function (id) {
        var thiz = this
        var buttonText = {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
        }
        this.confirm("是否要删除此项", buttonText, () => {
          thiz.deleteListener(id)
        })
      },
      getItems: function (list) {
        var str = "";
        for (var i = 0; i < list.length; i++) {
          str = str + list[i].name + "，";
        }
        str = str.slice(0, str.length - 1)
        str = str.length > str.slice(0, 19) + "..." ? str : str
        return str;
      }
    }
  }

</script>

<style scoped>
  .choose-article-list {

  }

  .choose-article-list .index {
    width: 14%;
    text-align: center;
  }

  .choose-article-list .item {
    border-top: 1px solid #F4f4f4;
  }

  .choose-article-list .title {
    width: 35%;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .choose-article-list .delete {
    width: 14%;
  }

  .choose-article-list .url {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    width: 35%;
  }

  .choose-article-list .item-index {
    width: 14%;
    text-align: center;
  }

  .choose-article-list .item-title {
    width: 32%;
    padding-right: 3%;
    text-align: left;
    overflow: hidden;
    color: #3B87F5;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }

  .choose-article-list .item-delete {
    width: 14%;
    text-align: center;
    cursor: pointer;
  }

  .choose-article-list .item-delete span {
    padding: 5px 12px 5px 12px;
    border: 1px solid #9b9b9b;
    color: #9b9b9b;
    border-radius: 13px;
  }

  .choose-article-list .item-url {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    width: 35%;
    color: #3B87F5;
  }
  .choose-article-list .item-url a{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    color: #3B87F5;
  }
  .choose-article-list .list-header {
    background: #F4f4f4;
  }

  .choose-article-list .list-header div {
    display: inline-block;
    vertical-align: top;
    height: 45px;
    line-height: 45px;
    /* font-size: 13px; */
    font-weight: bold;
  }

  .choose-article-list .item div {
    display: inline-block;
    vertical-align: top;
    height: 45px;
    line-height: 45px;
    /* font-size: 12px; */
  }

</style>
