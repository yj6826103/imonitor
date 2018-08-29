<template>
  <div class="optionList">
    <div class="itemLine" :style="{display:listItem.type=='网站'||listItem.type=='APP'?'inline':'block'}"
         v-for="(listItem,index1) in listData">
      <span class="title">{{listItem.name}}</span>
      <div class="lineBox">
        <div class="itemBox" v-for="(item,index2) in listItem.items"
             @click="clickItem(item)">
          <i class="choose_icon color_base" v-if="!item.choose"></i>
          <i class="check_icon color_base" v-if="item.choose"></i>
          <span :title="item.name" class="item-name">{{item.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "choose-option-list",
    props: ['listData', 'maxChoose', "exceedMaxListener"],
    data() {
      return {
        radio: false,
        radio1: true,
        data: null
      }
    },
    methods: {
      selectItemById(id) {
        for (var i = 0; i < this.listData.length; i++) {
          for (var j = 0; j < this.listData[i].items.length; j++) {
            if (id == this.listData[i].items[j].id) {
              this.clickItem(this.listData[i].items[j])
            }
          }
        }
      },
      clear() {
        for (var i = 0; i < this.listData.length; i++) {
          for (var j = 0; j < this.listData[i].items.length; j++) {
            this.listData[i].items[j].choose = false
          }
        }
        this.$set(this.listData, "random", 1)
        this.$delete(this.listData, "random")
      },
      deleteItem(item) {
        item.choose = false
        var random = Math.random()
        this.$set(this.listData, "random", random)
        this.$delete(this.listData, "random")
      },
      getHasChooseNum() {
        var num = 0;
        for (var i = 0; i < this.listData.length; i++) {
          for (var j = 0; j < this.listData[i].items.length; j++) {
            if (this.listData[i].items[j].choose) {
              num++
            }
          }
        }
        return num
      },
      containThisItem(item) {
        for (var i = 0; i < this.listData.length; i++) {
          for (var j = 0; j < this.listData[i].items.length; j++) {
            if (this.listData[i].items[j].id == item.id && this.listData[i].items[j].choose) {
              return true
            }
          }
        }
        return false
      },
      clickItem(item) {
        var num = this.getHasChooseNum();
        var contain = this.containThisItem(item)
        if (this.maxChoose && (this.maxChoose < num || this.maxChoose == num) && !contain) {
          // this.$message({
          //   duration: 1500,
          //   message: "最多只能选择" + this.maxChoose + "栏目"
          // });
          this.exceedMaxListener()
          return
        }
        if (item.choose) {
          item.choose = false
        } else {
          item.choose = true
        }
        var random = Math.random()
        this.$set(this.listData, "random", random)
        this.$delete(this.listData, "random")
        this.$emit("selectListener", item)
      },
    },
    mounted() {
      // this.listData.random = Math.random()
      // this.data = this.listData;
    },
  }
</script>

<style scoped>
  @import '../../assets/css/Customization/chooseOptionList.css';
  .choose_icon{
    width: 16px;
    height: 16px;
    position: absolute;
    left: 20px;
    top: 9px;
    line-height: 34px;
    background: url("../../assets/image/circle.png") no-repeat center;
  }
  .check_icon{
    width: 16px;
    height: 16px;
    position: absolute;
    left: 20px;
    top: 9px;
    line-height: 34px;
    background: #fff url("../../assets/image/right.png") no-repeat center;
    border-radius: 50%;
  }

</style>
