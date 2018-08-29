<template>
  <div class="overView"
       style="height: 100%;"
       id="overView">
    <div class="works_content">

      <div class="works_header block_rzl">

        <div class="works_header_search">
          <el-autocomplete size="medium"
                           :placeholder="radio?'请输入文章标题':'请输入连接'"
                           v-model="recommendSelected"
                           :disabled="disabled"
                           :suffix-icon="radio?'el-icon-search':''"
                           :trigger-on-focus="false"
                           :fetch-suggestions="articleSearch"
                           @select="platformSearchSelect"
                           @focus="platformSearchFocus">
          </el-autocomplete>
        </div>
        <span class="sureBtn" @click="confirmChooseArticle">确定</span>
        <span class="title-hint" id="title-hint">最多可勾选{{worksMax}}个平台进行勾线</span>
        <div class="radio-box">
          <template>
            <el-radio v-model="radio" :label=true>站内文章</el-radio>
            <!--<el-radio v-model="radio" :label=false>站外链接</el-radio>-->
          </template>
          <!--<div class="description-box" v-if="!radio">-->
            <!--<input class="description-input"-->
                   <!--v-model="urlTitle"-->
                   <!--placeholder="请输入文章标题"/>-->
          <!--</div>-->
        </div>
        <chooseArticleList
          style="margin-top: 20px"
          :listData="selectArticles"
          :deleteListener="chooseArticleDeleteListener"/>
        <div class="works_header_save">
          <span class="saveBtn" @click="saveChooseArticle">保存</span>
        </div>
      </div>

      <div class="block_rzl" style="overflow: hidden" id="comparisonArticleList_box">
        <div class="title_rzl">已添加对比列表</div>
        <comparisonArticleList
          style="margin-top: 20px;margin-bottom: 20px"
          :listData="listData"
          :deleteListener="comparisonArticleDeleteListener"/>
      </div>

    </div>
  </div>

</template>

