<template>
  <div class="addArticle">
    <div class="submit" @click="submit">提交</div>
    <div class="input-box">
      <span>标题：</span>
      <el-input v-model="title" placeholder="请输入内容" class="input-title"></el-input>
    </div>
    <div class="input-box">
      <span>日期：</span>
      <el-date-picker
        v-model="time"
        type="date"
        placeholder="选择日期">
      </el-date-picker>
    </div>
    <div class="input-box">
      <span>正文：</span>
      <div class="content-input-box">
        <quill-editor
          class="content-input"
          v-model="content"
          ref="myQuillEditor"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @change="onEditorChange($event)">
        </quill-editor>
      </div>
    </div>
  </div>
</template>

<script>
  // import WordCloudPic from '@/components/common/WordCloudPic'
  import VueQuillEditor from 'vue-quill-editor'
  // require styles 引入样式
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  export default {
    name: "add-article-content",
    components: {VueQuillEditor},
    data() {
      return {
        title: "",
        time: "",
        content: "",
        editorOption: {
          debug: 'none',
          modules: {
            toolbar: ''
          },
          placeholder: '',
          readOnly: true,
          theme: 'snow'
        },

      }
    },
    methods: {
      onEditorBlur(event) {

      },
      onEditorFocus(event) {

      },
      onEditorChange(event) {

      },
      dateFormat(date) {
        var date = new Date(date);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if (minutes < 10) {
          minutes = "0" + minutes
        }
        if (hours < 10) {
          hours = "0" + hours
        }
        if (month < 10) {
          month = "0" + month
        }
        if (day < 10) {
          day = "0" + day
        }
        var str = year + "-" + month + "-" + day + " " + hours + ":" + minutes
        return str
      },
      submit() {
        if (!this.time || this.time == "") {
          this.alert("请选择发布时间")
          return
        }
        if (!this.title || this.title == "") {
          this.alert("请填写文章标题")
          return
        }
        if (!this.content || this.content == "") {
          this.alert("请填写正文内容")
          return
        }
        var content = this.content.replace(/<.*?>/ig, "")
        content = content.replace(/&nbsp/g, "")
        var params = {
          title: this.title,
          content: content,
          public_time: this.time.getTime(),
        }
        this.$http.get(this.baseUrl + '/article/pagerank/add', {params: params}).then(function (res) {
        }, function (err) {
        })
        this.$http.get(this.baseUrl + '/article/pagerank/test', ).then(function (res) {
          let response = JSON.parse(res.bodyText);
          if (response.code == 200) {
            this.alert("添加成功，点击确定关闭窗口",function () {
              window.close()
            })
          }
        }, function (err) {
        })
      }
    },
    mounted() {


    }
  }
</script>

<style scoped>

  .addArticle {
    position: relative;
    width: 100%;
    background-color: #fff;
  }

  .input-title {
    width: 400px;
  }

  .content-input-box {
    margin-left: 48px;
    margin-right: 50px;
    margin-top: -50px;
  }

  .content-input {
    margin-top: 35px;
    height: 250px;
  }

  .input-box {
    margin-left: 50px;
    margin-top: 40px;
  }

  .submit {
    cursor: pointer;
    height: 34px;
    line-height: 34px;
    /* font-size: 16px; */
    text-align: center;
    width: 80px;
    background: #3B87F5;
    color: white;
    border-radius: 10px;
    top: 0px;
    right: 50px;
    position: absolute;
  }

  .input-box span {

  }
</style>
