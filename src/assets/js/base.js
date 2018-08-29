exports.install = function (Vue, options) {
  Vue.prototype.getRandomColor = function () {
    return 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
  };

  let app = require('../../App.vue');
  Vue.prototype.alert = app.default.methods.alert;

  Vue.prototype.confirm = function (content, buttonText, confirmCallback, cancelCallback) {
    let app = this.$parent;
    while (1) {
      if (app.$parent) {
        app = app.$parent
      } else {
        break
      }
    }
    app = app.$children[0];
    app.confirm(content, buttonText, confirmCallback, cancelCallback)
  };

  Vue.prototype.alert = function (content, buttonText, confirmCallback) {
    let app = this.$parent;
    while (1) {
      if (app.$parent) {
        app = app.$parent
      } else {
        break
      }
    }
    app = app.$children[0];
    app.alert(content, buttonText, confirmCallback)
  };

  Vue.prototype.rzl_handleNumber = function (num) {

    let result;
    let reg = /^[0-9]+.?[0-9]*$/;
    if (reg.test(num)) {
      result = num;

    } else {

    }
  };

  Vue.prototype.rzl_showLoading = function (isShow) {
    document.getElementById('loading_rzl').style.display = isShow ? 'block' : 'none';
  };
  Vue.prototype.zc_log = function (log) {
    // console.log(log);
  };

  //剪切省/市名字
  Vue.prototype.cutProvinceName = function (name) {
    let newName = name;
    if (name.indexOf('省') > 0) {
      newName = name.substring(0, name.indexOf('省'))
    } else if (name.indexOf('市') > 0) {
      newName = name.substring(0, name.indexOf('市'))
    }
    return newName
  };
  String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
  };
  // Vue.prototype.baseUrl = 'http://10.50.2.23:9091/imonitor/v1'; //开发环境
  // Vue.prototype.baseUrl = 'http://10.50.1.191:8064/imonitor/v1'; //本地测试环境
  Vue.prototype.baseUrl = 'http://mon.inewsengine.com/imonitor/v1'; //华为云环境


  // Vue.prototype.linkINewsURL = 'http://10.50.1.191/api/asserver/JGauthorize'; //测试环境__跳转inewsURL
  Vue.prototype.linkINewsURL = 'http://inewsengine.com/api/asserver/JGauthorize'; //华为云换囧__跳转inewsURL


  // Vue.prototype.imageServerUrl = 'http://192.168.1.152:5555/get_screenshot';//本地环境
  Vue.prototype.imageServerUrl = 'http://mon.inewsengine.com/get_screenshot';//华为云环境
  Vue.prototype.dataFormat = function (time) {
    var date = new Date(time);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    if (minutes.length == 1) {
      minutes = "0" + minutes
    }
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes
  };

  // 对Date的扩展，将 Date 转化为指定格式的String
  // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
  // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
  Date.prototype.Format = function (fmt) { //author: meizz
    let o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  };
  // 获取get请求的参数对象
  Vue.prototype.getQueryObjectByUrl = function () {
    var url = window.location.href;
    var obj = {
      pathname: window.location.pathname,
      getUrl: function () {
        var i = 0;
        var result = '';
        for (prop in this) {
          if (prop === 'getUrl' || prop === "pathname") {
            continue;
          }
          if (i == 0)
            result += '?' + prop + '=' + this[prop];
          else
            result += '&' + prop + '=' + this[prop];
          i++;
        }
        result = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + this.pathname + result;
        return result;
      }
    };
    if (url.indexOf("?") == -1)
      return obj;
    var search = url.substring(url.indexOf("?"));
    if (!search || search === '')
      return obj;
    var keyValueArray = search.substring(1).split('&');
    keyValueArray.forEach(function (item, i) {
      var keyAndValue = item.split('=');
      var key = keyAndValue[0];
      var value = keyAndValue[1];
      if (typeof (value) !== 'undefined' && value !== null && value !== '')
        obj[key] = decodeURIComponent(value);
    });
    return obj;
  }


  Vue.prototype.handleNum = function (num) {
    var str = 0
    if (num > 10000) {
      str = (num / 10000).toFixed(2)
      while (str.substr(str.length - 1, str.length) == "0") {
        str = str.substr(0, str.length - 1)
      }
      if (str.substr(str.length - 1, str.length) == ".") {
        str = str.substr(0, str.length - 1)
      }
      str = str + "万"
    } else {
      str = num
    }
    return str
  }
  Vue.prototype.getLineUnitWidth = function (num, hasSildBar) {
    if (hasSildBar) {
      return window.screen.width * 0.93 / num
    }
    return window.screen.width * 0.78 / num
  }
  Vue.prototype.createReportParamsMap = {}
  Vue.prototype.registerCreateReportParams = function (pathName, id,) {
    this.createReportParamsMap[pathName] = id
  }
  Vue.prototype.initPageSize = function () {
    // console.log(this)
    this.contentMarginLeft = window.screen.width * 0.15
    this.sliderWidth = window.screen.width * 0.15 - 1
    if (!this.showSiderbar) {
      this.contentMarginLeft = 0
      this.sliderWidth = 0
    }
    this.contentWidth = window.screen.width - this.contentMarginLeft
    var content = document.getElementsByClassName("showSiderbar")
    var marginLeftpx = this.contentMarginLeft
    setTimeout(function () {
      if (content[0]) {
        var width = "calc(100% - " + marginLeftpx + "px)"
        content[0].style.width = width
      }
    }, 200)
  }
  // 移除字符中的所有空格
  Vue.prototype.trimAll = function (str) {
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
  }

};
