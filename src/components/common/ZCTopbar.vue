<template>
  <div id="IM_topbar" class="IM_topbar bgc_rzl">
    <div class="IM_topbar_content bgc_base clearfix">

      <!--logo-->
      <div id="IM_topbar_logo" class="IM_topbar_logo">
        <img src="../../assets/image/iMonitor_logo1.png" @click="logoClicked()">
      </div>

      <!--搜索框-->
      <div id="IM_topbar_search"
           class="IM_topbar_search"
           @keyup.enter="searchEnter">
        <el-autocomplete placeholder="请输入文章标题"
                         v-model="searchResult"
                         placement="top-start"
                         :fetch-suggestions="articleSearch"
                         :trigger-on-focus="false">
          <template slot="append" >
            <span style="cursor: pointer" @click="searchEnter">iSearch</span>
          </template>
        </el-autocomplete>
      </div>

      <!--更多产品-->
      <div id="IM_topbar_more" class="IM_topbar_more">

        <el-dropdown trigger="hover"
                     placement="top"
                     :show-timeout="100"
                     @command="getMoreProducts">
          <span class="IM_topbar_more_title">更多产品</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="inews">
              <img src="../../assets/image/logo_inews.png" style="height: 30px">
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <!--表单提交(隐藏)-->
        <form name='paySubmit' id="sub" method='post'  :action='linkINewsURL'>
          <input type='hidden' id="access_token" name='access_token' value=''/>
          <input type='hidden' id="signature" name='signature' value=''/>
          <input type='hidden' id="account" name='account' value=''/>
          <input type='hidden' name='redirectUrl' value='/home'/>
        </form>

    </div>

      <!--用户管理-->
      <div id="IM_topbar_user"
           class="IM_topbar_user"
           v-if="userName">

        <el-dropdown trigger="hover"
                     :hide-on-click="false"
                     placement="bottom"
                     :show-timeout="100"
                     @command="userInfoClick">

          <span class="IM_topbar_user_title">
            <!--<i class="el-icon-picture" style="margin-right: 0"></i>-->
            <span>{{userName?userName:'用户名'}}</span>
            <i class="el-icon-arrow-down" style="margin-left: 0"></i>
          </span>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: "z-c-topbar",
    data(){
      return{
        /*搜索结果*/
        searchResult:null,

        /*当前登录用户名*/
        userName:null,
      }
    },
    methods:{


      /******************IM_topbar_logo******************/
      /*logo点击方法*/
      logoClicked(){
        // window.location.href = '/';
        window.location.href = '/';
      },


      /******************IM_topbar_search******************/
      /*进入搜索页面*/
      searchEnter(){
        let searchResult = this.trimAll(this.searchResult);
        if(searchResult.length>0){
          window.open("searchList?searchTitle=" + this.searchResult)
        }
      },

      /*搜索建议*/
      articleSearch(queryString, callback) {
        queryString = this.trimAll(queryString);

        if(queryString.length === 0){
          callback([])
        }else{

          this.$http.get(this.baseUrl + "/search/titleList", {params: {titleWord:queryString}}).then(function (res) {
            this.fullscreenLoading = false;
            let response = JSON.parse(res.bodyText);
            this.zc_log('加载搜索建议数据');
            this.zc_log(response);
            this.handleArticleSearchData(response.data, callback);
          }, function (err) {
            this.fullscreenLoading = false;
          })
        }
      },
      handleArticleSearchData(data,callBack){

        let result = [];

        if(data && data.length){
          data.forEach(function (value,index) {
            result.push({
              value: value.title + (value.platformName ? ('-' + value.platformName) : ''),
              articleId: value.articleId,
              url: value.url,
              unionId:value.unionId,
            })
          })
        }else{
          result.push({value:'无相关结果',id:''});
        }

        callBack(result);

      },


      /******************IM_topbar_user******************/
      /*点击用户信息下拉列表*/
      userInfoClick(value) {
        if (value === 'logout') {
          window.localStorage.removeItem('selectedPickerClickRecord');
          window.localStorage.removeItem('datePickerClickRecord');
          window.localStorage.removeItem('sidebarClickRecord1');
          this.$http.get(this.baseUrl + '/user/logout').then(function (res) {
            var response = JSON.parse(res.bodyText);
            if (response.code == 200) {
              window.localStorage.clear();
              this.$router.push({path: '/login'});
              this.zc_log('退出');
            }
          }, function (err) {
            this.zc_log(err);
          })
        }
      },

      /*加载当前登录的用户信息*/
      loadUserInfo(){
        this.$http.get(this.baseUrl + '/user/info').then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('加载用户数据');
          this.zc_log(response);
          if (response.code == 200) {
            let data = response.data;
            this.userName = data.username?data.username:(data.account?account:null);
          }
        }, function (res) {
          this.zc_log('加载侧边栏error');
          this.zc_log(res);
        });
      },




      /******************IM_topbar_more******************/
      //点击跳转更多作品页
      getMoreProducts(value){
        if(value === 'inews'){
          this.$http.get(this.baseUrl + '/api/inews/token/info').then(function (res) {
            let response = JSON.parse(res.bodyText);
            this.zc_log('跳转iNews返回数据');
            this.zc_log(response);
            if (parseInt(response.code) === 200) {
              this.handleGetMoreProducts(response.data)
            }
          }, function (res) {
            this.zc_log('跳转iNewserror');
            this.zc_log(res);
          });
        }
      },
      handleGetMoreProducts(data){

        document.getElementById('signature').value = data.signature;
        document.getElementById('account').value = data.account;

        let accessT = localStorage.getItem('token');
        document.getElementById('access_token').value = accessT;

        let sub = document.getElementById('sub');
        sub.submit();
      },


    },
    mounted(){
      this.rzl_showLoading(true);/*增加加载动画蒙版*/
      this.loadUserInfo();
    }
  }
