<template>

  <div class="zctables" style="background-color: white">

    <!--筛选器部分-->
    <div :id="options.id" class="zctables_select" v-if="options.selectData">

      <el-select :value="selectedValue"
                 size="mini"
                 @change="selectHasChanged"
                 style="width: 90px">
        <el-option v-for="item in options.selectData"
                   :value="item.value"
                   :label="item.label"
                   :key="item.label"
                   :disabled="item.value == selectedValue"></el-option>
      </el-select>

    </div>

    <!--列表部分-->
    <div id="zctables_content" style="overflow: auto">
      <el-table :data="data.length?data:null" 
                :header-cell-style="options?headerCellStyle:null"
                :cell-style="options?cellStyle:null"
                :border="options?options.showBorder:false"
                :show-header="options?options.showHeader:true"
                @header-click="headerClick"
                @cell-click="cellClick"
                :height="tableHeight"
                empty-text="暂无相关数据">

        <el-table-column ref="typeColumn_leading"
                         v-if="setupTypeColumn('leading').show"
                         :type="setupTypeColumn('leading').type">
        </el-table-column>

        <el-table-column v-for="(item,index) in columnData"
                        :render-header="item.msg?renderProductId:renderProductIds"
                        :prop="item.prop"
                        :label="item.label"
                        :key="item.prop"
                        :width="setupColumnWidth(index)"
                        :align="setupColumnAlign(index)">                      
        </el-table-column>

        <el-table-column ref="typeColumn_trailing"
                         v-if="setupTypeColumn('trailing').show "
                         :type="setupTypeColumn('trailing').type">
        </el-table-column>

        <el-table-column v-if="options.handleTitle" width="100px">
          <template slot-scope="scope">

            <div class="handleTitle fontSize13"
                 style="float:left;border: 1px solid #9b9b9b;border-radius: 13px;color: #9b9b9b;padding: 0 10px;cursor: pointer"
                 @click="handleEdit(scope.$index, scope)">{{options.handleTitle}}</div>

          </template>
        </el-table-column>

      </el-table>
    </div>

    <!--分页控制器部分-->
    <div class="zctables_page" v-if="showPageControl">

      <div class="zctables_page_size">
        <el-pagination
          :background="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes,->,prev, pager, next,->, jumper"
          :total="options.total">
        </el-pagination>
      </div>

    </div>

  </div>


</template>

