<template>
  <div class="home-page">
    <h1>{{ msg }}</h1>
    <router-link to="/login">
      <el-button type="primary">登 录</el-button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '欢迎来到BIM管理系统'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
.home-page{
  width: 100%;
  height: 110px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
</style>
