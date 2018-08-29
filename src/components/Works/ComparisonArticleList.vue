<template>
  <div class="comparison-article-list">
    <el-row class="header">
      <el-col :span="1">
        <div class="header-item">序号</div>
      </el-col>
      <el-col :span="3">
        <div class="header-item">创建时间</div>
      </el-col>
      <el-col :span="5">
        <div class="title header-item">文章标题</div>
      </el-col>
      <el-col :span="3">
        <div class="media header-item">媒体来源</div>
      </el-col>
      <el-col :span="2">
        <div class="header-item">发布时间</div>
      </el-col>
      <el-col :span="1">
        <div class="header-item">转载数</div>
      </el-col>
      <el-col :span="1">
        <div class="header-item">阅读数</div>
      </el-col>
      <el-col :span="1">
        <div class="header-item">点赞数</div>
      </el-col>
      <el-col :span="1">
        <div class="header-item">评论数</div>
      </el-col>
      <el-col :span="2">
        <div class="header-item">监测状态</div>
      </el-col>
      <el-col :span="2">
        <div class="header-item">监测剩余时间</div>
      </el-col>
      <el-col :span="2">
        <div class="header-item"></div>
      </el-col>
    </el-row>

    <el-row class="item" v-for="(item,index) in listData" :key="index">
      <el-col :span="1">
        <div class="list-item"
             :style="'height:'+46*item.info.length+'px;line-height:'+46*item.info.length+'px'">
          {{index+1}}
        </div>
      </el-col>
      <el-col :span="3">
        <div class="list-item"
             :style="'height:'+46*item.info.length+'px;line-height:'+46*item.info.length+'px'">
          {{item.createTime?dateFormat(item.createTime):"-"}}
        </div>
      </el-col>
      <el-col :span="14">
        <div class="line-item-box" v-for="(itemInItem,index) in item.info"
             :style="index!=0?'border-top: 1px solid #F4f4f4;':''">
          <div class="list-item line-item-title">
            <a :href="getUrl(itemInItem)" target="_blank"> {{itemInItem.title}}</a>
          </div>
          <div class="list-item line-item-media-source">{{itemInItem.mediaSource}}</div>
          <div class="list-item line-item-publish-time">{{itemInItem.publishTime}}</div>
          <div class="list-item line-item-num">{{itemInItem.transNum}}</div>
          <div class="list-item line-item-num">{{itemInItem.readNum}}</div>
          <div class="list-item line-item-num">{{itemInItem.commentNum}}</div>
          <div class="list-item line-item-num">{{itemInItem.appriseNum}}</div>
        </div>
      </el-col>
      <el-col :span="2">
        <div class="list-item"
             :style="'height:'+46*item.info.length+'px;line-height:'+46*item.info.length+'px'">
          {{item.imonitorStatus=='0'?'监测完成':'监测中'}}
        </div>
      </el-col>
      <el-col :span="2">
        <div class="list-item"
             :style="'height:'+46*item.info.length+'px;line-height:'+46*item.info.length+'px'"><span
          :style="item.leftTime=='0'?'color:red':''">{{item.leftTime?item.leftTime:'-'}}</span><span>/14天</span></div>
      </el-col>
      <el-col :span="2">
        <div class="list-item" @click="deleteItem(item.groupId)"
             style="cursor: pointer;"
             :style="'height:'+46*item.info.length+'px;line-height:'+46*item.info.length+'px'">
          <span class="delete-item">删除</span>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  export default {
    name: "comparison-article-list",
    props: ['deleteListener', 'listData'],
    data() {
      return {
        // listData: []
      }
    },
    mounted() {
    },
    methods: {
      getUrl(item){
        if(item.unionId=="-"){
          return item.url
        }else {
          return '/detail?uid='+ item.unionId+'&aid='+item.articleId
        }

      },
      dateFormat(date){
        var date = new Date(date);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if(minutes<10){
          minutes="0"+minutes
        }
        if(hours<10){
          hours="0"+hours
        }
        if(month<10){
          month="0"+month
        }
        if(day<10){
          day="0"+day
        }
        var str =year + "-" + month + "-" + day + " " + hours + ":" + minutes
        return str
      },
      deleteItem: function (id) {
        if (!this.deleteListener) {
          return
        }
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
  .comparison-article-list {

  }

  .comparison-article-list .line-item-box div {
    display: inline-block;
  }

  .comparison-article-list .list-item {
    text-align: center;
    height: 45px;
    line-height: 45px;
    /* font-size: 13px; */
    overflow: hidden;
  }

  .comparison-article-list .delete-item {
    padding: 5px 12px 5px 12px;
    border: 1px solid #9b9b9b;
    color: #9b9b9b;
    border-radius: 13px;
  }

  .comparison-article-list .header {
    background-color: #F4f4f4;
  }

  .comparison-article-list .line-item-box {
    width: 100%;
    font-size: 0px;
  }

  .comparison-article-list .line-item-title {
    width: 32.714%;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 3%;
    color: #3B87F5;
  }

  .comparison-article-list .line-item-title a {
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #3B87F5;
  }

  .comparison-article-list .line-item-media-source {
    width: 21.4285%;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .comparison-article-list .line-item-num {
    width: 7.14285%;
  }

  .comparison-article-list .line-item-publish-time {
    width: 14.285714%;
  }

  .comparison-article-list .header-item {
    text-align: center;
    height: 45px;
    line-height: 45px;
    /* font-size: 13px; */
    font-weight: bold;
  }

  .comparison-article-list .title {
    text-align: left;
  }
  .comparison-article-list .media {
    text-align: left;
  }

  .comparison-article-list .item {
    border-top: 2px solid #F4f4f4;
  }

</style>
