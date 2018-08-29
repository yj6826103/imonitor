<template>
  <div class="overView bgc_rzl"
       id="overView">


    <!--传播情况统计  + 作品发布占比-->
    <div class="block_rzl clearfix" style="margin: 0">

      <!--传播情况统计-->
      <div :class="sidebarType===1002?'spread_single':'spread'"
           v-if="spreadData.length">
        <div class="title_rzl">传播情况统计</div>
        <div class="spread_item" :class="sidebarType===1002?'spread_item_single':'spread_item_group'"
             v-for="(item,index) in spreadData">
          <span class="spread_item_icon" :style="{backgroundPositionY:-index*60+'px'}"></span>
          <span class="fontSize14" style="color: #666;">{{item.title}}</span><br/>
          <span class="fontSize16" style="color: #444;">{{item.count>=10000?(item.count/10000).toFixed(2)+'万':item.count}}</span>
        </div>
      </div>

      <!--作品发布占比-->
      <div class="works linkPointer" v-if="platformData.length&&sidebarType!==1002">
        <div class="title_rzl">作品发布占比</div>
        <pieChart idName="ptdbs" :height="200" :chartData="platformData">
        </pieChart>
      </div>
    </div>


    <!--原创文章占比-->
    <div class="block_rzl clearfix linkPointer" v-if="originalData.length">
      <div class="title_rzl">原创作品占比</div>
      <div class="original_article_l">
        <pieChart idName="ycwzzb" :height="200" :chartData="originalData"></pieChart>
      </div>
      <div class="original_article_r">
        <tables :data="weekedCircle"
                :showPageControl="false"
                :columnData="weekedCircleColumn"
                :options="weekedCircleOptions">
        </tables>
      </div>

    </div>

    <!--传播时间趋势-->
    <div class="block_rzl linkPointer" v-if="timeTrendDatas.categoryArr.length">
      <div class="title_rzl">传播时间趋势</div>
      <lineChart idName="timeTrendCharts" :height="400" :chartData="timeTrendDatas" ref="echartsBox"></lineChart>
    </div>

    <!--传播地域分析-->
    <div class="block_rzl linkPointer" v-if="areaData.length">
      <div class="title_rzl">传播地域分布</div>
      <div class="region clearfix">
        <div class="region_map">
          <mapCharts idName="map" :height="600" :chartData="areaData"></mapCharts>
        </div>

        <div class="region_chart">
          <div class="region_chart_title clearfix">
            <div class="region_chart_title_l">
              <div>覆盖地域数量</div>
              <span>{{areaData.length}}</span>
            </div>
            <div class="region_chart_title_r">
              <div>{{provienceTransName}}地区转载数量</div>
              <span class="color_base">{{provienceTransnumData?provienceTransnumData:'无'}}</span>
            </div>
          </div>

          <barChart :height="550"
                    idName="time"
                    :chartData="areaRankData"
                    :options="{direction:'vertical',showRankingList:true,emphasizeColor:true}">
          </barChart>
          <div class="fontSize14" style="text-align: center;color: #444padding-top: 20px">注：此地域是指媒体地域属性</div>

        </div>
      </div>
    </div>

    <!--媒体转载分析-->
    <div class="block_rzl"
         v-if="transMediaTypeData.length||transChannelTypeData.length||platformTransData.length||mediaTransData.length">
      <div class="title_rzl">媒体转载分析</div>
      <div class="reprints clearfix" id="reprints">
        <div class="reprint_per"
             style="border-top: #E2E3E4 1px solid;border-bottom: #E2E3E4 1px solid"
             v-if="transMediaTypeData.length">
          <div class="fontSize20" style="color: #444;margin: 20px 0;line-height: 18px">转载媒体占比</div>
          <!--<div class="halfBox-left">-->
          <pieChart idName="reprint_per1"
                    :height="200"
                    @click-piechart="synopsisMediaClick"
                    :chartData="transMediaTypeData"/>
          <!--</div>-->
        </div>
        <div class="reprint_per"
             style="border-top: #E2E3E4 1px solid;border-bottom: #E2E3E4 1px solid"
             v-if="transChannelTypeData.length">
          <div class="fontSize20" style="color: #444;margin: 20px 0;line-height: 18px">转载渠道占比</div>
          <!--<div class="halfBox-right">-->
          <pieChart idName="reprint_per2"
                    :height="200"
                    @click-piechart="synopsisChinnal"
                    :chartData="transChannelTypeData"></pieChart>
          <!--</div>-->
        </div>
        <div class="reprint_per" v-if="platformTransData.categoryArr.length">
          <div class="fontSize20" style="color: #444;margin:20px 0;line-height: 18px">平台转载排行</div>
          <div class="halfBox-left">
            <barChart :height="600"
                      idName="ptzzph"
                      :chartData="platformTransData"
                      @click-barchart="platformHandleClick"
                      :options="{direction:'vertical',showLegend:false}"></barChart>
          </div>
        </div>
        <div class="reprint_per" v-if="mediaTransData.categoryArr.length">
          <div class="fontSize20" style="color: #444;margin: 20px 0;line-height: 18px">媒体转载排行</div>
          <div class="halfBox-right">
            <barChart :height="600"
                      idName="mtzzph"
                      :chartData="mediaTransData"
                      @click-barchart="mediaHandleClick"
                      :options="{direction:'vertical',showLegend:false}">
            </barChart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import pieChart from '@/components/common/ZCChartsPie'
  import lineChart from '@/components/common/ZCChartsLine'
  import mapCharts from '@/components/common/mapCharts'
  import barChart from '@/components/common/ZCChartsBar'
  import Tables from '@/components/common/ZCTables'

  export default {
    name: 'Home-content',
    components: {pieChart, lineChart, mapCharts, barChart,Tables},
    props: {
      sidebarType: {type: String / Number, require: true},
      plantformId: {type: String / Number, require: true},
      datePickerParams: {type: Object, require: true},
    },
    watch: {
      plantformId(val, oldVal) {
        this.loadAllData(val);
      },
      datePickerParams(val) {
        if (this.plantformId) {
          this.loadAllData(this.plantformId);
        }
      },
    },
    data() {
      return {
        statisticBoxWidth: "0px",
        statisticBoxPadding: "0px",
        homeWorkNumFontSize: "0px",
        homeWorkNumBackgroundSize: "0px",
        //传播情况统计数据
        spreadData: [],
        //各平台作品数对比数据
        platformData: [],
        //作品数
        workCountsData: '0',
        //原创文章占比
        originalData: [],
        weekedCircle: [],
        weekedCircleColumn:[],
        weekedCircleOptions:{},
        //传播时间趋势数据
        timeTrendDatas: {categoryArr: [], valueArr: []},
        //传播地域分析数据
        areaOriginalData: [],
        areaData: [],
        provienceTransnumData: 0,
        provienceTransName: '',
        areaRankData: {categoryArr: [], valueArr: []},
        //**********媒体转载分析*********
        //转载媒体占比
        transMediaTypeData: [],
        //转载渠道占比
        transChannelTypeData: [],
        //平台转载排行
        platformTransData: {categoryArr: [], platformIdArr: [], valueArr: []},
        //媒体转载排行
        mediaTransData: {categoryArr: [], valueArr: []},
      }
    },

    methods: {
      // 转载媒体占比(某一媒体点击)
      synopsisMediaClick(pieObj) {
        let name = pieObj.name;
        let mediaType = this.transMediaTypeData[pieObj.index].code;
        let params = {
          listName: '转载媒体占比',
          listType: 'synopsisMedia',
          resourceUrl: '/',
          resourceName: '传播情况总览',
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
        let newUrl = 'mediaMonitorSingle?';
        for (let key in params) {
          newUrl += key + '=' + params[key] + '&';
        }
        newUrl = newUrl.substring(0, newUrl.length - 1);
        this.zc_log(this.sidebarType);
        this.zc_log(params);
        window.open(newUrl);
      },
      // 转载渠道占比(某一渠道点击)
      synopsisChinnal(pieObj) {
        let name = pieObj.name;
        let channel = this.transChannelTypeData[pieObj.index].code;
        let params = {
          listName: '转载渠道占比',
          listType: 'synopsisChinnal',
          resourceUrl: '/',
          resourceName: '传播情况总览',
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
        let newUrl = 'mediaMonitorSingle?';
        for (let key in params) {
          newUrl += key + '=' + params[key] + '&';
        }
        newUrl = newUrl.substring(0, newUrl.length - 1);
        this.zc_log(params);
        window.open(newUrl);
      },
      // 平台转载排行(某一平台点击)
      platformHandleClick(barObj) {
        let name = barObj.name;
        let plantformId = this.platformTransData.platformIdArr[barObj.index];
        let params = {
          listName: '平台转载排行',
          listType: 'reprintPlantform',
          resourceUrl: '/',
          resourceName: '传播情况总览',
          plantformId: plantformId,
          startTime: this.datePickerParams.startTime,
          accountType: this.datePickerParams.accountType,
          pageNo: 1,
          pageSize: 10,
          name: name,
        };
        let newUrl = 'mediaMonitorSingle?';
        for (let key in params) {
          newUrl += key + '=' + params[key] + '&';
        }
        newUrl = newUrl.substring(0, newUrl.length - 1);
        this.zc_log(params);
        window.open(newUrl);
      },
      // 媒体转载排行(某一媒体点击)
      mediaHandleClick(barObj) {
        let name = barObj.name;
        let mediaName = this.mediaTransData.categoryArr[barObj.index];
        let params = {
          listName: '媒体转载排行',
          listType: 'reprintMedia',
          resourceUrl: '/',
          resourceName: '传播情况总览',
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
          params.groupId = '';
        }

        let newUrl = 'mediaMonitorSingle?';
        for (let key in params) {
          newUrl += key + '=' + params[key] + '&';
        }
        newUrl = newUrl.substring(0, newUrl.length - 1);
        this.zc_log(params);
        window.open(newUrl);
      },




      /*加载数据*/
      loadAllData(val) {

        //传播情况
        this.loadSpreadData(val);
        if (this.sidebarType === 1002) {
          this.platformTransData = {categoryArr: [], platformIdArr: [], valueArr: []};
          this.platformData = [];
        } else {
          //各平台作品数
          this.loadPlatformData(val);
          //平台转载排行
          this.loadPlatformTransData(val)
        }

        //原创作品数
        this.loadOriginalData(val);
        //周环比
        this.loadCircleData(val);
        //传播地域分析
        this.loadAreaData(val);
        //传播时间趋势
        this.loadTimeTrendData(val);
        // 媒体转载排行
        this.loadMediaTransData(val);
        //媒体转载占比
        this.loadTransMediaTypeData(val);
        //渠道转载占比
        this.loadTransChannelTypeData(val);
      },

      //情况统计
      loadSpreadData(ID) {

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
        this.zc_log('=======情况统计');
        this.zc_log(params);
        this.zc_log('=======情况统计');

        this.$http.get(this.baseUrl + '/spread/accounted', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('情况统计数据');
          this.zc_log(response);
          this.spreadData = [];
          this.workCountsData = '0';
          if (response.code == 200 && response.data) {
            this.handleData_spread(response.data)
          }

        }, function (err) {
          this.zc_log('情况统计数据失败');
          this.zc_log(err);

        })
      },
      handleData_spread(data) {
        let spreadData = [
          {title: '作品数', count: data.articleTotalNum, pic: this.baseUrl+'/static/images/spread_readNum.png'},
          {title: '转载数', count: data.transNum, pic: this.baseUrl+'/static/images/spread_readNum.png'},
          {title: '阅读数', count: data.readNum, pic: this.baseUrl+'/static/images/spread_readNum.png'},
          {title: '收藏数', count: data.collectionNum, pic: this.baseUrl+'/static/images/spread_readNum.png'},
          {title: '分享数', count: data.shareNum, pic: this.baseUrl+'/static/images/spread_readNum.png'},
          {title: '评论数', count: data.commentNum, pic: this.baseUrl+'/static/images/spread_readNum.png'},
          {title: '点赞数', count: data.rewardNum, pic: this.baseUrl+'/static/images/spread_readNum.png'},
          {title: '打赏数', count: data.thumbsNum, pic: this.baseUrl+'/static/images/spread_readNum.png'},
        ];

        let result = [];

        spreadData.forEach(function (item) {
          if(item.count != null){
            result.push(item);
          }
        });
        this.spreadData = result;
        // this.layoutSubviews();
      },


      //各平台作品数占比
      loadPlatformData(ID) {
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
        this.zc_log('======各平台作品数占比');
        this.zc_log(params);
        this.zc_log('======各平台作品数占比');
        this.$http.get(this.baseUrl + '/spread/platform/articlenum/accounted', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('各平台占比数据');
          this.zc_log(response);
          this.platformData = [];
          if (response.code == 200 && response.data) {
            this.handleData_platform(response.data)
          }
        }, function (err) {
          this.zc_log('各平台占比数据失败');
          this.zc_log(err);
        })
      },
      handleData_platform(data) {

        // //this.zc_log('各平台占比');
        // //this.zc_log(data)
        let platformData = [];
        data.forEach(function (value, index) {
          if (value.platformName) {
            if (value.count) {
              platformData.push({name: value.platformName, value: value.count})
            }
          } else {
            if (value.count) {
              platformData.push({name: value.platformTypeName, value: value.count})
            }
          }
        });

        this.platformData = platformData;

        // //this.zc_log(this.platformData)
      },


      //原创文章占比
      loadOriginalData(ID) {
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
        this.zc_log('======原创文章占比');
        this.zc_log(params);
        this.zc_log('======原创文章占比');

        this.$http.get(this.baseUrl + '/spread/platform/originalnum/accounted', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('原创文章数据');
          this.zc_log(response);
          this.originalData = [];
          if (response.code == 200 && response.data) {
            this.handleData_original(response.data)
          }
        }, function (err) {
          this.zc_log('原创文章数据失败');
          this.zc_log(err);
        })
      },
      handleData_original(data) {
        // //this.zc_log('原创文章数据');
        // //this.zc_log(data);
        let originalData = [];
        if (data.originalCount != 0 || data.unoriginalCount != 0) {
          originalData.push({name: '原创', value: data.originalCount ? data.originalCount : 0});
          originalData.push({name: '非原创', value: data.unoriginalCount ? data.unoriginalCount : 0});
        }
        this.originalData = originalData;
      },


      //周环比数据
      loadCircleData(ID) {
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
        this.zc_log('=======周环比数据');
        this.zc_log(params);
        this.zc_log('=======周环比数据');

        this.$http.get(this.baseUrl + '/spread/platform/weeked/circle', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('周环比数据');
          this.zc_log(response);
          this.weekedCircle = [];
          if (response.code == 200 && response.data) {
            // this.weekedCircle = response.data
            this.handleCircleData(response.data)
          }
        }, function (err) {
          this.zc_log('周环比数据失败');
          this.zc_log(err);
        })
      },

      handleCircleData(data){
        let chainTitle = null;
        let lastWeek = null;
        let nowWeek = null;
        switch (this.datePickerParams.accountType) {
          case "0":
            chainTitle = "日环比";
            lastWeek = "昨天";
            nowWeek = "今天";
            break;
          case "1":
            chainTitle = "年环比";
            lastWeek = "去年";
            nowWeek = "今年";
            break;
          case "2":
            chainTitle = "月环比";
            lastWeek = "上月";
            nowWeek = "本月";
            break;
          case "3":
            chainTitle = "周环比";
            lastWeek = "上周";
            nowWeek = "本周";
            break;
        }


        this.weekedCircle = data;
        this.weekedCircleColumn = [
          {prop: 'title', label: ''},
          {prop: 'sequential', label: chainTitle},
          {prop: 'sequentialtext', label: '差值'},
          {prop: 'prevWeek', label: lastWeek},
          {prop: 'week', label: nowWeek},
        ];

        this.weekedCircleOptions = {
          id: 'weekedCircle',
          total: 0,
          showBorder: false,
          //表格列样式
          columnStyle: {
            indexs: [0,1,2,3,4],
            styles: [{textAlign: 'center'},{textAlign: 'center'},{textAlign: 'center'},{textAlign: 'center'},{textAlign: 'center'}],
            commons: {textAlign: 'center', color: '#444',align:'center'}
          },
          //表格表头样式
          headerStyle: {
            indexs: [],
            styles: [],
            commons: {backgroundColor: '#f4f4f4', textAlign: 'center', padding: '5px 0'}
          },
        };
      },


      //传播时间趋势
      loadTimeTrendData(ID) {
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
        this.zc_log('======传播时间趋势');
        this.zc_log(params);
        this.zc_log('======传播时间趋势');

        this.$http.get(this.baseUrl + '/spreadTrend/timeTrend', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('传播时间趋势数据');
          this.zc_log(response);
          this.timeTrendDatas = {categoryArr: [], valueArr: []};
          if (response.code == 200 && response.data) {
            this.handleData_TimeTrend(response.data)
          }

        }, function (err) {

          this.zc_log('传播时间趋势失败');
          this.zc_log(err);
        })
      },
      handleData_TimeTrend(data) {
        // //this.zc_log('传播时间趋势数据');
        // //this.zc_log(data);

        let categoryArr = [];
        let valueArr = [
          // {name: '综合数值', value: []},
          {name: '转载数', value: []},
          {name: '评论数', value: []},
          {name: '阅读数', value: []},
        ];

        data.forEach(function (value) {
          categoryArr.push(value.create_time);
        });

        valueArr.forEach(function (value, index) {

          data.forEach(function (dataValue) {
            //暂时隐去综合数值
            // if (index == 0) {
            //   value.value.push(dataValue.comprehensive_num)
            // } else
            //暂时隐去综合数值
            if (index == 0) {
              value.value.push(dataValue.trans_num)
            } else if (index == 1) {
              value.value.push(dataValue.comment_num)
            } else {
              value.value.push(dataValue.read_num)
            }
          })
        });

        this.timeTrendDatas = {categoryArr: categoryArr, valueArr: valueArr}
        this.layoutSubviews();
      },


      //传播地域分析
      loadAreaData(ID) {
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
        this.zc_log('======传播地域分析');
        this.zc_log(params);
        this.zc_log('======传播地域分析');

        this.$http.get(this.baseUrl + '/spread/area/current', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('传播地域分析数据');
          this.zc_log(response);
          this.areaOriginalData = [];
          this.areaData = [];
          this.areaRankData = {categoryArr: [], valueArr: []};
          if (response.code == 200 && response.data) {
            this.handleData_area(response.data);
            this.handleData_areaRank(response.data)
          }
        }, function (err) {
          this.zc_log('传播地域分析数据失败');
          this.zc_log(err);
        })
      },
      handleData_area(data) {
        // //this.zc_log('传播地域分析数据')
        // //this.zc_log(data)
        let areaData = [];
        let thiz = this;
        data.forEach(function (value, index) {
          if (value.province) {
            // areaData.push({name: thiz.cutProvinceName(value.province), value: value.transNum})
            areaData.push({name: value.province, value: value.transNum});
            thiz.areaOriginalData.push(value)
          }
        });
        this.areaData = areaData;

        this.loadTenantData();//动态加载当前地区的转载数量


      },
      handleData_areaRank(data) {
        // //this.zc_log('传播地域分析排行数据')
        // //this.zc_log(data)

        let categoryArr = [];
        let valueArr = [
          {name: '文章转载篇数', value: []},
        ];

        let thiz = this;
        data.forEach(function (value) {
          if (value.province) {
            categoryArr.push(thiz.cutProvinceName(value.province));
          }
        });

        valueArr.forEach(function (value, index) {
          data.forEach(function (dataValue) {
            if (dataValue.province) {
              value.value.push(dataValue.transNum)
            }
          })
        });

        if (categoryArr.length > 10) {

          valueArr.forEach(function (item) {
            item.value = item.value.slice(0,10);
          });

          categoryArr = categoryArr.slice(0,10);

          this.areaRankData = {categoryArr: categoryArr, valueArr: valueArr};

        } else {
          this.areaRankData = {categoryArr: categoryArr, valueArr: valueArr};
        }

        // //this.zc_log(this.areaRankData)
      },
      areaMapClick({name, index}) {
        // alert(`name=${name},index=${index}`);
        // this.provienceTransName = name;
        let thiz = this;
        this.areaOriginalData.forEach(function (value, index) {
          if (value.province.indexOf(name) != -1) {
            thiz.loadProvienceTransnumData(thiz.plantformId, value.province)
          }
        })

      },
      //租户信息
      loadTenantData() {
        this.$http.get(this.baseUrl + '/tenant/find').then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('加载租户信息数据');
          this.zc_log(response);
          this.sidebarData_top = null;
          if (response.code == 200) {
            this.loadProvienceTransnumData(this.plantformId, response.data.region);
          }
        }, function (res) {
          this.zc_log('加载租户信息error');
          this.zc_log(res);
        });
      },


      //某地区转载数量
      loadProvienceTransnumData(ID, province) {
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
        params.province = province;
        this.zc_log('======某地区转载数量');
        this.zc_log(params);
        this.zc_log('======某地区转载数量');

        this.provienceTransName = this.cutProvinceName(province);
        // this.zc_log(`=======某地区转载数量参数`);
        // this.zc_log(params)
        // this.zc_log(`=======某地区转载数量参数`);
        let thiz = this;
        this.$http.get(this.baseUrl + '/spread/provience/transnum', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('某地区转载数量数据');
          this.zc_log(response);
          if (response.code == 200 && response.data) {
            this.handleData_provienceTransnum(response.data);
          }
        }, function (err) {

          this.zc_log('某地区转载数量数据失败');
          this.zc_log(err);
        })
      },
      handleData_provienceTransnum(data) {
        // //this.zc_log('某地区转载数量数据')
        // //this.zc_log(data)

        this.provienceTransnumData = data;
      },


      //转载媒体占比
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
        this.zc_log('======转载媒体占比');
        this.zc_log(params);
        this.zc_log('======转载媒体占比');

        this.$http.get(this.baseUrl + '/platform/trans/mediatype/find', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('转载媒体占比数据');
          this.zc_log(response);
          this.transMediaTypeData = [];
          if (response.code == 200 && response.data) {
            this.handleData_transMediaType(response.data)
          }
        }, function (err) {

          this.zc_log('转载媒体占比数据失败');
          this.zc_log(err);
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
        this.zc_log('======转载渠道占比');
        this.zc_log(params);
        this.zc_log('======转载渠道占比');

        this.$http.get(this.baseUrl + '/platform/trans/channel/find', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('转载渠道占比数据');
          this.zc_log(response);
          this.transChannelTypeData = [];
          if (response.code == 200 && response.data) {
            this.handleData_transChannelType(response.data)
          }
        }, function (err) {

          this.zc_log('转载渠道占比数据失败');
          this.zc_log(err);
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
        this.zc_log(`=======平台转载排行`);
        this.zc_log(params);
        this.zc_log(`=======平台转载排行`);
        this.$http.get(this.baseUrl + '/spread/platform/trans', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('平台转载排行数据');
          this.zc_log(response);
          this.platformTransData = {categoryArr: [], platformIdArr: [], valueArr: []};
          if (response.code == 200 && response.data) {
            this.handleData_platformTrans(response.data)
          }
        }, function (err) {
          this.zc_log('平台转载排行失败');
          this.zc_log(err);
        })
      },
      handleData_platformTrans(data) {
        //this.zc_log('平台转载排行数据')
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

        this.platformTransData = {categoryArr: categoryArr, platformIdArr: platformIdArr, valueArr: valueArr}
        // //this.zc_log(this.platformTransData)
      },


      //媒体转载排行
      loadMediaTransData(ID) {
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
        this.zc_log('======媒体转载排行');
        this.zc_log(params);
        this.zc_log('======媒体转载排行');

        this.$http.get(this.baseUrl + '/spreadTrend/mediaOrder', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('媒体转载排行数据');
          this.zc_log(response);
          this.mediaTransData = {categoryArr: [], valueArr: []};

          if (response.code == 200 && response.data) {
            this.handleData_mediaTrans(response.data.mediaList)
          }
        }, function (err) {

          this.zc_log('媒体转载排行失败');
          this.zc_log(err);
        })
      },
      handleData_mediaTrans(data) {
        // //this.zc_log('媒体转载排行数据')
        // //this.zc_log(data)
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


      layoutSubviews() {
        let parentWidth = this.$parent.showSiderbar ? screen.width * 0.85 - 117 : screen.width - 117;
        let length = this.spreadData.length;
        let width = 0;
        let padding = screen.width < 1920 ? 25 : 45;
        width = (parentWidth - (padding * length * 2)) / length;
        if (width > 180) {
          width = 180;
          padding = (parentWidth - (180 * length)) / (length * 2)
        }
        if (width < 110) {
          width = 110;
          padding = (parentWidth - (110 * length)) / (length * 2)
        }
        if (navigator.userAgent.indexOf('Firefox') >= 0) {
          this.statisticBoxWidth = (Math.floor(width) - 3) + "px";
          this.statisticBoxPadding = (Math.floor(padding)) + "px";
        } else {
          this.statisticBoxWidth = Math.floor(width) + "px";
          this.statisticBoxPadding = Math.floor(padding) + "px";
        }
        this.homeWorkNumFontSize = screen.width < 1920 ? "40px" : "60px";
        this.homeWorkNumBackgroundSize = screen.width < 1920 ? "40px" : "60px";
      }
    },
    beforeCreate(){
      let token = this.$route.query.token;
      if(token){
        localStorage.setItem('token',token);
      }
    },
    created(){
      let data = {
        id: "overView",
        name:document.title
      };
      this.registerCreateReportParams(this.$route.path, data);

      let token = this.$route.query.token;
      if(token){
        localStorage.setItem('token',token);
      }
    }
  }
