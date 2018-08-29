<template>
  <div class="overView"
       style="height:calc(100%-5px);"
       id="overView">
    <div class="platform_content">
      <div class="platform_collapse">
        <div class="block">
          <div class="title">选择平台</div>
          <span class="title-hint" id="title-hint">最多可勾选三个平台进行对比</span>

          <div class="right-search" v-if="chooseIsShow">
            <el-autocomplete
              v-model="state4"
              ref="input"
              :fetch-suggestions="querySearchAsync"
              :trigger-on-focus="false"
              placeholder="输入平台名称"
              :disabled="disabled"
              @select="handleSelect"
            ></el-autocomplete>
            <i class="el-icon-search search-icon" />
          </div>
          <div class="right-box" v-if="!chooseIsShow">
            <span class="has-choose-title" v-show="chooseIsShow&&selectItemData&&selectItemData.length>0">已选平台:</span>
            <span v-for="(item,index) in selectItemData" class="has-choose-close" v-if="!chooseIsShow">{{getSelectListItemName(item.name)}}
                </span>
            <span class="clear-choose" @click="clearChoose" v-show="selectItemData&&selectItemData.length>0">清空</span>

          </div>
          <div class="has-choose-box">
            <span class="has-choose-title" v-if="selectItemData&&selectItemData.length>0">已选平台:</span>
            <span v-for="(item,index) in selectItemData" class="has-choose" v-if="chooseIsShow">{{getSelectListItemName(item.name)}}
                      <i class="choose_close" @click="deleteItem(index)" />
                </span>


            <span class="clear-choose" @click="clearChoose" v-show="selectItemData&&selectItemData.length>0"
                  v-if="chooseIsShow">清空</span>
          </div>
        </div>
        <chooseOptionList :listData="itemData" @selectListener="selectListener" ref="chooseOptionList"
                          :maxChoose="3"
                          :exceedMaxListener="exceedMaxListener"
                          v-show="chooseIsShow"/>
        <i class="el-icon-caret-bottom arrow" @click="changeChoose()" v-if="!chooseIsShow"></i>
        <i class="el-icon-caret-top arrow" @click="changeChoose()" v-if="chooseIsShow"></i>
        <div class="execute-comparison" v-if="chooseIsShow"><span @click="add()">对比统计</span></div>
      </div>
      <div class="table-box" id="table-box">
        <div v-for="(item,index) in tableData" :class="index%2==1?'table-right-box':'table-left-box'">
          <div class="table-title" :class="index%2==0?'':'table-title-right'">{{item.title}}</div>
          <barChart :height="400"
                    :idName="'ptzzph'+(index+'')"
                    :chartData="item.data"
                    :options="{direction:'horizontal'}">
          </barChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import barChart from '@/components/common/ZCChartsBar'
  import chooseOptionList from '@/components/Customization/chooseOptionList.vue'

  export default {
    name: "platform-content1",
    components: {chooseOptionList, barChart},
    props: {
      isGroupPlantform: {type: Boolean, require: true},
      plantformId: {type: String / Number, require: true},
      datePickerParams: {type: Object, require: true},
    },
    data() {
      return {
        itemData: null,
        disabled: false,
        chooseIsShow: true,
        state4: '',
        restaurants: [],
        //当前处于展开状态
        isActive: true,
        selectItemData: [],
        tableData: [],
        // 被选中平台列表最大值
        platformsMax: 3,
        //下拉菜单选中的平台名称
        recommendSelected: '',
        timeCodeColor: -1,
        timeCodeDD: -1,
        startTime: "",
        accountType: ""
      }
    },
    watch: {
      selectItemData(curVal, oldVal) {
        if (this.selectItemData.length == 3 || this.selectItemData.length > 3) {
          this.disabled = true
        } else {
          this.disabled = false
        }
      },
      datePickerParams(oldData, newData) {
        this.startTime = this.datePickerParams.startTime
        this.accountType = this.datePickerParams.accountType
        if (this.startTime && this.accountType && this.selectItemData.length > 0) {
          this.executeComparison()
        }
      },

    },
    methods: {
      add() {
        if (this.selectItemData.length < 2) {
          this.alert('至少选择两个平台才可以进行对比');
          return
        }
        var thiz = this
        var url = this.baseUrl + '/platform/compared/add?'
        var parames = ""
        for (var i = 0; i < this.selectItemData.length; i++) {
          parames = parames + "&" + "platformIdList=" + this.selectItemData[i].id
        }
        parames=parames.substr(1,parames.length)
        url=url+parames
        this.$http.get(url).then(function (res) {
          var response = JSON.parse(res.bodyText)
          if (response.code != "200" || response.code != 200) {
            thiz.$message({"message": "参数错误，请重试！"})
            return
          } else {
            thiz.executeComparison()
          }
        }, function (err) {
          thiz.$message({message: '请求错误'});
        })
      },
      executeComparison() {
        var thiz = this
        var params = {
          today: this.startTime,
          accountType: this.accountType
        }
        this.$http.get(this.baseUrl + '/platform/compared/find', {params: params}).then(function (res) {
          var response = JSON.parse(res.bodyText)

          if (response.code != "200" || response.code != 200) {
            thiz.$message({"message": "参数错误，请重试！"})
            return
          }
          if(thiz.chooseIsShow){
            thiz.changeChoose()
          }
          response = response.data
          var array = []
          if(response&&response.length>0){
            for(var i =0 ;i<thiz.selectItemData.length;i++){
              for(var j =0 ;j<response.length;j++){
                if(response[j].platformId==thiz.selectItemData[i].id){
                  array.push(response[j])
                }
              }
            }
            response =array
          }
          var data = []
          var names = [{
            name: "作品数对比",
            paramsName: "articleNum"
          }, {
            name: "阅读数对比",
            paramsName: "readNum"
          }, {
            name: "转载数对比",
            paramsName: "transNum"
          }, {
            name: "收藏数对比",
            paramsName: "collectNum"
          }, {
            name: "分享数对比",
            paramsName: "shareNum"
          }, {
            name: "评论数对比",
            paramsName: "commentNum"
          }, {
            name: "点赞数对比",
            paramsName: "appriseNum"
          }, {
            name: "打赏数对比",
            paramsName: "awardNum"
          }]
          for (var i = 0; i < names.length; i++) {
            var item = {}
            item.title = names[i].name
            var categoryArr = []
            var valueArr = []
            valueArr.push({})
            valueArr[0].name = item.title.slice(0, item.title.length - 2)
            valueArr[0].value = []
            for (var j = 0; j < response.length; j++) {
              var value = response[j][names[i].paramsName]
              categoryArr.push(response[j].platformName)
              value = value ? value : 0
              valueArr[0].value.push(value)
            }
            item.data = {
              categoryArr: categoryArr,
              valueArr: valueArr
            }
            data.push(item)
          }
          thiz.tableData = data
        }, function (err) {
          thiz.$message({message: '请求错误'});
        })
      },
      exceedMaxListener() {
        if (this.timeCodeDD != -1) {
          clearTimeout(this.timeCodeDD)
        }
        if (this.timeCodeColor != -1) {
          clearTimeout(this.timeCodeColor)
        }
        document.getElementById("title-hint").style.color = "red"
        document.getElementById("title-hint").classList.add("dd");
        this.timeCodeDD = setTimeout(function () {
          document.getElementById("title-hint").classList.remove("dd");
        }, 1000)
        this.timeCodeColor = setTimeout(function () {
          document.getElementById("title-hint").style.color = "#dddddd"
        }, 5000)

      },
      clearChoose() {
        if (this.selectItemData.length == 0) {
          return
        }
        this.chooseIsShow=true
        this.selectItemData = []
        this.$refs.chooseOptionList.clear()
      },
      changeChoose() {
        this.chooseIsShow = !this.chooseIsShow
      },

      deleteItem(index) {
        var item = this.selectItemData[index]
        this.$refs.chooseOptionList.deleteItem(item)
        for (var i = 0; i < this.selectItemData.length; i++) {
          if (this.selectItemData[i].id == item.id) {
            this.selectItemData.splice(i, 1);
          }
        }
      },
      querySearchAsync(queryString, cb) {
        queryString = this.trimAll(queryString)
        // if(queryString.length==0){
        //   return
        // }
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        if (!results || results.length == 0) {
          results = [{
            value: "无相关结果",
            id: ""
          }]
        }
        cb(results);
      },
      getSelectListItemName(name) {
        return name.length > 12 ? name.slice(0, 11) + "..." : name
      },
      //获取上一次的对比平台，并且进行对比
      initData() {
        var thiz = this
        this.$http.get(this.baseUrl + "/platform/compared/group", ).then(function (res) {
          var response = JSON.parse(res.bodyText)
          if (response.code != "200" || response.code != 200) {
            thiz.$message({"message": "参数错误，请重试！"})
            return
          }
          if( response.data.length>1){
            for (var i = 0; i < response.data.length; i++) {
              thiz.$refs.chooseOptionList.selectItemById(response.data[i].platformId)
            }
            thiz.changeChoose()
            thiz.executeComparison()
          }
        }, function (err) {
        })
      },

      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        this.state4 = ""
        if(item.id==""){
          return
        }
        this.$refs.chooseOptionList.selectItemById(item.id)
      },
      selectListener(item) {
        if (item.choose) {
          this.selectItemData.push(item)
        } else {
          for (var i = 0; i < this.selectItemData.length; i++) {
            if (this.selectItemData[i].id == item.id) {
              this.selectItemData.splice(i, 1);
              return
            }
          }
        }
      },
      getItemDate() {
        var params = {
          pageNo: 1,
          pageSize: 100,
        }
        var thiz = this
        this.$http.get(this.baseUrl + "/platform/find", {params: params}).then(function (res) {
          var response = JSON.parse(res.bodyText)
          if (response.code != 200) {
            thiz.$message({message: '请求错误'});
            return
          }
          var items = response.data.content
          thiz.itemData = []
          for (var i = 0; i < items.length; i++) {
            var item = items[i]
            var flag = -1;
            for (var j = 0; j < thiz.itemData.length; j++) {
              if (thiz.itemData[j].platformTypeId == item.platformTypeId) {
                thiz.itemData[j].items.push(item)
                flag = 1
                break
              }
            }
            if (flag == -1) {
              thiz.itemData.push(
                {
                  name: item.platformTypeName,
                  platformTypeId: item.platformTypeId,
                  items: [item]
                }
              )
            }
          }
          thiz.restaurants = []
          for (var i = 0; i < thiz.itemData.length; i++) {
            for (var j = 0; j < thiz.itemData[i].items.length; j++) {
              var name = thiz.itemData[i].items[j].name
              var id = thiz.itemData[i].items[j].id
              thiz.restaurants.push({
                value: name,
                id: id
              })
            }
          }
          this.initData()
        }, function (err) {
          thiz.$message({message: '请求错误'});
        })
      },
      //头部折叠响应方法
      collapseHeaderClick(event) {
        if (event.target.className.indexOf('platform_collapse_header') >= 0 ||
          event.target.className.length == 0 ||
          event.target.className.indexOf('arrow') >= 0) {
          this.isActive = !this.isActive;
        }
      },

      //已选平台块点击事件
      selectedItemClick(index) {
        if (this.isActive) {
          //删除从index开始第1个元素,即为删除第index个元素
          this.$refs.chooseOptionList.deleteItem(this.selectItemData[index])
          this.selectItemData.splice(index, 1)
        }

      },

      //已选平台清空按钮点击
      selectedClearClick() {
        this.selectItemData.splice(0, this.selectItemData.length)
        this.selectItemData = []
        this.$refs.chooseOptionList.clear()
      },

      //搜索框方法
      platformSearch(queryString, cb) {
        var recommends = this.recommendsData;
        var results = recommends.filter(this.createFilter(queryString));
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
        };
      },

      //搜索结果推荐点击事件
      platformSearchSelect(item) {
        if (this.platformSelected.length < this.platformsMax) {
          this.platformSelected.push(item.value);
        }
      },

      //搜索框获取焦点事件
      platformSearchFocus() {
        this.recommendSelected = null;
      },


      //用于测试搜索推荐数据
      loadAll() {
        return [
          {"value": "南拳妈妈龙虾盖浇饭", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13"}
        ];
      },
      initInput() {
        var domArray = document.getElementsByClassName("el-input__inner");
        var inputDom = domArray[domArray.length - 1]
        if (window.screen.width > 1919) {
          inputDom.style.width = "350px"
        } else {
          inputDom.style.width = "240px"
        }
      }

    }
    ,

    mounted() {
      // this.recommendsData = this.loadAll();
      this.initInput();
      this.getItemDate();
    },
    created(){
      let data = {
        name:document.title,
        id:"table-box"
      };
      this.registerCreateReportParams(this.$route.path,data)
    }
  }
