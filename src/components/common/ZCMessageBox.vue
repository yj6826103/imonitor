<template>

  <div class="messagebox" v-if="isShow">

    <div class="boxcover" @click="closeMyself">
    </div>

    <div class="content">
      <div class="close">
        <el-button type="text" @click="closeMyself($event)" name="cancel">X</el-button>
      </div>

      <div class="disc">
        <h2>确定要删除{{text}}吗?</h2>
      </div>
      <div class="sure">
        <el-button @click="closeMyself($event)" name="sure">确定</el-button>
        <el-button @click="closeMyself($event)" name="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "message-box",
    props:
      {
        isShow: {type: Boolean, default: false},
        text: {type: String, default: '', require: false}
      },
    methods: {
      closeMyself(event) {
        var btnType = event.currentTarget.name;
        this.$emit('close-alert',btnType);
      },

    }

  }
</script>

<style scoped>

  button {
    padding: 0;
    font-size: 10px;
  }

  .messagebox, .boxcover {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .boxcover {
    background-color: black;
    opacity: .3;
  }

  .messagebox .content {
    position: fixed;
    top: 10%;
    left: 25%;
    background-color: white;
    width: 50%;
    max-height: 200px;
  }

  .messagebox .content .close {
    text-align: right;
    padding: 5px;
  }

  .messagebox .content .disc {
    text-align: center;
    padding: 10px;
  }

  .messagebox .content .sure {
    text-align: center;
    padding: 10px;
  }

  .messagebox .content .sure button {
    padding: 5px 10px;
    margin: 0 20px;
    /* font-size: 15px; */
  }

</style>
