<template>
    <div class="map-only" id="mapOnly">
      <div class="amap" id="mapImg"></div>
      <el-tooltip v-if="sign !== ''" class="enter-backstage" effect="dark" content="点击进入后台系统" placement="top-start">
        <el-button type="primary" icon="el-icon-data-line" circle @click="enterBackstage"></el-button>
      </el-tooltip>
      <!-- <el-tooltip v-if="sign !== ''" class="enter-backstage enter-backstage2" effect="dark" content="点击进入大屏展示" placement="top-start">
        <el-button type="primary" icon="el-icon-full-screen" circle @click="enterBigScreen"></el-button>
      </el-tooltip> -->
      <Dialog/>
    </div>
</template>
<script>
import { pointLogin } from '@/api/login'
import store from '@/store'
import Dialog from '@/components/common/Dialog'
import AMap from 'AMap'
import Cookies from 'js-cookie'
import { findMapConfigByPageId,
  findMapDataConfig, findMapDataConfigSourceData, getPageId } from '@/api/applySouce'
export default {
  name: 'AMap',
  components: {
    Dialog
  },
  data () {
    return {
      pageId: '',
      map: {}, // 地图
      markerList: [], // 点标记
      sign: ''
    }
  },
  created () {
    if (this.$route.query.sign) {
      store.dispatch('CloseTipsDialog')
      store.commit('SET_TOKEN', '')
      store.commit('SET_NAME', '')
      store.commit('SET_ACCOUNT', '')
      Cookies.remove('bimToken')
      let sign = this.$route.query.sign
      this.sign = sign
      this.pointLogin(sign)
    } else {
      let that = this
      if (Cookies.get('bimToken')) {
        getPageId().then(res => {
          if (res.data.success) {
            that.pageId = res.data.apply_page_id
          }
        }).catch(er => {
          console.log(er)
        })
      } else {
        this.$router.push('/login')
      }
    }
  },
  mounted () {
    document.getElementById('mapOnly').style.height = document.body.offsetHeight + 'px'
    this.MapInit()
  },
  destroyed () {
    this.map.destroy()
  },
  methods: {
    // 登录
    pointLogin (sign) {
      pointLogin(sign).then(res => {
        if (res.data.success) {
          store.dispatch('SetToken', res.data.obj.bimToken)
          store.dispatch('GetUserInfo', res.data.obj.bimToken)
          // 获取地图
          this.pageId = res.data.obj.apply_page_id
        } else {
          store.dispatch('OpenTipsDialog', res.data.msg + '3秒后跳转至登录页面')
          setTimeout(() => {
            this.$router.push('/login')
          }, 3000)
        }
      }).catch(er => {
        this.$router.push('/login')
        console.log(er)
      })
    },
    // 跳转到后台管理应用列表页面
    enterBackstage () {
      // this.$router.push('/projectList')
      this.$router.push({ path: '/projectList' })
    },
    // 跳转到大屏展示
    enterBigScreen () {
      // 南靖 http://www.thingjs.com/s/1d60330e4c13eaf8250c03d6?params=105b0f77fd24654d4eebc434e9
      // 测试 https://www.thingjs.com/s/0e8b33f49d6d0206c54bd018?params=105b0f77fd24654d4eebc434e9
      let url = 'http://www.thingjs.com/s/0e8b33f49d6d0206c54bd018?params=105b0f77fd24654d4eebc434e9'
      this.$router.push(
        {
          path: '/effect',
          query: {src: url}
        }
      )
    },
    // 初始化地图
    MapInit () {
      let that = this
      that.map = new AMap.Map('mapImg', {
        center: [118.136134, 24.522914],
        resizeEnable: true,
        zoom: 12
      })
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
        that.map.addControl(new AMap.ToolBar())
        that.map.addControl(new AMap.Scale())
      })
      setTimeout(() => { // 等待接口获取pageId
        if (that.pageId === '') {
          return
        }
        that.getMapInfo(that.pageId)
      }, 1000)
    },
    // 点击页面获取地图信息
    getMapInfo (pageId) {
      let that = this
      findMapConfigByPageId(pageId).then(res => {
        if (res.data.success) {
          let obj = res.data.obj
          // 设置地图
          if (res.data.obj.is_abbr !== 0) {
            that.map.destroy()
            that.map = new AMap.Map('mapImg', {
              center: [obj.map_longitude, obj.map_latitude],
              resizeEnable: true,
              pitch: obj.map_maxPitch,
              viewMode: '3D',
              mapStyle: 'amap://styles/' + obj.map_style,
              zoom: obj.zoom
            })
            // that.map.setFeatures(['bg', 'road', 'point', 'building'])
            AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
              that.map.addControl(new AMap.ToolBar())
              that.map.addControl(new AMap.Scale())
            })
          } else {
            that.map.destroy()
            that.map = new AMap.Map('mapImg', {
              center: [obj.map_longitude, obj.map_latitude],
              resizeEnable: true,
              mapStyle: 'amap://styles/' + obj.map_style,
              zoom: obj.zoom
            })
            // that.map.setFeatures(['bg', 'road', 'point', 'building'])
            AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
              that.map.addControl(new AMap.ToolBar())
              that.map.addControl(new AMap.Scale())
            })
          }
        }
      }).catch(er => {
        console.log(er)
      })
      findMapDataConfig(pageId).then(res => {
        // console.log('data2:', res.data)
        if (res.data.success) {
          let obj = res.data.obj
          obj.forEach(item => {
            that.findMapDataConfigSourceData(item.source_id, item.data_table, item.latitude, item.longitude, item.mapDataPoint_pd.point_url, item)
          })
          // 等待循环结束将标注点都加入到地图
          setTimeout(() => {
            that.map.add(that.markerList)
          }, 500)
        }
      }).catch(er => {
        console.log(er)
      })
    },
    // 获取地图所需标记信息
    findMapDataConfigSourceData (sourceId, dataTable, latitude, longitude, url, mapData) { // longitude经度 latitude纬度 url标记的图标路径
      let mapDataFieldList = mapData.mapDataField_list // 信息窗口需要的信息
      findMapDataConfigSourceData(sourceId, dataTable).then(res => {
        // console.log('data3:', res.data.obj)
        let that = this
        // 创建 AMap.Icon 实例：
        var icon = new AMap.Icon({
          size: new AMap.Size(30, 30), // 图标尺寸
          image: url // Icon的图像
        })
        if (res.data.success) {
          // 创建信息窗体
          let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -10)})
          res.data.obj.forEach((item, index) => {
            let marker = new AMap.Marker({
              position: new AMap.LngLat(item[longitude], item[latitude]),
              offset: new AMap.Pixel(-10, -10),
              icon: icon
            })
            let str = ''
            let title = ''
            // 如果弹窗不是无
            if (mapData.mapDataPoint_pd.tc_type !== 0) {
              // 如果弹窗是常显
              if (mapData.mapDataPoint_pd.tc_type === 3) {
                mapDataFieldList.forEach(el => {
                  if (el.is_title) {
                    title = title + '<p style="font-size: 14px; font-weight: bold;color: #333;text-align: left;margin-left: 10px;" onclick="fieldClick(&quot;' + el.id + '&quot;,' + JSON.stringify(item).replace(/"/g, '&quot;') + ');">' + item[el.corr_field] + '</p>'
                  } else {
                    if (el.unit === '') {
                      str = str + '<tr style="border:1px solid #ecedee;" onclick="fieldClick(&quot;' + el.id + '&quot;,' + JSON.stringify(item).replace(/"/g, '&quot;') + ');"><td style="color:#333;padding: 5px;border:1px solid #ecedee;min-width:50px;text-align: center;">' +
                    el.show_name + '</td>' + '<td rowspan="2" style="color:#0099FF;padding: 5px;border:1px solid #ecedee;text-align: left;"><p>' +
                    item[el.corr_field] + '</p></td></tr>'
                    } else {
                      str = str + '<tr style="border:1px solid #ecedee;" onclick="fieldClick(&quot;' + el.id + '&quot;,' + JSON.stringify(item).replace(/"/g, '&quot;') + ');"><td style="color:#333;padding: 5px;border:1px solid #ecedee;min-width:50px;text-align: center;">' +
                      el.show_name + '</td>' + '<td style="color:#0099FF;padding: 5px;border:1px solid #ecedee;text-align: left;">' +
                      item[el.corr_field] + '</td>' + '<td>' + el.unit + '</td></tr>'
                    }
                  }
                })
                if (mapDataFieldList.length > 0) {
                  str = '<table style="border-collapse:collapse;width:100%;font-size:12px;border:1px solid #ecedee;background:#f9f9f9;">' +
                  str + '</table>'
                }
                // marker.content = '<div style="width: 180px;">' + title + str + '</div>'
                marker.setLabel({
                  offset: new AMap.Pixel(0, 0), // 设置文本标注偏移量
                  content: '<div style="width: 180px;border:1px soild #ccc;">' + title + str + '</div>', // 设置文本标注内容
                  direction: 'top' // 设置文本标注方位
                })
                marker.on('click', e => {
                  if (marker.getLabel() === null) {
                    marker.setLabel({
                      offset: new AMap.Pixel(0, 0), // 设置文本标注偏移量
                      content: '<div style="width: 180px;border:1px soild #ccc;">' + title + str + '</div>', // 设置文本标注内容
                      direction: 'top' // 设置文本标注方位
                    })
                  } else {
                    marker.setLabel(null)
                  }
                })
              } else {
                mapDataFieldList.forEach(el => {
                  if (el.is_title) {
                    title = title + '<p style="font-size: 14px; font-weight: bold;color: #333;" onclick="fieldClick(&quot;' + el.id + '&quot;,' + JSON.stringify(item).replace(/"/g, '&quot;') + ');">' + item[el.corr_field] + '</p>'
                  } else {
                    if (el.unit === '') {
                      str = str + '<tr style="border:1px solid #ecedee;" onclick="fieldClick(&quot;' + el.id + '&quot;,' + JSON.stringify(item).replace(/"/g, '&quot;') + ');"><td style="color:#333;padding: 5px;border:1px solid #ecedee;min-width:50px;text-align: center;">' +
                      el.show_name + '</td>' + '<td rowspan="3" style="color:#0099FF;padding: 5px;border:1px solid #ecedee;">' +
                      item[el.corr_field] + '</td></tr>'
                    } else {
                      str = str + '<tr style="border:1px solid #ecedee;" onclick="fieldClick(&quot;' + el.id + '&quot;,' + JSON.stringify(item).replace(/"/g, '&quot;') + ');"><td style="color:#333;padding: 5px;border:1px solid #ecedee;min-width:50px;text-align: center;">' +
                      el.show_name + '</td>' + '<td style="color:#0099FF;padding: 5px;border:1px solid #ecedee;">' +
                      item[el.corr_field] + '</td>' + '<td>' + el.unit + '</td></tr>'
                    }
                  }
                })
                if (mapDataFieldList.length > 0) {
                  str = '<table style="border-collapse:collapse;width:100%;font-size:12px;border:1px solid #ecedee;background:#f9f9f9;">' +
                  str + '</table>'
                }
                marker.content = '<div style="width: 180px;">' + title + str + '</div>'
                // 如果弹窗是点击
                if (mapData.mapDataPoint_pd.tc_type === 1) {
                  marker.on('click', e => {
                    infoWindow.setContent(e.target.content)
                    infoWindow.open(that.map, e.target.getPosition())
                  })
                }
                // 如果弹窗是悬浮
                if (mapData.mapDataPoint_pd.tc_type === 2) {
                  marker.on('mouseover', e => {
                    infoWindow.setContent(e.target.content)
                    infoWindow.open(that.map, e.target.getPosition())
                  })
                }
              }
            }
            that.markerList.push(marker)
          })
        } else {
          console.log(res.data.msg)
        }
      }).catch(er => {
        console.log(er)
      })
    }
  }
}
</script>
<style lang="scss">
.map-only{
    .amap{
      width: 100%;
      height: 100%;
    }
    .enter-backstage{
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .enter-backstage2{
      top: 80px;
      right: 20px;
    }
}
</style>
