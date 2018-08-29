<template>
  <div class="monitorList">
    <div class="monitorList-header">
      <div class="index">&nbsp;</div>
      <div class="name">监测项名称</div>
      <div class="items">包含平台</div>
      <div class="time">创建时间</div>
      <div class="del">&nbsp;</div>
    </div>
    <div class="list-box-none" v-if="listData.length==0">
      暂无数据
    </div>
    <div class="monitorList-item" v-for="(item,index) in listData">
      <div class="index">{{index+1}}</div>
      <div class="name">{{item.groupName}}</div>
      <div class="items" :title="getItemsTitle(item.platformList)">{{getItems(item.platformList)}}</div>
      <div class="time">{{item.createTime}}</div>
      <div class="del" @click="deleteItem(item.id ,item.groupName)">
        <span class="delete"> 删除</span>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "monitor-list",
    props: ['listData', 'deleteListener'],
    methods: {
      deleteItem: function (id, name) {
        var thiz = this
        var content = {
          startContent: "是否要删除",
          accentContent: name,
          endContent: "此检测项？",
        }
        var buttonText = {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
        }
        this.confirm(content, buttonText, () => {
          thiz.deleteListener(id)
        })
      },
      getItemsTitle: function (list) {
        var str = "";
        for (var i = 0; i < list.length; i++) {
          str = str + list[i].name + "，";
        }
        str = str.slice(0, str.length - 1)
        return str;
      },
      getItems: function (list) {
        var str = "";
        for (var i = 0; i < list.length; i++) {
          str = str + list[i].name + "，";
        }
        str = str.slice(0, str.length - 1)
        str = str.length > str.slice(0, 19) + "..." ? str : str
        return str;
      }
    }
  }
</script>

<style scoped>
  @import '../../assets/css/Customization/monitorList.css';
</style>
