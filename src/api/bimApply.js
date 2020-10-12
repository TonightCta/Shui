import fetch from '@/utils/fetch'
import qs from 'qs'

export function findAll (token) { // 获取应用列表
  return fetch({
    url: 'bimApply/findAll',
    method: 'get',
    headers: {'bimToken': token}
  })
}

export function addApply (token, name) { // 新增应用
  const data = {
    name: name
  }
  return fetch({
    url: 'bimApply/addApply',
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'bimToken': token
    }
  })
}

export function editApply (obj) { // 修改应用
  const data = {
    id: obj.id,
    name: obj.name
  }
  return fetch({
    url: 'bimApply/editApply',
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'bimToken': obj.token
    }
  })
}
export function findApplyByName (obj) { // 通过name获取应用
  const data = {
    name: obj.name
  }
  return fetch({
    url: 'bimApply/findAll',
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'bimToken': obj.token
    }
  })
}
// 删除应用
export function delApply (token, id) {
  const params = {
    id: id
  }
  return fetch({
    url: 'bimApply/delApply',
    method: 'post',
    params: params,
    headers: {
      'bimToken': token
    }
  })
}
