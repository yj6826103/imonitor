<template>
  <div class="IM_time_frame bgc_rzl" id="IM_time_frame"
       :class="options.showSidebar?(options.showMenu?'IM_time_frame_showSidebar IM_time_frame_showMenu':'IM_time_frame_showSidebar IM_time_frame_hiddenMenu')
       :(options.showMenu?'IM_time_frame_hiddenSidebar IM_time_frame_showMenu':'IM_time_frame_hiddenSidebar IM_time_frame_hiddenMenu')">

    <div class="IM_time_frame_content clearfix">

      <div class="IM_time_frame_datapicker" v-if="!breadcrumbData.length">
        <span>时间选择:</span>
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
                        prefix-icon=""
                        :picker-options="{firstDayOfWeek:1,disabledDate(time) {return Date.now() < time.getTime()}}"
                        @change="datePickerChanged">
        </el-date-picker>
      </div>

      <div class="IM_time_frame_range"
           v-if="!breadcrumbData.length"
           @click="chooseTimeClick()">
        <span>{{currentDataRank}}</span>
      </div>

      <div class="breadcrumb" v-if="breadcrumbData.length">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item,index) in breadcrumbData" :to="{path:item.path}" :key="index">{{item.name}}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>


      <div class="IM_time_frame_report bgc_base"
           id="getPdfByDom"
           @click="getPdfByDom">
        <span id="report-span">{{canGetPdf?'生成报告':'报告生成中'}}</span>
      </div>
      <!--<div class="report" @click="getPdfByDom" id="getPdfByDom"><span id="report-span">{{canGetPdf?'生成报告':'报告生成中'}}</span></div>-->

    </div>


  </div>
</template>

<script>
  export default {
    name: "z-c-time-frame",
    props: {
      options: {
        type: Object,
        require: true,
        default() {
          return {
            showMenu: true,
            showSidebar: true,
          }
        }

      },
      breadcrumbData: {
        type: Array,
        require: false,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        selectedPickerType: {name: '周', value: 'week', type: 3, format: 'yyyy年第WW周'},
        pickerTypes: [
          {name: '天', value: 'date', type: 0, format: 'yyyy/MM/dd'},
          {name: '周', value: 'week', type: 3, format: 'yyyy年第WW周'},
          {name: '月', value: 'month', type: 2, format: 'yyyy年MM月'},
          {name: '年', value: 'year', type: 1, format: 'yyyy年'},
        ],
        selectedDatePicker: '',
        currentDataRank: '',//当前时间选择器的data格式时间

        /*生成报告按钮*/
        canGetPdf: true,
        canGetPdf1: false,

      }
    },
    methods: {

      initSelectedPicker(){
        let selectedRecord = window.localStorage.getItem('selectedPickerClickRecord');
        if (selectedRecord) {
          this.selectedPickerChanged(selectedRecord);
        } else {
          window.localStorage.setItem('selectedPickerClickRecord', this.selectedPickerType.value);
          this.handleDateData();
        }
      },
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

      /*时间范围点击,时间选择器获取焦点*/
      chooseTimeClick() {
        let dataPicker = document.getElementById('el-date-picker');
        dataPicker.focus();
      },


      /************生成报告方法*****************/
      initPdfByDom(){
        if (this.createReportParamsMap[this.$route.path] == null) {
          document.getElementById("report-span").style.background = "rgb(244, 244, 244)";
          document.getElementById("report-span").style.color = "#444444";
          document.getElementById("getPdfByDom").style.backgroundColor = "rgb(244, 244, 244)";
          document.getElementById("getPdfByDom").style.cursor = "not-allowed";
          this.canGetPdf1 = true
        }
      },
      getPdfByDom() {
        if (!this.canGetPdf) {
          return
        }
        if (this.canGetPdf1) {
          return
        }
        let thiz = this;
        this.canGetPdf = false;
        document.getElementById("getPdfByDom").style.cursor = "not-allowed";
        setTimeout(function () {
          thiz.canGetPdf = true;
          document.getElementById("getPdfByDom").style.cursor = "pointer"
        }, 5000);
        let obj = this.createReportParamsMap[this.$route.path];
        if(!obj){
          return;
        }
        let id = obj.id;
        let name = obj.name;
        let time = this.currentDataRank;
        // if(!name||name==""){
        //   let sidebar = this.$parent.$children[2];
        //   if(sidebar){
        //     name = sidebar.selectedName;
        //     if(name=="苏州广播电视总台"){
        //       name=""
        //     }
        //   }
        // }
        this.getPdf(id, name, time)
      },

    },

    mounted() {

      this.initPdfByDom();

      this.initSelectedPicker();
    }

  }
</script>

<style scoped>

  .IM_time_frame {
    position: absolute;
    top: calc(60px + 70px);
    bottom: 0;
    left: 200px;
    right: 0;
  }

  .IM_time_frame_showSidebar {
    left: 200px;
  }

  .IM_time_frame_hiddenSidebar {
    left: 0;
  }

  .IM_time_frame_showMenu {
    top: calc(60px + 70px);
  }

  .IM_time_frame_hiddenMenu {
    top: 60px;
  }

  .IM_time_frame_content {
    padding: 12px 0;
    background-color: #FFF;
  }

  .IM_time_frame_datapicker {
    color: #BCBCBC;
    float: left;
    line-height: 36px;
    padding-left: 47px;
  }

  .IM_time_frame_datapicker >>> input {
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    -webkit-user-select: none;
    -moz-user-focus: none;
    -moz-user-select: none;
    -webkit-appearance: none;
    outline: none;
    border: 1px solid #E2E3E4;
    background-color: #fff;
    padding: 0;
    margin: 0;
    height: 36px;
    width: 60px;
    text-align: center;
    cursor: pointer;
  }

  /*消除方向箭头*/
  .IM_time_frame_datapicker >>> .el-input__suffix, .IM_time_frame_datapicker > > > .el-input__prefix {
    display: none;
  }

  /*刷新时间样式*/
  .IM_time_frame_range {
    position: absolute;
    height: 36px;
    line-height: 36px;
    color: #606266;
    /* font-size: 14px; */
    cursor: pointer;
    background-color: #fff;
    margin-left: 175px;
  }

  .IM_time_frame_range span {
    border: 1px solid #e2e3e4;
    border-radius: 5px;
    padding: 7px 20px;
  }

  /*面包屑*/
  .breadcrumb {
    float: left;
    height: 36px;
    line-height: 36px;
    padding-left: 47px;
  }

  .breadcrumb .el-breadcrumb {
    height: 36px;
    line-height: 36px;
  }

  .breadcrumb >>> .el-breadcrumb__inner:hover {
    color: #3B87F5;
  }

  /*生成报告*/
  .IM_time_frame_report {
    float: right;
    margin-right: 20px;
    line-height: 36px;
    color: #fff;
    /* font-size: 16px; */
    padding: 0 22px;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
