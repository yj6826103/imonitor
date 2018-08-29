<template>
  <div id="reprint" class="reprint">
    <div class="outer_wrpaer" v-if="transMediaTypeData.length ||
          transChannelTypeData.length  ||
          mediaTransData.categoryArr.length  ||
          platformTransData.categoryArr.length  ||
          classificationData.length ||
          transPeriodData.categoryArr.length ">
      <!--转载媒体占比+转载媒体渠道-->
      <div class="block_rzl clearfix" >
        <!--转载媒体占比-->
        <div class="ratio" >
          <div class="title_rzl">转载媒体占比</div>
          <div class="halfBox-left" v-if="transMediaTypeData.length > 0">
            <pieChart idName="ratio"
                      :height="200"
                      @click-piechart="synopsisMediaClick"
                      :chartData="transMediaTypeData"></pieChart>
          </div>
          <div class="empty_block" v-if="transMediaTypeData.length == 0">暂无相关数据</div>

        </div>
        <!--转载媒体渠道-->
        <div class="channel" >
          <div class="title_rzl">转载渠道占比</div>
          <div class="halfBox-right" v-if="transChannelTypeData.length > 0">
            <pieChart idName="channel"
                      :height="200"
                      @click-piechart="synopsisChinnal"
                      :chartData="transChannelTypeData"></pieChart>
          </div>
          <div class="empty_block" v-if="transChannelTypeData.length == 0">暂无相关数据</div>
        </div>
      </div>

      <!--媒体转载排行-->
      <div class="block_rzl clearfix" >
        <div class="title_rzl">媒体转载排行</div>
        <topSelectMenu
          :menuData1="mediaTypeData"
                      :menuData2="channelData"
                      @select="topSelectMenuSelectListener">
        </topSelectMenu>

        <!--<div class="topSelectMenu clearfix">-->
        <!--<div class="mediaType">-->
        <!--<div v-for="item in mediaTypeData"><span>{{item.text}}</span></div>-->
        <!--</div>-->
        <!--<div class="channel">-->
        <!--<div v-for="item in channelData"><span>{{item.text}}</span></div>-->
        <!--</div>-->
        <!--</div>-->

        <div class="media-infoShow">
          <div class="media-num">覆盖媒体数：{{mediaTransNumData}}</div>
          <div class="media-more color_base" @click="moreMediaDatas">更多</div>
        </div>
        <!--<div :style="{backgroundColor:this.getRandomColor(),height:'300px'}"></div>-->
        <div class="empty"
            v-if="!mediaTransData.categoryArr.length > 0"
            style="height: 200px;background-color: #fff;color: #8c939d;padding-top: 200px;text-align: center">
          暂无相关数据
        </div>

        <div >
          <barChart
            v-if="mediaTransData.categoryArr.length >0 "
            :height="400"
                    idName="mtzzph"
                    :chartData="mediaTransData"
                    @click-barchart="mediaHandleClick"
                    :options="{direction:'horizontal'}">
          </barChart>
          <!--<div class="empty_block" v-if="mediaTransData.categoryArr.length==0">暂无相关数据</div>-->

        </div>

      </div>

      <!--平台转载排行-->
      <div class="block_rzl" v-if="sidebarType!=1002">
        <div class="title_rzl">平台转载排行</div>
        <!--<div :style="{backgroundColor:this.getRandomColor(),height:'300px'}"></div>-->
        <barChart :height="400"
                  idName="ptzzph"
                  v-if="platformTransData.categoryArr.length > 0"
                  :chartData="platformTransData"
                  @click-barchart="platformHandleClick"
                  :options="{direction:'horizontal',
                  showSlider: platformTransData.categoryArr.length>10,
                sliderAreaScale: 10/platformTransData.categoryArr.length*100 > 100?100:10/platformTransData.categoryArr.length*100}">
        </barChart>
        <div class="empty_block" v-if="platformTransData.categoryArr.length == 0">暂无相关数据</div>
      </div>

      <!--转载文章分类+经济类转载文章-->
      <div class="block_rzl clearfix" >
        <!--转载文章分类-->
        <div class="classify linkPointer">
          <div class="title_rzl">转载文章分类</div>
          <pieChart idName="classify" :height="200" :chartData="classificationData"
                    v-if="classificationData.length"
                    @click-piechart="clickPiechart"></pieChart>
          <div class="empty_block" v-if="classificationData.length == 0">暂无相关数据</div>

        </div>

        <!--经济类转载文章TOP-->
        <div class="top10" v-if="classificationTopData.length">
          <div class="title_rzl">{{classificationTopName}}类转载文章TOP 10</div>
          <tables :data="classificationTopData"
                  :columnData="classificationTopColumn"
                  :showPageControl="false"
                  v-if="classificationTopData.length"
                  @click-tablecell="tablecellClick"
                  :options="options"></tables>
        </div>
      </div>

      <!--转载时段占比-->
      <div class="block_rzl">
        <div class="title_rzl">转载时段占比</div>
        <!--<div :style="{backgroundColor:this.getRandomColor(),height:'300px'}"></div>-->
        <barChart :height="400"
                  v-if="transPeriodData.categoryArr.length > 0"
                  idName="zzsdzb"
                  :chartData="transPeriodData"
                  :options="{direction:'horizontal'}">
        </barChart>
        <div class="empty_block"  v-if="transPeriodData.categoryArr.length == 0">暂无相关数据</div>

      </div>
    </div>
    <div class="empty_block" v-if="transMediaTypeData.length === 0 &&
          transChannelTypeData.length === 0 &&
          mediaTransData.categoryArr.length ===0 &&
          platformTransData.categoryArr.length === 0 &&
          classificationData.length ===0 &&
          transPeriodData.categoryArr.length === 0">暂无相关数据
      </div>
  </div>
