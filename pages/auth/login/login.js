//import {FriendUserInfo} from "../../../models/socketApp";
var userModel = require('../../../models/user.js')
import {showErrorToast} from '../../../utils/util.js'
var chatModel = require('../../../models/chat.js')


var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
    wxLogin: function (e) {
        if (e.detail.userInfo === undefined) {
            app.globalData.hasLogin = false;
            showErrorToast('微信登录失败');
            return;
        }

        userModel.checkLogin().then(()=>{
            //console.info('这是在login.js中调用的userModel.checkLogin')
            app.globalData.hasLogin = true
            //this.fetchUnReadMsg()
            wx.navigateBack({
                delta: 1
            })
        }).catch(() => {
            userModel.loginByWeixin(e.detail.userInfo).then((res)=>{
                app.globalData.hasLogin = true
                chatModel.fetchUnReadMsg()
                // 每次重新登入，删除classic 本地缓存
                //this.clearMyClassicStorage()
                wx.navigateBack({
                    delta: 1
                })
            }).catch((err) => {
                app.globalData.hasLogin = false
                showErrorToast('微信登录失败')
            })
        })
    },
    clearMyClassicStorage: function () {
      let classicNums = wx.getStorageSync("latest")
      for(var i =0; i < classicNums; i++){
        let tmp = wx.getStorageSync('classic-'+(i+1))
        if(tmp){
          wx.removeStorageSync('classic-'+(i+1))
        }
      }
    }
})