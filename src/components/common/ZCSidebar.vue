<template>
  <div id="IM_sidebar" class="IM_sidebar bgc_rzl" :class="options.showSidebar?'':'IM_sidebar_hidden'">

    <div class="IM_sidebar_content">
      <!------------租户信息------开始------>
      <div :class="tenantSelected?'iM_sidebar_tenant_selected color_base':'iM_sidebar_tenant'"
           v-text="tenantData?tenantData:''"
           @click="iMSidebarClick(0,[],$event)">
      </div>
      <!------------租户信息------结束------>


      <!------------平台信息------开始------>
      <div v-for="(common,commonIndex) in sidebarData_common"
           class="IM_sidebar_common">
        <!--一级标题-->
        <div class="iM_sidebar_group"
             :class="common.selected?'iM_sidebar_group_selected color_base':''"
             :title="common.name.length>8?common.name:''"
             @click="iMSidebarClick(0,[commonIndex],$event)"
             @mouseenter="mouseenter(commonIndex,$event)"
             @mouseleave="mouseleave(commonIndex)">
          {{common.name}}<!--一级内容-->
          <div class="iM_sidebar_group_arrow"
               v-if="common.list.length"
               @click="foldSidebarGroup('common',commonIndex)">
            <i :class="common.folding?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
          </div>
        </div>
        <!--二级标题-->
        <div v-if="!common.folding"
             v-for="(list,listIndex) in common.history?common.history:common.list"
             class="iM_sidebar_item"
             :class="list.selected?'iM_sidebar_item_selected color_base':''"
             :title="common.history?(list.platformName.length>8?list.platformName:''):(list.name.length>8?list.name:'')"
             @click="iMSidebarClick(0,[commonIndex,listIndex],$event)">
          {{common.history?list.platformName:list.name}}<!--二级内容-->
        </div>
      </div>
      <!------------平台信息-------结束----->


      <!------------定制检测项平台信息------开始------>
      <div class="iM_sidebar_custom"
           v-text="'定制检测项'" v-if="sidebarData_custom.length">
      </div>
      <div v-for="(custom,customIndex) in sidebarData_custom">
        <!--一级标题-->
        <div class="clearfix iM_sidebar_group"
             :class="custom.selected?'iM_sidebar_group_selected color_base':''"
             :title="custom.groupName.length>8?custom.groupName:''"
             @click="iMSidebarClick(1,[customIndex],$event)">
          {{custom.groupName}}<!--一级内容-->
          <div class="iM_sidebar_group_arrow"
               @click="foldSidebarGroup('custom',customIndex)">
            <i :class="custom.folding?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
          </div>
        </div>
        <!--二级标题-->
        <div v-if="!custom.folding"
             v-for="(list,listIndex) in custom.platformList"
             class="iM_sidebar_item"
             :class="list.selected?'iM_sidebar_item_selected':''"
             :title="list.name.length>8?list.name:''"
             @click="iMSidebarClick(1,[customIndex,listIndex],$event)">
          {{list.name}}<!--二级内容-->
        </div>
      </div>
      <!-- 定制检测项平台信息-结束 -->

    </div>

    <!-- 定制按钮-开始 -->
    <div class="IM_sidebar_tools">

      <div class="IM_sidebar_tools_item" @click="goToCustomization">+ 制定检测项</div>
      <!--<div class="IM_sidebar_tools_item" @click="goToAddArticle">+ 上传文章组</div>-->
    </div>
    <!--定制按钮-结束-->


    <!--二级菜单页面-开始-->
    <div class="dialog"
         ref="dialog"
         v-show="showDialog"
         v-if="sidebarData_common.length"
         @mouseenter="mouseenter(currentIndex)"
         @mouseleave="mouseleave(currentIndex)">
      <div v-for="(item,index) in sidebarData_common[currentIndex].list"
           :class="item.selected?'dialog_title_selected color_base':'dialog_title'"
           @click="iMSidebarClick(0,[currentIndex,index],$event)"
           v-text="item.name"
           :title="item.name">
      </div>
    </div>
    <!-- 二级菜单页面-结束 -->

  </div>
</template>

