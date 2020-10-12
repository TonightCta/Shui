<template>
    <div class="effect">
        <iframe :src="iframUrl" frameborder="0"></iframe>
    </div>
</template>
<script>
// import store from '@/store'
// import Cookies from 'js-cookie'
export default {
  name: 'Map',
  components: {
    // Dialog
  },
  data () {
    return {
      iframUrl: ''
    }
  },
  created () {
    // console.log('bimtoken1', Cookies.get('bimToken'))
  },
  mounted () {
    let src = this.$route.query.src
    let title = this.$route.query.title
    if (src) {
      this.iframUrl = src
    }
    if (title) {
      document.title = title
    }
  },
  destroyed () {
    // 销毁的时候设置本地hideScreenBtn为false 使map上的按钮不隐藏
    // localStorage.removeItem('hideScreenBtn')
  },
  methods: {
  }
}
</script>
<style lang="scss">
.effect{
  width: 100%;
  height: 100%;
    iframe{
        width: 100%;
        height: 100%;
    }
}
</style>
