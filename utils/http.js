var util = require('./util.js')
var app = getApp()


function request({url, data = {}, method = "GET", comtentType = "application/json"}) {
  return new Promise(function (resolve, reject) {
    // console.info('url:' + url.toString())
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': comtentType,
        'X-Bigears-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode == 200) {
          //
          if (res.data.status == 501 || res.data.status == 604) {
            // 清除登录相关内容
            try {
              wx.removeStorageSync('userInfo')
              wx.removeStorageSync('token')
            } catch (e) {
              // Do something when catch error
            }
            let currentPageUrl = util.getCurrentPageUrl()
            //console.info('currentPageUrl:'+util.getCurrentPageUrl())
            if(currentPageUrl != 'pages/auth/login/login'){
              // 切换到登录页面
              wx.navigateTo({
                url: '/pages/auth/login/login'
              })
            }

          } else if(res.data.status == 607){
            wx.showToast({
              title: res.data.msg,
              icon: "none",
              duration: 8000
            })

          } else if (res.data.status == 200) {
            resolve(res.data)
          } else {
            reject(res.data)
          }
        } else {
          reject(res.errMsg)

        }

      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

function requestFileUpload({url, filePath, name = "fileName", data = {}}) {
  return new Promise(function (resolve, reject) {
    // console.info('url:' + url.toString())
    wx.uploadFile({
      url: url,
      filePath: filePath,
      name: name,
      formData: data,
      success(res) {
        //console.info('============requestFileUpload-status11:'+res.data)
        //console.info('============requestFileUpload-status:'+JSON.parse(res.data).status)
        let result = JSON.parse(res.data)
        if (result.status == 200) {
          resolve(result)
        } else {
          reject(result)
        }
      },fail:function(err){
        reject(err)
      }

    })
  })
}


export {
  request,
  requestFileUpload
}