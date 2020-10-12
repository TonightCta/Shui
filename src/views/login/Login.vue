<template>
    <div class="login">
        <el-container>
            <el-main class="main">
                <el-tabs class="tabs" stretch v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane class="tabs-cont" label="账号登录" name="first">
                        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                            <el-form-item  prop="account">
                                <el-input v-model.number="ruleForm.account" placeholder="手机号/邮箱"></el-input>
                            </el-form-item>
                            <el-form-item label="" prop="password" class="password">
                                <el-input type="password" v-model="ruleForm.password"  placeholder="密码" show-password></el-input>
                            </el-form-item>
                            <el-form-item class="tips">
                                <el-checkbox v-model="checked" @change="autoLogin">下次自动登录</el-checkbox>
                                <!-- <router-link to="/forgetpassword">
                                  <span class="span1">忘记密码了？</span>
                                </router-link> -->
                            </el-form-item>
                            <el-form-item>
                                <el-button class="login-btn" type="primary"
                                @click="submitForm('ruleForm')">登录</el-button>
                                <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="微信扫码登录" name="second">正在建设中...</el-tab-pane>
                    <el-tab-pane label="企业微信登录" name="third">正在建设中...</el-tab-pane>
                </el-tabs>
            </el-main>
            <div class="login-right">
              <div class="cont">
              <img src="@/assets/logo.png"/>
              <p>宁夏水务投资集团</p>
              </div>
            </div>
        </el-container>
        <Dialog/>
    </div>
</template>
<script>
import Dialog from '@/components/common/Dialog'
import store from '@/store'
import { mapGetters } from 'vuex'
export default {
  name: 'Login',
  components: {Dialog},
  data () {
    var checkAccount = (rule, value, callback) => {
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
        // if (this.ruleForm.checkPass !== '') {
        //   this.$refs.ruleForm.validateField('checkPass')
        // }
        callback()
      }
    }
    return {
      name: '用户名：',
      activeName: 'first',
      checked: true,
      ruleForm: {
        account: localStorage.getItem('account') || '',
        password: localStorage.getItem('password') || ''
      },
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        account: [
          { validator: checkAccount, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  created () {
    // 回车登录
    let lett = this
    document.onkeydown = function (e) {
      let key = window.event.keyCode
      if (key === 13) {
        lett.submitForm('ruleForm')
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.checked) {
            localStorage.setItem('account', this.ruleForm.account)
            localStorage.setItem('password', this.ruleForm.password)
          }
          this.login()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleClick (tab, event) {
      // console.log(tab, event)
    },
    login () {
      store.dispatch('LoginByAccount',
        {account: this.ruleForm.account, password: this.ruleForm.password}).then(
        () => {
          this.$router.push('/projectList')
        }
      ).catch(er => {
        console.log(er)
      })
    },
    // 选择是否自动登录
    autoLogin (v) {
      if (v) {
        localStorage.setItem('account', this.ruleForm.account)
        localStorage.setItem('password', this.ruleForm.password)
      } else {
        localStorage.removeItem('account')
        localStorage.removeItem('password')
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.login {
    width: 760px;
    height: 420px;
    font-size: 18px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    .main{
        width: 380px;
        height: 400px;
        padding: 0;
        padding-top: 10px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        margin: 0 auto;
        .el-tabs__nav-wrap{
            padding-left: 10px;
            padding-right: 10px;
        }
        .el-tabs__nav.is-stretch{
            height: 50px;
        }
        .tabs-cont{
            padding: 10px;
            margin-top: 30px;
            form{
                width: 320px;
                margin: 0 auto;
            }
            .login-btn{
                width: 100%;
            }
            .password{
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
            }
        }
        .el-form-item__content{
            margin-left: 0 !important;
        }
    }
    .login-right{
      width: 380px;
      height: 400px;
      background: #409EFF;
      position: relative;
      .cont{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        height: 135px;
        img{
          height: 50px;
        }
        p{
          color: #ffffff;
          font-size: 18px;
          font-family: 'MicrosoftYaHei';
          margin-top: 30px;
        }
      }
    }
}
</style>