</template>

<script>
  import pieChart from '@/components/common/ZCChartsPie'
  import topSelectMenu from '@/components/common/TopSelectMenu'
  import barChart from '@/components/common/ZCChartsBar'
  import tables from '@/components/common/ZCTables'

  export default {
    name: "reprint-content",
    components: {pieChart, tables, topSelectMenu, barChart},
    props: {
      sidebarType: {type: String / Number, require: true},
      plantformId: {type: String / Number, require: true},
      datePickerParams: {type: Object, require: true},
      startTime: {type: String, require: true},
      accountType: {type: String, require: true},
    },
    watch: {
      plantformId(val, oldVal) {
        this.loadAllData(val)
      },
      datePickerParams(val) {
        if (this.plantformId) {
          this.loadAllData(this.plantformId)
        }
      },
    },
    data() {
      return {

        options: {
          id: '215423',
          total: 10,
          //表格列样式
          columnStyle: {
            indexs: [0, 1, 2, 3],
            styles: [
              {width: '80px'},
              {textAlign: 'left', color: '#3B87F5', cursor: 'pointer'},
              {width: '120px'},
              {width: '150px'},
            ],
            commons: {textAlign: 'center', color: '#444', height: "45px", padding: '5px 0'}
          },
          //表格表头样式
          headerStyle: {
            indexs: [1],
            styles: [{textAlign: 'left'}],
            commons: {backgroundColor: '#f4f4f4', textAlign: 'center', padding: '5px 0'}
          },
        },

        //转载媒体占比
        transMediaTypeData: [],
        //转载渠道占比
        transChannelTypeData: [],
        //平台转载排行
        platformTransData: {categoryArr: [], platformIdArr: [], valueArr: []},
        //媒体转载排行
        mediaTransData: {categoryArr: [], valueArr: []},
        mediaTransNumData: 0,
        mediaTypeData: [
          {text: "全部", select: true, value: 0},
          {text: "官方媒体", select: false, value: 1},
          {text: "政府网站", select: false, value: 2},
          {text: "商业媒体", select: false, value: 3},
          {text: "自媒体", select: false, value: 4},
          {text: "国外媒体", select: false, value: 5},
          {text: "其他", select: false, value: 6},
        ],
        channelData: [
          {text: '网站', select: false, value: 1},
          {text: '微信', select: false, value: 2},
          {text: '微博', select: false, value: 3},
          {text: 'APP', select: false, value: 4},
          {text: '其他', select: false, value: 5},
        ],


        //转载文章分类占比
        classificationData: [],
        classificationTopData: [],
        classificationTopName: '',
        classificationTopColumn: [],
        //转载时段占比
        transPeriodData: {categoryArr: [], valueArr: []}

      }
    },
    methods: {
      tablecellClick({rowIndex, columnIndex}) {
        // this.zc_log('行=' + rowIndex + ',' + '列=' + columnIndex);
        // 文章标题点击：打开新页面跳转到单篇文章分析
        if (columnIndex && columnIndex == 1) {
          var articleId = this.classificationTopData[rowIndex].articleId;
          var unionId = this.classificationTopData[rowIndex].unionId;
          if (articleId == null || articleId == '' || unionId == null || unionId == '') {
            this.$message({message: '链接已失效！'});
          } else {
            var reprintUrl = 'detail?uid=' + unionId + '&aid=' + articleId;
            window.open(reprintUrl);
          }
        }
      },
      topSelectMenuSelectListener(menu) {
        //this.zc_log(menu);
        if (menu[1] == 0) {
          let path = menu[0];
          if (path <= 6) {
            let menuData = this.mediaTypeData;
            this.loadMediaTransData(this.plantformId, menuData[path].value, null)
          }
        } else {
          let path = menu[0];
          let menuData = this.channelData;
          this.loadMediaTransData(this.plantformId, null, menuData[path - 8].value)
        }
      },
      // 转载媒体占比(某一媒体点击)
      synopsisMediaClick(pieObj) {
        var name = pieObj.name;
        var mediaType = this.transMediaTypeData[pieObj.index].code;
        var params = {
          listName: '转载媒体占比',
          listType: 'synopsisMedia',
          resourceUrl: '/reprint',
          resourceName: '媒体转载分析',
          plantformId: '',
          platformTypeId: '',
          groupId: '',
          startTime: this.datePickerParams.startTime,
          accountType: this.datePickerParams.accountType,
          pageNo: 1,
          pageSize: 10,
          mediaType: mediaType,
          name: name,
        };
        // groupId: 指组ID, queryId：指具体ID， 2者不能同时存在
        if (this.sidebarType == 1002) {
          // 1002表示查具体ID
          params.plantformId = this.plantformId;
        } else if (this.sidebarType == 1001) {
          params.platformTypeId = this.plantformId;
        } else if (this.sidebarType == 1003) {
          params.groupId = this.plantformId;
        } else if (this.sidebarType == 1000) {
          params.groupId = 0;
        }
        var newUrl = 'mediaMonitorSingle?';
        for (var key in params) {
          newUrl += key + '=' + params[key] + '&';
        }
        newUrl = newUrl.substring(0, newUrl.length - 1);
        this.zc_log(params);
        window.open(newUrl);
      },
      // 转载渠道占比(某一渠道点击)
      synopsisChinnal(pieObj) {
        var name = pieObj.name;
        var channel = this.transChannelTypeData[pieObj.index].code;
        var params = {
          listName: '转载渠道占比',
          listType: 'synopsisChinnal',
          resourceUrl: '/reprint',
          resourceName: '媒体转载分析',
          plantformId: '',
          platformTypeId: '',
          groupId: '',
          startTime: this.datePickerParams.startTime,
          accountType: this.datePickerParams.accountType,
          pageNo: 1,
          pageSize: 10,
          channel: channel,
          name: name,
        };
        // groupId: 指组ID, queryId：指具体ID， 2者不能同时存在
        if (this.sidebarType == 1002) {
          // 1002表示查具体ID
          params.plantformId = this.plantformId;
        } else if (this.sidebarType == 1001) {
          params.platformTypeId = this.plantformId;
        } else if (this.sidebarType == 1003) {
          params.groupId = this.plantformId;
        } else if (this.sidebarType == 1000) {
          params.groupId = 0;
        }
        var newUrl = 'mediaMonitorSingle?';
        for (var key in params) {
          newUrl += key + '=' + params[key] + '&';
        }
        newUrl = newUrl.substring(0, newUrl.length - 1);
        this.zc_log(params);
        window.open(newUrl);
      },
      // 媒体转载排行(某一媒体点击)
      mediaHandleClick(barObj) {
        var name = barObj.name;
        var mediaName = this.mediaTransData.categoryArr[barObj.index];
        var params = {
          listName: '媒体转载排行',
          listType: 'reprintMedia',
          resourceUrl: '/reprint',
          resourceName: '媒体转载分析',
          plantformId: '',
          platformTypeId: '',
          groupId: '',
          startTime: this.datePickerParams.startTime,
          accountType: this.datePickerParams.accountType,
          pageNo: 1,
          pageSize: 10,
          name: name,
        };
        // groupId: 指组ID, queryId：指具体ID， 2者不能同时存在
        if (this.sidebarType == 1002) {
          // 1002表示查具体ID
          params.plantformId = this.plantformId;
        } else if (this.sidebarType == 1001) {
          params.platformTypeId = this.plantformId;
        } else if (this.sidebarType == 1003) {
          params.groupId = this.plantformId;
        } else if (this.sidebarType == 1000) {

        }

        var newUrl = 'mediaMonitorSingle?';
        for (var key in params) {
          newUrl += key + '=' + params[key] + '&';
        }
        newUrl = newUrl.substring(0, newUrl.length - 1);
        this.zc_log(params);
        window.open(newUrl);
      },
      // 平台转载排行(某一平台点击)
      platformHandleClick(barObj) {
        var name = barObj.name;
        var plantformId = this.platformTransData.platformIdArr[barObj.index];
        var params = {
          listName: '平台转载排行',
          listType: 'reprintPlantform',
          resourceUrl: '/reprint',
          resourceName: '媒体转载分析',
          plantformId: plantformId,
          startTime: this.datePickerParams.startTime,
          accountType: this.datePickerParams.accountType,
          pageNo: 1,
          pageSize: 10,
          name: name,
        };
        var newUrl = 'mediaMonitorSingle?';
        for (var key in params) {
          newUrl += key + '=' + params[key] + '&';
        }
        newUrl = newUrl.substring(0, newUrl.length - 1);
        this.zc_log(params);
        window.open(newUrl);
      },
      // 媒体转载排行(更多按钮)
      moreMediaDatas() {
        var params = {
          mediaType: 0, //更多查全部媒体类型
          channel: 0,
          listName: '媒体转载排行',
          listType: 'reprintMediaMore',
          resourceUrl: '/reprint',
          resourceName: '媒体转载分析',
          plantformId: '',
          platformTypeId: '',
          groupId: '',
          startTime: this.datePickerParams.startTime,
          accountType: this.datePickerParams.accountType,
          pageNo: 1,
          pageSize: 10,
        };
        // groupId: 指组ID, queryId：指具体ID， 2者不能同时存在
        if (this.sidebarType == 1002) {
          // 1002表示查具体ID
          params.plantformId = this.plantformId;
        } else if (this.sidebarType == 1001) {
          params.platformTypeId = this.plantformId;
        } else if (this.sidebarType == 1003) {
          params.groupId = this.plantformId;
        } else if (this.sidebarType == 1000) {

        }

        var newUrl = 'mediaMonitorSingle?';
        for (var key in params) {
          newUrl += key + '=' + params[key] + '&';
        }
        newUrl = newUrl.substring(0, newUrl.length - 1);
        this.zc_log(params);
        window.open(newUrl);
      },
      loadAllData(val) {
        //转载媒体占比
        this.loadTransMediaTypeData(val);
        // 转载渠道占比
        this.loadTransChannelTypeData(val);
        this.loadMediaTransData(val, 0, null);

        if (this.sidebarType === 1002) {
          this.platformTransData = {categoryArr: [], platformIdArr: [], valueArr: []}
        } else {
          //平台转载排行
          this.loadPlatformTransData(val);
        }
        // 转载时段占比数据
        this.loadTransPeriodData(val);
        //转载文章占比
        this.loadClassificationData(val);
      },

      // 转载媒体占比
      loadTransMediaTypeData(ID) {

        let params = {startTime: this.datePickerParams.startTime, accountType: this.datePickerParams.accountType};
        if (this.plantformId && this.plantformId.length > 1) {
          if (this.sidebarType === 1001) {
            params.platformTypeId = ID;
          } else if (this.sidebarType === 1002) {
            params.platformId = ID;
          } else if (this.sidebarType === 1003) {
            params.groupId = ID;
          }
        }
        this.zc_log('========转载媒体占比');
        this.zc_log(params);
        this.zc_log('========转载媒体占比');


        this.$http.get(this.baseUrl + '/platform/trans/mediatype/find', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('转载媒体占比数据');
          this.zc_log(response);

          this.transMediaTypeData = [];
          if (response.code == 200 && response.data) {
            this.handleData_transMediaType(response.data)
          }
        }, function (err) {
          // loading.close();
          //this.zc_log('转载媒体占比数据失败');
          //this.zc_log(err);

        })
      },
      handleData_transMediaType(data) {

        // //this.zc_log('转载媒体占比数据');
        // //this.zc_log(data)
        let transMediaTypeData = [];
        data.forEach(function (value, index) {
          if (parseInt(value.value)) {
            transMediaTypeData.push({name: value.name, value: parseInt(value.value), code: value.code})
          }
        });
        this.transMediaTypeData = transMediaTypeData;
        // //this.zc_log(this.transMediaTypeData)
      },

      //转载渠道占比
      loadTransChannelTypeData(ID) {
        let params = {startTime: this.datePickerParams.startTime, accountType: this.datePickerParams.accountType};
        if (this.plantformId && this.plantformId.length > 1) {
          if (this.sidebarType === 1001) {
            params.platformTypeId = ID;
          } else if (this.sidebarType === 1002) {
            params.platformId = ID;
          } else if (this.sidebarType === 1003) {
            params.groupId = ID;
          }
        }
        this.zc_log('========转载渠道占比');
        this.zc_log(params);
        this.zc_log('========转载渠道占比');

        this.$http.get(this.baseUrl + '/platform/trans/channel/find', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('转载渠道占比数据');
          this.zc_log(response);
          this.transChannelTypeData = [];
          if (response.code == 200 && response.data) {
            this.handleData_transChannelType(response.data)
          }
        }, function (err) {

          //this.zc_log('转载渠道占比数据失败');
          //this.zc_log(err);
        })
      },
      handleData_transChannelType(data) {

        // //this.zc_log('转载渠道占比数据');
        // //this.zc_log(data)
        let transChannelTypeData = [];
        data.forEach(function (value, index) {
          if (parseInt(value.value)) {
            transChannelTypeData.push({name: value.name, value: parseInt(value.value), code: value.code})
          }
        });
        this.transChannelTypeData = transChannelTypeData;
        // //this.zc_log(this.transChannelTypeData)
      },

      //平台转载排行
      loadPlatformTransData(ID) {
        let params = {startTime: this.datePickerParams.startTime, accountType: this.datePickerParams.accountType};
        if (this.plantformId && this.plantformId.length > 1) {
          if (this.sidebarType === 1001) {
            params.platformTypeId = ID;
          } else if (this.sidebarType === 1002) {
            params.platformId = ID;
          } else if (this.sidebarType === 1003) {
            params.groupId = ID;
          }
        }
        this.zc_log('========平台转载排行');
        this.zc_log(params);
        this.zc_log('========平台转载排行');

        this.$http.get(this.baseUrl + '/spread/platform/translist', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('平台转载排行数据');
          this.zc_log(response);
          this.platformTransData = {categoryArr: [], platformIdArr: [], valueArr: []};
          if (response.code == 200 && response.data) {
            this.handleData_platformTrans(response.data)
          }
        }, function (err) {

          // this.zc_log('平台转载排行失败');
          // this.zc_log(err);
        })
      },
      handleData_platformTrans(data) {
        // //this.zc_log('平台转载排行数据')
        // //this.zc_log(data)

        let categoryArr = [];
        let valueArr = [
          {name: '文章转载篇数', value: []},
        ];
        let platformIdArr = [];
        data.forEach(function (value) {
          if (value.transNum) {
            categoryArr.push(value.platformName);
            platformIdArr.push(value.platformId);
          }
        });
        valueArr.forEach(function (value, index) {
          data.forEach(function (dataValue) {
            if (dataValue.transNum) {
              value.value.push(dataValue.transNum)
            }
          })
        });
        this.platformTransData = {categoryArr: categoryArr, platformIdArr: platformIdArr, valueArr: valueArr};
        this.zc_log(this.platformTransData)
      },

      //媒体转载排行
      loadMediaTransData(ID, mediaType, channel) {
        let params = {startTime: this.datePickerParams.startTime, accountType: this.datePickerParams.accountType};
        if (this.plantformId && this.plantformId.length > 1) {
          if (this.sidebarType === 1001) {
            params.platformTypeId = ID;
          } else if (this.sidebarType === 1002) {
            params.platformId = ID;
          } else if (this.sidebarType === 1003) {
            params.groupId = ID;
          }
        }
        if (mediaType) {
          params.mediaType = mediaType;
        }
        if (channel) {
          params.channel = channel;
        }
        this.zc_log('========媒体转载排行数据');
        this.zc_log(params);
        this.zc_log('========媒体转载排行数据');
        this.$http.get(this.baseUrl + '/spreadTrend/mediaOrderSuper', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('媒体转载排行数据');
          this.zc_log(response);
          this.mediaTransData = {categoryArr: [], valueArr: []};
          this.mediaTransNumData = 0;
          if (response.code == 200 && response.data.mediaList) {
            this.handleData_mediaTrans(response.data.mediaList);
            this.mediaTransNumData = response.data.mediaCover
          }
        }, function (err) {

          this.zc_log('媒体转载排行失败');
          this.zc_log(err);
        })
      },
      handleData_mediaTrans(data) {
        //this.zc_log('媒体转载排行数据')
        //this.zc_log(data)
        let categoryArr = [];
        let valueArr = [
          {name: '文章转载篇数', value: []},
        ];

        data.forEach(function (value) {
          categoryArr.push(value.media_name);
        });
        valueArr.forEach(function (value, index) {
          data.forEach(function (dataValue) {
            value.value.push(dataValue.trans_num)
          })
        });
        this.mediaTransData = {categoryArr: categoryArr, valueArr: valueArr}
      },


      //转载文章分类占比
      loadClassificationData(ID) {
        let params = {startTime: this.datePickerParams.startTime, accountType: this.datePickerParams.accountType};
        if (this.plantformId && this.plantformId.length > 1) {
          if (this.sidebarType === 1001) {
            params.platformTypeId = ID;
          } else if (this.sidebarType === 1002) {
            params.platformId = ID;
          } else if (this.sidebarType === 1003) {
            params.groupId = ID;
          }
        }
        this.zc_log('========转载文章分类占比');
        this.zc_log(params);
        this.zc_log('========转载文章分类占比');

        this.$http.get(this.baseUrl + '/platform/trans/classification/find', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('转载文章分类占比数据');
          this.zc_log(response);
          this.classificationData = [];
          if (response.code == 200 && response.data) {
            this.handleData_classification(response.data)
          }
        }, function (err) {

          //this.zc_log('转载文章分类占比数据失败');
          //this.zc_log(err);
        })
      },
      handleData_classification(dataM) {

        let data = [];
        dataM.forEach(function (value, index) {
          if (value.value) {
            data.push(value);
          }
        });

        if (!data.length) {
          return;
        }
        this.classificationData = data;

        if (data[0].name != '综合') {
          this.loadClassificationTopData(this.plantformId, data[0].classification, data[0].name);
        }

      },

      clickPiechart({name, index}) {
        //this.zc_log(`name=${name},index=${index}`);

        if (name !== '综合') {
          this.loadClassificationTopData(this.plantformId, this.classificationData[index].classification, name);
        }else{
          let others = [];
          this.classificationData.forEach(function (value) {
            // console.log(value);
            others.push(value.classification);
          });

          this.loadClassificationTopData(this.plantformId, others.join(','), name);
        }


      },

      //转载文章分类Top10
      loadClassificationTopData(ID, classification, className) {
        let params = {startTime: this.datePickerParams.startTime, accountType: this.datePickerParams.accountType};
        if (this.plantformId && this.plantformId.length > 1) {
          if (this.sidebarType === 1001) {
            params.platformTypeId = ID;
          } else if (this.sidebarType === 1002) {
            params.platformId = ID;
          } else if (this.sidebarType === 1003) {
            params.groupId = ID;
          }
        }
        if(className === '综合'){
          params.other = classification;
        }else{
          params.classification = classification;
        }
        this.zc_log('========转载文章分类Top10');
        this.zc_log(params);
        this.zc_log('========转载文章分类Top10');

        this.$http.get(this.baseUrl + '/platform/trans/classification/top/ten', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('转载文章分类Top10数据');
          this.zc_log(response);
          this.classificationTopData = [];
          this.classificationTopName = '';
          if (response.code == 200 && response.data) {
            this.handleData_classificationTop(response.data);
            this.classificationTopName = className;
          }
        }, function (err) {
          //this.zc_log('转载文章分类Top10数据失败');
          //this.zc_log(err);
        })
      },
      handleData_classificationTop(data) {

        this.classificationTopData = data;
        this.classificationTopData.forEach(function (value, index) {
          value.index = index + 1;
        });
        this.classificationTopColumn = [
          {prop: 'index', label: '排名'},
          {prop: 'title', label: '文章标题'},
          {prop: 'platform', label: '平台'},
          {prop: 'publishTime', label: '发布时间'},
        ];
      },


      //转载时段占比数据
      loadTransPeriodData(ID) {
        let params = {startTime: this.datePickerParams.startTime, accountType: this.datePickerParams.accountType};
        if (this.plantformId && this.plantformId.length > 1) {
          if (this.sidebarType === 1001) {
            params.platformTypeId = ID;
          } else if (this.sidebarType === 1002) {
            params.platformId = ID;
          } else if (this.sidebarType === 1003) {
            params.groupId = ID;
          }
        }
        this.zc_log('========转载时段占比数据');
        this.zc_log(params);
        this.zc_log('========转载时段占比数据');

        this.$http.get(this.baseUrl + '/trans/transPeriod', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('转载时段占比数据');
          this.zc_log(response);
          this.transPeriodData = {categoryArr: [], valueArr: []};
          if (response.code == 200 && response.data) {
            this.handleData_transPeriod(response.data)
          }

        }, function (err) {

          //this.zc_log('失败');
          //this.zc_log(err);
        })
      },
      handleData_transPeriod(data) {
        // //this.zc_log('转载时段占比数据');
        // //this.zc_log(data);
        let categoryArr = [];
        let valueArr = [
          {name: '文章转载篇数', value: []},
        ];

        data.forEach(function (value) {
          categoryArr.push(value.period_name);
        });
        valueArr.forEach(function (value, index) {
          data.forEach(function (dataValue) {
            value.value.push(dataValue.trans_num)
          })
        });
        this.transPeriodData = {categoryArr: categoryArr, valueArr: valueArr}
        // //this.zc_log(this.transPeriodData)
      },

    },
    created(){
      var data = {
        name: document.title,
        id:"reprint",
      };
      this.registerCreateReportParams(this.$route.path, data);
    },
  }
