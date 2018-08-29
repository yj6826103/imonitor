<template>
  <div id="app" class="app">

    <router-view></router-view>

    <!--加载中的遮罩层-->
    <div id="loading_rzl"></div>


    <div id="message-box" class="message-background" v-if="show">
      <div class="message-box">
        <div class="content">{{startContent}}<span class="color_base">{{accentContent}}</span>{{endContent}}</div>
        <div class="button">
          <span class="confirm bgc_base" :style="isAlert?'margin-right:0px;':''" @click="confirmListener">{{confirmButtonText}}</span>
          <span class="cancel color_base" @click="cancelListener" v-if="!isAlert">{{cancelButtonText}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Home from '@/components/Home/Home.vue'

  export default {
    name: 'App',
    components: {Home},
    data() {
      return {
        show: false,
        confirmCallback: null,
        cancelCallback: null,
        isAlert: false,
        startContent: "",
        accentContent: "",
        endContent: "",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      }
    },
    methods: {
      confirmListener() {
        if (this.confirmCallback) {
          this.confirmCallback()
        }
        this.complete()
      },
      cancelListener() {
        if (this.cancelCallback) {
          this.cancelCallback()
        }
        this.complete()
      },
      complete() {
        this.show = false;
        this.confirmCallback = null;
        this.cancelCallback = null;
        this.startContent = "";
        this.accentContent = "";
        this.endContent = "";
        this.isAlert = false;
        this.confirmButtonText = "确认";
        this.cancelButtonText = "取消"
      },
      alert(content, buttonText, callback){
        this.show = true;
        this.isAlert = true;
        if (typeof content === 'string') {
          this.accentContent = content
        } else if (content) {
          this.startContent = content.startContent ? content.startContent : "";
          this.accentContent = content.accentContent ? " " + content.accentContent + " " : "";
          this.endContent = content.endContent ? content.endContent : ""
        }
        if (buttonText && typeof buttonText === "string") {
          this.confirmButtonText = buttonText
        } else if (buttonText && typeof buttonText === "function") {
          this.confirmCallback = buttonText
        }
        if (callback && typeof buttonText === "function") {
          this.confirmCallback = callback
        }
      },
      confirm(content, buttonText, confirmCallback, cancelCallback){
        this.show = true;
        this.isAlert = false;
        if (typeof content === 'string') {
          this.accentContent = content
        } else if (content) {
          this.startContent = content.startContent ? content.startContent : "";
          this.accentContent = content.accentContent ? " " + content.accentContent + " " : "";
          this.endContent = content.endContent ? content.endContent : ""
        }
        if (buttonText && typeof buttonText === "object") {
          this.confirmButtonText = buttonText.confirmButtonText;
          this.cancelButtonText = buttonText.cancelButtonText
        } else if (buttonText && typeof buttonText === "function") {
          this.confirmCallback = buttonText;
          if (confirmCallback && typeof confirmCallback === "function") {
            this.cancelCallback = confirmCallback
          }
        }

        if (buttonText && typeof buttonText !== "function") {
          if (confirmCallback && typeof confirmCallback === "function") {
            this.confirmCallback = confirmCallback
          }
          if (cancelCallback && typeof cancelCallback === "function") {
            this.cancelCallback = cancelCallback
          }
        }
      },
      initMessage() {
        // let thiz = this
        // Vue.prototype.alert = function (content, buttonText, callback) {
        //
        // }
        // Vue.prototype.confirm = function (content, buttonText, confirmCallback, cancelCallback) {
        //
        // }
      }
    },

    created() {
      this.initMessage()
    },
  }
</script>
<style scoped>

  .app{
    background-color: #fff;
  }

  .app .message-background {
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(64, 64, 64, 0.5);
  }

  .app .button {
    margin-top: 70px;
    text-align: center;
  }

  .app .confirm {
    display: inline-block;
    height: 34px;
    color: white;
    /* font-size: 16px; */
    line-height: 34px;
    width: 100px;
    border-radius: 10px;
    margin-right: 25px;
    cursor: pointer;
  }

  .app .cancel {
    cursor: pointer;
    display: inline-block;
    height: 32px;
    background: white;
    border: #3B87F5 1px solid;
    /* font-size: 16px; */
    line-height: 32px;
    margin-left: 25px;
    width: 98px;
    border-radius: 10px;
  }

  .app .content {
    margin-top: 50px;
    height: 50px;
    line-height: 50px;
    /* font-size: 14px; */
    color: #444444;
    text-align: center;
  }

  .app .content span {
    /* font-size: 18px; */
    font-weight: bold;
  }

  .app .message-box {
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -250px;
    margin-top: -125px;
    border-radius: 15px;
    height: 250px;
    width: 500px;
    background: white;
  }

</style>

