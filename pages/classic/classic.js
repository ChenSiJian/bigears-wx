var classicModel = require('../../models/classic.js')
var likeModel = require('../../models/like.js')
var userModel = require('../../models/user.js')
const regeneratorRuntime = require('regenerator-runtime')
//import { newSocket } from '../../models/socket'
var app = getApp()
Page({

    properties:{
        cid: '',
        type: 0
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
      if(options.cid && options.type){
        this.setData({
          cid: options.cid,
          type: options.type
        })
      }

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      wx.setNavigationBarTitle({
        title: "大耳朵一乐"
      })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow:async function () {
      if (!app.globalData.hasLogin && wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
        await userModel.checkBigearsToken().then((res)=>{
          app.globalData.hasLogin = true

        }).catch(()=>{
          app.globalData.hasLogin = false
        })
      }
      let cid = this.data.cid
      let type = this.data.type
      this.setData({
        cid: '',
        type: 0
      })
      //console.info('cid='+cid)
      if(cid != ''){
        classicModel.getById(cid, type).then((res)=>{
          this.setData({
            classic: res.data,
            latest: classicModel.isLatest(res.data.index),
            first: classicModel.isFirst(res.data.index)
          })
          //this._getLikeStatus(res.data.id, res.data.type)
          this.settingLikeStatus(res.data.id,res.data.type)
          this._getUserInfo(res.data.userId)

        })
      }else if(this.data.classic== null){
        classicModel.getLatest().then((res)=>{
          this.setData({
            classic: res.data
          })
          //this._getLikeStatus(res.data.id,res.data.type)
          this.settingLikeStatus(res.data.id,res.data.type)
          this._getUserInfo(res.data.userId)
        })
      }else{
        //this._getLikeStatus(this.data.classic.id, this.data.classic.type)
        this.settingLikeStatus(this.data.classic.id, this.data.classic.type)
      }

      /*wx.getSystemInfo({
        success: (res) => {
          let heightTmp = res.windowHeight
          let windowWidthTmp = res.windowWidth
          let modelTmp = res.model
          let pixelRatioTmp = res.pixelRatio
          wx.showModal({
            title: '提示',
            content: 'w-w:'+windowWidthTmp+';wh:'+heightTmp + '; mode:'+modelTmp+'; dpr:'+pixelRatioTmp
          })
        }
      })*/

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
      let cidTmp = this.data.classic.id
      let typeTmp = this.data.classic.type
      let userInfo = wx.getStorageSync('userInfo');
      return {
        title: userInfo.nickName+'给你分享 大耳朵一乐',
        path: "pages/classic/classic?cid=" + cidTmp+"&type="+typeTmp
      }
    },
    onLike: function (event) {
        const behavior = event.detail.behavior
        const formId = event.detail.formId
        likeModel.like(behavior, this.data.classic.id,
            this.data.classic.type,formId)
    },

    playMusic:function () {
      if(this.data.likeStatus){
        classicModel.updateViewCounts(this.data.classic.id)
      }
    },

    onNext: function (event) {
        this._getClassicBy('next')
    },

    onPrevious: function (event) {
        this._getClassicBy('previous')
    },

    _getClassicBy: function (nextOrPrevious) {
        const index = this.data.classic.index
        classicModel.getClassic(index, nextOrPrevious).then((res)=>{
            this._getLikeStatus(res.id, res.type)
            this.setData({
                classic: res,
                latest: classicModel.isLatest(res.index),
                first: classicModel.isFirst(res.index)
            })
        }).catch((res)=>{
          console.info(res)
        })
    },

    settingLikeStatus: function (cid,type) {
      if(app.globalData.hasLogin){
        this._getLikeStatus(cid,type)
      }else {
        this.setData({
          likeCount: this.data.classic.likeCounts,
          likeStatus: false
        })
      }
    },
    _getLikeStatus: function (artID, category) {
        likeModel.getClassicLikeStatus(artID, category).then((res)=>{
            this.setData({
                likeCount: res.data.favNums,
                likeStatus: res.data.likeStatus
            })
        })
    },
    _getUserInfo: function (userId) {
        userModel.getUserInfo(userId).then((res)=>{
            this.setData({
                userInfo: res.data
            })
        })
    },
    onJumpToDetail(){
      if(!app.globalData.hasLogin){
        wx.navigateTo({
          url: '/pages/auth/login/login'
        })
        return
      }
      let cid = this.data.classic.id
      let type = this.data.classic.type
      let toUrl = `/pages/classic-detail/classic-detail?cid=${cid}&type=${type}`
      wx.navigateTo({
        url: toUrl
      })
      /*//更新收藏的点击量，
      if(this.data.likeStatus){
        classicModel.updateViewCounts(cid)
      }*/
    },
    onJumpToVideoPlay(){
      // 注释掉视频模块
      /*if(!app.globalData.hasLogin){
        wx.navigateTo({
          url: '/pages/auth/login/login'
        })
        return
      }
      var videoInfo = JSON.stringify(this.data.classic);
      //console.info('videoInfoStr:'+videoInfo)
      videoInfo = encodeURIComponent(videoInfo)
      let toUrl = '/pages/videoinfo/videoinfo?videoInfo=' + videoInfo
      wx.navigateTo({
        url: toUrl
      })*/


    }

})