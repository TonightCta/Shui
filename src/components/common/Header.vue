<template>
  <div>
      <div class="logo">
        <img/>
        <p @click="toProjList"><span>工作台</span>
        <span v-if="bimapplyName !== ''">|</span>
        <span>{{bimapplyName}}</span></p>
      </div>
      <div class="user-set">
        <i class="el-icon-question" style="margin-right: 15px"></i>
        <el-badge is-dot :hidden="badge">
          <i class="el-icon-chat-dot-round" style="margin-right: 15px"></i>
        </el-badge>
        <i class="el-icon-s-custom" style="margin-right: 15px"></i>
        <el-dropdown size="mini" type="primary" @command="exitLogin">
            <span>{{username}}</span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item command="退出">安全退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
export default {
  name: 'Header',
  data () {
    return {
      badge: false
    }
  },
  computed: {
    ...mapGetters(['username', 'token', 'bimapplyName'])
  },
  methods: {
    toProjList () { // 跳转至项目列表页
      store.dispatch('SetCurrentApply', {id: '', name: ''})
      this.$router.push('/projectList')
    },
    exitLogin (command) { // 退出登录
      store.dispatch('ExitLogin').then(() => {
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .logo{
    float: left;
    .radios{
      float: left;
      margin-top: 10px;
    }
    p{
      height: 60px;
      text-align: left;
      float: left;
      margin: 0;
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
      span{
        margin-top: 5px;
        &:first-child{
          font-size: 20px;
          margin-right: 10px;
        }
        &:last-child{
          margin-left: 10px;
        }
      }
    }
  }
  .user-set{
    i{
      font-size: 18px;
    }
    span{
      font-size: 16px;
    }
    .el-badge__content.is-fixed.is-dot{
      right: 19px;
    }
    .el-badge__content.is-fixed{
      top: 22px;
    }
    .el-badge__content.is-dot{
      height: 5px;
      width: 5px;
    }
  }
  .dropdown-menu{
    margin-top: -10px !important;
  }
  .el-header {
      background-color: #B3C0D1;
      color: #333;
      line-height: 60px;
  }
</style>
