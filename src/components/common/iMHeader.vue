<template>

  <div id="iM_header">

    <div class="iM_header_search"
         v-if="!breadcrumbData.length"
         @keyup.enter="searchEnter()">
      <el-autocomplete placeholder="请输入文章标题"
                       v-model="searchResult"
                       suffix-icon="el-icon-search"
                       :trigger-on-focus="false"
                       :fetch-suggestions="articleSearch"
                       @select="articleSearchSelect">
      </el-autocomplete>
    </div>

    <div class="iM_header_datapicker" v-if="!breadcrumbData.length">
      已选择:
      <el-select :value="selectedPickerType.name"
                 placeholder="请选择"
                 @change="selectedPickerChanged">
        <el-option
          v-for="(item,index) in pickerTypes"
          :key="index"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>

      <el-date-picker :type="selectedPickerType.value"
                      id="el-date-picker"
                      align="right"
                      v-model="selectedDatePicker"
                      :format="selectedPickerType.format"
                      :editable="false"
                      :clearable="false"
                      :placeholder="'请选择'+selectedPickerType.name+'数据'"
                      prefix-icon="el-icon-arrow-down"
                      :picker-options="{firstDayOfWeek:1,disabledDate(time) {return Date.now() < time.getTime()}}"
                      @change="datePickerChanged">
      </el-date-picker>
    </div>

    <div class="iM_refresh_time" v-if="!breadcrumbData.length" @click="chooseTimeClick()">
      <span>{{currentDataRank}}</span>
    </div>


    <div class="breadcrumb" v-if="breadcrumbData.length">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item,index) in breadcrumbData" :to="{path:item.path}" :key="index">{{item.name}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="report" @click="getPdfByDom" id="getPdfByDom"><span id="report-span">{{canGetPdf?'生成报告':'报告生成中'}}</span></div>
  </div>

</template>

