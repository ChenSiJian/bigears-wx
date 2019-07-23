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
    newSocket()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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