</script>

<style scoped>

  .IM_topbar {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .IM_topbar_content{
    height: 60px;
    padding-right: 90px;
  }

  /*logo部分*/
  .IM_topbar_logo {
    float: left;
    width: 200px;
    height: 100%;
  }
  .IM_topbar_logo img{
    padding: 13px 32px;
    width: 134px;
    height: 34px;
    cursor: pointer;
  }



  /*搜索框部分*/
  .IM_topbar_search{
    float: left;
    padding: 0;
    margin: 0 0 0 48px;
    line-height: 60px;
  }

  .IM_topbar_search >>> input{
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    -webkit-user-select: none;
    -moz-user-focus: none;
    -moz-user-select: none;
    -webkit-appearance: none;
    outline: none;
    border: none;
    background-color: #fff;
    margin: 0;
    padding: 0 17px 0 17px;
    height: 36px;
    width: 235px;
    border-radius: 30px 0 0  30px;
    font-size: 12px;
  }
  .IM_topbar_search >>> input::-webkit-input-placeholder {
    color: #D0D0D0;
    font-size: 12px;
  }
  .IM_topbar_search >>> input:-moz-placeholder {
    color: #D0D0D0;
    font-size: 12px;
  }
  .IM_topbar_search >>> input::-moz-placeholder {
    color: #D0D0D0;
    font-size: 12px;
  }
  .IM_topbar_search >>> input:-ms-input-placeholder {
    color: #D0D0D0;
    font-size: 12px;
  }
  .IM_topbar_search >>> .el-input-group__append{
    border: none;
    border-radius: 0 30px 30px 0;
    color: #3B87F5;
    background-color: #BDD8FF;
  }


  /*用户管理部分*/
  .IM_topbar_user{
    float: right;
    line-height: 60px;
  }



  /*更多*/
  .IM_topbar_more{
    float: right;
    line-height: 60px;
    padding-left: 20px;
  }
  .IM_topbar_more_title{
    color: #fff;
    cursor: pointer;
  }
  .IM_topbar_user_title{
    /* font-size: 18px; */
    color: #fff;
    cursor: pointer;
  }
  .el-popper[x-placement^=bottom] {
     margin:0;
  }



</style>
