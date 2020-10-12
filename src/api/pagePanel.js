import fetch from '@/utils/fetch'
import qs from 'qs'

// 获取面板
export function findModuleNavByPageId (id) {
  return fetch({
    url: 'bimModuleNav/findModuleNavByPageId',
    params: {page_id: id},
    method: 'get'
  })
}

// 新增面板
export function addModuleNav (id, name, panel, list) {
  const data = {
    page_id: id,
    name: name,
    panel_json: panel,
    attr_json: list
  }
  return fetch({
    url: 'bimModuleNav/addModuleNav',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 编辑面板
export function editModuleNav (id, name, panel, list) {
  const data = {
    id: id,
    name: name,
    panel_json: panel,
    attr_json: list
  }
  return fetch({
    url: 'bimModuleNav/editModuleNav',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 删除面板
export function delModuleNav (id) {
  const data = {
    id: id
  }
  return fetch({
    url: 'bimModuleNav/delModuleNav',
    method: 'post',
    data: qs.stringify(data)
  })
}
