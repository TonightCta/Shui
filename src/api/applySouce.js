import fetch from '@/utils/fetch'
import qs from 'qs'

// 获取数据源树形结构
export function findTreeByApplyId (token, id, type) {
  return fetch({
    url: 'bimApplySource/findTreeByApplyId',
    method: 'get',
    params: {apply_id: id, classify_type: type},
    headers: {'bimToken': token}
  })
}
// 添加数据源
export function addSource (token, form) {
  return fetch({
    url: 'bimApplySource/addSource',
    method: 'post',
    data: qs.stringify(form),
    headers: {'bimToken': token}
  })
}
// 编辑数据源
export function editSource (token, form) {
  return fetch({
    url: 'bimApplySource/editSource',
    method: 'post',
    data: qs.stringify(form),
    headers: {'bimToken': token}
  })
}
// 编辑分类
export function editClassify (token, form) {
  return fetch({
    url: 'bimBaseClassify/editClassify',
    method: 'post',
    data: qs.stringify(form),
    headers: {'bimToken': token}
  })
}
// 编辑页面
export function editPage (token, form) {
  return fetch({
    url: 'bimApplyPage/editPage',
    method: 'post',
    data: qs.stringify(form),
    headers: {'bimToken': token}
  })
}
// 删除数据源
export function delSource (token, id) {
  return fetch({
    url: 'bimApplySource/del',
    method: 'post',
    params: {id: id},
    headers: {'bimToken': token}
  })
}
// 删除页面
export function delPage (token, id) {
  return fetch({
    url: 'bimApplyPage/delPage',
    method: 'post',
    params: {id: id},
    headers: {'bimToken': token}
  })
}
// 删除分类
export function delClassify (token, id) {
  return fetch({
    url: 'bimBaseClassify/delClassify',
    method: 'post',
    params: {id: id},
    headers: {'bimToken': token}
  })
}
// 获取页面树形结构
export function findPageTreeByApplyId (token, id, type) {
  return fetch({
    url: 'bimApplyPage/findTreeByApplyId',
    method: 'get',
    params: {apply_id: id, classify_type: type},
    headers: {'bimToken': token}
  })
}
// 添加分类
export function addClassify (token, form) {
  return fetch({
    url: 'bimBaseClassify/addClassify',
    method: 'post',
    data: qs.stringify(form),
    headers: {'bimToken': token}
  })
}
// 更新上级
export function updateClassifyParentId (token, form) {
  return fetch({
    url: 'bimBaseClassify/updateClassifyParentId',
    method: 'post',
    data: qs.stringify(form),
    headers: {'bimToken': token}
  })
}
// 更新数据源所属分类
export function updateSourceClassifyId (token, form) {
  return fetch({
    url: 'bimApplySource/updateSourceClassifyId',
    method: 'post',
    data: qs.stringify(form),
    headers: {'bimToken': token}
  })
}
// 更新页面所属分类
export function updateClassifyId (token, form) {
  return fetch({
    url: 'bimApplyPage/updateClassifyId',
    method: 'post',
    data: qs.stringify(form),
    headers: {'bimToken': token}
  })
}

// 添加页面
export function addPage (token, form) {
  return fetch({
    url: 'bimApplyPage/addPage',
    method: 'post',
    data: qs.stringify(form),
    headers: {'bimToken': token}
  })
}


// 工作台右边的接口

// 根据apply_id获取数据树形结构
export function findMapDataConfigTree (token, id, type, pageId) {
  return fetch({
    url: 'bimMapDataConfig/findMapDataConfigTree',
    method: 'get',
    params: {apply_id: id, classify_type: type, page_id: pageId},
    headers: {'bimToken': token}
  })
}
// 根据apply_page_id查找应用
export function findOneByApplyPageId (token, id) {
  return fetch({
    url: 'bimMapBase/findOneByApplyPageId',
    method: 'get',
    params: {apply_page_id: id},
    headers: {'bimToken': token}
  })
}
// 获取地图类型
export function findBimMapType (token) {
  return fetch({
    url: 'bimMapType/findBimMapType',
    method: 'get',
    headers: {'bimToken': token}
  })
}
// 获取地图类型配置
export function findBimMapTypeConfig (token, id) {
  return fetch({
    url: 'bimMapType/findBimMapTypeConfig',
    method: 'get',
    params: {map_type_id: id},
    headers: {'bimToken': token}
  })
}
// 添加地图基础设置
export function addMapBase (token, form) {
  return fetch({
    url: 'bimMapBase/addMapBase',
    method: 'post',
    data: qs.stringify(form),
    headers: {'bimToken': token}
  })
}
// 编辑地图基础设置
export function editMapBase (token, form) {
  return fetch({
    url: 'bimMapBase/editMapBase',
    method: 'post',
    data: qs.stringify(form),
    headers: {'bimToken': token}
  })
}
// 新增地图数据管理
export function addMapDataCofig (token, form) {
  return fetch({
    url: 'bimMapDataConfig/addMapDataCofig',
    method: 'post',
    data: qs.stringify(form),
    headers: {'bimToken': token}
  })
}
// 编辑地图数据管理
export function editMapDataCofig (token, form) {
  return fetch({
    url: 'bimMapDataConfig/editMapDataCofig',
    method: 'post',
    data: qs.stringify(form),
    headers: {'bimToken': token}
  })
}
// 删除地图数据管理
export function delMapDataCofig (token, id) {
  return fetch({
    url: 'bimMapDataConfig/delMapDataCofig',
    method: 'get',
    params: {id: id},
    headers: {'bimToken': token}
  })
}

