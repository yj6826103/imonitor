<template>
  <div class="copyRightTables" v-if="tableData">
    <div class="title-box" style="margin-bottom: 5px">
      <span class="title">  {{titleType}}</span>
      <span class="title-name"> {{title}}</span>
    </div>
    <div class="title-box">
      <span class="title">  {{transTitleType}}</span>
      <span class="title-name"> {{transTitle}}</span>
    </div>
    <div class="list">
      <div class="item" v-for="item in items">
        <div class="title">
          {{item.title}}
        </div>
        <div class="content">
          <div v-if="item.type=='text'">
            {{item.content}}
          </div>
          <a :href="item.content" v-if="item.type=='url'" style="color: #3B87F5">
            {{item.content}}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "copy-right-tables",
    props: ["tableData"],
    data() {
      return {
        items: [],
        title: "",
        titleType: "",
        transTitle:'',
        transTitleType:''
      }
    },
    watch: {
      tableData(oldData, newData) {
        if (this.tableData) {
          var isOrigin = this.tableData.articleType == 0 ? true : false;
          this.title = isOrigin ? this.tableData.platformName : this.tableData.mediaName;
          this.titleType = isOrigin ? "本文" : "本文";
          this.transTitle = isOrigin ? this.tableData.source : this.tableData.transAnnotationSource;
          this.transTitleType = isOrigin ? "来源" : "来源";

          this.items = [];
          this.items.push({
            title: "标题",
            type: 'text',
            content: isOrigin ? this.tableData.title : this.tableData.transTitle
          });
          this.items.push({
            title: "发布链接",
            type: 'url',
            content: isOrigin ? this.tableData.url : this.tableData.transUrl
          });
          this.items.push({
            title: "发布时间",
            type: 'text',
            content: isOrigin ? this.tableData.publishTime : this.tableData.transPublishTime
          });
          this.items.push({
            title: "正文字数",
            type: 'text',
            content: isOrigin ? this.tableData.contentNum : this.tableData.transContentNum
          });
          if (isOrigin) {
            this.items.push({title: "编号", type: 'text', content:this.tableData.unionId})
          } else {
            this.items.push({title: "版权存疑", type: 'text', content: this.tableData.isTort=="1"?"注明来源":"版权存疑"})
          }
        }
      }
    },
    methods: {
      goTo(item) {

      }
    },
    mounted() {
      this.goTo = (item) => {
        if (item.type == 'url') {
          window.open(item.url)
        }
      }
    }
  }
</script>

<style scoped>
  @import '../../assets/css/Copyringht/copyRightTables.css';
</style>
