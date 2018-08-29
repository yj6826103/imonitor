<template>
  <div class="iM_sidebar">

    <div class="iM_sidebar_main">
      <!--通用检测项-->
      <div :class="sidebarTopSelected?'iM_sidebar_group_selected':'iM_sidebar_group'"
           style="margin-top: 5px;margin-bottom: 10px"
           @click="iMSidebarClick(0,[],$event)" v-text="sidebarData_top?sidebarData_top:''">
      </div>
      <div v-for="(common,commonIndex) in sidebarData_common">
        <!--一级标题-->
        <div
          :class="common.selected?'iM_sidebar_group_selected':'iM_sidebar_group'"
          @click="iMSidebarClick(0,[commonIndex],$event)"
          @mouseenter="mouseenter(commonIndex,$event)"
          @mouseleave="mouseleave(commonIndex)"
          v-if="common.list.length"
          v-text="common.name">
        </div>
        <!--二级标题-->
        <div v-for="(list,listIndex) in common.history?common.history:common.list"
             :class="list.selected?'iM_sidebar_item_selected':'iM_sidebar_item'"
             @click="iMSidebarClick(0,[commonIndex,listIndex],$event)"
             v-text="common.history?list.platformName:list.name"
             :title="common.history?(list.platformName.length>8?list.platformName:''):(list.name.length>8?list.name:'')">
        </div>
      </div>

      <!--自定义监测项-->
      <div class="iM_sidebar_group custom"
           v-if="sidebarData_custom.length" style="margin-top: 15px">自定义监测项
      </div>
      <div v-for="(custom,customIndex) in sidebarData_custom">
        <!--一级标题-->
        <div :class="custom.selected?'iM_sidebar_group_selected':'iM_sidebar_group'"
             class="clearfix custom_group"
             :title="custom.groupName"
             @click="iMSidebarClick(1,[customIndex],$event)">
          <span v-text="custom.groupName"></span>
          <i :class="custom.folding?'el-icon-arrow-down':'el-icon-arrow-up'"
             @click="customGroupClick(customIndex)"
             v-if="custom.platformList.length>1">
          </i>
        </div>
        <!--二级标题-->
        <div v-for="(list,listIndex) in custom.platformList"
             v-if="custom.platformList.length>1"
             v-show="!custom.folding"
             :class="list.selected?'iM_sidebar_item_selected':'iM_sidebar_item'"
             @click="iMSidebarClick(1,[customIndex,listIndex],$event)"
             v-text="list.name"
             :title="list.name">
        </div>
      </div>
    </div>


    <div class="customization"
         @click="goToCustomization">
      <span><i class="el-icon-plus"></i>定制监测项</span>
    </div>

    <!--扩展页面-->
    <div class="dialog"
         ref="dialog"
         v-show="showDialog"
         v-if="sidebarData_common.length"
         @mouseenter="mouseenter(currentIndex)"
         @mouseleave="mouseleave(currentIndex)">
      <div v-for="(item,index) in sidebarData_common[currentIndex].list"
           :class="item.selected?'dialog_title_selected':'dialog_title'"
           @click="iMSidebarClick(0,[currentIndex,index],$event)"
           v-text="item.name"
           :title="item.name">
      </div>
    </div>


  </div>
</template>

