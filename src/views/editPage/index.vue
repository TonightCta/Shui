<template lang="html">
  <div class="editContent">
    <div class="editHeader">

    </div>
    <div class="contentMes">
      <Left/>
      <div class="amap" id="editMap">
        Map
      </div>
      <Right/>
    </div>
  </div>
</template>

<script>
import Left from './left'
import Right from './right'
export default {
  components:{Left,Right},
  mounted(){
    this.initMap()
  },
  methods:{
    initMap(){
      let map= new AMap.Map('editMap',{
        zoom:13,
        center:[118.122752,24.46743],
        viewMode:'3D',
        resizeEnable:true
      });
      // 同时引入工具条插件，比例尺插件和鹰眼插件
      AMap.plugin([
          'AMap.ToolBar',
          'AMap.Scale',
      ], function(){
          // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
          map.addControl(new AMap.ToolBar());

          // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
          map.addControl(new AMap.Scale());
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.editContent{
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 60px;
  .editHeader{
    width: 100%;
    height: 60px;
    background: #eee;
    z-index: 100;
    position: absolute;
    top:0;
    left: 0;
    box-shadow: 0px 0px 10px 0 #999;
  }
  .contentMes{
    width: 100%;
    display: flex;
    .amap{
      width: 64%;
      height: 878px;
    }
  }
}
</style>
