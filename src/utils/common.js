// 判断数据类型的方法
export function isType (obj) {
  let type = Object.prototype.toString.call(obj)
  if (type === '[object Array]') {
    return 'Array'
  }
  if (type === '[object Object]') {
    return 'Object'
  }
  if (type === '[object String]') {
    return 'String'
  }
  return type
}