<script>

  export default {
    name: "z-c-tables",
    props: {
      data: {
        type: Array, require: true, default() {
          return []
        }
      },
      columnData: {
        type: Array, require: true, default() {
          return []
        }
      },
      showPageControl:{type:Boolean,require:false,default:true},
      options: {
        type: Object, require: true,
        default:{
            id: {type: String, require: true},
            //总数据量
            total: {type: Number, require: true},
            //标题
            title: {type: String, require: false},
            //列样式
            columnStyle: {type: Object, require: false,},
            //行样式
            rowStyle: {type: Object, require: false,},
            //表头单元格样式
            headerStyle: {type: Object, require: false,},
            //是否显示表格线
            showBorder: {type: Boolean, require: false, default: true},
            //是否显示表头
            showHeader: {type: Boolean, require: false, default: true},
            //是否显示高亮效果
            highlightCurrentRow: {type: Boolean, require: false, default: true},
            //表格样式
            tableType: {type: Object, require: false},
            //筛选项数据
            selectData: {type: Array, require: false},
            //操作列的文字显示
            handleTitle: {type: String, require: false},
          }
      },
    },
    watch:{
      // 'options.total':function (val,oldVal) {
      //   if(val != oldVal){
      //     this.currentPage = 1;
      //   }
      // }
    },
    data() {
      return {
        showSelected:false,
        selectedValue: 0,//当前筛选项
        currentPage: 1,  //当前页码
        pageSize: 10,   //每页数据条数
        sortingIndex: undefined, //排序index
        descOrAsc:'1',
        outerText:[]
      }
    },
    computed: {
      pageSizes() {
        // return this.options.total >= 1000 ? (this.options.total >= 3000 ? [50, 100, 150, 200, 250] : [20, 40, 60, 80, 100]) : [10, 20, 30, 40, 50]
        return [10, 30, 50]
      },
      tableHeight() {
        // return this.data.length>=10?450+'px':null
        return null
      }
    },
    methods: {
      //添加排序图标
      renderProductId(h, {column, $index}){
        let that=this
        return (
            <span onClick={this.changesLoad}>
              {column.label}
              <i class='el-icon-caret-bottom' style="display:contents" onClick={this.eventFalse}></i>
            </span>
        )
      },
      //转换伪数组
      makeArray(obj){
        var rs=[],len=obj.length;
        try{
          rs = [].slice.call(obj,0);
        }catch(e){ //for IE
          for(var i=0;j=obj[i++];){
            rs.push(j);
          }
        }
        return rs;
      },
      eventFalse(e){
        e.stopPropagation()
        return false
      },
      //上下图标切换
      changesLoad(e){
          this.outerText.push(e.toElement.outerText)
          let arrTr=this.makeArray(e.path[3].children)
          let forTr=[]
          let styleBottom='el-icon-caret-bottom'
          let styleTop='el-icon-caret-top'
          arrTr.forEach(item=>{//移除多余tr
            if(item.className!='gutter'){
              forTr.push(item)
            }
          })
          if(this.outerText.length>2){
            this.outerText.splice(0,1)
          }
          e.toElement.childNodes[1].className==styleBottom?this.descOrAsc='1':this.descOrAsc='2'
          if(this.outerText[0]==this.outerText[1]){
            e.toElement.childNodes[1].className==styleBottom?e.toElement.childNodes[1].className=styleTop:e.toElement.childNodes[1].className=styleBottom
            e.toElement.childNodes[1].className==styleBottom?this.descOrAsc='1':this.descOrAsc='2'
            
          }else{
            forTr.forEach(item => {
                if(item.children[0].children[0].children[0].className!=''){              
                item.children[0].children[0].children[0].className=styleBottom
              }
            })
            
          }
          // this.updateDatas()
      },
      //添加标签
      renderProductIds(h, {column}){
        return h('span', [
            h('span', column.label),
        ]);
      },
      //**********************外部数据刷新方法*******************************
      updateDatas() {
        this.$emit('refresh-data', {
          selected: this.selectedValue,
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          sortingIndex: this.sortingIndex,
          descOrAsc:this.descOrAsc
        })
      },

      //**********************el-select部分的方法*******************************
      selectHasChanged(value) {
        // this.zc_log('selectHasChanged')
        //记录当前被选中的筛选项并执行外部刷新数据操作
        this.selectedValue = value;
        if (this.currentPage != 1) {
          this.currentPage = 1;
        }
        this.handleCurrentChange(1);
      },

      //**********************el-table部分的方法*******************************
      //主体单元格的样式设置
      cellStyle({row, column, rowIndex, columnIndex}) {


        row.rowIndex = rowIndex;
        column.columnIndex = ((this.options?this.options.tableType:false) && this.options.tableType.position == 'leading') ? columnIndex - 1 : columnIndex;

        var cellStyle = {};

        //设置列样式
        if (this.options.columnStyle && this.options.columnStyle.indexs.length && this.options.columnStyle.styles.length) {
          //公共参数设置
          Object.assign(cellStyle, this.options.columnStyle.commons);

          //判断当前时候有selection/index/spand列
          var newIndex = 0;
          if (this.$refs.typeColumn_leading) {
            newIndex = 1;
          }

          //单独列样式设置
          var column_indexs = this.options.columnStyle.indexs;
          var column_styles = this.options.columnStyle.styles;
          for (var i = 0; i < column_indexs.length; i++) {
            if (columnIndex - newIndex === column_indexs[i]) {
              Object.assign(cellStyle, column_styles[i])
            }
          }
        }
        //设置行样式
        if (this.options.rowStyle && this.options.rowStyle.indexs.length && this.options.rowStyle.styles.length) {
          //公共参数设置
          Object.assign(cellStyle, this.options.rowStyle.commons);

          //单独行样式设置
          var row_indexs = this.options.rowStyle.indexs;
          var row_styles = this.options.rowStyle.styles;
          for (var i = 0; i < row_indexs.length; i++) {
            if (rowIndex === row_indexs[i]) {
              Object.assign(cellStyle, row_styles[i])
            }
          }
        }

        return cellStyle;
      },

      //表头单元格的样式设置
      headerCellStyle({columnIndex}) {

        var cellStyle = {};

        //公共参数设置
        Object.assign(cellStyle, this.options.headerStyle.commons)

        //判断当前时候有selection/index/spand列
        var newIndex = 0;
        if (this.$refs.typeColumn_leading) {
          newIndex = 1;
        }

        //单独表格样式设置
        var header_indexs = this.options.headerStyle.indexs;
        var header_styles = this.options.headerStyle.styles;

        if (this.options.headerStyle && header_indexs.length) {
          for (var i = 0; i < header_indexs.length; i++) {

            if (header_indexs[i] == columnIndex - newIndex) {
              Object.assign(cellStyle, header_styles[i])
            }
          }
        }
        return cellStyle;
      },

      //列宽度设置
      setupColumnWidth(index) {

        var column_indexs = this.options.columnStyle.indexs;
        var column_styles = this.options.columnStyle.styles;

        for (var i = 0; i < column_indexs.length; i++) {
          if (index === column_indexs[i]) {
            if (column_styles[i].width) {
              // this.$refs.column[columnIndex].width = column_styles[i].width;
              return column_styles[i].width
            } else {
              return ''
            }
          }
        }
      },

      //列对齐方式设置
      setupColumnAlign(index) {

        var columnStyle = {};

        if (this.options.columnStyle.commons) {
          Object.assign(columnStyle, this.options.columnStyle.commons)
        }
        var column_indexs = this.options.columnStyle.indexs;
        var column_styles = this.options.columnStyle.styles;


        for (var i = 0; i < column_indexs.length; i++) {
          if (index === column_indexs[i]) {
            if (column_styles[i].align || column_styles[i].textAlign) {
              Object.assign(columnStyle, column_styles[i].align ? column_styles[i].align : column_styles[i].textAlign)
            }
          }
        }
        return columnStyle.toString()
      },

      //列类型设置
      setupTypeColumn(position) {
        if (!this.options){
          return{show:false}
        }
        if (this.options.tableType && this.options.tableType.position === position) {
          return {show: true, type: this.options.tableType.commons}
        } else {
          return {show:false}
        }
      },

      //表头点击事件监听
      headerClick(column) {
        
        // this.zc_log('headerClick')
        //记录当前被点击的columnIndex
        for (var i = 0; i < this.columnData.length; i++) {
          if (this.columnData[i].prop == column.property) {
            this.sortingIndex = i; 
         }
        }
        if (this.currentPage == 1) {
          this.handleCurrentChange(1);
        } else {
          this.currentPage = 1;
        }
        
      },

      //表格点击事件监听
      cellClick(row, column,event) {

        this.$emit('click-tablecell', {
          rowIndex: row.rowIndex,
          columnIndex: column.columnIndex
        });

      },

      //**********************分页部分的方法*******************************
      //分页容量对应监听方法
      handleSizeChange(val) {
        // this.zc_log('handleSizeChange');
        this.pageSize = val;
        if (this.currentPage != 1) {
          this.currentPage = 1;
        }
        this.handleCurrentChange(1);
      },

      //分页器更换对应监听方法
      handleCurrentChange(val) {
        this.currentPage = val;
        this.updateDatas();
      },

      handleEdit(index, scop) {
        this.$emit('handle-cell-click', {
          rowIndex: index,
        });
      }
    },
    mounted() {
      this.updateDatas();
    }
  }
</script>

<style>

  .zctables_title {
    background-color: white;
    /* font-size: 15px; */
    color: #000;
    margin: 0;
    padding: 0;
    text-align: left;
    margin-bottom: 20px;
  }

  .zctables .zctables_select {
    background-color: white;
    /* font-size: 15px; */
    color: #111111;
    padding: 0;
    margin: -10px 0 10px 0;
    text-align: right;
  }

  .zctables_page {
    padding: 10px 0;
  }

  .cell {
    overflow: hidden!important;
    white-space: nowrap !important;
    text-overflow: ellipsis!important;
  }

  /*分页效果样式复写*/
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li{
  background: none;
  color: #606266;
  border: 1px solid #E2E3E4;
}
.el-pagination.is-background .el-pager li:not(.disabled).active{
  background: none;
  color: #3B87F5;
  border: 1px solid #3B87F5;
}
</style>