<script>
  export default {
    name: "i-m-header",
    props: {
      breadcrumbData: {
        type: Array,
        require: false,
        default() {
          return [
            // {path:'/',name:'首页'},
            // {path:'/mediamonitor',name:'重点媒体监测'},
            // {path:'/',name:'重点媒体监测列表-凤凰网'},
          ]
        }
      },
    },
    data() {
      return {
        searchResult: '',
        selectedDatePicker: '',
        canGetPdf: true,
        canGetPdf1:false,
        currentDataRank: '',//当前时间选择器的data格式时间
        //时间选择器参数
        selectedPickerType: {name: '周', value: 'week', type: 3, format: 'yyyy年第WW周'},
        pickerTypes: [
          {name: '天', value: 'date', type: 0, format: 'yyyy/MM/dd'},
          {name: '周', value: 'week', type: 3, format: 'yyyy年第WW周'},
          {name: '月', value: 'month', type: 2, format: 'yyyy年MM月'},
          {name: '年', value: 'year', type: 1, format: 'yyyy年'},
        ]
      }
    },
    methods: {

      // ******************************************搜索框方法****************************************//
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
        };
      },
      //搜索结果推荐点击事件
      articleSearchSelect(item) {
        if (item.articleId !== undefined) {
          window.open( '/detail?uid='+ item.unionId+"&aid="+item.articleId)
        }
      },

      // ****************************************时间选择器方法******************************************//

      //日期类型选择器更改
      selectedPickerChanged(item) {
        let thiz = this;
        this.selectedPickerType.value = item;
        this.pickerTypes.forEach(function (value) {
          if (value.value === item) {
            thiz.selectedPickerType.name = value.name;
            thiz.selectedPickerType.format = value.format;
            thiz.selectedPickerType.type = value.type;
          }
        });

        window.localStorage.setItem('selectedPickerClickRecord', item);
        let dateRecord = window.localStorage.getItem('datePickerClickRecord');
        this.handleDateData(dateRecord);
      },

      //日期选择器更改
      datePickerChanged(item) {
        this.handleDateData(item);
      },

      refreshPickerData(time) {

        let name = this.selectedPickerType.name;
        let date = new Date(time);
        this.currentDataRank = date.Format('yyyy年MM月dd日');
        let timeResult;
        if (name === '天') {
          timeResult = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
          //生成显示范围文字
          this.currentDataRank += '当天';
        } else if (name === '周') {
          timeResult = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
          //生成显示范围文字
          date.setDate(date.getDate() + 6);
          this.currentDataRank = this.currentDataRank + '-' + date.Format('yyyy年MM月dd日');

        } else if (name === '月') {
          timeResult = (date.getMonth() + 1) + '/1/' + date.getFullYear();
          //生成显示范围文字
          date.setDate(1);
          this.currentDataRank = date.Format('yyyy年MM月dd日') + '-';
          date.setMonth(date.getMonth() + 1);
          date.setDate(date.getDate() - 1);
          this.currentDataRank += date.Format('yyyy年MM月dd日');
        } else {
          timeResult = '1/1/' + date.getFullYear();
          //生成显示范围文字
          date.setMonth(0);
          date.setDate(1);
          this.currentDataRank = date.Format('yyyy年MM月dd日') + '-';
          date.setFullYear(date.getFullYear() + 1);
          date.setDate(date.getDate() - 1);
          this.currentDataRank += date.Format('yyyy年MM月dd日');
        }
        this.timeResult = timeResult
        this.$emit('click-datepicker', {
          type: this.selectedPickerType.type,
          time: timeResult
        });
      },
      articleSearch(queryString, callback) {
        queryString = this.trimAll(queryString);
        if(queryString.length==0){
          return
        }
        let params = {
          titleWord: queryString
        }
        let thiz = this
        this.$http.get(thiz.baseUrl + "/search/titleList", {params: params}).then(function (res) {
          thiz.fullscreenLoading = false
          let data = typeof res.body === "object" ? res.body : JSON.parse(res.body);
          let result = []
          if (data.code == 200 && data.data.length > 0) {
            for (let i = 0; i < data.data.length; i++) {
              result.push({
                value: data.data[i].title + (data.data[i].platformName ? ('-' + data.data[i].platformName) : ''),
                articleId: data.data[i].articleId,
                url: data.data[i].url,
                unionId:data.data[i].unionId,
              })
            }
            callback(result)
          } else {
            let result = [{
              value: "无相关结果",
              id: ""
            }];
            callback(result)
          }
        }, function (err) {
          thiz.fullscreenLoading = false
          callback([]);
          this.handleError("请求错误，请稍后尝试")
        })
      },
      handleError(message) {
        this.$message({
          duration: 1500,
          message: message
        });
      },
      handleDateData(dateM) {
        let date = dateM ? new Date(dateM) : new Date();
        this.selectedDatePicker = date;
        window.localStorage.setItem('datePickerClickRecord', date);

        //初始化时候选择上周数据
        if (this.selectedPickerType.name === '周') {
          let day = date.getDay();
          let result = date.setDate(date.getDate() - day + 1);
          this.refreshPickerData(result);
        } else {
          this.refreshPickerData(date);
        }

      },
      getPdfByDom() {
        if(!this.canGetPdf){
          return
        }
        if(this.canGetPdf1){
          return
        }
        let thiz = this
        this.canGetPdf = false
        document.getElementById("getPdfByDom").style.cursor="not-allowed"
        setTimeout(function () {
          thiz.canGetPdf = true
          document.getElementById("getPdfByDom").style.cursor="pointer"
        }, 5000)
        let obj = this.createReportParamsMap[this.$route.path]
        let id = obj.id
        let name = obj.name
        let time = this.currentDataRank
        if(!name||name==""){
          let sidebar = this.$parent.$children[2]
          if(sidebar){
            name = sidebar.selectedName
            if(name=="苏州广播电视总台"){
              name=""
            }
          }
        }
        this.getPdf(id, name, time)
      },



      /*监听回车点击事件*/
      searchEnter(){
        let searchResult = this.trimAll(this.searchResult);
        if(searchResult.length>0){
          window.open("searchList?searchTitle=" + this.searchResult)
        }
      },



      /*时间范围点击,时间选择器获取焦点*/
      chooseTimeClick(){
        let dataPicker = document.getElementById('el-date-picker');
        dataPicker.focus();
      }
    },
    mounted() {
      var thiz =this;
      setTimeout(function () {
        if(thiz.createReportParamsMap[thiz.$route.path]==null){
          document.getElementById("report-span").style.background="rgb(244, 244, 244)";
          document.getElementById("report-span").style.color="#444444";
          thiz.canGetPdf1 = true
        }
      },1000);
      let searchImg = document.getElementsByClassName("el-input__icon")[0];
      var thiz = this;
      if(searchImg){
        let thiz =this;
        searchImg.onclick = function () {
         let searchResult = thiz.trimAll(thiz.searchResult);
         if(searchResult.length>0){
           window.open("searchList?searchTitle=" + thiz.searchResult)
         }
        }
      }
      let selectedRecord = window.localStorage.getItem('selectedPickerClickRecord');
      if (selectedRecord) {
        this.selectedPickerChanged(selectedRecord);
      } else {
        window.localStorage.setItem('selectedPickerClickRecord', this.selectedPickerType.value);
        this.handleDateData();
      }
    }
  }
