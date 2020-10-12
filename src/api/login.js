import fetch from '@/utils/fetch'

export function loginByAccount (account, password) { // 账号登录
  const params = {
    account: account,
    password: password
  }
  return fetch({
    url: 'login/loginAP',
    method: 'post',
    params: params
  })
}
// 账号登录point
export function pointLogin (sign) {
  const params = {
    sign: sign
  }
  return fetch({
    url: 'login/pointLogin',
    method: 'post',
    params: params
  })
}

export function getUserInfo (token) { // 获取用户信息
  return fetch({
    url: 'login/getLoginInfo',
    method: 'get',
    headers: {'bimToken': token}
  })
}

export function exitLogin (token) { // 退出登录
  return fetch({
    url: 'login/exitLogin',
    method: 'get',
    headers: {'bimToken': token}
  })
}
