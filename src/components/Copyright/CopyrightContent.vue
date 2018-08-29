<template>
  <div class="overView"
       style="height: 100%;"
       id="overView"
       v-loading.fullscreen.lock="fullscreenLoading">
    <div class="viewItem" style="margin-top: 5px;">
      <div class="compare-copyright">
        <div class="button-box">
          <div :class="{ buttonSelect: !compareImage,buttonNormal:compareImage }" @click="selectCompareModel()">
            <i class="file_button"/>
            <span>正文对比</span>
          </div>
          <div :class="{ buttonSelect: compareImage,buttonNormal:!compareImage }" @click="selectCompareModel()"
               style="margin-left: 10px">
            <i class="picture_button"/>
            <span>截图对比</span>
          </div>
          <span>相似度{{similarityCount}}</span>
        </div>
        <el-row :gutter="100" id="copyright-content" class="comparison-box">
          <el-col :span="12">
            <copyRightTables :tableData="originalArticleData"/>
            <copyRightArticle :articleData="originalArticleData"
                              style="margin-top: 50px;margin-bottom: 50px;padding-bottom: 50px"/>
          </el-col>
          <el-col :span="12">
            <copyRightTables :tableData="transArticleData"/>
            <copyRightArticle ref="tranArticle" :articleData="transArticleData"
                              style="margin-top: 50px;margin-bottom: 50px;padding-bottom: 50px"/>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import copyRightTables from './copyRightTables.vue'
  import copyRightArticle from './copyRightArticle.vue'

  export default {
    name: "compar-copyright-content",
    components: {
      'copyRightTables': copyRightTables,
      'copyRightArticle': copyRightArticle
    },
    data() {
      return {
        compareImage: false,
        similarityCount: 0,
        transArticleData: null,
        originalArticleData: null,
        fullscreenLoading: false,
        unionId: "",
        webpageCode: "",
      }
    },
    methods: {
      getImageUrl(url) {
        var thiz = this
        var params = {
          url: url,
          webpage_code: this.webpageCode
        }
        this.$http.get(this.imageServerUrl, {params: params}).then(function (res) {
          var response = JSON.parse(res.bodyText)
          if (response.message == "sucess") {
            thiz.transArticleData.transPictureUrl = response.data.url
            var shotParams = {}
            shotParams.webpageCode =this.webpageCode
            shotParams.screenshot =response.data.url
            this.$http.get(this.baseUrl + "/page/screen/shot", {params: shotParams}).then(function (res) {

            }, function (err) {

            })
          }
        }, function (err) {

        })
      },
      selectCompareModel() {
        this.compareImage = !this.compareImage
        this.$refs.tranArticle.showImg(this.compareImage)
      },
      initData() {
        this.fullscreenLoading = true
        var thiz = this
        var params1 = {unionId: this.unionId}
        var params2 = {webpageCode: this.webpageCode}
        this.$http.get(this.baseUrl + "/copyrightMonitor/originalArticle", {params: params1}).then(function (res) {
          thiz.fullscreenLoading = false
          var response = JSON.parse(res.bodyText)
          if (response.code == "200" || response.code == 200) {
            response.data.articleType = 0
            thiz.originalArticleData = response.data
          } else {
            thiz.$message({message: '请求错误'});
          }
        }, function (err) {
          thiz.fullscreenLoading = false
          thiz.$message({message: '请求错误'});
        })
        this.$http.get(this.baseUrl + "/copyrightMonitor/transArticle", {params: params2}).then(function (res) {
          thiz.fullscreenLoading = false
          var response = JSON.parse(res.bodyText)
          if (response.code == "200" || response.code == 200) {
            response.data.articleType = 1
            thiz.transArticleData = response.data
            thiz.similarityCount = " "+(response.data.transSimilarity*100).toFixed(2)+"%"
            if (!response.data.transPictureUrl) {
              thiz.getImageUrl(response.data.transUrl)
            }
          } else {
            thiz.$message({message: '请求错误'});
          }
        }, function (err) {
          thiz.fullscreenLoading = false
          thiz.$message({message: '请求错误'});
        })
      }
    },
    mounted() {
      var data = {
        name:document.title,
        id:"copyright-content"
      }
      this.registerCreateReportParams(this.$route.path,data)
      this.unionId = this.$route.query.unionId
      this.webpageCode = this.$route.query.webpageCode
      if (!(this.unionId && this.webpageCode)) {
        this.$message({message: '参数错误'});
      } else {
        this.initData();
      }
    }
  }
</script>

<style scoped>
  @import '../../assets/css/home/common.css';
  @import '../../assets/css/Copyringht/CopyringhtContent.css';

  .compare-copyright .comparison-box {
    margin-top: 20px;
  }
  .compare-copyright .buttonSelect .file_button{
    width: 32px;
    height: 32px;
    background: url("../../assets/image/file.png") no-repeat center;
    background-size: 80%;
    line-height: 33px;
    float: left;
    vertical-align: top;
    display: inline-block;
    margin-left: 2px;
    cursor: pointer;
  }
  .compare-copyright .buttonNormal .file_button{
    width: 32px;
    height: 32px;
    background: url("../../assets/image/file_unselected.png") no-repeat center;
    background-size: 80%;
    line-height: 33px;
    float: left;
    vertical-align: top;
    display: inline-block;
    margin-left: 2px;
    cursor: pointer;
  }
  .compare-copyright .buttonNormal .picture_button{
    width: 32px;
    height: 32px;
    background: url("../../assets/image/picture.png") no-repeat center;
    background-size: 80%;
    line-height: 33px;
    float: left;
    vertical-align: top;
    display: inline-block;
    margin-left: 2px;
    cursor: pointer;
  }
    .compare-copyright .buttonSelect .picture_button{
    width: 32px;
    height: 32px;
    background: url("../../assets/image/picture_selected.png") no-repeat center;
    background-size: 80%;
    line-height: 33px;
    float: left;
    vertical-align: top;
    display: inline-block;
    margin-left: 2px;
    cursor: pointer;
  }
</style>
