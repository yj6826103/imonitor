<template>
  <div class="spreadAnalyze" id="spreadAnalyze">
    <div class="title-bar" id="title-bar">
      <div>
        <el-autocomplete placeholder="请输入文章标题"
                         v-model="searchResult"
                         style="margin-left: 20px;margin-top: 8px;"
                         suffix-icon="el-icon-search"
                         :trigger-on-focus="false"
                         :fetch-suggestions="articleSearch"
                         @select="articleSearchSelect">
        </el-autocomplete>
        <el-date-picker
          style="margin-left: 20px;margin-top: 8px;"
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="传播开始日期"
          end-placeholder="传播结束日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </div>
      <span>
       {{articleTitle}}
      </span>
    </div>
    <div id="analyze" class="analyze">
    </div>
    <div class="explain">圆圈直径越大表示其传播能力越强。线条越短表示转载时间越早，线条越粗表示相似度越高。</div>
  <div class="add-button bgc_base" @click="openAddPage">添加</div>
  </div>
</template>

<script>

  import echarts from 'echarts'

  export default {
    name: "spread-content",
    components: {},
    data() {
      return {
        value6: '',
        notShowMessage: false,
        echartsObj: null,
        value7: '',
        value1: '',
        article: [],
        platformTypeId: "",
        articleId: "",
        articleTitle: "",
        searchResult: '',
        timeCode: -1,
        pickerOptions: {
          disabledDate: function (data) {
            return new Date().getTime() < data.getTime()
          },
        },
      };
    },
    watch: {
      value1(curVal, oldVal) {
        if (this.value1 == null) {
          this.getArticleDetails();
        }
        if (this.value1 && this.value1.length > 1 && this.articleId && this.platformTypeId) {
          this.getArticleDetails();
        }
      },
    },
    methods: {

      handleError(message) {
        if (this.notShowMessage) {
          this.notShowMessage = false
          return
        }
        this.$message({
          duration: 1500,
          message: message
        });
        if (this.echartsObj) {
          this.echartsObj.clear()
        }
        this.articleTitle = ""
      },
      openAddPage(){
        window.open("/addArticle")
      },
      articleSearch(queryString, callback) {
        if (this.timeCode != -1) {
          clearTimeout(this.timeCode)
        }
        var params = {
          title: this.searchResult
        }
        var thiz = this
        this.timeCode = setTimeout(function () {
          thiz.$http.get(thiz.baseUrl + "/article/pagerank/search", {params: params}).then(function (res) {
            var data = typeof res.body === "object" ? res.body : JSON.parse(res.body);
            var result = []
            if (data.code == 200 && data.data.length > 0) {
              for (var i = 0; i < data.data.length; i++) {
                result.push({
                  value: data.data[i].title,
                  address: data.data[i].media_id + "&&" + data.data[i].origin_app
                })
              }
              callback(result)
            } else {
              callback([])
              this.handleError("没有匹配结果")
            }
          }, function (err) {
            callback([])
            this.handleError("请求错误，请稍后尝试")
          })
        }, 200)
      },
      articleSearchSelect(item) {
        this.articleId = item.address.split("&&")[0]
        this.platformTypeId = item.address.split("&&")[1]
        this.getArticleDetails();
      },
      pushArticleList(linkedList, categories) {
        var article = [];
        for (var i = 0; i < linkedList.length; i++) {
          var name = linkedList[i].reportSource == null || linkedList[i].reportSource == "" ? "未知媒体" + i : linkedList[i].reportSource;
          article.push({
            reportSource: name,
            pageRank: linkedList[i].pageRank,
            id: linkedList[i].id,
            title: linkedList[i].title == null ? "未知标题" : linkedList[i].title,
            size: linkedList[i].pageRank,
            length: (linkedList[i].publishTime - new Date().getTime()),
            realLength: 0,
            realSize: 0,
            categories: linkedList[i].mediaType == null ? 5 : linkedList[i].mediaType,
            x: 0,
            y: 0,
            angle: 0,
            relativeScore: linkedList[i].relativeScore == null ? 0 : linkedList[i].relativeScore,
            lineWidth: 0,
          })
        }
        return article;
      },
      getUnitLengthGap(article, lengthRange) {
        var compare = function (val1, val2) {
          return val2.length - val1.length;
        };
        article.sort(compare);
        var maxLength = article[0].length
        compare = function (val1, val2) {
          return val1.length - val2.length;
        };
        article.sort(compare);
        var minLength = article[0].length
        var lengthGap = Math.abs(maxLength - minLength);
        return lengthRange == 0 ? 1 : lengthRange / lengthGap
      },
      getUnitLineWidthGap(article, lineWidthRange) {
        var compare = function (val1, val2) {
          return val2.relativeScore - val1.relativeScore;
        };
        article.sort(compare);
        var maxWidth = article[0].relativeScore
        compare = function (val1, val2) {
          return val1.relativeScore - val2.relativeScore;
        };
        article.sort(compare);
        var minWidth = article[0].relativeScore
        var widthGap = Math.abs(maxWidth - minWidth);
        return widthGap === 0 ? 1 : lineWidthRange / widthGap;
      },
      getUnitSizeGap(article, widthRange) {
        var compare = function (val1, val2) {
          return val2.size - val1.size;
        };
        article.sort(compare);
        var maxSize = article[0].size
        compare = function (val1, val2) {
          return val1.size - val2.size;
        };
        article.sort(compare);
        var minSize = article[0].size
        var sizeGap = Math.abs(maxSize - minSize);
        return sizeGap === 0 ? 1 : widthRange / sizeGap;
      },
      getUnitAngle(article, teamSpaceCoefficient) {
        var sum = 0;
        for (var i = 0; i < article.length; i++) {
          var articleSingle = article[i]
          var articleSize = 2 * Math.atan(articleSingle.realSize / 2 / articleSingle.realLength)
          sum += articleSize;
        }
        return (2 * Math.PI * (1 - teamSpaceCoefficient)) / sum
      },
      groupingByCategories(article) {
        var compare = function (val1, val2) {
          return val1.categories - val2.categories;
        };
        article.sort(compare);
      },
      computeRealSize(article, unitSizeGap) {
        var compare = function (val1, val2) {
          return val1.size - val2.size;
        };
        article.sort(compare);
        var minSize = article[0].size
        for (var i = 0; i < article.length; i++) {
          var articleSingle = article[i]
          articleSingle.realSize = unitSizeGap === 1 ? 10 : 15 + (articleSingle.size - minSize) * unitSizeGap
        }
      },
      computeLineWidth(article, unitLineWidthGap, baseWidthRange) {
        var compare = function (val1, val2) {
          return val2.relativeScore - val1.relativeScore;
        };
        article.sort(compare);
        var maxLength = article[0].relativeScore
        for (var i = 0; i < article.length; i++) {
          var articleSingle = article[i]
          articleSingle.lineWidth = unitLineWidthGap === 1 ? 15 : baseWidthRange + Math.abs((maxLength - articleSingle.relativeScore) * unitLineWidthGap);
        }
      },
      computeRealLength(article, unitLengthGap, baseLength) {
        var compare = function (val1, val2) {
          return val2.length - val1.length;
        };
        article.sort(compare);
        var maxLength = article[0].length
        for (var i = 0; i < article.length; i++) {
          var articleSingle = article[i]
          articleSingle.realLength = unitLengthGap === 1 ? 300 : baseLength + Math.abs((maxLength - articleSingle.length) * unitLengthGap);
        }
      },
      secondCompute(article, unitAngle, looseCoefficient) {
        for (var i = 0; i < article.length; i++) {
          var angle = 2 * Math.atan(article[i].realSize / 2 / article[i].realLength) * unitAngle
          article[i].angle = angle
          var size = article[i].realLength * 2 * (Math.tan(angle / 2))
          // article[i].realSize = size
        }
      },
      computeCoordinate(article, categories, teamSpaceCoefficient) {
        var teamSpace = 2 * Math.PI * teamSpaceCoefficient / categories.length
        var angleTotal = 0
        var categoryIndex = 0
        for (var i = 0; i < article.length; i++) {
          var articleSingle = article[i]
          var angle = articleSingle.angle
          if (articleSingle.categories !== categoryIndex) {
            angleTotal = angleTotal + teamSpace
            categoryIndex = articleSingle.categories
          }
          article[i].x = Math.sin(angleTotal) * articleSingle.realLength
          article[i].y = Math.cos(angleTotal) * articleSingle.realLength
          angleTotal = angleTotal + angle
        }
      },
      getArticleNum(article) {
        var category = -1;
        var num = 0;
        for (var i = 0; i < article.length; i++) {
          if (article[i].categories != category) {
            category = article[i].categories
            num++
          }
        }
        return num
      },
      /**
       * 将文章数据转换成节点坐标的主要计算过程
       * 主要是将文章的各个维度通过计算映射成节点的X Y坐标
       * 文章的转载时间对应原始文章 转载文章之间的距离 length
       * 文章的影响力 代表节点的大小 size或者width
       * 文章的相似度 代表关系线的粗细
       * 通过以上三个维度计算出节点的位置 以及关系线的粗细 节点位置主要是通过文章影响力及文章转载时间计算的
       * 坐标大致的计算逻辑
       * 通过原始数据进行第一次计算 将文章的相关维度转化成一个范围内的具体数值（距离，尺寸）
       * 知道距离尺寸后 根据asin（（width/2/)length）函数计算每个节点的圆所占的圆心角弧度
       * 计算所有节点的弧度总和 allRadian
       * 通过组间距系数判读出可供划分的圆心角弧度2PI*（1-组间距系数） 组间距系数越大则每组数据间隔越大
       * 通过allRadian 和实际可用的角度 等比例的计算出角度转化系数（实际可用的角度/allRadian）
       * 然后进行二次计算
       * 实际的节点所占弧度 = asin（（width/2/)length）* 角度转化系数*（1-松散系数）  （松散系数越大则越稀疏松散 0 — 1）
       * 知道实际所占弧度后 分为两种情况
       * 如果角度转化系数>1 说明节点比较少 比较稀疏则需要放大节点 放大节点时 length不变 width变大
       * 如果角度转化系数<1 说明节点比较多 比较秘籍则需要缩小节点 缩小节点时 length增长 width不变
       * 到此二次计算计算完毕
       * 然后进行打散计算
       * 在坐标系中节点相对圆点进行随机的转动（距离不变 圆心角随机变动）
       * 变动过程 首先对该组数据根据length范围进行分组 如果同一组的数据过多 圆心角占据了该组圆心角的50%以上则不进行打散
       * 其次将需要打散的圆从集合中抽出然后随机进行圆心角改变然后进行重叠计算
       * 重叠计算规则 两个圆的圆心距离不能超过两个圆的直径的（1/松散系数）倍
       * 如果果重叠则再次随机直到不重叠 或者五次以后还是重叠的话则直接放到该组数据区外 顺时针放置
       * 打散结束后 Y值不变 X值乘以屏幕宽高比的80%进行压扁
       * 计算结束
       *
       * 第二次计算完毕后 发现length和width不在一个坐标系 width是真是的物理坐标 length的坐标是虚拟坐标 并且没有转换关系 放弃计算！ fuck！！！！
       *
       * */
      getNoeds(categories, linkedList, center) {
        //width和length左边单位换算关系
        var widthRange = 30
        //圆的尺寸范围
        var widthRange = 30
        //线条宽细范围
        var lineWidthRange = 8
        //线条宽细范围
        var baseWidthRange = 5
        //距离原始文章的距离范围
        var lengthRange = 20
        //距离基数
        var baseLength = 50
        //长度系数，第二次计算时使用
        var lengthCoefficient = 0
        //尺寸系数，第二次计算时使用
        var widthCoefficient = 0
        //松散系数
        var looseCoefficient = 0.7
        var nodes = [];
        var article = this.pushArticleList(linkedList, categories);
        //组间距系数
        var teamSpaceCoefficient = this.getArticleNum(article) == 1 ? 0.1 : 0.4
        var unitLengthGap = this.getUnitLengthGap(article, lengthRange);
        var unitSizeGap = this.getUnitSizeGap(article, widthRange);
        var unitLineWidthGap = this.getUnitLineWidthGap(article, lineWidthRange);
        this.computeRealSize(article, unitSizeGap);
        this.computeRealLength(article, unitLengthGap, baseLength);
        this.computeLineWidth(article, unitLineWidthGap, baseWidthRange);
        var unitAngle = this.getUnitAngle(article, teamSpaceCoefficient);
        this.secondCompute(article, unitAngle);
        this.groupingByCategories(article);
        this.computeCoordinate(article, categories, teamSpaceCoefficient);
        var title = "";
        for (var i = 0; i < center.title.length / 12; i++) {
          title += (center.title.substr(12 * i, 12) + "\n")
        }
        nodes.push({
          name: title,
          symbol: "circle",
          symbolSize: 50,
          x: 0,
          y: 0,
          tooltip: {
            show: false
          },
          itemStyle: {
            color: "#4740FF"
          },
          label: {
            formatter: [
              '{a|' + title + '}',
            ].join('\n'),
            rich: {
              a: {
                lineHeight: 16
              }
            }
          },
        })
        for (var i = 0; i < article.length; i++) {
          nodes.push({
            name: article[i].id,
            category: article[i].categories-1,
            symbol: "circle",
            symbolSize: article[i].realSize,
            x: article[i].x * 1.5,
            y: article[i].y,
            label: {
              show: article[i].realSize > 10,
              formatter: [
                '{a|' + article[i].reportSource + '}',
              ].join('\n'),
              rich: {
                a: {
                  lineHeight: 14
                }
              }
            },
            tooltipContent: article[i].title + "</br>" + "转载媒体: " + article[i].reportSource + "</br>" + "传播力: " + article[i].pageRank,
            edgeLabel: {
              show: true
            },
            tooltip: {
              // formatter: article[i].title + "</br>" + "转载媒体: " + article[i].reportSource + "</br>" + "传播力: " + article[i].pageRank,
              formatter: (params, ticket, callback) => {
                if (!params.data.source) {
                  return params.data.tooltipContent;
                }
              },
              backgroundColor: "#fff",
              position: "left",
              borderColor: "rgba(0,0,0,0.4)",
              borderWidth: 1,
              padding: 13,
              textStyle: {
                color: "#444444",
                lineHeight: 29,
                fontSize: 12
              }
            }
          })
        }
        this.article = article;
        return nodes
      },
      getLinks(linkedList, title) {
        var article = this.article;
        var link = []
        var title1 = "";
        for (var i = 0; i < title.length / 12; i++) {
          title1 += (title.substr(12 * i, 12) + "\n")
        }
        for (var i = 0; i < linkedList.length; i++) {
          link.push({
            source: title1,
            target: linkedList[i].id,
            emphasis: {
              lineStyle: {
                width: article[i].lineWidth
              },
            },

          })
        }
        return link
      },
      getArticleDetails() {
        if (!(this.platformTypeId && this.articleId)) {
          return
        }
        var analyzeDom = document.getElementById("analyze");
        var barChart = echarts.init(analyzeDom);
        var categories = [];
        var params = {
          "platformTypeId": this.platformTypeId,
          "articleId": this.articleId
        }
        if (this.value1 && this.value1.length > 1) {
          var statTime = this.value1[1].getTime();
          var endTime = this.value1[0].getTime();
          // [0].getYear()) + "/" + (this.value1[0].getMonth() + 1) + "/" + this.value1[0].getDay() + " 00:00:00"
          // var statTime = (1900 + this.value1[1].getYear()) + "/" + (this.value1[1].getMonth() + 1) + "/" + this.value1[1].getDay() + " 00:00:00"
          params.startTime = statTime
          params.endTime = endTime
        }
        var thiz = this
        this.$http.get(this.baseUrl + "/article/pagerank/detonation", {params: params}).then(function (res) {
          // this.$http.get("http://127.0.0.1:8020/HelloHBuilder/test.json", {params: params}).then(function (res) {

          categories[0] = {name: '官方媒体'};
          categories[1] = {name: '政府网站'};
          categories[2] = {name: '商业媒体'};
          categories[3] = {name: '自媒体'};
          categories[4] = {name: '国外媒体'};
          categories[5] = {name: '其他'};
          var response = JSON.parse(res.bodyText)
          if (response.code == 200) {
            if (response.data.center == null) {
              this.handleError("暂无该篇文章传播分析")
              return
            }
            if (response.data.linkedList == null || response.data.linkedList.length == 0) {
              this.handleError("暂无该篇文章传播分析")
              return
            }
            localStorage.setItem("platformTypeId", this.platformTypeId)
            localStorage.setItem("articleId", this.articleId)
            this.articleTitle = response.data.center.title;
            try {
              var nodes = this.getNoeds(categories, response.data.linkedList, response.data.center);
              var link = this.getLinks(response.data.linkedList, response.data.center.title);
              this.notShowMessage = false
            } catch (error) {
              this.handleError("数据解析失败")
            }
            var option = {
              color: ['#00C7FF', '#44DC2F', '#FFD642', '#FD933F', '#FE5858', '#999999'],
              title: {
                top: 'bottom',
                left: 'right'
              },
              label: {
                show: true,
                position: 'right',
                formatter: '{b}'
              },
              tooltip: {},
              legend: [{
                // selectedMode: 'single',
                right: 0,
                bottom: 20,
                title: "",
                orient: "vertical",
                data: categories.map(function (a) {
                  return a.name;
                })
              }],
              animationDuration: 1500,
              animationEasingUpdate: 'quinticInOut',
              series: [
                {
                  text: "",
                  type: 'graph',
                  layout: 'none',
                  data: nodes,
                  links: link,
                  categories: categories,
                  roam: true,
                  focusNodeAdjacency: true,
                  itemStyle: {
                    normal: {
                      borderColor: '#fff',
                      borderWidth: 1,
                      shadowBlur: 10,
                      shadowColor: 'rgba(0, 0, 0, 0.3)'
                    }
                  },
                  label: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                  },
                  lineStyle: {
                    color: 'target',
                    curveness: 0.3
                  },
                  emphasis: {
                    lineStyle: {
                      width: 10
                    }
                  }
                }
              ]
            };
            this.echartsObj = barChart
            barChart.setOption(option);
          } else {
            this.handleError("请求错误，请稍后尝试")
          }
        }, function (err) {
          thiz.handleError("请求错误，请稍后尝试")
        })

      }
    },
    mounted() {
      var spreadAnalyzeDom = document.getElementById("spreadAnalyze")
      var titleDom = document.getElementById("title-bar")
      var analyzeDom = document.getElementById("analyze");
      analyzeDom.style.height = spreadAnalyzeDom.offsetHeight - titleDom.offsetHeight - 30 + "px"
      this.platformTypeId = this.$route.query.platformTypeId
      this.articleId = this.$route.query.articleId
      if (!(this.platformTypeId && this.articleId)) {
        this.notShowMessage = true
        this.platformTypeId = localStorage.getItem("platformTypeId")
        this.articleId = localStorage.getItem("articleId")
        if (!(this.platformTypeId && this.articleId)) {
          this.platformTypeId = ""
          this.articleId = ""
        }
      }
      this.getArticleDetails();
    }
  }
</script>

<style scoped>

  .spreadAnalyze {
    height: 100%;
  }

  .spreadAnalyze .title-bar {
    text-align: center;
    height: 40px;
    line-height: 40px;
  }

  .spreadAnalyze .title-bar div {
    float: left;
  }

  .spreadAnalyze .title-bar span {
    float: right;
    /* font-size: 18px; */
    font-weight: bold;
    margin-right: 60px;
    max-width: 600px;
  }

  .spreadAnalyze .analyze {
    padding-left: 5%;
    padding-right: 5%;
    width: 90%;
  }

  .spreadAnalyze .explain {
    height: 30px;
    line-height: 30px;
    text-align: center;
  }

  .spreadAnalyze >>> .el-input__inner {
    width: 300px;
    border-radius: 50px;
  }
  .spreadAnalyze .add-button {
    cursor: pointer;
    height: 34px;
    line-height: 34px;
    /* font-size: 16px; */
    text-align: center;
    width: 80px;
    color: white;
    border-radius: 10px;
    top: 10px;
    right: 40px;
    position: absolute;
  }

</style>