</script>

<style scoped>
  .outer_wrpaer{
    width: 100%;
    height: 100%;
  }
  .reprint .ratio, .reprint .channel {
    float: left;
    width: 50%;
  }

  .reprint .classify, .reprint .top10 {
    float: left;
    width: 50%;
  }

  /*.topSelectMenu .mediaType div, .topSelectMenu .channel div {*/
    /*float: left;*/
    /*border-bottom: 2px #3B87F5 solid;*/
    /*color: #3B87F5;*/
  /*}*/

  .reprint .media-infoShow {
    width: 100%;
    padding-right: 20px;
    display: flex;
    justify-content: flex-end;
    box-sizing: border-box;
  }

  .reprint .media-num {
    width: 150px;
    text-align: right;
    /* font-size: 12px; */
    font-weight: bold;
  }

  .reprint .media-more {
    width: 50px;
    text-align: right;
    /* font-size: 12px; */
    font-weight: bold;
    cursor: pointer;
  }

  .reprint .media-more:hover {
    color: #3B87F5;
  }

  .reprint .halfBox-right {
    /*width: 82%;*/
    /*padding-right: 5%;*/
    /*padding-left: 13%;*/
    width: 100%;
  }

  .reprint .halfBox-left {
    /*width: 82%;*/
    /*padding-right: 13%;*/
    /*padding-left: 5%;*/
    width: 100%;
  }
  .empty_block{
    height: 450px;
    line-height: 450px;
    padding-top: 0px;
    margin-top: 0px;
  }
</style>
