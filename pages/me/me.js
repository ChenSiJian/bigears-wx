// pages/me/index.js
var userModel = require('../../models/user.js');
var classicModel = require('../../models/classic.js')
//import {showErrorToast} from '../../utils/util.js'


var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickName: '点击登录',
      avatarUrl: '/images/default_avatar.png'
    },
    hasLogin: false,
    classicsList: [],
    totalPage: 1,
    page: 1,
    limit: 6
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
    /*if (app.globalData.hasLogin) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
        hasLogin: true
      })

    }*/
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取用户的登录信息
    if (app.globalData.hasLogin) {
      //console.info('into me.js onshow and haslogin is true')
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
        hasLogin: true
      })
      this.getMyFavor(this.data.page, this.data.limit)
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
    var currentPage = this.data.page;
    var totalPage = this.data.totalPage;

    // 判断当前页数和总页数是否相等，如果想的则无需查询
    if (currentPage === totalPage) {
      wx.showToast({
        title: '没有更多歌曲啦~~，赶快去点爱心收藏更多',
        icon: "none"
      })
      return;
    }

    var page = currentPage + 1;

    this.getMyFavor(page, this.data.limit)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var shareObj = {
      title: "好看的小姐姐、小哥哥都在看，快来！",        // 默认是小程序的名称(可以写slogan等)
      path: '/pages/classic/classic',        // 默认是当前页面，必须是以‘/’开头的完整路径
      //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      imageUrl: 'http://media.mygallop.cn/bigears/storage/bigears-logo.png'
       }
    if(options.from == 'button'){
      var eData = options.target.dataset
      console.log( eData.title )     // shareBtn
      // 此处可以修改 shareObj 中的内容
      shareObj.title = eData.title
    }
    /*if(options.from == 'menu'){
      shareObj.title = '我给你推荐 大耳朵一乐'
    }*/

    return shareObj
  },
  clearMyStorage: function () {
    wx.showModal({
      title: '提示',
      content: '确定要清除本地缓存吗？',
      success (res) {
        if (res.confirm) {
          //console.log('用户点击确定')
          let classicNums = wx.getStorageSync("latest")
          for(var i =0; i < classicNums; i++){
            let tmp = wx.getStorageSync('classic-'+(i+1))
            if(tmp){
              wx.removeStorageSync('classic-'+(i+1))
            }
          }
          wx.removeStorageSync("latest")
          wx.removeStorageSync("chatHistoryList-9527")
          wx.removeStorageSync("currentChatTime-9527")
          //wx.removeStorageSync("motionParser")
          wx.removeStorageSync("q") //搜索记录
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },
  goLogin() {
    if (!this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  getMyFavor(page, pageSize) {
    classicModel.getMyFavor(page, pageSize).then((res) => {

      // 判断当前页page是否是第一页，如果是第一页，那么设置videoList为空
      if (page === 1) {
        this.setData({
          classicsList: []
        });
      }

      var classicList = res.data.rows;
      var newClassicList = this.data.classicsList;
      this.setData({
        classicsList: newClassicList.concat(classicList),
        page: page,
        totalPage: res.data.total,
      })
    })
  },
  onJumpToAbout(event) {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  onJumpToDetail(event) {
    const cid = event.detail.cid
    const type = event.detail.type
    const classicIndex = event.detail.index
    //console.info('my like classic index=' + index)
    let toUrl = ''
    if (classicIndex > 0) {
      /*app.globalData.currentCid = cid
      app.globalData.currentType = type*/
      toUrl = `/pages/classic/classic?cid=${cid}&type=${type}`
      wx.reLaunch({
        url: toUrl
      })
    } else {
      toUrl = `/pages/classic-detail/classic-detail?cid=${cid}&type=${type}`
      if(type != 400){
        wx.navigateTo({
          url: toUrl
        })
      }else{
        let index = event.currentTarget.dataset.index
        let classic = this.data.classicsList[index]
        var videoInfo = JSON.stringify(classic);
        toUrl = '/pages/videoinfo/videoinfo?videoInfo=' + videoInfo
        wx.navigateTo({
          url: toUrl
        })
      }
    }
  }
})