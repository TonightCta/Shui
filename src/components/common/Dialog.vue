<template>
  <el-dialog
  title="提示"
  :visible.sync="tipvisible"
  width="30%">
    <span>{{tipmessage}}</span>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="close()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
export default {
  name: 'Dialog',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['tipmessage', 'tipvisible'])
  },
  methods: {
    close () {
      store.dispatch('CloseTipsDialog')
    }
  }
}
</script>

<style scoped>
</style>
