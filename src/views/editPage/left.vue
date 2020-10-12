<template lang="html">
  <div class="editLeft">
    <p class="leftTitle">控件</p>
    <div class="">
      <el-button size="small" type="primary" icon="el-icon-c-scale-to-original">表单</el-button>
      <el-button size="small" type="primary" icon="el-icon-document-add">面板</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{

    }
  }
}
</script>

<style lang="scss" scoped>
.editLeft{
  width: 18%;
  height: 878px;
  border-right: 1px solid #ccc;
  box-shadow: 0px 0px 10px 5px #999;
  z-index: 10;
  .leftTitle{
    text-align: left;
    font-size: 16px;
    box-sizing: border-box;
    padding-left: 10px;
  }
}
</style>
