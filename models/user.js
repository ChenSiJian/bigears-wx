import {request} from '../utils/http.js'
import {apiUrl} from '../config/api.js'


/*
* Promise封装wx.checkSession
*/
function checkSession()
{
    return new Promise(function (resolve, reject) {
        wx.checkSession({
            success: function () {
                resolve(true);
            },
            fail: function () {
                reject(false);
            }
        })
    });
}

/**
 * Promise封装wx.login
 */
function loginwx() {
    return new Promise(function (resolve, reject) {
        wx.login({
            success(res) {
                if (res.code) {
                    //console.info('wx login-code:' + res.code)
                    resolve(res);
                } else {
                    console.log('登录失败！' + res.errMsg)
                    reject(err);
                }
            }
        })
    })
}

function getAuthorizeLocation() {
  return new Promise(function (resolve, reject) {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success (res) {
              // 用户已经同意
              resolve(res)
            },
            fail (err){
              reject(err)
            }
          })
        }else{
          resolve(res)
        }
      }
    })
  })
}


/**
 * 调用微信登录
 */
function loginByWeixin(userInfo) {
    return new Promise(function (resolve, reject) {
        return loginwx().then((res) => {
            //console.info('wx login-code:' + res.code)
            //登录远程服务器
            request({
                url: apiUrl.AuthLoginByWeixin,
                data: {
                    code: res.code,
                    userInfo: userInfo
                },
                method: 'POST'
            }).then(res => {
                if (res.status === 200) {
                    //console.info('res.data:'+res.data.token)
                    wx.setStorageSync('userInfo', res.data.userInfo)
                    wx.setStorageSync('token', res.data.token)

                    resolve(res)
                } else {
                    reject(res)
                }
            }).catch((err) => {
                reject(err)
            })
        }).catch((err) => {
            reject(err);
        })

    })
}

function checkBigearsToken() {
  return new Promise(function (resolve, reject) {
    request({
      url: apiUrl.CheckBigearsToken
    }).then(res => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
    return new Promise(function (resolve, reject) {
        if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
            checkSession().then(() => {
                resolve(true)
            }).catch(() => {
              // 清除登录相关内容
              try {
                wx.removeStorageSync('userInfo');
                wx.removeStorageSync('token');
              } catch (e) {
                // Do something when catch error
              }
                reject(false)
            });
        } else {
            console.info('user.js--getStorageSync userInfo and token is false')
            reject(false)
        }
    })
}

function getUserInfo(userId) {
    return new Promise(function (resolve, reject) {
        request({
            url: apiUrl.GetUserInfo + '?id=' + userId
        }).then(res => {
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
    })
}


export {
    loginByWeixin,
    checkLogin,
    getUserInfo,
    getAuthorizeLocation,
    checkBigearsToken
}