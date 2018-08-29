<template>
  <div class="topSelectTop">
    <el-row type="flex" justify="space-around">
      <el-col :span="item.text?2:1" @click.native="select(index)" v-for="(item,index) in data" :key="item.text+index"
              style="text-align: center">
        <div class="item" :class="{select:item.select}" v-if="item.text">{{item.text}}</div>
        <div class="item" v-if="!item.text" style="cursor:default"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "top-select-menu",
    props: ["menuData1", "menuData2"],
    methods: {
      select(index) {
        this.$emit("select", [index, (this.emptyIndex == -1 ? 0 : index < this.emptyIndex ? 0 : 1)]);
        this.data[index].select = true
        for (var i = 0; i < this.data.length; i++) {
          if (i != index) {
            this.data[i].select = false
          }
        }
      }
    },
    data() {
      return {
        width: 0,
        data: [],
        emptyIndex: -1
      }
    },
    mounted() {
      if (!this.menuData2) {
        this.data = this.menuData1
      } else {
        this.data = this.menuData1
        this.data.push({text: "", select: false})
        this.emptyIndex = this.menuData1.length
        this.data = this.data.concat(this.menuData2)
      }
      this.width = 24 / this.data.length
      // this.zc_log(this.width)
    }
  }
</script>

<style scoped>
  @import '../../assets/css/common/topSelectMenu.css';
</style>
