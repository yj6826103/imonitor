<template>

  <div class="uploadArticleContent">
    <div class="block_rzl uploadControl">
      <div class="uploadTitle">
        <span class="upload_left">文件名称：</span>
        <input type="text" v-model="uploadName" @keyup="VerificationName" placeholder="请输入不超过10个字符的文件名称">
      </div>
      <div class="chooseExcel">
        <span class="upload_left">上传表格：</span>
        <span class="upload_right_file">
            <input type="file" id="file" @change="changeFile" value="选择excel">
            <span class="chooseBtn" v-if="judgeFC">选择excel</span>
            <span v-text="fileName" v-else></span>
        </span>
      </div>
      <div class="progress">
        <span class="upload_left">上传进度：</span>
        <span style="width:400px">
          <el-progress color="#4642FF" :stroke-width='10' :show-text='false' :percentage='tageData'></el-progress>
          <span class="Uploading" v-show="upLoading">上传中...</span>
        </span>
      </div>
      <div class="upload_buttons">
        <input type="button" @click="uploadFile" value="上传" class="buttons_upload">
        <input type="button" value="重置" @click="ResetFile" class="buttons_Reset">
      </div>
    </div>


    <div class="block_rzl">
      <div class="title_rzl" @click="uploadList">已添加的文章组:</div>
      <Tables :data="uploadExcelData"
          :columnData="uploadExcelColumn"
          :options="options"
          @refresh-data="refreshData">
      </Tables>
    </div>
  </div>
</template>

<script>
  import Tables from '@/components/common/ZCTables'
  export default {
    name: "upload-article-content",
    components: { Tables},
    props: {
      sidebarType: {type: String / Number, require: true},
      plantformId: {type: String / Number, require: true},
      datePickerParams: {type: Object, require: true}
    },
    data(){
      return{
        uploadName:'',
        upLoading:false,//上传中
        tageData:0,//上传进度
        fileName:'',//文件名
        judgeFC:true,//判断文件变动
        file:{},

        uploadExcelData: [],
        uploadExcelColumn: [],

        options: {},
        total: 0,//作品总数
        pageNo: 1,//当前页码数
        pageSize: 10,//每页条数
      }
    },
    watch: {
      pageSize(val) {
        this.uploadList(this.pageNo,val)
      }
    },
    methods:{
      VerificationName(){
        if(this.uploadName.length>10){
          this.$message.error('文件名称不能超过10个字符')
          return
        }
      },
      //上传
      uploadFile(){
        if(this.fileName==''){
          this.$message.error('请选择上传文件')
          return
        } 
        let ext = this.fileName.slice(this.fileName.lastIndexOf(".")+1).toLowerCase(); 
        if("xls" == ext||'xlsx'==ext){
          this.upLoading=true
          for(let i=1;i<7;i++){
            this.tageData=i*10
          }
          let uploadData = new FormData()
          uploadData.append('file', this.file)
          uploadData.append('uploadName', this.uploadName)
          
          this.$http.post(this.baseUrl + '/upload/uploadExcel',uploadData).then(function(res) {
            var response = JSON.parse(res.bodyText)
            if(response.code==200){
              this.tageData=100
              this.upLoading=false
              this.$message({
                message: '上传成功',
                type: 'success'
              });
              this.uploadList(1,this.pageSize)
              this.ResetFile()
            }
          }),function(err){
            console.log(err)
          }
        }else{
          this.$message.error('仅支持Excel格式文件')
        }
      },
      //获取列表
      uploadList(pageNo,pageSize){
        let params={
          pageNo:pageNo,
          pageSize:pageSize
        }
        this.$http.post(this.baseUrl + '/upload/uploadList?pageNo='+pageNo+'&pageSize='+pageSize).then(function(res) {
          var response = JSON.parse(res.bodyText)
          if(response.code==200){
            this.uploadExcelData=response.data.content
            this.total=response.data.totalElements
            this.initData(this.total)
          }
        }),function(err){
          console.log(err)
        }
      }, 
      //重置
      ResetFile(){
        this.judgeFC=true
        this.fileName=''
        this.tageData=0
        this.uploadName=''
        this.upLoading=false
      },
      //fiel改变
      changeFile(e){  
        let TargetFiles= e.currentTarget.files  
        if(TargetFiles.length!=0){
          this.tageData=0  
          this.fileName=TargetFiles[0].name
          this.file=TargetFiles[0]
          if(this.fileName!=''){
            this.judgeFC=false
          }
        }
      },

      refreshData({selected, currentPage, pageSize, sortingIndex}) {
        // this.zc_log(`筛选项=${selected},当前页=${currentPage},每页数=${pageSize},排序项=${sortingIndex}`);
        this.pageNo = currentPage;
        this.pageSize = pageSize;
        this.uploadList(this.pageNo,this.pageSize)
      },
      initData(total){//初始化值
        this.uploadExcelColumn = [
          {prop: 'index', label: '序号'},
          {prop: 'name', label: '文件名称'},
          {prop: 'createTime', label: '上传时间'},
          {prop: 'articleNumber', label: '文章数'},
        ];
        this.options = {
          id: 'uploadExcel_tables',
          total: this.total,
          titleStyle: {
            fontSize: '20px',
            color: '#111111',
            textAlign: 'center',
            paddingBottom: '0'

          },
          showBorder: false,
          //表格列样式
          columnStyle: {
            indexs: [0, 1, 2, 3],
            styles: [
              {textAlign: 'center',width:'80px'},
              {textAlign: 'center'},
              {textAlign: 'center'},
              {textAlign: 'center'},
            ],
            commons: {textAlign: 'center', color: '#444'}
          },
          //表格表头样式
          headerStyle: {
            indexs: [1,2,3,4],
            styles: [{textAlign: 'center'},{textAlign: 'center'}],
            commons: {backgroundColor: '#f4f4f4', textAlign: 'center', padding: '5px 0'}
          }
        };
      }
    },
    mounted(){
      this.initData()
      this.uploadList(this.pageNo,this.pageSize)
    }
  }
