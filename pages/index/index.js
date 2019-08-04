var userModel = require('../../models/user.js');
var chatModel = require('../../models/chat.js')
//获取应用实例
const app = getApp()

Page({
  data: {

  },
  onLoad: function () {

  },
  onShow: function () {
    userModel.checkLogin().then((res) =>{
      userModel.checkBigearsToken().then((res)=>{
        app.globalData.hasLogin = true
        //获取未读信息
        chatModel.fetchUnReadMsg()
        wx.reLaunch({
          url: '/pages/classic/classic'
        })
      }).catch(()=>{
        app.globalData.hasLogin = false
        wx.reLaunch({
          url: '/pages/classic/classic'
        })
      })

    }).catch(() =>{
      app.globalData.hasLogin = false
      wx.reLaunch({
        url: '/pages/classic/classic'
      })
    })
  }
})
