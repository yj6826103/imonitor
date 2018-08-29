<template>

  <div id="iM_topbar" class="clearfix">
    <div class="left_logo" style="cursor: pointer" @click="logoClicked"></div>

    <div class="getMore">
      <el-select value="更多作品" placeholder="更多作品" @change="getMoreChanged">
        <el-option value="inews">
          <span style="height: 100%"><img src="../../assets/image/logo_inews.png" style="height: 100%"></span>
        </el-option>
      </el-select>
    </div>

    <div class="topbar_logout " @click="logoutClicked" v-if="userName">{{userName}}</div>


    <form name='paySubmit' id="sub" method='post'  :action='linkINewsURL'>
      <input type='hidden' id="access_token" name='access_token' value=''/>
      <input type='hidden' id="signature" name='signature' value=''/>
      <input type='hidden' id="account" name='account' value=''/>
      <input type='hidden' name='redirectUrl' value='/home'/>
    </form>


    <!--<div class="topbar_user" @click="userClicked">-->
      <!--<span><i class="fa fa-user-circle-o"></i>admin</span>-->
    <!--</div>-->
    <!--<div class="floating-ball" @click="goToSpreadAnalyze()" v-if="showFloatingBall">传播力分析</div>-->




  </div>

</template>

<script>
  export default {
    name: "top-bar",
    data() {
      return {
        showFloatingBall: false,
        userName:null
      }
    },
    mounted() {
      this.showFloatingBall = this.$route.path.indexOf('spreadAnalyze') === -1;
      this.loadUserInfo();
    },
    methods: {
      //跳转传播力分析页面
      goToSpreadAnalyze() {
        // this.$router.push({path: '/spreadAnalyze'});
        window.open("/spreadAnalyze")
      },
      logoClicked() {
        this.$router.push('/');
      },
      logoutClicked() {
        window.localStorage.removeItem('selectedPickerClickRecord');
        window.localStorage.removeItem('datePickerClickRecord');
        window.localStorage.removeItem('sidebarClickRecord1');
        this.$http.get(this.baseUrl + '/user/logout')
          .then(function (res){
            var response = JSON.parse(res.bodyText);
            if(response.code == 200){
              window.sessionStorage.setItem('username', '');
              this.$router.push({path: '/login'});
            }
            this.zc_log('退出');
          },function (err){
            this.zc_log(err);
          })
      },
      userClicked() {
        // alert('用户管理');
      },


      getMoreChanged(value){

        if(value === 'inews'){
          this.$http.get(this.baseUrl + '/api/inews/token/info').then(function (res) {
            let response = JSON.parse(res.bodyText);
            this.zc_log('加载侧边栏数据');
            this.zc_log(response);
            if (response.code == 200) {
              this.hanleMoreData(response.data)
            }
          }, function (res) {
            this.zc_log('加载侧边栏error');
            this.zc_log(res);
          });
        }


      },
      hanleMoreData(data){

        document.getElementById('signature').value = data.signature;
        document.getElementById('account').value = data.account;

        let token = localStorage.getItem('token');
        document.getElementById('access_token').value = token;

        let sub = document.getElementById('sub');
        sub.submit()

      },


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
      beforeCreate(){
        let token = this.$route.query.token;
        if(token){
          localStorage.setItem('token',token);
        }
      },
      created(){
        let token = this.$route.query.token;
        if(token){
          localStorage.setItem('token',token);
        }
      }

    },


  }
</script>

<style scoped>

  #iM_topbar {
    color: #fff;
    height: 43px;
    padding-right: 50px;
    line-height: 43px;
    background-color: #3B87F5;
    border: #3B87F5 1px solid;
    overflow: hidden;
  }

  .topbar_logo {
    float: left;
    font-size: 18px;
    font-weight: 600;
    margin-left: 20px;
  }
  .left_logo{
    position: absolute;
    top: 3px;
    width: 161px;
    height: 38px;
    background: url("../../assets/image/iMonitor_logo1.png") no-repeat left center;
    background-size: 90%;
    margin-left: 30px;
  }
  .topbar_user, .topbar_logout {
    float: right;
    margin-left: 50px;
    padding-left: 38px;
    background: url("../../assets/image/loginOut.png") no-repeat left 10px center;
  }

  .topbar_logo, .topbar_user, .topbar_logout {
    cursor: pointer;
  }

  .getMore{
    float: right;
    margin-left: 20px;
  }
  .getMore >>> input{
    background-color: transparent;
    padding: 0;
    border: 0;
    width: 55px;
    color: #fff;
  }
  .el-select-dropdown__item:hover,.el-select-dropdown__item.hover{
    background-color: transparent;
  }
  >>> .el-input__suffix{
    display: none;
  }
  .el-popper[x-placement^=bottom]{
    margin-top: 0 !important;
  }
  .floating-ball {
    color: #565656;
    position: fixed;
    bottom: 60px;
    right: 60px;
    height: 40px;
    width: 120px;
    z-index: 100;
    background: rgba(255, 255, 255, 0.6);
    line-height: 40px;
    text-align: center;
    border-radius: 5px;
    box-shadow: 0px 0px 2px 2px #eeeeee;
    /* font-size: 14px; */
    cursor: pointer;
    border: rgba(70, 76, 255, 0.6) 1px solid;
  }

  .floating-ball:hover {
    background: rgba(255, 255, 255, 1);
    border: rgba(70, 76, 255, 1) 1px solid;
  }

  i {
    margin-right: 10px;
  }



</style>
