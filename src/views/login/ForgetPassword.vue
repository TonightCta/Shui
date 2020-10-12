<template>
    <div class="forget-password">
        <el-container>
            <el-main class="main">
              <p>忘记密码</p>
              <div class="tabs-cont">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item  prop="age">
                        <el-input v-model.number="ruleForm.age" placeholder="手机号/邮箱"></el-input>
                    </el-form-item>
                    <el-form-item class="tips">
                        <el-input placeholder="图片验证码" v-model="vCode1">
                          <template slot="append"><img class="vcode-img" src="@/assets/timg.jpeg"/></template>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="tips">
                        <el-input placeholder="请输入内容" v-model="vCode2">
                          <template slot="append">获取验证码</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="login-btn" type="primary" @click="submitForm('ruleForm')">重置密码</el-button>
                        <router-link to="/login">
                          <el-button class="login-btn" @click="resetForm('ruleForm')">返回登录</el-button>
                        </router-link>
                    </el-form-item>
                </el-form>
              </div>
            </el-main>
        </el-container>
    </div>
</template>
<script>
export default {
  name: 'Login',
  data () {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账号不能为空'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }

    return {
      name: '用户名：',
      // activeName: 'first',
      // checked: true,
      vCode1: '',
      vCode2: '',
      ruleForm: {
        pass: '',
        checkPass: '',
        age: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        age: [
          { validator: checkAge, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.forget-password {
    width: 420px;
    height: 420px;
    font-size: 18px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    .main{
        width: 400px;
        height: 400px;
        padding: 0;
        padding-top: 10px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        margin: 0 auto;
        p{
          margin: 0;
          margin-top: 10px;
        }
        .el-tabs__nav-wrap{
            padding-left: 10px;
            padding-right: 10px;
        }
        .el-tabs__nav.is-stretch{
            height: 50px;
        }
        .tabs-cont{
            padding: 10px;
            margin-top: 15px;
            form{
                width: 320px;
                margin: 0 auto;
            }
            .login-btn{
                width: 100%;
                margin-left: 0;
                margin-bottom: 10px;
            }
            .tips{
                .el-checkbox__label{
                    font-size: 13px;
                }
                .el-checkbox{
                    float: left;
                }
                .span1{
                    font-size: 12px;
                    color: #409EFF;
                    float: right;
                }
                .el-input-group__append{
                  width: 100px;
                  .vcode-img{
                    height: 30px;
                  }
                }
            }
        }
        .el-form-item__content{
            margin-left: 0 !important;
        }
    }
}
</style>
