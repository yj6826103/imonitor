<template>
  <div class="overView"
       style="height:calc(100%-5px);"
       id="overView"
       v-loading.fullscreen.lock="fullscreenLoading">
    <div class="search-list" id="search-list">
      <SearchInput :selectListener="selectListener"
      ref="searchInput"/>
      <div class="list" style="margin-bottom: 20px">
        <span class="search-num" v-if="listData.length>0">{{total}}条结果</span>
        <div class="item-box" v-for="item in listData">
          <div class="item-title" v-html="getTitleHtml(item.title)" @click="jump(item)"></div>
          <span class="item-span-left" v-if="item.platformName">{{item.platformName}}</span>
          <span class="item-span-right">{{item.publishTime}}</span>
        </div>
        <div class="sorry" v-if="noneSearch">对不起,没有搜索结果
        </div>
        <div>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="total"
            v-if="total>10"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import SearchInput from './SearchInput';

  export default {
    name: "spread-content",
    components: {SearchInput},
    data() {
      return {
        currentPage: 1,
        noneSearch: false,
        fullscreenLoading: false,
        total: 0,
        listData: [],
        title: "",
        pickerOptions: {
          disabledDate: function (data) {
            return new Date().getTime() < data.getTime()
          },
        },
      };
    },
    watch: {
      value1(curVal, oldVal) {
        if (this.value1 == null) {
          this.getArticleDetails();
        }
        if (this.value1 && this.value1.length > 1 && this.articleId && this.platformTypeId) {
          this.getArticleDetails();
        }
      },
    },
    methods: {
      selectListener(searchText) {
        this.title = searchText
        this.search();
      },
      jump(item){
        window.open( '/detail?uid='+ item.unionId+"&aid="+item.articleId)
      },
      search() {
        this.noneSearch = false
        this.fullscreenLoading = true
        var params = {
          titleWord: this.title,
          pageNo: this.currentPage,
          pageSize: 10,
        }
        var thiz = this
        this.$http.get(this.baseUrl + "/search/articleList", {params: params}).then(function (res) {
          this.fullscreenLoading = false
          var response = JSON.parse(res.bodyText)
          if (response.code == 200 || response.code == "200") {
            var data = response.data
            thiz.total = data.totalElements
            thiz.listData = data.content
            if (thiz.listData.length == 0) {
              thiz.noneSearch = true
            }
          }
        }, function (err) {
          this.$message({"message": "搜索失败"})
          this.fullscreenLoading = false
        })
      },
      getTitleHtml(articleTitle) {
        var copyTitle = articleTitle + ""
        var titleArray = []
        titleArray = articleTitle.split(this.title)
        if (titleArray.length < 2) {
          titleArray = articleTitle.split(this.title.toLocaleUpperCase())
        }
        if (titleArray.length < 2) {
          titleArray = articleTitle.split(this.title.toLocaleLowerCase())
        }
        var str = ""
        for (var i = 0; i < titleArray.length; i++) {
          if (i != titleArray.length - 1) {
            str = str + "<span style='color: #3B87F5;'>" + titleArray[i] + "</span>" + "<span style='color: red;'>" + this.title + "</span>"
          } else {
            str = str + "<span style='color: #3B87F5;'>" + titleArray[i] + "</span>"
          }
        }
        var startWith = copyTitle.startWith(this.title)
        if (startWith) {
          "<span style='color: red;'>" + this.title + "</span>" + str
        }
        return str
      },
      handleCurrentChange(val) {
        if (val != this.currentPage) {
          this.currentPage = val
          this.search()
        }
      }
    },
    mounted() {
      this.title = this.$route.query.searchTitle
      if( this.title&&this.title!=""){
        this.$refs.searchInput.setSearchTitle(this.title)
        this.search()
      }
    }
  }
</script>

<style scoped>
  @import '../../assets/css/search/search.css';
</style>
