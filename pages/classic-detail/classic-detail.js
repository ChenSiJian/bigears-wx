var classicModel = require('../../models/classic.js')
//var likeModel = require('../../models/like.js')
var userModel = require('../../models/user.js')

var app = getApp()
Page({

  properties:{

  },
  /**
   * 页面的初始数据
   */
  data: {
    classic: null,
    userInfo:null,
    latest: true,
    first: false,
    likeCount: 0,
    likeStatus: false,
    cid: '',
    type: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cid: options.cid,
      type: options.type
    })

    userModel.checkLogin().then((res) =>{
      app.globalData.hasLogin = true
    }).catch((err)=>{
      app.globalData.hasLogin = false
    })
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
    wx.setNavigationBarTitle({
      title: "大耳朵一乐"
    })
    const cid = this.data.cid
    const type = this.data.type
    if (cid) {
      classicModel.getById(cid, type).then((res)=>{
        //this._getLikeStatus(res.data.id, res.data.type)
        this._getUserInfo(res.data.userId)
        this.setData({
          classic: res.data
        })

      })
    }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  _getUserInfo: function (userId) {
    userModel.getUserInfo(userId).then((res)=>{
      this.setData({
        userInfo: res.data
      })
    })
  },
})