<template>
  <div class="testContentPage">

    <div style="width: 100%" v-if="timeLineData">
      <TimeLine :data="timeLineData"></TimeLine>
    </div>

  </div>
</template>

<script>

  import TimeLine from '../common/ZCTimeLine'

  export default {
    name: "test-content",
    components: {TimeLine},
    data() {
      return {
        timeLineData: null
      }
    },
    methods:{

      loadData(){
        let params = {unionId:'1_180815145_7126225'};

        this.$http.get(this.baseUrl + '/article/distribute', {params: params}).then(function (res) {
          let response = JSON.parse(res.bodyText);
          console.log('传播路径图数据返回');
          console.log(response);
          if (response.code == 200 && response.data) {

            this.timeLineData = response.data;
          }
        }, function (err) {
          //this.zc_log('传播地域分析数据失败');
          //this.zc_log(err);
        })
      }
    },
    mounted() {

      this.loadData();

      let res = {
        code: 200,
        message: "success",
        data: {
          links: [
            {source: "", target: "inews"},
            {source: "新华社", target: "央广网"},
            {source: "新华社", target: "人民网头条"},
            {source: "新华网", target: "中国经济网-头条"},
            {source: "新华通讯社", target: "凤凰网"},
            {source: "新华通讯社", target: "凤凰新闻"},
            {source: "观察者网", target: "凤凰网"},
            {source: "新华网", target: "新民网-时政"},
            {source: "新华网", target: "网易-首页-新闻（要闻）"},
            {source: "搜狐新闻", target: "搜狐头条"},
            {source: "新华社", target: "腾讯滚动"},
            {source: "新华网", target: "凯风网"},
            {source: "新华社", target: "红网"},
            {source: "澎湃新闻网", target: "凤凰网"},
            {source: "新华社", target: "南海网"},
            {source: "新华网", target: "河南一百度"},
            {source: "新华网", target: "新华网头条"},
            {source: "新华网", target: "环球网头条"},
            {source: "舆情", target: "上观新闻"},
            {source: "新华社", target: "新浪"},
            {source: "新华社", target: "东方网"},
            {source: "新华社", target: "央广网-头条"},
            {source: "法制网", target: "凤凰网"},
            {source: "新华网", target: "洛阳网"},
            {source: "新华社", target: "新浪新闻"},
            {source: "来源：新华社责任编辑：杨一楠2018-08-1522:21", target: "中华人民共和国国防部"}
          ],
          array01: [
            {name: "inews"},
            {name: "爆发点"},
            {name: "传播点"}
          ],
          categories: [
            {name: "inews", category: "inews"},
            {name: "澎湃新闻网", category: "传播点"},
            {name: "搜狐新闻", category: "传播点"},
            {name: "法制网", category: "传播点"},
            {name: "来源：新华社责任编辑：杨一楠2018-08-1522:21", category: "传播点"},
            {name: "新华社", category: "爆发点"},
            {name: "新华通讯社", category: "传播点"},
            {name: "新华网", category: "爆发点"},
            {name: "观察者网", category: "传播点"},
            {name: "舆情", category: "传播点"},
            {name: "中华网", category: "传播点"},
            {name: "21世纪财搜网", category: "传播点"},
            {name: "日照广播电视台日照网", category: "传播点"},
            {name: "南方网", category: "传播点"},
            {name: "长春新闻网", category: "传播点"},
            {name: "河北日报", category: "传播点"},
            {name: "央视网-滚动新闻", category: "传播点"},
            {name: "飞天新传媒", category: "传播点"},
            {name: "中国法院网", category: "传播点"},
            {name: "文汇报", category: "传播点"},
            {name: "宁夏广播电视总台", category: "传播点"},
            {name: "网易-首页-新闻（要闻）", category: "传播点"},
            {name: "南海网", category: "传播点"},
            {name: "东北网", category: "传播点"},
            {name: "中华人民共和国国防部", category: "传播点"},
            {name: "晋江新闻网", category: "传播点"},
            {name: "井冈山报社", category: "传播点"},
            {name: "呼和浩特市政府信息网", category: "传播点"},
            {name: "中国人民政治协商会议大理州委员会", category: "传播点"},
            {name: "央视网", category: "传播点"},
            {name: "人民网头条", category: "传播点"},
            {name: "张家口新闻网", category: "传播点"},
            {name: "齐鲁网", category: "传播点"},
            {name: "金羊网", category: "传播点"},
            {name: "凤凰新闻", category: "传播点"},
            {name: "内蒙古自治区扶贫开发（革命老区建设）办公室", category: "传播点"},
            {name: "人民网", category: "传播点"},
            {name: "光明网", category: "传播点"},
            {name: "中国常德", category: "传播点"},
            {name: "凯风网", category: "传播点"},
            {name: "怀化新闻网", category: "传播点"},
            {name: "新浪", category: "传播点"},
            {name: "江苏网络电视台", category: "传播点"},
            {name: "央广网", category: "传播点"},
            {name: "中国经济网-头条", category: "传播点"},
            {name: "深圳新闻网", category: "传播点"},
            {name: "金山网", category: "传播点"},
            {name: "河南一百度", category: "传播点"},
            {name: "最高人民法院", category: "传播点"},
            {name: "沭阳网", category: "传播点"},
            {name: "亳州新闻网", category: "传播点"},
            {name: "红山网", category: "传播点"},
            {name: "吉林电视网", category: "传播点"},
            {name: "腾讯滚动", category: "传播点"},
            {name: "中国新闻网", category: "传播点"},
            {name: "上观新闻", category: "传播点"},
            {name: "新蓝网", category: "传播点"},
            {name: "北方网", category: "传播点"},
            {name: "中青在线", category: "传播点"},
            {name: "桐庐新闻", category: "传播点"},
            {name: "中国网", category: "传播点"},
            {name: "海南在线", category: "传播点"},
            {name: "大洋网", category: "传播点"},
            {name: "黄河新闻网", category: "传播点"},
            {name: "三秦都市报网", category: "传播点"},
            {name: "东南网", category: "传播点"},
            {name: "正北方网", category: "传播点"},
            {name: "内蒙古电视台", category: "传播点"},
            {name: "忻州市人民政府", category: "传播点"},
            {name: "新华网-滚动新闻", category: "传播点"},
            {name: "环球网头条", category: "传播点"},
            {name: "搜狐头条", category: "传播点"},
            {name: "新华网头条", category: "传播点"},
            {name: "邵东县人民政府", category: "传播点"},
            {name: "红网", category: "传播点"},
            {name: "福州新闻网", category: "传播点"},
            {name: "玄武党建", category: "传播点"},
            {name: "央广网-头条", category: "传播点"},
            {name: "新浪新闻", category: "传播点"},
            {name: "绥江县人民政府 官方网站", category: "传播点"},
            {name: "人民政协网", category: "传播点"},
            {name: "东方网", category: "传播点"},
            {name: "海口晚报网", category: "传播点"},
            {name: "中华人民共和国环境保护部", category: "传播点"},
            {name: "华龙网", category: "传播点"},
            {name: "杭州网", category: "传播点"},
            {name: "中国抚州网", category: "传播点"},
            {name: "中国西藏网", category: "传播点"},
            {name: "21经济网", category: "传播点"},
            {name: "新民网-时政", category: "传播点"},
            {name: "呼和浩特新闻网", category: "传播点"},
            {name: "洛阳网", category: "传播点"},
            {name: "青岛网络电视台", category: "传播点"},
            {name: "凤凰网", category: "传播点"},
            {name: "澎湃", category: "传播点"},
            {name: "中国经济网", category: "传播点"},
            {name: "长春电视台", category: "传播点"},
            {name: "21CN", category: "传播点"}
          ],
          startTime:'2018/08/01 00:00',
          endTime:'2018/08/05 00:00'
        }
      };


    }
  }
</script>

<style scoped>

  .testContentPage {
    width: 100%;
    height: 100%;
  }

</style>
