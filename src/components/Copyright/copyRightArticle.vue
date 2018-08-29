<template>
  <div class="copyRightArticle">
    <div v-if="articleData">
      <div class="title">截止时间:{{articleData.transPictureTime?articleData.transPictureTime:'无'}}</div>
      <div class="content" v-html="html" v-if="!isShowImg">
      </div>
      <img :src="articleData.transPictureUrl" v-if="isShowImg&&articleData.transPictureUrl" class="content-img"/>
      <div v-if="isShowImg&&!articleData.transPictureUrl" class="content-text">
        图片正在准备，请稍等
      </div>
    </div>
    <div v-if="!articleData" class="content-text">
      暂无详情
    </div>
  </div>
</template>

<script>
  export default {
    name: "copy-right-tables",
    props: ["articleData"],
    data() {
      return {
        content: "",
        html: "",
        isShowImg: false,
      }
    },
    watch: {
      articleData(oldData, newData) {
        if (this.articleData) {
          var html = this.articleData.articleType == 0 ? this.articleData.content : this.articleData.transContent
          this.html = this.escape2Html(html)
        }
      }
    },
    methods: {
      showImg(compareImage) {
        this.isShowImg = compareImage
      },
      getTitle() {
        return this.tableData.type == '1' ? '原文' : '转载'
      },
      goTo(item) {

      },
      escape2Html(str) {
        var arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'};
        return str.toString().replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
          return arrEntities[t];
        });
      },
    },
    mounted() {
      var thiz = this;
      this.goTo = (item) => {
        if (item.type == 'url') {
          window.location.href = item.url;
        }
      }
    }
  }
</script>

<style scoped>
  @import '../../assets/css/Copyringht/copyRightArticle.css';
</style>