</script>

<style scoped>
  
  .uploadArticleContent .uploadControl{
    /* font-size: 14px; */
    font-weight: 900;
  }
  .uploadArticleContent .uploadTitle{
    margin-bottom: 50px;
  }
  .uploadArticleContent .uploadTitle input{
    height: 18pt;
    /*line-height: 18pt;*/
    padding: 5px 0 5px 18px;
    border: 1px solid #d0d0d0;
    width: 380px;
    border-radius: 6px;
    /* font-size: 12px; */
    outline: none
  }
  .uploadArticleContent .upload_left{
    width: 100px;
    display: inline-block;
    /* font-size: 16px; */
    line-height: 16px
  }
  .uploadArticleContent .chooseExcel .chooseBtn{
    display: inline-block;
    border: 1px solid #3B87F5;
    border-radius: 8px;
    color: #3B87F5;
    /* font-size: 16px; */
    margin: 0;
    width: 171px;
    text-align: center;
    height: 34px;
    line-height: 34px;
    position: absolute;
    top:-5px;
    left: 5px;
  }
  .uploadArticleContent .progress{
    display: inline-block;
    margin: 28px 0 32px
  }
  .uploadArticleContent .progress span{
    float: left;
    margin-right:5px;
  }
  .uploadArticleContent .progress span:nth-child{
    display: block;
  }
  .uploadArticleContent .progress span .Uploading{
    width: 100%;
    text-align: center;
    /* font-size: 11px; */
    height: 13px;
    line-height: 13px;
    margin-top:4px
  }
  .uploadArticleContent .upload_right_file{
    position: relative;
  }
  .uploadArticleContent .upload_right_file input{
    position: absolute;
    opacity: 0;
    z-index: 99;
    cursor: pointer;
    width: 170px;
    left: 5px;
  }
  .uploadArticleContent .upload_buttons{
    margin-left: 224px;
    clear: both;
  }
 .uploadArticleContent  .upload_buttons input{
    width: 84px;
    height: 36px;
    line-height: 36px;
    /* font-size: 16px; */
    border-radius: 8px;
    border:1px solid #3B87F5;
    outline: none
  }
  .uploadArticleContent .upload_buttons input:hover{
    cursor: pointer;
    opacity: 0.9;
  }
  .uploadArticleContent .upload_buttons .buttons_upload{
    background: #3B87F5;
    color: #fff;
    margin-right: 28px
  }
  .uploadArticleContent .upload_buttons .buttons_Reset{
    background: #fff;
    color: #3B87F5;
  }

</style>
