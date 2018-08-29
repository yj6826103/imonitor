// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import VueResource from 'vue-resource'


import base from './assets/js/base'
import './assets/css/common/common.css'
import './assets/css/common/ZC_Common.css';
import './assets/css/common/style_fontSize.css';
import htmlToPdf from '@/components/utils/HtmlToPdf'
import VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor);
Vue.use(htmlToPdf);
Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VueResource);
Vue.use(base);

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = 'iMonitor-'+binding.value
  }
});
Vue.directive('loading_rzl', {
  inserted: function (el, binding) {
    document.getElementById('loading_rzl').style.display = binding.value ? 'block' : 'none';
  }
});

// 拦截所有请求及响应,并进行处理.
Vue.http.interceptors.push((request, next) => {
  //此处this为请求所在页面的参数

  let token = localStorage.getItem('token');
  if (token) {
    // request.headers['token'] = token;
    request.headers.set('token',token);
  }

  // console.log(request);
  //在响应之后传给then之前对response进行修改和逻辑判断。对于token时候已过期的判断，就添加在此处，页面中任何一次http请求都会先调用此处方法　　　 　　
  next((response) => {
    let data = JSON.parse(response.bodyText);
    let code = data.code;
    // 状态为101,103时统一跳转至登陆页面
    if (code == 103 || code == 101) {
      //清除之前点击记录(包括侧边栏点击记录,时间选择记录)
      window.localStorage.clear();
      router.replace({
        path: '/login'
      });
    } else {
      return response;
    }
  });
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
