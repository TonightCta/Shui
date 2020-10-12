<template>
    <el-dialog class="dialog1" :title="title"
    :visible.sync="dialogFormVisible"
    :before-close="handleClose">
        <el-form :model="form" :rules="rules">
          <!-- <el-form-item label="apply_id" :label-width="formLabelWidth">
            <el-input v-model="form.apply_id" autocomplete="off" placeholder="请输入apply_id"></el-input>
        </el-form-item> -->
        <el-form-item label="数据源名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" placeholder="请输入数据源名称"></el-input>
        </el-form-item>
        <el-form-item label="数据库" :label-width="formLabelWidth">
            <el-select v-model="form.sql_type" placeholder="请选择数据库">
            <el-option label="mysql" value="mysql"></el-option>
            <el-option label="sql server" value="sql server"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="ip地址" :label-width="formLabelWidth">
            <el-input v-model="form.sql_addr" autocomplete="off" placeholder="请输入ip地址"></el-input>
        </el-form-item>
        <el-form-item label="端口" :label-width="formLabelWidth">
            <el-input v-model="form.sql_port" autocomplete="off" placeholder="请输入端口号"></el-input>
        </el-form-item>
        <el-form-item label="数据库名称" :label-width="formLabelWidth">
            <el-input v-model="form.sql_name" autocomplete="off" placeholder="请输入数据库名称"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="form.sql_user" autocomplete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="form.sql_password" autocomplete="off" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { addSource, editSource } from '@/api/applySouce'
import store from '@/store'
export default {
  name: 'AddDataSource',
  props: ['visible', 'title', 'editData'],
  data () {
    return {
      formLabelWidth: '120px',
      form: {
        apply_id: '',
        name: '',
        sql_type: '',
        sql_addr: '',
        sql_port: '',
        sql_name: '',
        sql_user: '',
        sql_password: ''
      },
      rules: {
        sql_addr: [
          { type: 'number', trigger: 'change', message: '必须为数字' }
        ],
        sql_port: [
          { type: 'number', trigger: 'change', message: '必须为数字' }
        ]
      }
    }
  },
  computed: {
    dialogFormVisible: {
      get () {
        return this.visible
      }
    },
    ...mapGetters(['token', 'bimapplyId', 'bimapplyName'])
  },
  watch: {
    editData: {
      deep: true,
      handler (v) {
        this.form = v
        // this.$set(this.form, 'sql_name', '')
      }
    },
    title (v) {
      if (v === '添加数据源') {
        this.form = {
          apply_id: '',
          name: '',
          sql_type: '',
          sql_addr: '',
          sql_port: '',
          sql_name: '',
          sql_user: '',
          sql_password: ''
        }
      }
    }
  },
  updated () {
    // console.log('90-90-9890:' + this.editData)
  },
  methods: {
    close () {
      this.$emit('closeDialog')
    },
    handleClose () {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$emit('closeDialog')
        })
        .catch(er => {
          console.log(er)
        })
    },
    // 新增数据源
    addSource () {
      this.form.apply_id = this.bimapplyId
      addSource(this.token, this.form).then(res => {
        if (res.data.success) {
          this.$emit('updateClassify')
        }
        store.dispatch('OpenTipsDialog', res.data.msg).then(() => {
          this.close()
        })
      }).catch(er => {
        console.log(er)
      })
    },
    // 编辑数据源
    editSource () {
      let obj = this.form = {
        id: this.form.id,
        name: this.form.name,
        sql_type: this.form.sql_type,
        sql_addr: this.form.sql_addr,
        sql_port: this.form.sql_port,
        sql_name: this.form.sql_name,
        sql_user: this.form.sql_user,
        sql_password: this.form.sql_password
      }
      editSource(this.token, obj).then(res => {
        if (res.data.success) {
          this.$emit('updateClassify')
        }
        store.dispatch('OpenTipsDialog', res.data.msg).then(() => {
          this.close()
        })
      }).catch(er => {
        console.log(er)
      })
    },
    submit () {
      if (this.title === '编辑数据源') {
        this.editSource()
      } else {
        this.addSource()
      }
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" >
</style>
