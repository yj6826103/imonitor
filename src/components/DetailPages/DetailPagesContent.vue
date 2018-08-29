<template>
  <div class="detail_pages" id="detail_pages">

    <!--新闻数据-->
    <div class="block_rzl clearfix">
      <!--文章正文-->
      <div class="detail_box detail_article">

        <div class="detail_article_title"
             v-if="articleInfo">{{articleInfo?articleInfo.title:null}}
        </div>
        <div class="detail_article_title fontSize14"
             style="color: #444;line-height: 30px;text-align: center;font-weight: 100">
          <span>发布平台:{{articleInfo?articleInfo.source:"无"}} </span>
          <span style="margin-left: 40px">发布时间:{{articleInfo?articleInfo.publishTime:"无"}}</span>
        </div>
        <div class="detail_article_title fontSize14"
             style="color: #444;line-height: 30px;border-bottom: 1px solid #E2E3E4;text-align: center;font-weight: 100">
          <span>文章链接:</span>
          <span class="detail_article_webpage color_base"
                @click="detailArticleWebpageClick">{{articleInfo?articleInfo.url:"无"}}</span>
        </div>
        <div class="detail_article_content" v-html="articleInfo?this.escape2Html(articleInfo.content):null"
             v-if="articleInfo"></div>

        <!--<div class="detail_article_content" v-html="articleInfo?articleInfo.content:null" v-if="articleInfo"></div>-->
      </div>

      <!--平台情况分析-->
      <div class="detail_box detail_box_right">
        <div class="title_rzl" style="margin-bottom: 20px">平台情况分析</div>
        <tables :data="platformAnalysisData"
                :columnData="platformAnalysisColumnData"
                :showPageControl="false"
                :options="platformAnalysisOptions">
        </tables>
      </div>

      <!--转载趋势-->
      <div class="detail_box detail_box_right">
        <div class="title_rzl" style="margin-top: 20px;margin-bottom: 0">传播趋势</div>
        <div style="text-align: right">
          <el-dropdown @command="handleTrendCommand">
            <span class="el-dropdown-link">
              {{trendTypeSelected}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in trendType" :command="item.value" :key="item.name">{{item.name}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <lineChart height="320" idName="zzqs" v-if="reprintTrend.categoryArr.length"
                   :chartData="reprintTrend"></lineChart>
        <div class="noMoreData" style="height: 100px;padding-top: 0;line-height: 100px"
             v-if="!reprintTrend.categoryArr.length">暂无相关数据
        </div>
      </div>

      <!--传播途径-->
      <div class="detail_box" :style="{width:'100%'}">
        <div class="title_rzl">传播路径</div>

        <!--爆发图和时间线-->
        <div style="text-align: right;margin-bottom: 10px">
          <el-dropdown @command="handleArticalTrackCommand">
            <div class="el-dropdown-link" style="border: 1px solid #999;padding: 5px 10px;border-radius: 5px">
              {{showBurst?"爆发图":"时间线"}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1" key="baofatu">爆发图</el-dropdown-item>
              <el-dropdown-item command="2" key="shijainxian">时间线</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </div>

        <div class="baofatu" v-if="showBurst">
          <div style="border: #E2E3E4 solid 1px;margin-top: 10px" v-if="burstData">
            <graph-chart :height="700" :chartData="burstData"></graph-chart>
          </div>
          <div class="noMoreData" style="height: 100px;padding-top: 0;line-height: 100px"
               v-if="!burstData">暂无相关数据
          </div>

        </div>

        <div class="shijianxian" v-if="!showBurst">
          <div v-if="articalTrack">
            <!--<treeChart :height="500" idName="chuanbolujingdemo" :chartData="articalTrack"></treeChart>-->
            <TimeLine :data="articalTrack"></TimeLine>

          </div>
          <div class="noMoreData" style="height: 100px;padding-top: 0;line-height: 100px"
               v-if="!articalTrack">暂无相关数据
          </div>

        </div>

      </div>

      <!--转载新闻列表-->
      <div class="detail_box" :style="{width:'100%'}">
        <div class="title_rzl" style="margin-bottom: 20px">转载文章列表</div>

        <div class="newslist_screening">
          <el-select :value="newslistSourceValue"
                     size="mini"
                     @change="newsListSourceChange"
                     style="width: 100px">
            <el-option v-for="item in newsListSourceOption"
                       :value="item.value"
                       :label="item.label"
                       :key="item.label"></el-option>
          </el-select>
          <el-select :value="newslistCopyrightValue"
                     size="mini"
                     @change="newsListCopyrightChange"
                     style="width: 100px">
            <el-option v-for="item in newsListCopyrightOption"
                       :value="item.value"
                       :label="item.label"
                       :key="item.label"></el-option>
          </el-select>
        </div>

        <tables :data="newslistData"
                :columnData="newslistcolumnData"
                :showPageControl="false"
                @click-tablecell="clickTablecell"
                :options="newslistDataOptions">
        </tables>
        <div class="newslist_page clearfix">
          <div class="newslist_page_count">
            当前第{{newslistData.length>1?
            (((newsListCurrentPage-1)*10+1)+'-'+(newsListCurrentPage*10>newsListTotal?newsListTotal:newsListCurrentPage*10))
            :newslistData.length}}条 共计{{newsListTotal}}条
          </div>
          <div class="newslist_page_control">
            <el-pagination :background="true" :current-page="newsListCurrentPage" :page-size="10"
                           layout="prev, pager, next,jumper"
                           :total="newsListTotal" @current-change="newslistCurrentChange"></el-pagination>
          </div>
        </div>
      </div>
    </div>

    <!--评价分析-->
    <div class="block_rzl comment clearfix linkPointer">
      <div class="title_rzl">评论分析</div>
      <!--时间趋势-->
      <div class="time"
           v-if="commentData.length"
           :style="{width:'calc(100% / 3)',float:'left',height:'240px'}">
        <div class="title_rzl" style="margin-bottom: 20px">时间趋势</div>
        <div v-if="timeData.categoryArr.length">
          <barChart :height="200"
                    idName="time"
                    :chartData="timeData"
                    :options="{direction:'horizontal',showLegend:false}">
          </barChart>
        </div>
        <div class="noMoreData"
             style="height: 60px;padding-top: 0;line-height: 60px"
             v-if="!timeData.categoryArr.length">
          暂无相关数据
        </div>


      </div>

      <!--地域分布-->
      <div class="region"
           v-if="commentData.length"
           :style="{height:'240px',width:'calc(100% / 3)',float:'left'}">
        <div class="title_rzl" style="margin-bottom: 20px">地域分布</div>
        <div v-if="areaData.length">
          <mapChart idName="region" height="200" :chartData="areaData" :showProvice="false"></mapChart>
        </div>

        <div class="noMoreData"
             style="height: 460px;padding-top: 0;line-height: 460px"
             v-if="!areaData.length">
          暂无相关数据
        </div>

      </div>

      <!--情感分析-->
      <div class="emotion"
           v-if="commentData.length"
           :style="{width:'calc(100% / 3)',float:'left',height:'240px'}">
        <div class="title_rzl" style="margin-bottom: 20px">情感分析</div>
        <div v-if="emotionData.length">
          <pieChart :height="200"
                    idName="qgfx"
                    :chartData="emotionData">
          </pieChart>
        </div>
        <div class="noMoreData"
             style="height: 460px;padding-top: 0;line-height: 460px"
             v-if="!emotionData.length">
          暂无相关数据
        </div>


      </div>

      <!--相关标签+评论词云-->
      <div style="width: 50%;float: left;" v-show="commentData.length">
        <!--相关标签-->
        <div class="tags_related clearfix">
          <div class="title_rzl" style="margin-bottom: 20px">相关标签</div>
          <div class="tags_item"
               v-if="tagsData.length"
               v-for="item in tagsData">
            <el-tag :hit="true" color="#fff" size="medium" borderWidth="2px">{{item}}</el-tag>
          </div>
          <div class="noMoreData"
               style="height: 60px;padding-top: 0;line-height: 60px"
               v-if="!tagsData.length">
            暂无相关数据
          </div>
        </div>
        <!--评论词云-->
        <div class="comment_cloud" id="commentCloud">
          <div class="title_rzl">评论词云</div>
          <!--<div class="cloud" :style="{backgroundColor:this.getRandomColor(),height:'450px'}"-->
          <!--v-if="commentsWordCloud.length"></div>-->
          <div style="text-align: center">
            <WordCloudPic v-show="commentsWordCloud.length"
                          :decorateCircleColor="['#99acfb']"
                          :size="WordCloudHeight"
                          :data="commentsWordCloud">
            </WordCloudPic>
          </div>


          <div class="noMoreData"
               style="height: 60px;padding-top: 0;line-height: 60px"
               v-if="!commentsWordCloud.length">暂无相关数据
          </div>
        </div>
      </div>

      <!--典型意见-->
      <div class="advice" v-if="commentData.length">
        <div class="title_rzl" style="margin-bottom: 20px">典型意见</div>
        <div v-if="typicalOpinionsData.categoryArr.length">
          <barChart :height="560"
                    idName="typicalOpinions"
                    :chartData="typicalOpinionsData"
                    :options="{direction:'vertical',showLegend:false}">
          </barChart>
        </div>
        <div class="noMoreData"
             style="height: 560px;padding-top: 0;line-height: 560px"
             v-if="!typicalOpinionsData.categoryArr.length">
          暂无相关数据
        </div>
      </div>

      <!--评论列表-->
      <div class="comments_list" v-if="commentData.length">
        <div class="title_rzl comment_type">
          <span :class="isHotComment?'selected bgc_base':'nomal color_base'" @click="hotCommentClick(true)">热门评论</span>
          <span :class="!isHotComment?'selected bgc_base':'nomal color_base'" @click="hotCommentClick(false)">最新评论</span>
        </div>
        <div class="comment_item" v-for="item in commentData">
          <span class="comment_item_name color_base">{{item.name}}</span>
          <span class="comment_item_time">{{item.time}}</span>
          <div class="comment_item_text">{{item.text}}</div>
        </div>

        <div style="margin-top: 10px">
          <el-pagination
            :background="true"
            layout="total,->,prev, pager, next,->, jumper"
            :total="commentTotal"
            :current-page="commentCurrentPage"
            @current-change="commentsListCurrentChange">
          </el-pagination>
        </div>

      </div>

      <div class="noMoreData"
           style="height: 100px;padding-top: 0;line-height: 100px"
           v-if="!commentData.length">
        暂无相关数据
      </div>


    </div>
  </div>

</template>

<script>
  import GraphChart from '@/components/common/ZCChartsGraph'
  import Tables from '@/components/common/ZCTables'
  import pieChart from '@/components/common/ZCChartsPie'
  import barChart from '@/components/common/ZCChartsBar'
  import lineChart from '@/components/common/ZCChartsLine'
  import mapChart from '@/components/common/mapCharts'
  import WordCloudPic from '@/components/common/WordCloudPic'
  import treeChart from '@/components/common/ZCChartsTree'
  import TimeLine from '../common/ZCTimeLine'


  export default {
    name: "detail-pages-content",
    components: {GraphChart, Tables, pieChart, barChart, mapChart, lineChart, WordCloudPic, treeChart,TimeLine},
    data() {
      return {

        articleId: null,
        unionId: null,
        fullscreenLoading: false,

        /*平台情况分析*/
        articleInfo: null,
        platformAnalysisData: [],
        platformAnalysisColumnData: [
          {prop: 'platformName', label: '平台'},
          {prop: 'publishTime', label: '发布时间'},
          {prop: 'readNum', label: '阅读数'},
          {prop: 'transNum', label: '转载数'},
          {prop: 'commentNum', label: '评论数'},
          {prop: 'appriseNum', label: '点赞数'},
        ],
        platformAnalysisOptions: {
          id: 'hotwork_content',
          total: 10,
          showBorder: false,
          //表格列样式
          columnStyle: {
            indexs: [0],
            styles: [{textAlign: 'center'}],
            commons: {textAlign: 'center'}
          },
          //表格表头样式
          headerStyle: {
            indexs: [],
            styles: [],
            commons: {backgroundColor: '#f4f4f4', textAlign: 'center', padding: '5px 0'}
          },
        },

        /*转载趋势*/
        trendType: [
          {name: '阅读数', value: 0},
          {name: '转载数', value: 1},
          {name: '评论数', value: 2},
          {name: '点赞数', value: 3},
        ],
        trendTypeSelected: '阅读数',
        reprintTrendData: [],
        reprintTrend: {categoryArr: [], valueArr: []},


        //传播路径分析
        showBurst: true,
        burstData: null,
        articalTrack: null,
        /*转载新闻列表数据*/
        newsListSourceOption: [
          {
            value: 9,
            label: '全部'
          },
          {
            value: 1,
            label: '网页转载'
          },
          {
            value: 2,
            label: '微信转载'
          },
          {
            value: 3,
            label: '微博转载'
          },
          {
            value: 4,
            label: 'APP转载'
          },
          {
            value: 5,
            label: '搜索引擎'
          },
        ],
        newslistSourceValue: 9,
        newsListCopyrightOption: [
          {
            value: 9,
            label: '全部'
          },
          {
            value: 0,
            label: '版权存疑'
          },
          {
            value: 1,
            label: '注明来源'
          }
        ],
        newslistCopyrightValue: 9,
        newsListCurrentPage: 1,
        newsListTotal: 0,
        newslistData: [],
        newslistcolumnData: [
          {prop: 'num', label: '序号'},
          {prop: 'transMedia', label: '转载媒体'},
          {prop: 'transTitle', label: '转载标题'},
          {prop: 'transTime', label: '转载时间'},
          {prop: 'similarity', label: '相似度'},
          {prop: 'transType', label: '转载类型'},
          {prop: 'tort', label: '侵权情况'},
        ],
        newslistDataOptions: {
          id: 'single_content',
          total: 500,
          //表格列样式
          columnStyle: {
            indexs: [0, 1, 2, 3, 4, 5, 6, 7],
            styles: [
              {width: '80px'},
              {width: '150px'},
              {textAlign: 'left', color: '#3B87F5', cursor: 'pointer'},
              {width: '150px'},
              {width: '150px'},
              {width: '100px'},
              {width: '100px'},
              {width: '100px'},
            ],
            commons: {textAlign: 'center'}
          },
          //表格行样式
          rowStyle: {
            indexs: [],
            styles: [],
            commons: {}
          },
          //表格表头样式
          headerStyle: {
            indexs: [2],
            styles: [{textAlign: 'left'}],
            commons: {backgroundColor: '#f4f4f4', textAlign: 'center', padding: '5px 0'}
          },
          //操作按钮
          handleTitle: '详情'
        },


        /*时间趋势数据*/
        timeData: {categoryArr: [], valueArr: []},

        //地域分布
        areaData: [],

        /*情感分析数据*/
        emotionData: [],
        /*标签数据*/
        tagsData: [],


        //词云
        commentsWordCloud: [],
        WordCloudHeight: '0',
        //典型意见
        typicalOpinionsData: {categoryArr: [], valueArr: []},


        /*评论数据*/
        commentData: [],
        commentCurrentPage: 1,
        commentTotal: 0,
        isHotComment: true,


      }
    },
    methods: {


      loadAllData() {

        // 文章详情内容
        this.loadArticleInfo(this.unionId);
        // 平台情况分析接口
        this.loadPlatformAnalysis(this.articleId);
        /*转载趋势接口*/
        this.loadReprintTrendData(this.unionId);

        // 传播路径-爆发图
        this.loadArticalTrackData(this.unionId);
        // 传播路径-时间线
        this.loadArticalTrackTimeData(this.unionId);

        /*转载新闻列表*/
        this.loadNewslistAnalysis(this.unionId);
        //获取时间趋势接口
        this.loadTimeTrendData(this.unionId);
        // 获取分布接口
        this.loadDistributeData(this.unionId);
        // 评论情感分析
        this.loadCommentsSentimentData(this.unionId);
        // 评论标签
        this.loadCommentsTagsData(this.unionId);
        // 评论词云
        this.loadCommentsWordCloudData(this.unionId);
        // 评论典型意见
        this.loadCommentsOptionsData(this.unionId);
        /*评论列表加载*/
        this.loadCommentsListData(this.unionId);

      },


      /*文章详情内容*/
      loadArticleInfo(id) {
        this.fullscreenLoading = true;
        let params = {id: id};

        // this.zc_log('=======文章详情参数');
        // this.zc_log(params);
        // this.zc_log('=======文章详情参数');
        this.$http.get(this.baseUrl + '/article/analysis/info', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('文章详情接口数据');
          this.zc_log(response);
          this.fullscreenLoading = false;
          this.articleInfo = null;
          if (response.code == 200 && response.data) {
            // this.handleArticleInfo(response.data)
            this.articleInfo = response.data;

          }
        }, function (err) {
          this.fullscreenLoading = false;
          this.zc_log('文章详情接口数据失败');
          this.zc_log(err);
        })
      },
      handleArticleInfo(data) {

        // let result = this.escape2Html(data);
        // this.articleInfo = result;

      },
      //转意符换成普通字符
      escape2Html(str) {
        var arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'};
        return str.toString().replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
          return arrEntities[t];
        });
      },
      //  转成空格
      nbsp2Space(str) {
        var arrEntities = {'nbsp': ' '};
        return str.replace(/&(nbsp);/ig, function (all, t) {
          return arrEntities[t]
        })
      },

      //回车转为br标签
      return2Br(str) {
        return str.replace(/\r?\n/g, "<br />");
      },
      //去除开头结尾换行,并将连续3次以上换行转换成2次换行
      trimBr(str) {
        str = str.replace(/((\s| )*\r?\n){3,}/g, "\r\n\r\n");//限制最多2次换行
        str = str.replace(/^((\s| )*\r?\n)+/g, '');//清除开头换行
        str = str.replace(/((\s| )*\r?\n)+$/g, '');//清除结尾换行
        return str;
      },
      // 将多个连续空格合并成一个空格
      mergeSpace(str) {
        str = str.replace(/(\s| )+/g, ' ');
        return str;
      },
      detailArticleWebpageClick() {
        if (this.articleInfo && this.articleInfo.url) {
          window.open(this.articleInfo.url)
        }
      },


      /*平台情况分析接口*/
      loadPlatformAnalysis(id) {
        this.fullscreenLoading = true;
        let params = {id: id};

        // this.zc_log('=======平台情况分析接口参数');
        // this.zc_log(params);
        // this.zc_log('=======平台情况分析接口参数');
        this.$http.get(this.baseUrl + '/article/analysis/platform', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('平台情况分析接口数据');
          this.zc_log(response);
          this.fullscreenLoading = false;
          this.platformAnalysisData = [];
          if (response.code == 200 && response.data) {
            this.platformAnalysisData = response.data;
          }
        }, function (err) {
          this.fullscreenLoading = false;
          this.zc_log('平台情况分析接口数据');
          this.zc_log(err);
        })
      },

      /*转载趋势接口*/
      loadReprintTrendData(id) {
        this.fullscreenLoading = true;
        let params = {id: id};

        // this.zc_log('=======转载趋势接口参数');
        // this.zc_log(params);
        // this.zc_log('=======转载趋势接口参数');
        this.$http.get(this.baseUrl + '/article/analysis/current', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('转载趋势接口数据');
          this.zc_log(response);
          this.fullscreenLoading = false;
          this.reprintTrendData = null;
          if (response.code == 200 && response.data) {
            this.reprintTrendData = response.data;
            this.handleReprintTrendData(this.reprintTrendData);
          }
        }, function (err) {
          this.fullscreenLoading = false;
          this.zc_log('转载趋势接口数据error');
          this.zc_log(err);
        })
      },
      handleReprintTrendData(data) {

        let categoryArr = [];
        let valueArr = [];

        let thiz = this;
        data.forEach(function (dataItem, dataIndex) {
          valueArr.push({name: dataItem.platformName, value: []});
          dataItem.dailyList.forEach(function (listItem, listIndex) {
            categoryArr.push(listItem.createTime);
            if (thiz.trendTypeSelected === '转载数') {//转载数
              valueArr[dataIndex].value.push(listItem.transNum);
            } else if (thiz.trendTypeSelected === '评论数') {//评论数
              valueArr[dataIndex].value.push(listItem.commentNum);
            } else if (thiz.trendTypeSelected === '点赞数') {//点赞数
              valueArr[dataIndex].value.push(listItem.appriseNum);
            } else {//阅读数
              valueArr[dataIndex].value.push(listItem.readNum);
            }
          });
        });

        this.reprintTrend = {categoryArr: categoryArr, valueArr: valueArr};

      },
      handleTrendCommand(command) {

        let thiz = this;
        this.trendType.forEach(function (value) {
          if (value.value === command) {
            thiz.trendTypeSelected = value.name;
          }
        });
        this.handleReprintTrendData(this.reprintTrendData);
      },

      // 传播路径-爆发图
      loadArticalTrackData(id) {
        this.fullscreenLoading = true;
        let params = {unionId: id};

        this.zc_log('=======传播路径-爆发图接口参数');
        this.zc_log(params);
        this.zc_log('=======传播路径-爆发图接口参数');
        this.$http.get(this.baseUrl + '/article/track', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('传播路径-爆发图接口数据');
          this.zc_log(response);
          this.fullscreenLoading = false;
          if (response.code == 200 && response.data) {
            this.handleArticalTrackData(response.data);
          }
        }, function (err) {
          this.fullscreenLoading = false;
          this.zc_log('传播路径-爆发图接口数据error');
          this.zc_log(err);
        })
      },
      handleArticalTrackData(data) {

        if (!data.array01 || !data.array02 || !data.array03 || data.array01.length === 0 || data.array02.length === 0 || data.array03.length === 0) {
          return;
        }
        let trackData = data;
        let list = [
          {
            category: '',
            itemStyle: {color: '#6992a9'},
            symbol: 'diamond',
            symbolSize: 64,
            label:{position:'inside',color:'#fff'}
          },
          {
            category: '爆发点',
            itemStyle: {color: '#d0605c'},
            symbol: 'circle',
            symbolSize: 54,
          },
          {
            category: '传播点',
            itemStyle: {color: '#79c1a9'},
            symbol: 'circle',
            symbolSize: 30,
          },
        ];

        trackData.array01.forEach(function (value) {

          if (value.name === '传播点') {
            value.itemStyle = list[2].itemStyle;
          } else if (value.name === '爆发点') {
            value.itemStyle = list[1].itemStyle;
          } else {
            value.itemStyle = list[0].itemStyle;
          }

        });

        trackData.array03.forEach(function (value) {

          if (value.category === '传播点') {
            value.symbol = list[2].symbol;
            value.symbolSize = list[2].symbolSize;
            value.emphasis = list[2].emphasis;
          } else if (value.category === '爆发点') {
            value.symbol = list[1].symbol;
            value.symbolSize = list[1].symbolSize;
            value.emphasis = list[1].emphasis;
          } else {
            value.symbol = list[0].symbol;
            value.symbolSize = list[0].symbolSize;
            value.emphasis = list[0].emphasis;
            value.label = list[0].label;
          }
        });

        this.burstData = trackData;

      },


      // 传播路径-时间线
      // loadArticalTrackTimeData(id) {
      //   this.fullscreenLoading = true;
      //   let params = {unionId: id};
      //
      //   this.zc_log('=======传播路径-时间线接口参数');
      //   this.zc_log(params);
      //   this.zc_log('=======传播路径-时间线接口参数');
      //   this.$http.get(this.baseUrl + '/article/trace', {params: params}).then(function (res) {
      //     let response = JSON.parse(res.bodyText);
      //     this.zc_log('传播路径-时间线接口数据');
      //     // this.zc_log(response);
      //     this.fullscreenLoading = false;
      //     if (response.code == 200 && response.data) {
      //       let dataTest = [response.data];
      //
      //       // let dataTest = [
      //       //   {
      //       //     "transTime": "07-20 09:59",
      //       //     "children": [
      //       //       {
      //       //         "transTime": "07-20 09:59",
      //       //         "children": [
      //       //           {
      //       //             "transTime": "07-26 08:28",
      //       //             "children": [],
      //       //             "name": "凤凰网",
      //       //             "channel": 1
      //       //           }
      //       //         ],
      //       //         "name": "澎湃新闻网",
      //       //         "channel": 1
      //       //       },
      //       //       {
      //       //         "transTime": "07-20 09:59",
      //       //         "children": [
      //       //           {
      //       //             "transTime": "07-24 01:59",
      //       //             "children": [],
      //       //             "name": "新民网-时政",
      //       //             "channel": 1
      //       //           }
      //       //         ],
      //       //         "name": "光明网",
      //       //         "channel": 1
      //       //       },
      //       //       {
      //       //         "transTime": "07-20 09:59",
      //       //         "children": [
      //       //           {
      //       //             "transTime": "07-26 06:54",
      //       //             "children": [],
      //       //             "name": "人民网",
      //       //             "channel": 1
      //       //           },
      //       //           {
      //       //             "transTime": "07-26 08:15",
      //       //             "children": [],
      //       //             "name": "人民网",
      //       //             "channel": 1
      //       //           },
      //       //           {
      //       //             "transTime": "07-26 09:34",
      //       //             "children": [],
      //       //             "name": "红网",
      //       //             "channel": 1
      //       //           }
      //       //         ],
      //       //         "name": "人民网－人民日报",
      //       //         "channel": 1
      //       //       },
      //       //       {
      //       //         "transTime": "07-20 09:59",
      //       //         "children": [
      //       //           {
      //       //             "transTime": "07-24 11:27",
      //       //             "children": [],
      //       //             "name": "凤凰新闻",
      //       //             "channel": 4
      //       //           }
      //       //         ],
      //       //         "name": "光明网-光明日报",
      //       //         "channel": 1
      //       //       },
      //       //       {
      //       //         "transTime": "07-20 09:59",
      //       //         "children": [
      //       //           {
      //       //             "transTime": "07-24 08:32",
      //       //             "children": [],
      //       //             "name": "红网",
      //       //             "channel": 1
      //       //           },
      //       //           {
      //       //             "transTime": "07-26 12:00",
      //       //             "children": [],
      //       //             "name": "凯风网",
      //       //             "channel": 1
      //       //           },
      //       //           {
      //       //             "transTime": "07-26 06:19",
      //       //             "children": [],
      //       //             "name": "中国经济网",
      //       //             "channel": 1
      //       //           },
      //       //           {
      //       //             "transTime": "07-26 08:19",
      //       //             "children": [],
      //       //             "name": "中国江苏网-财经播报",
      //       //             "channel": 1
      //       //           },
      //       //           {
      //       //             "transTime": "07-26 10:10",
      //       //             "children": [],
      //       //             "name": "红网",
      //       //             "channel": 1
      //       //           }
      //       //         ],
      //       //         "name": "经济日报",
      //       //         "channel": 1
      //       //       },
      //       //       {
      //       //         "transTime": "07-20 09:59",
      //       //         "children": [
      //       //           {
      //       //             "transTime": "07-22 08:09",
      //       //             "children": [],
      //       //             "name": "成都全搜索",
      //       //             "channel": 1
      //       //           },
      //       //           {
      //       //             "transTime": "07-23 05:51",
      //       //             "children": [],
      //       //             "name": "新浪新闻",
      //       //             "channel": 4
      //       //           }
      //       //         ],
      //       //         "name": "四川日报",
      //       //         "channel": 1
      //       //       },
      //       //       {
      //       //         "transTime": "07-20 09:59",
      //       //         "children": [
      //       //           {
      //       //             "transTime": "07-24 09:39",
      //       //             "children": [
      //       //               {
      //       //                 "transTime": "07-24 09:39",
      //       //                 "children": [],
      //       //                 "name": "东方网",
      //       //                 "channel": 1
      //       //               },
      //       //               {
      //       //                 "transTime": "07-24 11:13",
      //       //                 "children": [],
      //       //                 "name": "新浪新闻",
      //       //                 "channel": 4
      //       //               }
      //       //             ],
      //       //             "name": "新华网",
      //       //             "channel": 1
      //       //           },
      //       //           {
      //       //             "transTime": "07-24 10:46",
      //       //             "children": [],
      //       //             "name": "东方网",
      //       //             "channel": 1
      //       //           },
      //       //           {
      //       //             "transTime": "07-24 02:43",
      //       //             "children": [],
      //       //             "name": "人民网",
      //       //             "channel": 1
      //       //           }
      //       //         ],
      //       //         "name": "光明日报",
      //       //         "channel": 1
      //       //       },
      //       //       {
      //       //         "transTime": "07-20 09:59",
      //       //         "children": [
      //       //           {
      //       //             "transTime": "07-30 10:47",
      //       //             "children": [],
      //       //             "name": "浙江在线",
      //       //             "channel": 1
      //       //           }
      //       //         ],
      //       //         "name": "浙江在线",
      //       //         "channel": 1
      //       //       },
      //       //       {
      //       //         "transTime": "07-24 09:39",
      //       //         "children": [
      //       //           {
      //       //             "transTime": "07-24 09:39",
      //       //             "children": [],
      //       //             "name": "东方网",
      //       //             "channel": 1
      //       //           },
      //       //           {
      //       //             "transTime": "07-24 11:13",
      //       //             "children": [],
      //       //             "name": "新浪新闻",
      //       //             "channel": 4
      //       //           }
      //       //         ],
      //       //         "name": "新华网",
      //       //         "channel": 1
      //       //       },
      //       //       {
      //       //         "transTime": "07-20 09:59",
      //       //         "children": [
      //       //           {
      //       //             "transTime": "07-26 09:48",
      //       //             "children": [],
      //       //             "name": "中国江苏网",
      //       //             "channel": 1
      //       //           }
      //       //         ],
      //       //         "name": "人民日报",
      //       //         "channel": 1
      //       //       },
      //       //       {
      //       //         "transTime": "07-20 09:59",
      //       //         "children": [
      //       //           {
      //       //             "transTime": "07-24 10:20",
      //       //             "children": [],
      //       //             "name": "红网",
      //       //             "channel": 1
      //       //           }
      //       //         ],
      //       //         "name": "光明网-《光明日报》",
      //       //         "channel": 1
      //       //       }
      //       //     ],
      //       //     "name": "sxdst",
      //       //     "channel": 1
      //       //   }
      //       // ]
      //
      //
      //       this.handleArticalTrackTimeData(dataTest);
      //       this.articalTrack = dataTest;
      //       this.zc_log(dataTest);
      //     }
      //   }, function (err) {
      //     this.fullscreenLoading = false;
      //     this.zc_log('传播路径-时间线接口数据error');
      //     this.zc_log(err);
      //   })
      // },
      // handleArticalTrackTimeData(data) {
      //
      //   for (var i = 0; i < data.length; i++) {
      //
      //     let value = data[i];
      //
      //     // alert(value.channel)
      //     switch (value.channel) {
      //       case 1:
      //         value.itemStyle = {color: '#C23531'};
      //         break;
      //       case 2:
      //         value.itemStyle = {color: '#31C2BA'};
      //         break;
      //       case 3:
      //         value.itemStyle = {color: '#6BC231'};
      //         break;
      //       case 4:
      //         value.itemStyle = {color: '#C29131'};
      //         break;
      //       case 5:
      //         value.itemStyle = {color: '#787878'};
      //         break;
      //     }
      //     if (value.children && value.children.length) {
      //       // alert('hhahahahhahaha')
      //       this.handleArticalTrackTimeData(value.children);
      //     }
      //   }
      //
      //
      // },

      // 传播路径-时间线
      loadArticalTrackTimeData(id){

        let params = {unionId:id};
        this.$http.get(this.baseUrl + '/article/distribute', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('传播路径图数据返回');
          this.zc_log(response);
          if (response.code == 200 && response.data) {

            this.articalTrack = response.data;
          }
        }, function (err) {
          //this.zc_log('传播地域分析数据失败');
          //this.zc_log(err);
        })
      },

      handleArticalTrackCommand(command) {

        if (command == '1') {
          this.showBurst = true;
        } else {
          this.showBurst = false;
        }
        // this.zc_log(command);
      },


      /*转载新闻列表*/
      loadNewslistAnalysis(id) {
        this.fullscreenLoading = true;
        let params = {
          id: id,
          pageNo: this.newsListCurrentPage,
          pageSize: 10,
          transType: this.newslistSourceValue,
          tort: this.newslistCopyrightValue
        };

        this.zc_log('=======转载新闻列表参数');
        this.zc_log(params);
        this.zc_log('=======转载新闻列表参数');
        this.$http.get(this.baseUrl + '/article/analysis/newslist', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('转载新闻列表接口数据');
          this.zc_log(response);
          this.fullscreenLoading = false;
          this.newslistData = [];
          this.newsListTotal = 0;
          if (response.code == 200 && response.data) {
            var similarity = 0;
            response.data.transInfoList.forEach(function (item, index) {
              similarity = (item.similarity * 100).toFixed(2) + '%';
              item.similarity = similarity;
              if(!item.tort || !item.tort.length){
                item.tort = "--";
              }
            });
            this.newslistData = response.data.transInfoList;
            this.newsListTotal = response.data.total;
          }
        }, function (err) {
          this.fullscreenLoading = false;
          this.zc_log('转载新闻列表接口数据error');
          this.zc_log(err);
        })
      },
      newslistCurrentChange(val) {
        this.newsListCurrentPage = val;
        this.loadNewslistAnalysis(this.unionId);
      },
      clickTablecell({rowIndex, columnIndex}) {
        this.zc_log(`行号=${rowIndex},列号=${columnIndex}`);
        if (columnIndex === 7) {
          let webpageCode = this.newslistData[rowIndex].webpageCode;
          let uid = this.unionId;
          window.open('copyright?unionId=' + uid + '&webpageCode=' + webpageCode);
        } else if (columnIndex === 2) {

          let url = this.newslistData[rowIndex].url;
          window.open(url);
        }

      },
      newsListSourceChange(val) {
        this.newslistSourceValue = val;
        this.newsListCurrentPage = 1;
        this.loadNewslistAnalysis(this.unionId);
      },
      newsListCopyrightChange(val) {
        this.newslistCopyrightValue = val;
        this.newsListCurrentPage = 1;
        this.loadNewslistAnalysis(this.unionId);
      },

      // 获取时间趋势接口
      loadTimeTrendData(id) {
        this.fullscreenLoading = true;
        let params = {unionId: id, queryType: 2};
        // this.zc_log('=======获取分布接口');
        // this.zc_log(params);
        // this.zc_log('=======获取分布接口');
        this.$http.get(this.baseUrl + '/comment/getDistribute', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('获取时间趋势接口');
          this.zc_log(response);
          this.fullscreenLoading = false;
          this.timeData = {categoryArr: [], valueArr: []};

          if (response.code == 200 && response.data) {
            this.handleTimeTrendData(response.data);
          }

        }, function (err) {
          this.fullscreenLoading = false;
          this.zc_log('获取时间趋势接口失败');
          this.zc_log(err);
        })
      },
      handleTimeTrendData(data) {

        let categoryArr = [];
        let valueArr = [
          {name: '文章评论数', value: []},
        ];
        data.forEach(function (value) {
          categoryArr.push(value.key);
        });
        valueArr.forEach(function (value, index) {
          data.forEach(function (dataValue) {
            value.value.push(dataValue.distribute)
          })
        });
        this.timeData = {categoryArr: categoryArr, valueArr: valueArr};
      },


      /*获取分布接口*/
      loadDistributeData(id) {
        this.fullscreenLoading = true;
        // queryType:1查询地域分布 2查询时间分布
        let params = {unionId: id, queryType: 1};

        // this.zc_log('=======获取分布接口');
        // this.zc_log(params);
        // this.zc_log('=======获取分布接口');
        this.$http.get(this.baseUrl + '/comment/getDistribute', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('获取分布接口数据');
          this.zc_log(response);
          this.fullscreenLoading = false;
          this.areaData = [];
          if (response.code == 200 && response.data) {
            this.handleDistributeData(response.data)
          }
        }, function (err) {
          this.fullscreenLoading = false;
          this.zc_log('获取分布接口数据失败');
          this.zc_log(err);
        })
      },
      handleDistributeData(data) {
        let result = [];
        data.forEach(function (value, index) {
          result.push({name: value.key, value: value.distribute})
        });

        this.areaData = result;
      },


      /*评论情感分析*/
      loadCommentsSentimentData(id) {
        this.fullscreenLoading = true;
        let params = {unionId: id};

        // this.zc_log('=======评论情感分析参数');
        // this.zc_log(params);
        // this.zc_log('=======评论情感分析参数');
        this.$http.get(this.baseUrl + '/comment/getSentiment', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('评论情感分析加载数据');
          this.zc_log(response);
          this.fullscreenLoading = false;
          if (response.code == 200 && response.data) {
            this.handleCommentsSentimentData(response.data)
          }

        }, function (err) {
          this.fullscreenLoading = false;
          this.zc_log('评论情感分析加载数据');
          this.zc_log(err);
        })
      },
      handleCommentsSentimentData(data) {
        let list = [];
        data.forEach(function (value) {
          list.push({name: value.content, value: value.num});
        });
        this.emotionData = list;
      },


      /*评论标签*/
      loadCommentsTagsData(id) {
        this.fullscreenLoading = true;
        let params = {unionId: id};

        // this.zc_log('=======评论标签参数');
        // this.zc_log(params);
        // this.zc_log('=======评论标签参数');
        this.$http.get(this.baseUrl + '/comment/getTags', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('评论标签加载数据');
          this.zc_log(response);
          this.fullscreenLoading = false;
          this.tagsData = [];
          if (response.code == 200 && response.data) {

            this.handleCommentsTagsData(response.data)
          }

        }, function (err) {
          this.fullscreenLoading = false;
          this.zc_log('评论标签加载数据失败');
          this.zc_log(err);
        })
      },
      handleCommentsTagsData(data) {

        let list = [];
        data.forEach(function (value) {
          list.push(value.content);
        });
        this.tagsData = list;
      },

      /*评论词云*/
      loadCommentsWordCloudData(id) {
        this.fullscreenLoading = true;
        let params = {unionId: id};

        // this.zc_log('=======评论词云参数');
        // this.zc_log(params);
        // this.zc_log('=======评论词云参数');
        this.$http.get(this.baseUrl + '/comment/getWordCloud', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('评论词云加载数据');
          this.zc_log(response);
          this.fullscreenLoading = false;
          this.commentsWordCloud = [];
          if (response.code == 200 && response.data) {
            this.handleCommentsWordCloudData(response.data);
          }
        }, function (err) {
          this.fullscreenLoading = false;
          this.zc_log('评论词云加载数据失败');
          this.zc_log(err);
        })
      },

      handleCommentsWordCloudData(data) {

        let result = [];

        data.forEach(function (value, index) {

          let color = '';
          if (index === 0) {
            color = 'rgba(246,81,87,1)'
          } else if (index > 0 && index < 4) {
            color = 'rgba(71,76,250,1)'
          } else {
            color = 'rgba(154,172,254,1)'
          }
          result.push({num: value.num, name: value.content, color: color})
        });

        this.commentsWordCloud = result;
        // this.commentsWordCloud = [
        //   {
        //     num: 10.27,
        //     name: "名人明星",
        //     color: "rgba(246,81,87,1)"
        //   },
        //   {
        //     num: 10.22,
        //     name: "视频音乐",
        //     color: "rgba(71,76,250,1)"
        //   },
        //   {
        //     num: 6.2,
        //     name: "校园生活",
        //     color: "rgba(71,76,250,1)"
        //   },
        //   {
        //     num: 4.05,
        //     name: "宠物图集",
        //     color: "rgba(71,76,250,1)"
        //   },
        //   {
        //     num: 3.56,
        //     name: "美图摄影",
        //     color: "rgba(71,76,250,1)"
        //   },
        //   {
        //     num: 7.39,
        //     name: "幽默搞笑",
        //     color: "rgba(154,172,254,1)"
        //   },
        //   {
        //     num: 4.6,
        //     name: "穿衣美容",
        //     color: "rgba(154,172,254,1)"
        //   },
        //   {
        //     num: 4.42,
        //     name: "美食",
        //     color: "rgba(154,172,254,1)"
        //   },
        //   {
        //     num: 8.79,
        //     name: "旅游",
        //     color: "rgba(154,172,254,1)"
        //   },
        //   {
        //     num: 3.47,
        //     name: "娱乐",
        //     color: "rgba(154,172,254,1)"
        //   },];
      },
      setWorldCloudSize() {

        this.zc_log((screen.width - 100) / 2);
        return ((screen.width - 100) / 2).toString();
      },


      /*评论典型意见*/
      loadCommentsOptionsData(id) {
        this.fullscreenLoading = true;
        let params = {unionId: id};

        // this.zc_log('=======评论典型意见参数');
        // this.zc_log(params);
        // this.zc_log('=======评论典型意见参数');
        this.$http.get(this.baseUrl + '/comment/getOpinions', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('评论典型意见加载数据');
          this.zc_log(response);
          this.fullscreenLoading = false;
          this.typicalOpinionsData = {categoryArr: [], valueArr: []};
          if (response.code == 200 && response.data) {
            this.handleCommentsOptionsData(response.data);
          }

        }, function (err) {
          this.fullscreenLoading = false;
          this.zc_log('评论典型意见加载数据');
          this.zc_log(err);
        })
      },
      handleCommentsOptionsData(data) {

        let categoryArr = [];
        let valueArr = [
          {name: '文章评论数', value: []},
        ];
        data.forEach(function (value) {
          categoryArr.push(value.content);
        });
        valueArr.forEach(function (value, index) {
          data.forEach(function (dataValue) {
            value.value.push(dataValue.num)
          })
        });

        this.typicalOpinionsData = {categoryArr: categoryArr, valueArr: valueArr}

      },


      /*传播路径接口*/
      loadAnalysisPath() {

      },


      /*评论列表加载*/
      loadCommentsListData(id) {
        this.fullscreenLoading = true;
        let params = {
          unionId: id,
          orderField: this.isHotComment ? 'upNum' : 'publishTime',
          pageNo: this.commentCurrentPage,
          pageSize: 10
        };

        // this.zc_log('=======评论列表加载');
        // this.zc_log(params);
        // this.zc_log('=======评论列表加载');
        this.$http.get(this.baseUrl + '/comment/findComments', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('评论列表加载数据');
          this.zc_log(response);
          this.fullscreenLoading = false;
          this.commentData = [];
          if (response.code == 200 && response.data.content) {
            this.handleCommentsListData(response.data);
          }

        }, function (err) {
          this.fullscreenLoading = false;
          this.zc_log('评论列表加载数据失败');
          this.zc_log(err);
        })
      },
      handleCommentsListData(data) {

        let list = [];
        let thiz = this;
        data.content.forEach(function (value) {

          let pubTime = new Date(value.publishTime);

          let year = pubTime.getFullYear();
          let month = pubTime.getMonth();
          let day = pubTime.getDate();
          let hour = pubTime.getHours();
          let minutes = pubTime.getMinutes();

          let time = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day) + ' ' + (hour < 10 ? ('0' + hour) : hour) + ':' + (minutes < 10 ? ('0' + minutes) : minutes)
          list.push({
            name: value.userName,
            time: thiz.dataFormat(value.publishTime),
            text: value.content
          })
        });
        this.commentData = list;
        this.commentTotal = data.totalElements;
      },
      commentsListCurrentChange(val) {
        this.commentCurrentPage = val;
        this.loadCommentsListData(this.unionId);
      },
      hotCommentClick(isHotComment) {
        this.commentCurrentPage = 1;
        this.isHotComment = isHotComment;
        this.loadCommentsListData(this.unionId);
      },


    },

    mounted() {
      // this.$message({"message": this.$route.query.uid + '@' + this.$route.query.aid});
      this.articleId = this.$route.query.aid;
      this.unionId = this.$route.query.uid;
      this.loadAllData();

      this.WordCloudHeight = (screen.width - 100) / (2 * 1.5);

    },
    created(){
      let data = {
        id: "detail_pages",
        name: document.title
      };
      this.registerCreateReportParams(this.$route.path, data);
    }
  }
