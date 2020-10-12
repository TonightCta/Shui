import { loginByAccount, getUserInfo } from '@/api/login'
import Cookies from 'js-cookie'
import { exitLogin } from '../../api/login'
const user = {
  state: {
    token: Cookies.get('bimToken'),
    username: localStorage.getItem('username') || '未登录',
    account: localStorage.getItem('account') || '',
    tipmessage: '', // 公用的提示弹框信息
    tipvisible: false // 是否弹出提示框
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
    SET_TIPMESSAGE: (state, tipmessage) => {
      state.tipmessage = tipmessage
    },
    SET_TIPVISIBLE: (state, tipvisible) => {
      state.tipvisible = tipvisible
    }
  },
  actions: {
    // 账号登录
    LoginByAccount ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByAccount(userInfo.account, userInfo.password).then(res => {
          if (res.data.success) {
            let seconds = 60 * 60 // 设置bimToken失效时间
            let expires = new Date(new Date() * 1 + seconds * 1000)
            Cookies.set('bimToken', res.data.obj, { expires: expires })
            commit('SET_TOKEN', res.data.obj)
            getUserInfo(res.data.obj).then(res2 => {
              if (res2.data.success) {
                localStorage.setItem('username', res2.data.obj.name)
                commit('SET_USERNAME', res2.data.obj.name)
                resolve()
              } else {
                commit('SET_TIPVISIBLE', true)
                commit('SET_TIPMESSAGE', res.data.msg)
              }
            })
          } else {
            commit('SET_TIPVISIBLE', true)
            commit('SET_TIPMESSAGE', res.data.msg)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 存储token
    SetToken ({commit}, token) {
      let seconds = 60 * 60 // 设置bimToken失效时间
      let expires = new Date(new Date() * 1 + seconds * 1000)
      Cookies.set('bimToken', token, { expires: expires })
      commit('SET_TOKEN', token)
    },
    // 获取用户信息
    GetUserInfo ({commit}, token) {
      return new Promise((resolve, reject) => {
        getUserInfo(token).then(res => {
          if (res.data.success) {
            localStorage.setItem('username', res.data.obj.name)
            commit('SET_USERNAME', res.data.obj.name)
            resolve()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 关闭提示弹窗
    CloseTipsDialog ({ commit }) {
      commit('SET_TIPVISIBLE', false)
      commit('SET_TIPMESSAGE', '')
    },
    // 打开提示弹窗
    OpenTipsDialog ({ commit }, msg) {
      commit('SET_TIPVISIBLE', true)
      commit('SET_TIPMESSAGE', msg)
    },
    // 退出登录
    ExitLogin ({commit, state}) {
      return new Promise((resolve, reject) => {
        exitLogin(state.token).then(res => {
          if (res.data.success) {
            commit('SET_TOKEN', '')
            commit('SET_NAME', '')
            commit('SET_ACCOUNT', '')
            Cookies.remove('bimToken')
            resolve()
          } else {
            commit('SET_TIPVISIBLE', true)
            commit('SET_TIPMESSAGE', res.data.msg)
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user


