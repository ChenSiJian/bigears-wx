
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/*返回两个时间差的秒数*/
function difftime(newTime,oldTime) {
  var newTimeTmp = newTime.replace(/\-/g, "/")
  var oldTimeTmp = oldTime.replace(/\-/g, "/")
  var newDate = new Date(newTimeTmp)
  var oldDate = new Date(oldTimeTmp)
  //var tmp = parseInt(newDate - oldDate) / 1000
  //console.info('difftime---time:'+tmp.toString())

  return parseInt(newDate - oldDate) / 1000
}


function redirect(url) {

  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/images/icon_error.png'
  })
}
function getCurrentPageUrl(){
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length-1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  return url
}

module.exports = {
  formatTime,
  redirect,
  showErrorToast,
  difftime,
  getCurrentPageUrl
}