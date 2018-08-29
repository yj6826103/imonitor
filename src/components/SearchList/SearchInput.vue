<template>
  <div class="search-input">
    <div class="input">
      <el-autocomplete placeholder="请输入文章标题"
                       v-model="searchText"
                       :select-when-unmatched="true"
                       suffix-icon="el-icon-search"
                       :fetch-suggestions="querySearchAsync"
                       @select="handleSelect"
                       :trigger-on-focus="false">
      </el-autocomplete>
    </div>
  </div>
</template>

<script>
  export default {
    name: "search-input",
    props: ["selectListener"],
    data() {
      return {
        searchText: ""
      }
    },
    methods: {
      articleSearch() {

      },
      setSearchTitle(searchTitle) {
        this.searchText = searchTitle
      },
      querySearchAsync(queryString, cb) {
        cb([]);
      },
      handleSelect() {
        if (this.selectListener && this.searchText) {
          this.selectListener(this.searchText)
        }
      }
    },
    mounted() {
      var searchImg = document.getElementsByClassName("el-input__icon")[0]
      var thiz = this
      searchImg.onclick = function () {
        thiz.handleSelect()
      }
    }
  }
</script>

<style scoped>
  .search-input {
    background: white;
    position: fixed;
    top: 45px;
    left: 0px;
    width: 100%;
    height: 90px;
  }

  .search-input .input {
    position: fixed;
    top: 80px;
    left: 100px;
  }

  .search-input >>> .el-input__inner {
    width: 500px;
    border-radius: 50px;
  }

</style>
