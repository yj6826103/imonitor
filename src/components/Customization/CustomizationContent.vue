<template>
  <div class="overView"
       style="height: 100%;"
       id="overView"
       v-loading.fullscreen.lock="fullscreenLoading">
    <div class="monitorCustomization">
      <div class="block">
        <div class="title">选择平台
          <div class="right-search">
            <el-autocomplete
              v-model="state4"
              :fetch-suggestions="querySearchAsync"
              :trigger-on-focus="false"
              placeholder="输入平台名称"
              @select="handleSelect"
            ></el-autocomplete>
            <i class="el-icon-search search-icon"/>
          </div>
        </div>
      </div>
      <div class="choose">
        <div class=" choose-item-box">
          <chooseOptionList
            :maxChoose="10"
            :exceedMaxListener="exceedMaxListener"
            :listData="itemData"
            @selectListener="selectListener"
            ref="chooseOptionList"/>
        </div>
        <div style="padding-bottom: 8px">
          <el-row>
            <el-col :span="2">
              <div class="title1"> 已选平台</div>
            </el-col>
            <el-col :span="22">
              <div class="show-choose-platform" id="show-choose-platform">
                <div class="has-choose">
                <span class="color_base" v-for="(item,index) in selectItemData">
                  {{getSelectListItemName(item.name)}}
                  <i class="choose_close" @click="deleteItem(index)"/>
                </span>
                </div>
                <div class="has-choose-name" id="has-choose-name">
                  <div class="box">
                    <i v-show="selectItemData.length>1">*</i>
                    <div class="hint title1" v-show="selectItemData.length>1">监测组名称</div>
                    <input v-model="chooseName" placeholder="请输入名称" v-show="selectItemData.length>1"/>
                    <div class="enter bgc_base canClick" @click="addChooseList()">确定</div>
                    <div class="cancel color_base canClick" @click="clearHasChoose()">清空</div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="show-box" id="show-box">
        <div class="showList">
          <div class="showList-title title" style="margin-left:10px">
            已添加监测列表
          </div>
          <div class="list-box">
            <monitorList :listData="tableData" :deleteListener="deleteListener"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import chooseOptionList from '@/components/Customization/chooseOptionList.vue'
  import monitorList from '@/components/Customization/monitorList.vue'

  export default {

    data: function () {
      return {
        restaurants: [],
        state4: '',
        timeout: null,
        itemData: null,
        selectItemData: [],
        chooseName: "",
        tableData: [],
        fullscreenLoading: true,
      };
    },

    components: {chooseOptionList, monitorList},
    watch: {
      chooseName(oldData, newData) {
        if (this.chooseName.length > 10) {
          this.alert('监测组名称长度过长，最长为10个字符');
          this.chooseName = this.chooseName.slice(0, 10)
          return
        }
      },
      selectItemData(oldData, newData) {
        var dom1 = document.getElementById("has-choose-name")
        var dom2 = document.getElementById("show-choose-platform")
        var spanWidth = 0
        for (var i = 0; i < this.selectItemData.length; i++) {
          var length = this.selectItemData[i].name.length > 16 ? 37 + 12 * 16 : 37 + 12 * this.selectItemData[i].name.length
          spanWidth = spanWidth + length + 20
        }
        if (spanWidth + 600 > dom2.offsetWidth) {
          dom1.style.width = "100%"
        } else {
          dom1.style.width = "auto"
        }
      }
    },
    methods: {
      deleteListener(id) {
        this.deleteGroup(id)
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
      exceedMaxListener() {
        this.alert('最多只能选择10个栏目');
      },
      loadTable() {
        var thiz = this
        thiz.fullscreenLoading=true
        this.$http.get(this.baseUrl + "/customGroup/listByUser",).then(function (res) {
          var response = JSON.parse(res.bodyText)
          thiz.fullscreenLoading = false
          if (response.code == "200" || response.code == 200) {
            thiz.tableData = response.data
          } else {
            thiz.$message({message: '请求错误'});
          }
        }, function (err) {
          thiz.fullscreenLoading = false
          thiz.$message({message: '请求错误'});
        })
      },
      createGroup() {

        if (this.tableData.length == 10 || this.tableData.length > 10) {
          this.alert('最多只能创建10组自定义检测组');
          return
        }

        var thiz = this
        var url = this.baseUrl + "/customGroup/create?";
        url = url + "groupName=" + this.chooseName
        for (var i = 0; i < this.selectItemData.length; i++) {
          url = url + "&" + "platformList=" + this.selectItemData[i].id
        }
        this.fullscreenLoading=true
        this.$http.get(url).then(function (res) {
          thiz.fullscreenLoading=false
          var response = JSON.parse(res.bodyText)
          if (response.code == "200" || response.code == 200) {
            thiz.$message({message: '添加成功'});
            thiz.loadTable();
          } else {
            thiz.$message({message: '请求错误'});
          }
        }, function (err) {
          thiz.fullscreenLoading=false
          thiz.$message({message: '请求错误'});
        })
      },
      deleteGroup(id) {

        var params = {
          groupId: id,
        }
        var thiz = this
        this.$http.get(this.baseUrl + "/customGroup/deleteByGroupId", {params: params}).then(function (res) {
          var response = JSON.parse(res.bodyText)
          if (response.code == "200" || response.code == 200) {
            thiz.$message({message: '删除成功'});
            thiz.loadTable();
          } else {
            thiz.$message({message: '删除失败'});
          }
        }, function (err) {
          thiz.$message({message: '请求错误'});
        })
      },
      getItemDate() {
        var params = {
          pageNo: 1,
          pageSize: 100,
        }
        var thiz = this
        this.$http.get(this.baseUrl + "/platform/find", {params: params}).then(function (res) {
          var response = JSON.parse(res.bodyText)
          thiz.fullscreenLoading = false
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
        }, function (err) {
          thiz.fullscreenLoading = false
          thiz.$message({message: '请求错误'});
        })
      },
      querySearchAsync(queryString, cb) {
        queryString = this.trimAll(queryString)
        if(queryString.length==0){
          return
        }
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        clearTimeout(this.timeout);
        if (!results || results.length == 0) {
          results = [{
            value: "无相关结果",
            id: ""
          }]
        }
        cb(results);
      },
      clearHasChoose() {
        if (this.selectItemData.length == 0) {
          return
        }
        this.selectItemData = []
        this.$refs.chooseOptionList.clear()
      },
      addChooseList() {
        var name = this.chooseName
        if (name == "" && this.selectItemData.length > 1) {
          this.alert('监测组名称不能为空');
          return
        }
        if (name && name.length > 10) {
          this.alert('监测组名称长度过长，最长为10个字符');
          return
        }
        if (this.selectItemData.length == 1) {
          this.chooseName = this.selectItemData[0].name
        }
        if (this.selectItemData.length == 0) {
          this.alert('请至少勾选一个栏目');
          return
        }
        this.createGroup();
        this.chooseName = ""
        this.clearHasChoose()
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
      getSelectListItemName(name) {
        return name.length > 16 ? name.slice(0, 15) + "..." : name
      },
      deleteItem(index) {
        var item = this.selectItemData[index]
        this.$refs.chooseOptionList.deleteItem(item)
        for (var i = 0; i < this.selectItemData.length; i++) {
          if (this.selectItemData[i].id == item.id) {
            this.selectItemData.splice(i, 1);
          }
        }
      }
    },
    mounted() {
      this.getItemDate();
      this.loadTable();
      this.selectItemData = [];
    }
  }
</script>

<style scoped>
  @import '../../assets/css/Customization/monitorCustomization.css';

  .monitorCustomization {
    height: 100%;
    background: #fff;
  }

  .monitorCustomization .canClick {
    cursor: pointer;
  }

  .monitorCustomization .title {
    /* font-size: 16px; */
    font-weight: bolder;
    color: #444;
    margin-bottom: 20px;
    margin-top: 20px;
  }

  .monitorCustomization .title1 {
    /* font-size: 16px; */
    font-weight: bolder;
    color: #444;
    height: 59px;
    line-height: 59px;
  }

  .monitorCustomization .block {
    background-color: #fff;
    border-bottom: 1px #E2E3E4 solid;
    margin: 0px 50px;
    min-width: 1000px;
    padding-top: 10px;
    padding-bottom: 10px;
    /*margin-top: 5px;*/
  }

  .monitorCustomization .choose {
    border-bottom: 1px solid #e2e3e4;
    margin-top: 8px;
    margin-left: 50px;
    margin-right: 50px;
    background: #fff;
  }

  .monitorCustomization .choose-platform {
    /*margin-left: 50px;*/
    /*margin-right: 50px;*/
    height: 60px;
    border-bottom: 1px solid #e2e3e4;
  }

  .monitorCustomization .choose-item-box {
    height: 64%;
    border-bottom: 1px solid #e2e3e4;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .monitorCustomization .choose-platform .left-title {
    float: left;
    line-height: 60px;
  }

  .monitorCustomization .right-search {
    float: right;
    height: 31px;
    position: relative;
  }

  .monitorCustomization .search-icon {
    position: absolute;
    right: 60px;
    /* font-size: 22px; */
    top: 5px;
  }

  .monitorCustomization .show {
    border-top: 1px solid #e2e3e4;
    border-bottom: 1px solid #e2e3e4;
    background: #fff;
    float: left;
    width: 100%;
    margin-top: 8px;
  }

  .monitorCustomization .show-choose-platform {
    margin-right: 40px;
  }

  .monitorCustomization .has-choose {
    padding-top: 8px;
    padding-bottom: 8px;
    line-height: 34px;
    display: inline-block;
  }

  .monitorCustomization .has-choose-name {
    float: right;
    height: 50px;
    display: inline;
    text-align: center;
  }

  .monitorCustomization .has-choose-name .box {
    margin-top: 5px;
    height: 100%;
  }

  .monitorCustomization .has-choose-name .hint {
    height: 50px;
    display: inline-block;
    line-height: 50px;
  }

  .monitorCustomization .has-choose-name i {
    color: #fb5e5e;
    margin-right: 15px;
    /* font-size: 20px; */
    font-weight: bold;
  }

  .monitorCustomization .has-choose-name input {
    margin-left: 15px;
    border-radius: 14px;
    padding-left: 14px;
    border: #c3c5c8 solid 1px;
    width: 180px;
    height: 32px;
    /* font-size: 13px; */
    margin-right: 40px;
  }

  .monitorCustomization .has-choose-name .enter {
    margin-left: 30px;
    height: 28px;
    margin-top: 10px;
    margin-bottom: 10px;
    line-height: 28px;
    width: 80px;
    text-align: center;
    display: inline-block;
    color: white;
    align-content: center;
    border-radius: 8px;
    border: #fff solid 1px;
  }

  .monitorCustomization .has-choose-name .cancel {
    margin-left: 30px;
    /* font-size: 10px; */
    background: #fff;
    height: 28px;
    margin-top: 11px;
    margin-bottom: 10px;
    line-height: 28px;
    width: 80px;
    text-align: center;
    display: inline-block;
    align-content: center;
    border-radius: 8px;
    border: #3B87F5 solid 1px;
  }

  .monitorCustomization .has-choose span {
    position: relative;
    /* font-size: 10px; */
    margin-left: 20px;
    margin-top: 11px;
    margin-bottom: 10px;
    font-weight: normal;
    display: inline-block;
    padding-left: 5px;
    height: 20px;
    line-height: 20px;
    border: #3B87F5 solid 1px;
    padding-right: 30px;
    border-radius: 14px;
  }
  .monitorCustomization .choose_close{
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


  .monitorCustomization .show-box {
    border-top: 1px solid #e2e3e4;
    border-bottom: 1px solid #e2e3e4;
    background: #fff;
    padding-left: 40px;
    padding-right: 40px;
    margin-top: 8px;
  }

  .monitorCustomization .showList {

  }

  .monitorCustomization .showList-title {
    height: 50px;
    line-height: 50px;
  }

  .monitorCustomization .list-box {
    padding: 30px;
  }


</style>
