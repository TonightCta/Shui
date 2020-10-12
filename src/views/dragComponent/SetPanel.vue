<template>
    <el-dialog class="setpanel-dialog" title="设置面板" :visible="setPanelVisible" @close="close">
      <el-form :model="form">
        <el-form-item label="面板宽度：" :label-width="formLabelWidth">
          <el-input v-model="form.width" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="面板高度：" :label-width="formLabelWidth">
          <el-input v-model="form.height" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="面板距离顶部：" :label-width="formLabelWidth">
          <el-input v-model="form.top" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="面板距离左边：" :label-width="formLabelWidth">
          <el-input v-model="form.left" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="面板字体：" :label-width="formLabelWidth">
          <el-input v-model="form.fontSize" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="面板类型：" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="请选择版面类型">
            <el-option v-for="(item, index) in type" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面板背景颜色：" :label-width="formLabelWidth">
          <el-color-picker v-model="form.backgroundColor"></el-color-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
</template>
<script>
export default {
  name: 'SetPanel',
  props: ['setPanelVisible', 'panelForm', 'type'],
  data () {
    return {
      formLabelWidth: '110px',
      form: {
        width: '',
        height: '',
        left: '',
        top: '',
        fontSize: '',
        type: '',
        backgroundColor: '#fff'
      }
    }
  },
  created () {
    this.form = {...this.panelForm}
  },
  watch: {
    panelForm: {
      deep: true,
      handler (v) {
        this.form = {...v}
      }
    }
  },
  methods: {
    submit () {
      this.$emit('setPanel', this.form)
      this.$emit('close')
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss">
.setpanel-dialog{
  .el-dialog{
    width: 400px;
    .el-input{
      width: 250px;
    }
  }
}
</style>
