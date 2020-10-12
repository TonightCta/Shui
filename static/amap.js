let linkBaseUrl = 'http://nj.water-mind.com:8201' // http://localhost:8080  http://nj.water-mind.com:8201 http://sx.water-mind.com:3409
let apiBaseUrl = 'http://nj.water-mind.com:8203' // http://sx.water-mind.com:3408  http://nj.water-mind.com:8203
function fieldClick (id, data) {
  console.log('data', data)
  var form = {
    event_bt_id: id,
    source_data: JSON.stringify(data)
  }
  $.ajax({
    url: apiBaseUrl + '/sx_bim/bimBaseEvent/trigEvent',
    data: form,
    dataType: 'json',
    type: 'post',
    headers: {'bimToken': getCookie('bimToken')},
    success: function (res) {
      console.log('result', res)
      if (res.success) {
        // console.log('result', res)
        let result = res.obj
        if (result !== null) {
          for (var i = 0; i < result.length; i++) {
            if (!result[i].event_config.link_url) {
              return
            }
            let linkUrl = result[i].event_config.link_url + '?local_id=' + data.id + '?server_url=http://nj.water-mind.com:8203/sx_bim'
            if (result[i].event_config.open_wz === 'new') {
              window.open(linkBaseUrl + '/BIM/effect?src=' + linkUrl + '&title=' + data.local_name)
            } else if (result[i].event_config.open_wz === 'current') {
              window.location.href = linkBaseUrl + '/BIM/effect?src=' + linkUrl + '&title=' + data.local_name
            } else if (result[i].event_config.open_wz === 'pop') {
              $('#mappop').css({
                'display': 'block',
                'width': result[i].event_config.size_width + 'px',
                'height': result[i].event_config.size_height + 'px',
                'top': result[i].event_config.top_px + 'px',
                'left': result[i].event_config.left_px + 'px'
              })
              $('#mappop iframe').attr('src', linkUrl)
            }
          }
        }
      }
    }
  })
}
function getCookie (name) {
  var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)') // 匹配字段
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2])
  } else {
    return null
  }
}
