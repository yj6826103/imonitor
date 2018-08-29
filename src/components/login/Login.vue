<template>
  <div id="login" v-loading_rzl="fullscreenLoading" v-title="'登录'">

    <!--渐变背景-->
    <div class="login_bgp">
      <li :style="{backgroundImage:'url('+imgs[0]+')'}" ref="login_bgp_cover"></li>
      <transition-group name="flip-list" tag="ul">
        <li v-for="curImg in currImgs"
            :key="curImg"
            class="list-item"
            :style="{backgroundImage:'url('+curImg+')'}">
        </li>
      </transition-group>
    </div>

    <!--顶部logo-->
    <div class="login_top">
      <img class="logo" src="../../assets/image/iMonitor_logo1.png">
    </div>

    <!--中间部分-->
    <div class="login_middle clearfix">

      <!--左侧slogan-->
      <div class="login_middle_left">
        <span style="font-size: 110px">iMonitor<br></span><span style="font-size: 55px">新闻传播监测系统</span>
      </div>

      <!--右侧登录操作部分-->
      <div class="login_middle_right">
        <div class="login">
          <!--用户名输入-->
          <div class="username" id="username">
            <input type="text"
                   name="IM_username"
                   v-model="loginName"
                   autocomplete="on"
                   @keyup.enter="loginBtnClick"
                   @focus="isSuccessToLogin(false)"
                   @input="isSuccessToLogin(false)"
                   placeholder="请输入用户名">
          </div>
          <!--用户名记录控件-->
          <div class="accessRecord" ref="accessRecord">
            <div class="accessRecordItem" v-for="item in accessRecordData">{{item.name}}</div>
          </div>
          <!--密码输入-->
          <div class="password">
            <input type="password"
                   name="IM_password"
                   autocomplete="on"
                   v-model="loginPwd"
                   @keyup.enter="loginBtnClick"
                   @focus="isSuccessToLogin(false)"
                   @input="isSuccessToLogin(false)"
                   placeholder="请输入密码">
          </div>
          <!--验证码输入-->
          <div class="verify clearfix" v-if="showVerify">
            <div class="verify_text">
              <input type="text"
                     v-model="verificationCode"
                     @keyup.enter="loginBtnClick"
                     @focus="isSuccessToLogin(false)"
                     @input="isSuccessToLogin(false)"
                     placeholder="请输入验证码">
            </div>
            <div class="verify_img">
              <img id="verifyImage" :src="loadVerify()">
            </div>
            <div class="refreshVerify" @click="refreshVerifyCode">
              <img src="../../assets/image/Light.png">
              <!--<i class="el-icon-refresh"></i>-->
            </div>
          </div>
          <!---->
          <div class="loginTools clearfix">
            <div class="tryout">申请试用</div>
            <div class="remindPW">
              <input type="checkbox" name="remindPW" value='male'/>记住用户名
            </div>
          </div>

          <!--错误提示-->
          <div class="showError" id="showError">用户名或密码错误</div>
          <div class="loginBtn bgc_base" @click="loginBtnClick"><span>登录</span></div>
          <!--<div class="forgetPW"><span>忘记密码</span></div>-->
        </div>
      </div>
    </div>


    <!--底部版权部分-->
    <div class="login_bottom">
      技术咨询: 座机 010-62602000-2032<br>
      北京荣之联科技股份有限公司（地址：北京市朝阳区酒仙桥北路甲10号院106号楼荣之联大厦）<br>
      Copyright©2018.UEC Group Co.,Ltd.京ICP备14049550号
    </div>
  </div>
</template>

<script>

  import Vue from 'vue'

  export default {
    name: "login1",
    data() {
      return {

        /*渐变背景参数*/
        currImgs: [],
        imgs: ['https://obs-imonitor.obs.cn-north-1.myhwclouds.com/homepage1.jpg', 'https://obs-imonitor.obs.cn-north-1.myhwclouds.com/homepage2.jpg'],
        index: 0,

        /*登录参数*/
        // loginKind: 'S',
        loginName: '',//账号
        loginPwd: '',//密码
        showVerify: false,//显隐验证码部分
        verifyImage: '',//验证码图片
        verificationCode: '',//验证码
        fullscreenLoading: false,

        /*登录记录参数*/
        accessRecordData:[],

      }
    },
    methods: {

      /*渐变背景开始渐变*/
      startChange() {
        let thiz = this;
        setInterval(function () {
          if (thiz.index < thiz.imgs.length - 1) {
            thiz.index++
          } else {
            thiz.index = 0
          }
          thiz.currImgs.splice(0, 1, thiz.imgs[thiz.index]);
        }, 10000);

        // this.$refs.login_bgp_cover.style.display = 'hidden';

      },


      /*登录按钮点击*/
      loginBtnClick() {

        //清除侧边栏和顶部时间选择框的记录
        window.localStorage.removeItem('selectedPickerClickRecord');
        window.localStorage.removeItem('datePickerClickRecord');
        window.localStorage.removeItem('sidebarClickRecord1');
        this.isSuccessToLogin(false);

        let username = this.loginName;
        let password = this.loginPwd;
        let checkcode = this.verificationCode;

        if (username.length === 0 || password.length === 0) {
          this.isSuccessToLogin(true, '用户名或密码不能为空');
          return;
        }
        if (this.showVerify && checkcode.length === 0) {
          this.isSuccessToLogin(true, '对不起,验证码不能为空');
          return;
        }
        //组织参数
        let params = {username: username, password: password}
        if (checkcode.length && this.showVerify) {
          params.checkcode = checkcode
        }
        this.$http.post(this.baseUrl + '/user/login', params, {emulateJSON: true}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('登录response');
          this.zc_log(response);
          localStorage.setItem('token', response.data.token);
          if (response.code == 200) {
            this.fullscreenLoading = true;
            window.location.href = '/';
          } else {
            this.isSuccessToLogin(true, response.message);
            if (response.data.loginTime >= 3) {
              this.showVerify = true;
            }
          }
        }, function (err) {
          this.fullscreenLoading = false;
          this.zc_log(err);
        })

      },


      /*点击更换验证码*/
      loadVerify() {
        return this.baseUrl + '/api/captcha/getCaptcha?token=' + localStorage.getItem('token');
      },
      refreshVerifyCode() {
        document.getElementById('verifyImage').src = this.loadVerify();
      },

      //弹窗提醒
      isSuccessToLogin(isShow, message) {
        let showerror = document.getElementById('showError');
        showerror.style.visibility = isShow ? 'visible' : 'hidden';
        showerror.innerText = isShow ? message : '请重试';
        showerror.className = isShow ? 'showErrorOut showError' : 'showError';
      }

    },
    created() {
      this.startChange();
    },
  }
