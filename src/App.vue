<template>
  <div id="app">
    <router-view/>
    <div class="mappop" id="mappop">
      <iframe src=""></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

html,body{
  height: 100%;margin: 0;padding: 0;
}
body{
  overflow: hidden;
}
a{
    text-decoration: none;
}
.width1{
  width: 100%;
}
.textLeft{
  text-align: left !important;
}
.el-tabs__item:focus.is-active.is-focus:not(:active) {
  -webkit-box-shadow: none;
  box-shadow: none;
}
.amap-marker-label{
  /* width: 400px; */
  border: 1px solid rgb(241, 241, 241);
  border-radius: 4px;
  background-color: #fff;
  white-space: normal;
}
.mappop{
  display: none;
  position: fixed;
  /* top: 20px;
  left: 20px; */
  background: #fff;
  z-index: 99999;
}
.mappop iframe{
  width: 100%;
  height: 100%;
}
:focus{
  outline:none
}
</style>