</script>

<style scoped>

  /******************传播情况统计****************/
  .spread{
    float: left;
    width: 50%;
  }
  .spread_single{
    float: left;
    width: 100%;
  }
  .spread_item{
    float: left;
    height: 80px;
    line-height: 40px;
    margin: 0 18px 30px 0;
    padding: 0 10px 0 0;
    text-align: right;
    background-color: #F0F6FF;
    border-radius: 8px;
    font-size: 16px
  }
  .spread_item:last-child{
    margin: 0;
  }

  .spread_item .spread_item_icon{
    float: left;
    background-image: url("/static/images/spreadIcon.png");
    background-repeat: no-repeat;
    background-position: 0 0;
    width: 40px;
    height: 60px;
    margin-top: 10px;
  }

  .spread_item_single{
    width: calc((100% - 7*18px - 8*10px) / 8);
    margin: 0 18px 0 0;
  }

  .spread_item_group{
    width: calc((100% - 4*18px - 4*10px) / 4);
    margin: 0 18px 30px 0;
  }

  /******************作品发布占比****************/
  .works{
    float: left;
    width: 50%;
  }

  /*****************原创作品占比****************/
  .original_article_l, .original_article_r {
    float: left;
    width: 50%;
  }

  /*****************传播地域分析****************/
  .region .region_map {
    float: left;
    width: 56%;
  }

  .region .region_chart {
    float: left;
    width: 38%;
  }

  .region_chart_title_l, .region_chart_title_r {
    text-align: center;
    float: left;
    width: 50%;
  }

  .region_chart_title_l div, .region_chart_title_r div {
    color: #444;
    /* font-size: 18px; */
    font-weight: 900;
  }

  .region_chart_title_l span, .region_chart_title_r span {
    /* font-size: 18px; */
    font-weight: 900;
  }

  .region_chart_ranking {
    margin-top: 10px;
  }

  /*媒体转载分析*/

  .reprint_per {
    float: left;
    width: calc(50% - 2px);
    /*border: #E2E3E4 1px solid;*/
    /*border-top: 0;*/
    padding-bottom: 20px;

  }

  .halfBox-left {
    width: 86%;
    padding-right: 14%;
    /*padding-left: 7%;*/
  }

  .halfBox-right {
    width: 86%;
    padding-right: 14%;
    /*padding-left: 7%;*/
  }

  .el-table .has-gutter {
    background-color: green;
  }

  .el-table .headerStyle th {
    background-color: rgb(244, 244, 244);
  }
</style>



