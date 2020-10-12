import { findAll, addApply, delApply, editApply, findApplyByName } from '@/api/bimApply'
const bimapply = {
  state: {
    id: localStorage.getItem('applyId') || '', // 当前应用id
    name: localStorage.getItem('applyName') || '',
    pageId: '', // 当前选中的页面id
    pageName: '', // 当前选中的页面name
    dataConfigId: '', // 当前选中数据id
    dataConfigName: '', // 当前选中数据的name
    dataType: '' // 当前选中的数据的数据类型
  },
  mutations: {
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_PAGEID: (state, pageId) => {
      state.pageId = pageId
    },
    SET_PAGENAME: (state, pageName) => {
      state.pageName = pageName
    },
    SET_DATACONFIGID: (state, dataConfigId) => {
      state.dataConfigId = dataConfigId
    },
    SET_DATACONFIGNAME: (state, dataConfigName) => {
      state.dataConfigName = dataConfigName
    },
    SET_DATATYPE: (state, dataType) => {
      state.dataType = dataType
    }
  },
  actions: {
    // 账号登录
    FindAll ({ commit }, token) {
      return new Promise((resolve, reject) => {
        findAll(token).then(res => {
          if (res.data.success) {
            resolve(res)
          } else {
            // commit('SET_TIPVISIBLE', true)
            // commit('SET_TIPMESSAGE', res.data.msg)
          }
        }).catch(error => {
          // alert(error)
          reject(error)
        })
      })
    },
    // 新增应用
    AddApply ({ commit }, paramObj) {
      return new Promise((resolve, reject) => {
        addApply(paramObj.token, paramObj.name).then(res => {
          if (res.data.success) {
            resolve(res)
          } else {
            commit('SET_TIPVISIBLE', true)
            commit('SET_TIPMESSAGE', res.data.msg)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // editApply
    EditApply ({ commit }, paramObj) {
      return new Promise((resolve, reject) => {
        editApply(paramObj).then(res => {
          if (res.data.success) {
            resolve(res)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // findApplyByName
    FindApplyByName ({ commit }, paramObj) {
      return new Promise((resolve, reject) => {
        findApplyByName(paramObj).then(res => {
          if (res.data.success) {
            resolve(res.data)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // delApply
    DelApply ({ commit }, paramObj) {
      return new Promise((resolve, reject) => {
        delApply(paramObj.token, paramObj.id).then(res => {
          if (res.data.success) {
            // commit('SET_TIPVISIBLE', true)
            // commit('SET_TIPMESSAGE', res.data.msg)
            resolve(res)
          }
          // commit('SET_TIPVISIBLE', true)
          // commit('SET_TIPMESSAGE', res.data.msg)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 保存当前项目基本信息
    SetCurrentApply ({ commit }, paramObj) {
      localStorage.setItem('applyName', paramObj.name)
      localStorage.setItem('applyId', paramObj.id)
      commit('SET_NAME', paramObj.name)
      commit('SET_ID', paramObj.id)
    }
  }
}

export default bimapply