// 获取数据库表
export function getDataBaseTable (token, id) {
  return fetch({
    url: 'dds/getDataBaseTable',
    method: 'get',
    params: {source_id: id},
    headers: {'bimToken': token}
  })
}
// 获取字段
export function getDataBaseTableField (token, id, name) {
  return fetch({
    url: 'dds/getDataBaseTableField',
    method: 'get',
    params: {source_id: id, table_name: name},
    headers: {'bimToken': token}
  })
}
// 更新数据所属分类
export function updateConfigClassifyId (token, form) {
  return fetch({
    url: 'bimMapDataConfig/updateClassifyId',
    method: 'post',
    data: qs.stringify(form),
    headers: {'bimToken': token}
  })
}

// 新增样式与弹窗
export function addMapDataPoint (token, form) {
  return fetch({
    url: 'bimMapDataConfig/addMapDataPoint',
    method: 'post',
    data: qs.stringify(form),
    headers: {'bimToken': token}
  })
}
// 编辑样式与弹窗
export function editMapDataPoint (token, form) {
  return fetch({
    url: 'bimMapDataConfig/editMapDataPoint',
    method: 'post',
    data: qs.stringify(form),
    headers: {'bimToken': token}
  })
}
// 获取地图数据管理详情
export function findMapDataConfigDetail (token, id, typeId) {
  return fetch({
    url: 'bimMapDataConfig/findMapDataConfigDetail',
    method: 'get',
    params: {id: id, data_type: typeId},
    headers: {'bimToken': token}
  })
}

// 编辑字段
export function editMapDataFeild (token, form) {
  return fetch({
    url: 'bimMapDataConfig/editMapDataFeild',
    method: 'post',
    data: qs.stringify(form),
    headers: {'bimToken': token}
  })
}

// 更新字段显隐字段
export function updateFeildShowHide (token, form) {
  return fetch({
    url: 'bimMapDataConfig/updateFeildShowHide',
    method: 'post',
    data: qs.stringify(form),
    headers: {'bimToken': token}
  })
}

// 获取地图中心点
export function findMapConfigByPageId (id) {
  return fetch({
    url: '/thingJs/findMapConfigByPageId',
    method: 'get',
    params: {apply_page_id: id}
  })
}
// 获取数据
export function findMapDataConfig (id) {
  return fetch({
    url: '/thingJs/findMapDataConfig',
    method: 'get',
    params: {page_id: id}
  })
}
// 获取数据
export function findMapDataConfigSourceData (sourceId, dataTable) {
  return fetch({
    url: '/thingJs/findMapDataConfigSourceData',
    method: 'get',
    params: {source_id: sourceId, data_table: dataTable}
  })
}
// 添加事件
export function addEvent (form) {
  return fetch({
    url: 'bimBaseEvent/addEvent',
    method: 'post',
    data: qs.stringify(form)
  })
}

// 编辑事件
export function editEvent (form) {
  return fetch({
    url: 'bimBaseEvent/editEvent',
    method: 'post',
    data: qs.stringify(form)
  })
}

// 获取选中的事件数据
export function findSelectedEvent (id) {
  return fetch({
    url: '/bimBaseEvent/findSelectedEvent',
    method: 'get',
    params: {event_bt_id: id}
  })
}
// 获取选中事件配置参数
export function findEventConfig (id, type) {
  return fetch({
    url: '/bimBaseEvent/findEventConfig',
    method: 'get',
    params: {event_selected_id: id, event_type: type}
  })
}
// 触发事件
export function trigEvent (form) {
  return fetch({
    url: 'bimBaseEvent/trigEvent',
    method: 'post',
    data: qs.stringify(form)
  })
}

// 获取pageId
export function getPageId () {
  return fetch({
    url: '/bimApplyPage/findIndexPageId',
    method: 'get'
  })
}