</script>

<style scoped>


  .flip-list-enter-active, .flip-list-leave-active {
    transition: all 10s;
  }

  .flip-list-enter, .flip-list-leave-active {
    opacity: 0;
  }

  .login_bgp li {
    z-index: -1;
    position: fixed;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    background-size: cover;
  }

  .login_bgp li img {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  .login_top {
    position: absolute;
    top: 0;
    left: 0;
    padding: 15px 60px;
  }

  .login_top .logo {
    width: 134px;
    height: 34px;
  }

  .login_middle {
    position: absolute;
    top: 50%;
    margin-top: -230px;
    width: 100%;
  }

  .login_middle .login_middle_left {
    float: left;
    width: 50%;
    text-align: right;
    color: #fff;
  }

  .login_middle .login_middle_right {
    float: right;
    width: 50%;
  }

  /*登录页面部分*/
  .login {
    font-size: 15px;
    color: #666;
    width: 365px;
    margin: 0 auto;
    padding: 25px 50px 40px 50px;
  }

  .username input,.password input,.verify input {
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    -webkit-user-select: none;
    -moz-user-focus: none;
    -moz-user-select: none;
    -webkit-appearance: none;
    outline: none;
    border: none;
    background-color: #fff;
    font-size: 14px;
    width: calc(100% - 20px);
    padding-left: 20px;
    height: 42px;
    border-radius: 8px;
  }

  .login input::-webkit-input-placeholder {
    color: #E2E3E4;
    font-size: 14px;
  }

  .login input:-moz-placeholder {
    color: #E2E3E4;
    font-size: 14px;
  }

  .login input::-moz-placeholder {
    color: #E2E3E4;
    font-size: 14px;
  }

  .login input:-ms-input-placeholder {
    color: #E2E3E4;
    font-size: 14px;
  }

  @keyframes fade-in {
    0% {opacity: 0;}/*初始状态 透明度为0*/
    100% {opacity: 1;}/*结束状态 透明度为1*/
  }
  @-webkit-keyframes fade-in {/*针对webkit内核*/
    0% {opacity: 0;}
    100% {opacity: 1;}
  }

  .accessRecord{
    position: fixed;
    display: none;
    background-color: #fff;
    animation: fade-in;/*动画名称*/
    animation-duration: 0.5s;/*动画持续时间*/
    -webkit-animation:fade-in 0.5s;/*针对webkit内核*/
  }

  .login .password {
    margin-top: 30px;
  }

  .login .verify {
    margin-top: 30px;
  }

  .login .verify .verify_text {
    float: left;
    width: 50%;
  }

  .login .verify .verify_img {
    float: left;
    width: 135px;
  }

  .login .verify .verify_img img {
    float: right;
    width: 125px;
    height: 42px;
  }

  .login .verify .refreshVerify{
    float: left;
    line-height: 40px;
    width: 40px;
    text-align: center;
    cursor: pointer;
  }

  .loginTools{
    color: #fff;
    font-size: 14px;
    padding-top: 10px;
  }

  .loginTools .tryout{
    float: left;
  }
  .loginTools .remindPW{
    float: right;
    top: 0;
    right:0;
  }

  .login .showError {
    visibility: hidden;
    color: #e60000;
    text-align: center;
  }

  .showErrorOut {
    -webkit-animation-name: showError-out;
    -webkit-animation-duration: 0.1s;
    -webkit-animation-timing-function: linear;
    -webkit-animation-iteration-count: 3;
  }

  @-webkit-keyframes showError-out {
    0% {
      -webkit-transform: translateX(5px);
    }
    100% {
      -webkit-transform: translateX(-5px);
    }
  }

  .loginBtn {
    width: 100%;
    height: 45px;
    line-height: 45px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
  }


  /*底部*/
  .login_bottom {
    z-index: -1;
    position: fixed;
    text-align: center;
    color: #fff;
    font-size: 15px;
    width: 100%;
    bottom: 10px;
  }
</style>
