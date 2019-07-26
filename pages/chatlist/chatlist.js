//import { formatTime } from '../../utils/util'
var socketApp = require('../../models/socketApp.js')
import { newSocket } from '../../models/socket'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //var chatSnapshotList = wx.getStorageSync('chatSnapshotList')
    //初始化socket
    if(app.globalData.hasLogin){
      newSocket()
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if(!app.globalData.hasLogin){
      wx.navigateTo({
        url: '/pages/auth/login/login'
      })
      return
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let chatSnapshotListTmp = wx.getStorageSync('chatSnapshotList')
    if(!chatSnapshotListTmp){
      let userInfo = wx.getStorageSync('userInfo')
      socketApp.saveChatSnapshotWrap(userInfo.userId,'9527',socketApp.packageEnum.CHAT,
          '', '', true)
    }
    this.setData({
      list: wx.getStorageSync('chatSnapshotList')
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  goPage(e) {
    let newlist = this.data.list
    const index = e.currentTarget.dataset.index
    newlist[index].count=0;
    this.setData({
      list: newlist
    })
    var friendId = e.currentTarget.dataset.userid
    var nickName = e.currentTarget.dataset.name
    var avatar = e.currentTarget.dataset.avatar
    socketApp.updateUserChatSnapshotCount(friendId)
    wx.navigateTo({
      url: '../message/message?friendId='+friendId+'&nickName='+nickName+
          '&avatar='+avatar
    })
  }
})