<script>
  export default {
    name: "i-m-sidebar1",
    data() {
      return {
        sidebarTopSelected: false,
        showDialog: false,
        currentIndex: 0,
        sidebarData_top:null,
        sidebarData_common: [],
        sidebarData_custom: [],
        selectedName: ''

      }
    },
    methods: {

      goToCustomization() {
        //定制监测页跳转
        this.$router.push('/customization')
      },

      //鼠标事件
      mouseenter(index, event) {
        let dialogArr = this.sidebarData_common[index].list;
        this.showDialog = true;
        //记录当前被选中的indexs
        this.currentIndex = index;
        if (event) {
          //修改视图的顶部位置
          this.$refs.dialog.style.top = event.currentTarget.getBoundingClientRect().top + 'px';
          this.$refs.dialog.style.left = event.currentTarget.getBoundingClientRect().right + 'px';
        }
      },
      mouseleave(index) {
        this.showDialog = false;
      },


      /*
      当前栏目点击事件
      type:当前点击类型,0:common 1:custom
      indexs:Array[section,row],表示当前被点击的定位,row缺省表示当前点击组
       */
      iMSidebarClick(type, clickIndex, event) {

        if (event && event.target.localName === 'i') {
          return;
        }
        // this.zc_log(`type==${type},indexs.length==${clickIndex.length},index1==${clickIndex[0]},index2==${clickIndex[1]}`)
        // this.zc_log(event)

        let indexArr = clickIndex;
        let typeID;
        let typeName;
        let typeState;
        let thiz = this;
        //判断当前是否点击总台按钮
        if (indexArr.length === 0) {
          typeState = 1000;
          typeID = '0';
          typeName = '苏州广播电视总台';
          this.selectedName = '苏州广播电视总台';
          this.sidebarTopSelected = true;
        } else {
          this.sidebarTopSelected = false;
        }

        //处理普通平台数据
        this.sidebarData_common.forEach(function (commonValue, commonIndex) {

          if (type === 0 && indexArr.length === 1) {
            //当前点击的是普通组
            if (commonIndex === indexArr[0]) {
              typeID = commonValue.platfromTypeId;
              commonValue.selected = true;
              typeState = 1001;
              typeName = commonValue.name;
              thiz.selectedName = commonValue.name;
            } else {
              commonValue.selected = false;
            }
          } else {
            commonValue.selected = false;
          }

          let clickHistoryId = null;
          if (commonValue.history) {
            commonValue.history.forEach(function (historyItem, historyIndex) {

              if (type === 0 && indexArr.length === 2 && !thiz.showDialog) {
                if (historyIndex === indexArr[1] && commonIndex === indexArr[0]) {
                  typeID = historyItem.platformId;
                  historyItem.selected = true;
                  typeState = 1002;
                  typeName = historyItem.platformName;
                  thiz.selectedName = historyItem.platformName;

                  clickHistoryId = historyItem.platformId;
                } else {
                  historyItem.selected = false;
                }
              } else {
                historyItem.selected = false;
              }
            });
          }
          // else {
          commonValue.list.forEach(function (listItem, listIndex) {


            if (type === 0 && indexArr.length === 2) {

              if (listIndex === indexArr[1] && commonIndex === indexArr[0] && !commonValue.history) {
                //点击的是不包含历史记录的平台
                typeID = listItem.id;
                listItem.selected = true;
                typeName = listItem.name;
                thiz.selectedName = listItem.name;
                typeState = 1002;
              } else if (listIndex === indexArr[1] && commonIndex === indexArr[0] && commonValue.history) {
                //点击的是包含历史记录的平台
                if (thiz.showDialog) {
                  //点击的是单个平台
                  typeID = listItem.id;
                  listItem.selected = true;
                  typeName = listItem.name;
                  thiz.selectedName = listItem.name;
                  typeState = 1002;
                }
              } else {
                listItem.selected = false;
              }

              //当前点击的是历史记录时候,对应的list更改
              if (clickHistoryId === listItem.id) {
                listItem.selected = true
              }
            }
            else {
              listItem.selected = false;
            }
          });
          // }
        });

        //处理自定义平台数据
        this.sidebarData_custom.forEach(function (customValue, customIndex) {

          if (type === 1 && indexArr.length === 1) {
            if (customIndex === indexArr[0]) {
              typeID = customValue.id;
              customValue.selected = true;
              typeState = 1003;
              typeName = customValue.groupName;
              thiz.selectedName = customValue.groupName;

            } else {
              customValue.selected = false;
            }
          } else {
            customValue.selected = false;
          }
          if (customValue.platformList) {
            customValue.platformList.forEach(function (listItem, listIndex) {
              if (type === 1 && indexArr.length === 2) {
                if (listIndex === indexArr[1] && customIndex === indexArr[0]) {
                  typeID = listItem.id;
                  listItem.selected = true;
                  typeState = 1002;
                  typeName = listItem.name;
                  thiz.selectedName = listItem.name;

                } else {
                  listItem.selected = false;
                }
              } else {
                listItem.selected = false;
              }
            });
          }
        });

        //增加普通平台的历史记录数据
        if (this.showDialog && typeState === 1002) {
          //增加历史记录
          // this.zc_log(`增加历史记录第${clickIndex[0]}组,第${clickIndex[1]}个`);

          let section = clickIndex[0];
          let row = clickIndex[1];
          let listArr = this.sidebarData_common[section].list;
          this.addHistoryNetData(listArr[row]);
          this.addHistoryLocalData(listArr[row], section)
        }

        this.showDialog = false;

        /*
        type:1000表示总台;1001表示平台组;1002表示单个平台;1003表示自定义平台组
         */
        this.$emit('sidebar-item-click', {
          type: typeState,
          id: typeID,
        });
        // this.$message({message: typeID});


        let record = {type: type, clickIndex: clickIndex};
        window.localStorage.setItem('sidebarClickRecord1', JSON.stringify(record));
        // this.zc_log('设置侧边栏记录');
        // this.zc_log(JSON.stringify(record));


        //此代码仅仅为了动态刷新列表,没有实际含义
        this.$set(this.sidebarData_common, "random", {});
        this.$delete(this.sidebarData_common, "random");
        this.$set(this.sidebarData_custom, "random", {});
        this.$delete(this.sidebarData_custom, "random");
      },

      //折叠按钮点击事件
      customGroupClick(index) {
        // alert(`折叠第${index}组`);

        this.sidebarData_custom.forEach(function (customValue, customIndex) {
          if (index === customIndex)
            customValue.folding = !customValue.folding;
        });

        this.$set(this.sidebarData_custom, "random", {});
        this.$delete(this.sidebarData_custom, "random");
      },


      /*加载侧边栏数据*/
      //租户信息
      loadTenantData() {
        this.$http.get(this.baseUrl + '/tenant/find').then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('加载租户信息数据');
          this.zc_log(response);
          this.sidebarData_top = null;
          if (response.code == 200) {
            this.rzl_showLoading(false);
            this.sidebarData_top = response.data.name;
          }
        }, function (res) {
          this.zc_log('加载租户信息error');
          this.zc_log(res);
        });
      },
      //平台信息
      loadSidebarData() {
        this.$http.get(this.baseUrl + '/platform/findAll').then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('加载侧边栏数据');
          this.zc_log(response);
          if (response.code == 200) {
            this.rzl_showLoading(false);
            this.handleSidebarData(response.data)
          }
        }, function (res) {
          this.zc_log('加载侧边栏error');
          this.zc_log(res);
        });
      },
      handleSidebarData(data) {
        // this.zc_log('加载侧边栏数据');
        // this.zc_log(data);
        this.sidebarData_common = data.nomal;
        this.sidebarData_custom = data.special;

        this.sidebarData_common.forEach(function (value, index) {
          value.selected = false;

          if (value.history) {
            value.history.forEach(function (historyItem, index) {
              historyItem.selected = false;
            });
          }

          value.list.forEach(function (listItem, index) {
            listItem.selected = false;
          });
        });

        this.sidebarData_custom.forEach(function (value, index) {
          value.selected = false;
          value.folding = false;
          value.platformList.forEach(function (listItem, index) {
            listItem.selected = false;
          });
        });


        let recordM = window.localStorage.getItem('sidebarClickRecord1');
        let record = JSON.parse(recordM);
        // this.zc_log('读取侧边栏记录');
        // this.zc_log(record);
        if (record) {
          this.iMSidebarClick(record.type, record.clickIndex);
        } else {
          this.iMSidebarClick(0, [], null);
        }
      },


      //增加历史点击记录(网络)
      addHistoryNetData(data) {
        var params = {
          platformId: data.id,
          platformName: data.name,
          platformTypeId: data.platformTypeId,
          platformTypeName: data.platformTypeName
        };
        this.zc_log('==========增加历史记录');
        this.zc_log(params);
        this.zc_log('==========增加历史记录');

        this.$http.get(this.baseUrl + '/platform/history/add', {params: params}).then(function (res) {
          var response = JSON.parse(res.bodyText);
          this.zc_log('增加历史记录');
          this.zc_log(response);
          if (response.code != 200) {
            this.addHistoryNetData(data);
          }
        }, function (res) {
          //this.zc_log('增加微信历史记录error');
          //this.zc_log(res);
        });
      },
      //增加历史点击记录(本地)
      addHistoryLocalData(data, index) {

        // this.zc_log(data);
        // this.zc_log(`第${index}组`);


        let existIndex = null;
        this.sidebarData_common[index].history.forEach(function (value, index) {
          if (value.platformId === data.id && value.platformName === data.name) {
            // this.zc_log(`存在该平台记录`);
            existIndex = index;
          }
        });

        if (existIndex != null) {
          this.sidebarData_common[index].history.splice(existIndex, 1);
        } else {
          if (this.sidebarData_common[index].history.length >= 5) {
            this.sidebarData_common[index].history.splice(this.sidebarData_common[index].history.length - 1, 1);
          }
        }
        this.sidebarData_common[index].history.splice(0, 0, {
          platformId: data.id,
          platformName: data.name,
          platformTypeId: data.platformTypeId,
          platformTypeName: data.platformTypeName,
          selected: data.selected
        });
      }

    },
    beforeCreate(){
      let token = this.$route.query.token;
      if(token){
        localStorage.setItem('token',token);
      }
    },
    created(){
      let token = this.$route.query.token;
      if(token){
        localStorage.setItem('token',token);
      }
      this.rzl_showLoading(false);
      this.loadTenantData();
      this.loadSidebarData();
    },

  }