<script>
  import chooseArticleList from '@/components/Works/ChooseArticleList.vue'
  import comparisonArticleList from '@/components/Works/ComparisonArticleList.vue'


  export default {
    name: "works-content",
    components: {chooseArticleList, comparisonArticleList},
    props: {
      datePickerParams: {type: Object, require: true},
    },
    data() {
      return {
        recommendSelected: '',
        disabled: false,
        worksMax: 3,
        selectArticle: null,
        urlTitle: '',
        selectArticles: [],
        timeCodeDD: -1,
        timeCodeColor: -1,
        getListIng: false,
        listData: [],
        startTime: "",
        accountType: "",
        radio: true,
      }
    },
    watch: {
      selectArticles(oldData, newData) {
        if (this.selectArticles.length > 2) {
          this.disabled = true
        } else {
          this.disabled = false
        }
      },
      datePickerParams(oldData, newData) {
        this.startTime = this.datePickerParams.startTime
        this.accountType = this.datePickerParams.accountType
        if (this.startTime && this.accountType) {
          this.getComparisonList()
        }
      },
    },
    methods: {
      chooseArticleDeleteListener(id) {
        var index = -1
        for (var i = 0; i < this.selectArticles.length; i++) {
          if (id == this.selectArticles[i].articleId) {
            index = i
          }
        }
        if (index != -1) {
          this.selectArticles.splice(index, 1);
          this.handleError("删除成功！")
        }
      },
      comparisonArticleDeleteListener(id) {
        var params = {
          groupId: id,
        }
        var thiz = this
        this.$http.get(this.baseUrl + '/article/compared/del', {params: params}).then(function (res) {
          var response = JSON.parse(res.bodyText)
          if (response.code != "200" || response.code != 200) {
            thiz.$message({"message": "删除失败！"})
            return
          } else {
            thiz.$message({"message": "删除成功！"})
            thiz.getComparisonList()
          }
        }, function (err) {
          thiz.$message({message: '删除失败！'});
        })
      },
      confirmChooseArticle() {
        if (!this.radio) {
          if (this.urlTitle == "") {
            this.handleError("请输入链接标题")
            return
          }
          if (this.recommendSelected == "" || this.recommendSelected.indexOf("http") != 0) {
            this.handleError("请输入合法链接")
            return
          }
          if (this.recommendSelected == "" || this.recommendSelected.indexOf("http") != 0) {
            this.handleError("请输入合法链接")
            return
          }
          var json = {
            url: this.recommendSelected,
            title: this.urlTitle
          }
          let Base64 = require('js-base64').Base64;
          json = Base64.encode(JSON.stringify(json))
          var obj = {
            "unionId": "",
            "articleId": "outsidelink" + json,
            "title": this.urlTitle,
            "platformName": "",
            "name": this.urlTitle,
            "url": this.recommendSelected
          }
          this.selectArticles.push(obj)
          this.recommendSelected = ""
          this.urlTitle = ""
          return
        }

        if (this.selectArticles.length > 2) {
          if (this.timeCodeDD != -1) {
            clearTimeout(this.timeCodeDD)
          }
          if (this.timeCodeColor != -1) {
            clearTimeout(this.timeCodeColor)
          }
          document.getElementById("title-hint").style.color = "red"
          document.getElementById("title-hint").classList.add("dd");
          this.timeCodeDD = setTimeout(function () {
            document.getElementById("title-hint").classList.remove("dd");
          }, 1000)
          this.timeCodeColor = setTimeout(function () {
            document.getElementById("title-hint").style.color = "#dddddd"
          }, 5000)
          return
        }
        if (this.selectArticle) {
          for (var i = 0; i < this.selectArticles.length; i++) {
            if (this.selectArticle.articleId == this.selectArticles[i].articleId) {
              this.handleError("请不要重复选择同一篇文章")
              return
            }
          }
          this.selectArticles.push(this.selectArticle)
          this.recommendSelected = ""
        } else {

        }
      },
      saveChooseArticle() {
        if (this.selectArticles.length < 2) {
          this.handleError("至少选择两篇文章")
          return
        }
        if (this.selectArticles.length > 3) {
          this.handleError("最多选择三篇文章")
          return
        }
        var thiz = this
        var url = this.baseUrl + '/article/compared/add?'
        var parames = ""
        for (var i = 0; i < this.selectArticles.length; i++) {
          parames = parames + "&" + "idList=" + this.selectArticles[i].articleId
        }
        parames = parames.substr(1, parames.length)
        url = url + parames
        this.zc_log(url)
        this.$http.get(url).then(function (res) {
          var response = JSON.parse(res.bodyText)
          if (response.code != "200" || response.code != 200) {
            thiz.$message({"message": "参数错误，请重试！"})
            return
          } else {
            thiz.selectArticles = []
            thiz.$message({"message": "添加成功"})
            thiz.getComparisonList()
          }
        }, function (err) {
          thiz.$message({message: '请求错误'});
        })
      },
      getComparisonList() {
        if (this.getListIng) {
          return
        }
        this.getListIng = true
        var thiz = this
        setTimeout(function () {
          thiz.getListIng = false
        }, 1500)
        var params = {
          today: this.startTime,
          accountType: this.accountType
        }
        this.$http.get(this.baseUrl + "/article/compared/find", {params: params}).then(function (res) {
          // this.$http.get("http://127.0.0.1:8020/HelloHBuilder/test2.json", {params: params}).then(function (res) {
          var response = JSON.parse(res.bodyText)
          if (response.code == "200" || response.code == 200) {
            for (var i = 0; i < response.data.length; i++) {
              var itemData = response.data[i]
              for (var j = 0; j < itemData.info.length; j++) {
                if (!itemData.info[j].unionId || itemData.info[j].unionId == "") {
                  var base = itemData.info[j].articleId.replace("outsidelink", "")
                  base = base.replace(/\ /g, "+")
                  let Base64 = require('js-base64').Base64;
                  var json = Base64.decode(JSON.stringify(base))
                  json = JSON.parse(json)
                  var obj = {
                    "commentNum": "-",
                    "publishTime": "-",
                    "appriseNum": "-",
                    "unionId": "-",
                    "readNum": "-",
                    "transNum": "-",
                    "articleId": "-",
                    "title": json.title,
                    "mediaSource": "-",
                    "url": json.url,
                    isUrl: true
                  }
                  itemData.info[j] = obj
                }
              }
            }
            thiz.listData = response.data
          } else {
            thiz.$message({message: '请求错误'});
          }
        }, function (err) {
          thiz.$message({message: '请求错误'});
        })
      },
      articleSearch(queryString, callback) {//return
        if (!this.radio) {
          callback([])
          return
        }
        queryString = this.trimAll(queryString)

        var params = {
          titleWord: queryString
        }
        var thiz = this
        this.$http.get(thiz.baseUrl + "/search/titleList", {params: params}).then(function (res) {
          var data = typeof res.body === "object" ? res.body : JSON.parse(res.body);
          var result = []
          if (data.code == 200 && data.data.length > 0) {
            for (var i = 0; i < data.data.length; i++) {
              result.push({
                value: data.data[i].title + (data.data[i].platformName ? ('-' + data.data[i].platformName) : ''),
                name: data.data[i].title,
                articleId: data.data[i].unionId,
                url: data.data[i].url,
                unionId: data.data[i].unionId,
              })
            }
            callback(result)
          } else {
            var result = [{
              value: "无相关结果",
              id: ""
            }]
            if(queryString.length===0){
              callback([])
            }else{
              callback(result)
            }
            
          }
        }, function (err) {
          callback([])
          this.handleError("请求错误，请稍后尝试")
        })
      },
      handleError(message) {
        this.$message({
          duration: 1500,
          message: message
        });
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
        };
      },

      //搜索结果推荐点击事件
      platformSearchSelect(item) {
        if (item.id == "") {
          this.recommendSelected = ''
          return
        }
        this.selectArticle = item
      },

      //搜索框获取焦点事件
      platformSearchFocus() {
        this.recommendSelected = null;
      },
    },

    created() {
      let data = {
        name: document.title,
        id: "comparisonArticleList_box"
      };
      this.registerCreateReportParams(this.$route.path, data)
    }

  }
</script>

<style scoped>
  @import '../../assets/css/works/works.css';
</style>
