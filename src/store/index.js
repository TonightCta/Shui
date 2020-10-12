import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import bimApply from './modules/bimApply'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    bimApply
  },
  getters
})

export default store