</script>

<style scoped>

  .detail_box, .detail_box2 {
    float: left;
    margin-top: 20px;
    background-color: #fff;
  }

  /*文章正文*/
  .detail_article {
    height: calc(700px - 2px);
    width: calc(50% - 62px);
    border: 1px solid #E2E3E4;
    margin-top: 0;
    overflow-y: auto;
    padding: 0 30px;
  }

  .detail_article_title {
    text-align: center;
    line-height: 60px;
    /* font-size: 20px; */
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .detail_article_webpage {
    text-decoration: underline;
    cursor: pointer;
  }

  .detail_article_content {
    margin-top: 20px;
  }

  /*平台情况分析 转载趋势*/
  .detail_box_right {
    margin: 0;
    padding-left: 50px;
    width: calc(50% - 50px);
  }

  .newslist_screening {
    margin-bottom: 20px;
  }

  .newslist_page {
    /*height: 50px;*/
    /*line-height: 50px;*/
    padding-top: 20px;
  }

  .newslist_page_count {
    float: left;
    line-height: 30px;
    color: #8c939d;
  }

  .newslist_page_control {
    float: right;
    line-height: 30px;
  }

  /****************评论分析****************/
  /*相关标签*/
  .tags_related {
    width: 100%;
  }

  .tags_related .tags_item {
    float: left;
    margin-bottom: 10px;
    margin-right: 20px;
  }

  .tags_related .tags_item >>> .el-tag {
    border: #3B87F5 solid 1px;
    padding: 0 15px;
    color: #3B87F5;
    /* font-size: 14px; */
    width: 100px;
    text-align: center;
  }

  /*词云*/
  .comment_cloud {
    width: 100%;
  }

  /*典型意见*/
  .advice {
    width: 50%;
    float: left;
  }

  /*评论列表*/
  .comments_list {
    float: left;
    width: 100%;
    margin-top: 10px;
  }

  .comments_list .comment_item {
    padding: 20px 0;
    border-bottom: #E2E3E4 1px solid;
    /* font-size: 15px; */
  }

  .comments_list .comment_type .selected {
    padding: 5px 20px;
    border-radius: 10px;
    color: #fff;
    display: inline-block;
    /* font-size: 15px; */
    cursor: pointer;
    font-family: "Songti TC";
  }

  .comments_list .comment_type .nomal {
    padding: 5px 20px;
    background: #fff;
    border-radius: 10px;
    display: inline-block;
    /* font-size: 15px; */
    cursor: pointer;
    font-family: "Songti TC";
  }

  .comment_item .comment_item_name {
    margin-right: 10px;
  }

  .comment_item .comment_item_time {
    color: #E2E3E4;
    font-family: "Songti TC";
  }

  .comment_item .comment_item_text {
    color: #444;
    margin-top: 10px;
  }
</style>