</script>

<style scoped>

  #iM_header {
    height: 43px;
    padding: 0 50px;
    line-height: 43px;
    background-color: #ffffff;
    border: #E2E3E4 1px solid;
    overflow: hidden;
  }

  .iM_header_search, .iM_header_datapicker {
    float: left;
    line-height: 43px;
    margin-left: 20px;
  }

  /*搜索框样式*/
  .iM_header_search {
    margin-left: 150px;
  }

  .iM_header_search >>> .el-input__inner {
    width: 400px;
    height: 30px;
    border-radius: 50px;
  }

  /*时间选择器样式*/
  .iM_header_datapicker >>> .el-input__inner {
    height: 30px;
    text-align: center;
    padding: 0;
    cursor: pointer;
  }

  .iM_header_datapicker .el-date-editor {
    width: 130px;
  }

  .iM_header_datapicker >>> .el-input__prefix {
    left: auto;
    right: 0px;
    display: none;
  }

  .iM_header_datapicker .el-select >>> .el-input__inner {
    width: 50px;
  }

  .iM_header_datapicker .el-select >>> .el-input__suffix {
    right: 0;
    display: none;
  }

  /*刷新时间样式*/
  .iM_refresh_time {
    position: absolute;
    height: 43px;
    line-height: 43px;
    color: #606266;
    /* font-size: 15px; */
    cursor: pointer;
    background-color: #fff;
    margin-left: 675px;
  }
  .iM_refresh_time span{
    border: 1px solid #e2e3e4;
    border-radius: 5px;
    padding: 4px 20px;
  }
  /*生成报告样式*/
  .report {
    cursor: pointer;
    float: right;
    line-height: 30px;
    padding: 6.5px 0;
  }

  .report span {
    background-color: #3B87F5;
    display: inline-block;
    width: 80px;
    text-align: center;
    color: #fff;
    border-radius: 5px;
  }

  /*面包屑*/
  .breadcrumb {
    /*margin-left: 50px;*/
    float: left;
    height: 43px;
    line-height: 43px;
  }

  .breadcrumb .el-breadcrumb {
    height: 45px;
    line-height: 45px;
  }

  .breadcrumb >>> .el-breadcrumb__inner:hover {
    color: #3B87F5;
  }

    >>>.el-input__icon {
    cursor: pointer;
  }
</style>