<script>
  export default {
    name: "z-c-sidebar",
    props: {
      options: {
        type: Object,
        require: true,
        default(){
          return{
            showMenu: true,
            showSidebar: true,
          }
        }

      }
    },
    data() {
      return {
        /*租户信息*/
        tenantSelected: false,
        tenantData: null,
        /*平台信息*/
        sidebarData_common: [],
        /*定制监测信息*/
        sidebarData_custom: [],
        /*二级菜单信息*/
        currentIndex: 0,
        showDialog: false,

        selectedName: ''//当前被点击的平台名称
      }
    },
    methods: {

      /*****************租户信息*****************/
      //获取租户信息
      loadTenantData() {

        this.$http.get(this.baseUrl + '/tenant/find').then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('加载租户信息数据');
          this.zc_log(response);
          this.sidebarData_top = null;
          if (response.code == 200 && response.data) {
            this.rzl_showLoading(false);
            this.tenantData = response.data.name;
            localStorage.setItem('currentTenant',response.data.name);
          }
        }, function (res) {
          this.zc_log('加载租户信息error');
          this.zc_log(res);
        });
      },


      /*****************平台信息*****************/
      //获取平台信息
      loadSidebarData() {
        this.$http.get(this.baseUrl + '/platform/findAll').then(function (res) {
          let response = JSON.parse(res.bodyText);
          this.zc_log('加载侧边栏数据');
          this.zc_log(response);
          if (response.code == 200 && response.data) {
            this.rzl_showLoading(false);
            this.handleSidebarData(response.data)
          }
        }, function (res) {
          this.zc_log('加载侧边栏error');
          this.zc_log(res);
        });
      },
      //处理平台信息
      handleSidebarData(data) {
        this.sidebarData_common = data.nomal;
        this.sidebarData_custom = data.special;

        this.sidebarData_common.forEach(function (value, index) {
          value.selected = false;
          value.folding = true;
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
          value.folding = true;
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


      /*****************公共方法*****************/
      /*折叠一级标题*/
      foldSidebarGroup(type, index) {
        //type:表示当前一级列表的类型,common表示平台信息,custom表示定制监测

        if (type === 'common') {
          /*折叠平台信息*/

          this.sidebarData_common.forEach(function (customValue, customIndex) {
            if (index === customIndex)
              customValue.folding = !customValue.folding;
          });
          /*仅仅为了动态刷新页面,没有实际含义*/
          this.$set(this.sidebarData_common, "random", {});
          this.$delete(this.sidebarData_common, "random");

        } else {
          /*折叠定制检测项信息*/

          this.sidebarData_custom.forEach(function (customValue, customIndex) {
            if (index === customIndex)
              customValue.folding = !customValue.folding;
          });
          /*仅仅为了动态刷新页面,没有实际含义*/
          this.$set(this.sidebarData_custom, "random", {});
          this.$delete(this.sidebarData_custom, "random");

        }
      },

      /*当前栏目点击事件,type:当前点击类型,0:common 1:custom,indexs:Array[section,row],表示当前被点击的定位,row缺省表示当前点击组*/
      iMSidebarClick(type, clickIndex, event) {

        // 若点击的是折叠箭头,则不响应
        if (event && (event.target.localName === 'i' || event.target.className === 'iM_sidebar_group_arrow')) {
          return;
        }

        let indexArr = clickIndex;
        let typeID;
        let typeName;
        let typeState;
        let thiz = this;

        //判断当前是否点击总台按钮
        if (indexArr.length === 0) {
          typeState = 1000;
          typeID = '0';
          typeName = this.tenantData;
          this.tenantSelected = true;
        } else {
          this.tenantSelected = false;
        }


        //【处理普通平台数据】
        this.sidebarData_common.forEach(function (commonValue, commonIndex) {

           // 『处理普通平台组名称进行处理』
          if (type === 0 && indexArr.length === 1 && commonIndex === indexArr[0]) {

            //当点击的是普通平台组名称记录
            typeID = commonValue.platfromTypeId;
            commonValue.selected = true;
            typeState = 1001;
            typeName = commonValue.name;
            thiz.selectedName = commonValue.name;

          } else {
            commonValue.selected = false;//若点击的不是普通平台组名称,则取消选中状态
          }


          let clickHistoryId = null;//记录当前点击的记录实际id数据,用于弹出菜单中对应id数据选中状态
          // 『处理普通平台历史记录数据』
          if (commonValue.history) {

            commonValue.history.forEach(function (historyItem, historyIndex) {

              //当点击的是平台历史记录
              if (type === 0 && indexArr.length === 2 && !thiz.showDialog && historyIndex === indexArr[1] && commonIndex === indexArr[0]) {

                //记录当前点击平台id,平台name,平台type
                typeID = historyItem.platformId;
                historyItem.selected = true;
                typeState = 1002;
                typeName = historyItem.platformName;
                thiz.selectedName = historyItem.platformName;
                clickHistoryId = historyItem.platformId;//记录当前被点击的历史记录id

              } else {

                historyItem.selected = false; //当点击的不是平台历史记录,则取消选中状态

              }
            });
          }

          // 『处理普通单个平台数据』
          if(commonValue.list){

            commonValue.list.forEach(function (listItem, listIndex) {


              if (type === 0 && indexArr.length === 2 && listIndex === indexArr[1] && commonIndex === indexArr[0]) {

                // if (listIndex === indexArr[1] && commonIndex === indexArr[0] && !commonValue.history) {
                //点击的是不包含历史记录的平台
                typeID = listItem.id;
                listItem.selected = true;
                typeName = listItem.name;
                thiz.selectedName = listItem.name;
                typeState = 1002;
                // } else if (listIndex === indexArr[1] && commonIndex === indexArr[0] && commonValue.history) {
                //   //点击的是包含历史记录的平台
                //   if (thiz.showDialog) {
                //     //点击的是单个平台
                //     typeID = listItem.id;
                //     listItem.selected = true;
                //     typeName = listItem.name;
                //     thiz.selectedName = listItem.name;
                //     typeState = 1002;
                //   }
                // } else {
                //   listItem.selected = false;
                // }

                //当前点击的是历史记录时候,对应的list更改
                if (clickHistoryId === listItem.id) {
                  listItem.selected = true
                }
              }
              else {
                //当点击的不是单个平台,取消选中
                listItem.selected = false;
              }
            });

          }


        });


        //【处理自定义平台数据】
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

          /*更新网络历史点击记录库*/
          this.addHistoryNetData(listArr[row]);
          /*更新本地历史点击记录库*/
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



        /*处理二级页面点击后折叠问题*/
        if(indexArr.length === 2){
          let groupIndex = clickIndex[0];
          if(type === 0){
            this.sidebarData_common[groupIndex].folding = false;
          }else{
            this.sidebarData_custom[groupIndex].folding = false;
          }
        }


        let record = {type: type, clickIndex: clickIndex};
        window.localStorage.setItem('sidebarClickRecord1', JSON.stringify(record));


        //此代码仅仅为了动态刷新列表,没有实际含义
        this.$set(this.sidebarData_common, "random", {});
        this.$delete(this.sidebarData_common, "random");
        this.$set(this.sidebarData_custom, "random", {});
        this.$delete(this.sidebarData_custom, "random");


        /*滚动到顶部*/
        document.getElementById('IM_content').scrollTop = 0;
      },


      /*增加历史点击记录(网络)*/
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

      /*增加历史点击记录(本地)*/
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
      },


      //鼠标事件
      mouseenter(index, event) {
        let dialogArr = this.sidebarData_common[index].list;
        this.showDialog = dialogArr.length?true:false;
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

      //跳转定制监测页
      goToCustomization() {
        //定制监测页跳转
        this.$router.push('/customization')
      },
      // 跳转
      goToAddArticle(){
        this.$router.push('/uploadArticle')
      }
    },
    mounted() {
      this.loadTenantData();
      this.loadSidebarData();
    }

  }
</script>

<style scoped>

  /*侧边栏*/
  .IM_sidebar {
    position: absolute;
    top: 60px;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .IM_sidebar_content {
    width: 199px;
    height: calc(100% - 100px);
    background-color: #fff;
    overflow-x: hidden;
    overflow-y: auto;
    border-right: 1px solid #E2E3E4;
  }

  .IM_sidebar_hidden {
    display: none;
    width: 0;
  }

  /*******租户信息********/
  .iM_sidebar_tenant {
    color: #444;
    font-weight: 600;
    /* font-size: 20px; */
    padding: 15px 30px;
    cursor: default;
    text-align: center;
  }

  .iM_sidebar_tenant:hover {
    cursor: pointer;
    background-color: #fff;
    color: #3B87F5;
  }

  .iM_sidebar_tenant_selected {
    background-color: #fff;
    /* font-size: 20px; */
    font-weight: 600;
    padding: 15px 30px;
    cursor: default;
    text-align: center;
    color: #3B87F5;
  }

  /*******平台信息********/

  /*一级标题*/
  .iM_sidebar_group {
    position: relative;
    color: #666;
    /* font-size: 16px; */
    padding: 15px 30px;
    cursor: pointer;
  }

  .iM_sidebar_group:hover {
    cursor: pointer;
    background-color: #fff;
    color: #3B87F5;
  }

  .iM_sidebar_group_selected {
    cursor: default;
    background-color: #fff;
    color: #3B87F5;
  }

  .iM_sidebar_group_hidden {
    display: none;
  }

  .iM_sidebar_group_selected:hover {
    cursor: default;
  }

  /*下拉按钮*/
  .iM_sidebar_group_arrow {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 40px;
    color: #666;
    /* font-size: 10px; */
    font-weight: 600;
    text-align: center;
    cursor: pointer;
  }

  .iM_sidebar_group_arrow i {
    position: absolute;
    width: 10px;
    height: 10px;
    top: 50%;
    margin-top: -10px;
    right: 50%;
    margin-right: -5px;
  }

  /*二级标题*/
  .iM_sidebar_item {
    color: #666;
    background-color: #EEE;
    /* font-size: 16px; */
    text-align: center;
    padding: 15px 0;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .iM_sidebar_item:hover{
    color:#fff;
    background-color: #3B87F5;
  }
  .iM_sidebar_item_selected{
    background-color: #3B87F5;
    color:#fff;
  }
  .iM_sidebar_item_hidden {
    display: none;
  }

  .iM_sidebar_item_selected:hover {
    cursor: default;
  }

  /*******定制检测项平台信息********/
  .iM_sidebar_custom {
    color: #444;
    /* font-size: 20px; */
    padding: 15px 30px;
    cursor: default;
    text-align: center;
    font-weight: 600;
  }

  /*******定制按钮********/
  .IM_sidebar_tools {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 199px;
    height: 100px;
    background-color: #fff;
    border-right: 1px solid #E2E3E4;
    text-align: center;
    color: #444;
    font-weight: 600;
    /* font-size: 16px; */

  }

  .IM_sidebar_tools_item {
    padding: 10px 0;
    cursor: pointer;
  }

  /*******二级菜单页面********/
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