</script>

<style scoped>

  .iM_sidebar {
    height: 100%;
  }

  .iM_sidebar_main {
    overflow-y: auto;
    height: calc(100% - 50px);
  }

  /*一级标题*/
  .iM_sidebar_group {
    /* font-size: 20px; */
    font-weight: 600;
    padding: 5px 10px;
    cursor: default;
    line-height: 25px;
  }

  .iM_sidebar_group:hover {
    cursor: pointer;
    color: #3B87F5;
  }

  .iM_sidebar_group_one {
    /* font-size: 20px; */
    font-weight: 600;
    padding: 5px 10px;
    cursor: default;
    line-height: 25px;
  }

  .iM_sidebar_group_selected {
    /* font-size: 20px; */
    font-weight: 600;
    padding: 5px 10px;
    cursor: default;
    color: #3B87F5;
    line-height: 25px;
  }

  .iM_sidebar_group_selected:hover {
    cursor: default;
  }

  /*二级标题*/
  .iM_sidebar_item {
    /* font-size: 16px; */
    padding: 5px 20px;
    cursor: default;
    line-height: 40px;
    font-weight: 100;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

  }

  .iM_sidebar_item:hover {
    cursor: pointer;
    color: #fff;
    background-color: #3B87F5;
  }

  .iM_sidebar_item_selected {
    /* font-size: 16px; */
    padding: 5px 20px;
    cursor: default;
    color: #fff;
    background-color: #3B87F5;
    line-height: 40px;
    font-weight: 100;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .iM_sidebar_item_selected:hover {
    cursor: default;
  }

  .iM_sidebar_group i, .iM_sidebar_group_selected i {
    float: right;
    cursor: pointer;
  }

  /*自定义监测*/
  .custom:hover {
    cursor: default;
    color: #444;
  }

  .custom_group {
    font-weight: normal;
  }

  .customization {
    color: #fff;
    background-color: #fff;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    line-height: 50px;
  }

  .customization span {
    border: #3B87F5 1px solid;
    border-radius: 10px;
    padding: 5px 10px;
    background: #3B87F5;
    cursor: pointer;
  }

  .dialog {
    position: fixed;
    width: 600px;
    padding: 10px 10px;
    background-color: #fff;
    border: #E2E3E4 1px solid;
    z-index: 100;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.2);
  }

  .dialog .dialog_title {
    float: left;
    line-height: 35px;
    width: 100px;
    text-align: left;
    color: #565656;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 10px;

  }

  .dialog .dialog_title_selected {
    float: left;
    line-height: 35px;
    width: 100px;
    text-align: left;
    color: #3B87F5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 10px;
    font-weight: 900;
  }

  .dialog .dialog_title:hover {
    color: #3B87F5;
    font-weight: 900;
    cursor: pointer;
  }

  .dialog .dialog_title_selected:hover {
    color: #3B87F5;
    cursor: default;
  }
</style>