</script>

<style scoped>

  @import '../../assets/css/platform/platform.css';

  .platform_content .block {
    background-color: #fff;
    border-bottom: 1px #E2E3E4 solid;
    padding-bottom: 10px;
    padding-top: 10px;
    display: inline-block;
    width: 100%;
    overflow: hidden;
    /*margin-top: 5px;*/
  }

  .platform_content .right-search {
    float: left;
    margin-left: 30px;
    height: 28px;
    position: relative;
  }

  .platform_content .title {
    float: left;
    height: 34px;
    line-height: 34px;
    /* font-size: 16px; */
    font-weight: bolder;
    display: inline;
    color: #444;
  }

  .platform_content .execute-comparison {
    text-align: center;
    height: 34px;
    margin-top: 16px;
    margin-bottom: 16px;
    line-height: 34px;
  }

  .platform_content .execute-comparison span {
    background: #3B87F5;
    color: white;
    border-radius: 8px;
    padding-right: 8px;
    padding-left: 8px;
    /* font-size: 12px; */
    padding-bottom: 5px;
    padding-top: 5px;
    cursor: pointer;
  }

  .platform_content .arrow {
    padding-top: 5px;
    color: #3B87F5;
    position: absolute;
    top: 10px;
    /* font-size: 18px; */
    right: 46px;
  }

  .platform_content .title-hint {
    float: left;
    /* font-size: 13px; */
    margin-left: 8px;
    color: #dddddd;
    display: inline-block;
    height: 34px;
    line-height: 34px;
  }

  .platform_content .canClick {
    cursor: pointer;
  }

  .platform_content .clear-choose {
    display: inline-block;
    padding-left: 8px;
    padding-right: 8px;
    margin-left: 20px;
    border: #3B87F5 solid 1px;
    height: 20px;
    line-height: 20px;
    border-radius: 14px;
    margin-top: 6px;
    margin-bottom: 6px;
    color: #3B87F5;
    cursor: pointer;
  }

  .platform_content .has-choose-close {
    color: #3B87F5;
    margin-left: 18px;
    height: 34px;
    margin-top: 6px;
    margin-bottom: 6px;
    line-height: 20px;
    /*float: right;*/
  }

  .platform_content .right-box {
    float: right;
    margin-right: 30px;
  }

  .platform_content .has-choose-title {
    display: inline-block;
    color: #444444;
    height: 20px;
    margin-top: 6px;
    margin-bottom: 6px;
    line-height: 20px;
    /* font-size: 15px; */
    /*float: right;*/
  }

  .platform_content .has-choose-box {
    display: inline-block;
    float: right;
    margin-right: 20px;
  }

  .platform_content .has-choose {
    position: relative;
    /* font-size: 10px; */
    margin-left: 10px;
    color: #3B87F5;
    font-weight: normal;
    display: inline-block;
    padding-left: 5px;
    height: 20px;
    margin-top: 6px;
    margin-bottom: 6px;
    line-height: 20px;
    border: #3B87F5 solid 1px;
    padding-right: 30px;
    border-radius: 14px;
  }

  /* .platform_content .has-choose i {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    background: #3B87F5;
    border-radius: 0px 10px 10px 0px;
    border: #3B87F5 solid 1px;
    line-height: 18px;
    font-size: 5px;
    padding-right: 10px;
    padding-left: 5px;
    float: right;
    color: white;
  } */
  .choose_close{
    width: 8px;
    /* height: 16px; */
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    background: #3B87F5 url("../../assets/image/close.png") no-repeat center;
    border-radius: 0px 10px 10px 0px;
    border: #3B87F5 solid 1px;
    line-height: 18px;
    /* font-size: 5px; */
    padding-right: 10px;
    padding-left: 5px;
    float: right;
    color: white;
    cursor: pointer;
  }
  .dd {

    animation: shake 1s;
    -o-animation: shake 1s;
    -webkit-animation: shake 1s;
    -moz-animation: shake 1s;
  }

  @keyframes shake {
    0%, 100% {
      -webkit-transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      -webkit-transform: translateX(-5px);
    }
    20%,
    40%,
    60%,
    80% {
      -webkit-transform: translateX(5px);
    }
  }

  @-o-keyframes shake {
    /* Opera */
    0%, 100% {
      -webkit-transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      -webkit-transform: translateX(-5px);
    }
    20%,
    40%,
    60%,
    80% {
      -webkit-transform: translateX(5px);
    }
  }

  @-webkit-keyframes shake {
    /* Safari 和 Chrome */
    0%, 100% {
      -webkit-transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      -webkit-transform: translateX(-5px);
    }
    20%,
    40%,
    60%,
    80% {
      -webkit-transform: translateX(5px);
    }
  }

  @-moz-keyframes shake {
    /* Firefox */
    0%, 100% {
      -moz-transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      -moz-transform: translateX(-5px);
    }
    20%,
    40%,
    60%,
    80% {
      -moz-transform: translateX(5px);
    }
  }

  .platform_content .table-box {
    background: #FAFAFA;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-bottom: 50px;
  }

  .platform_content .table-title {
    /* font-size: 16px; */
    font-weight: bolder;
    color: #444;
    line-height: 34px;
    height: 34px;
  }

  .platform_content .table-title-right {
  }

  .platform_content .table-left-box {
    background: white;
    float: left;
    padding-left: 50px;
    padding-right: 50px;
    display: inline-block;
    width: calc(50% - 108px);
    margin-top: 8px;
    margin-right: 4px;
    /*border: #EBECED 1px solid;*/
  }

  .platform_content .table-right-box {
    background: white;
    padding-right: 50px;
    padding-left: 50px;
    display: inline-block;
    float: left;
    width: calc(50% - 108px);
    margin-left: 4px;
    /*border: #EBECED 1px solid;*/
    margin-top: 8px;

  }

</style>
