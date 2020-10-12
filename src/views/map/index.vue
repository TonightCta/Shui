<template>
    <div class="map-only" id="mapOnly">
        <img src="@/assets/map.jpg"/>
        <!-- <iframe :src="iframUrl" frameborder="0"></iframe> -->
        <Dialog/>
    </div>
</template>
<script>
import { pointLogin } from '@/api/login'
import store from '@/store'
import Dialog from '@/components/common/Dialog'
export default {
  name: 'Map',
  components: {
    Dialog
  },
  data () {
    return {
      iframUrl: ''
    }
  },
  created () {
    if (this.$route.query.sign) {
      let sign = this.$route.query.sign
      this.pointLogin(sign)
    } else {
      this.$router.push('/login')
    }
  },
  mounted () {
    document.getElementById('mapOnly').style.height = document.body.offsetHeight + 'px'
  },
  methods: {
    // 登录
    pointLogin (sign) {
      pointLogin(sign).then(res => {
        if (res.data.success) {
          store.dispatch('SetToken', res.data.obj.bimToken)
          store.dispatch('GetUserInfo', res.data.obj.bimToken)
          this.iframUrl = 'http://www.thingjs.com/s/3fdf42fa2886662ff533cb8d?params=105b0f77fd24654d4eebc434e9&apply_page_id=' + res.data.obj.apply_page_id + '&bq=http://nj.water-mind.com:8203/sx_bim'
        } else {
          store.dispatch('OpenTipsDialog', res.data.msg + '3秒后跳转至登录页面')
          setTimeout(() => {
            store.dispatch('CloseTipsDialog')
            this.$router.push('/login')
          }, 3000)
        }
      }).catch(er => {
        this.$router.push('/login')
        console.log(er)
      })
    }
  }
}
</script>
<style lang="scss">
.map-only{
    img, iframe{
        width: 100%;
        height: 100%;
    }
}
</style>
