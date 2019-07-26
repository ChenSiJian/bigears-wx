var classicModel = require('../../models/classic.js')
// pages/category/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [],
    classicsList: [],
    id: 100,
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    totalPage: 1,
    page: 1,
    limit: 6
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

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
    wx.setNavigationBarTitle({
      title: "大耳朵一乐"
    })
    if(app.globalData.hasLogin){
      this.getCategoryInfo();
      if(this.data.page === 1){
        this.getClassicList(this.data.id,this.data.page,this.data.limit)
      }
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
    wx.showNavigationBarLoading()
    this.getClassicList(this.data.id,1,this.data.limit)
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
        title: '我的天啊，到底了，你已经看到大耳朵的底裤啦~~',
        icon: "none"
      })
      return;
    }

    var page = currentPage + 1;

    this.getClassicList(this.data.id,page,this.data.limit)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getCategoryInfo: function () {
    classicModel.getCategoryList().then((res) => {
      this.setData({
        navList: res.data,
        id: 100
      })
    })
  },
  getClassicList: function (type,page,pageSize) {
    /*wx.showLoading({
      title: '请等待，加载中...',
    });*/
    classicModel.getClassicList(type,page,pageSize).then((res) => {
      //console.info('getting ClassicList.........')
      //wx.hideLoading();
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();

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
  switchCate: function(event) {
    if (this.data.id == event.currentTarget.dataset.id) {
      return false;
    }
    //var that = this;
    var clientX = event.detail.x;
    var currentTarget = event.currentTarget;
    if (clientX < 60) {
      this.setData({
        scrollLeft: currentTarget.offsetLeft - 60
      });
    } else if (clientX > 330) {
      this.setData({
        scrollLeft: currentTarget.offsetLeft
      });
    }
    this.setData({
      id: event.currentTarget.dataset.id,
      classicsList: [],
      page: 1,
      totalPage: 1,
    });
    wx.setNavigationBarTitle({
      title: event.currentTarget.dataset.name
    })

    this.getClassicList(this.data.id,this.data.page,this.data.limit);
  },
  onJumpToDetail(event){
    const cid = event.detail.cid
    const type = event.detail.type
    const classicIndex = event.detail.index
    let toUrl = ''
    if (classicIndex > 0) {
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
        videoInfo = encodeURIComponent(videoInfo)
        let toUrl = '/pages/videoinfo/videoinfo?videoInfo=' + videoInfo
        wx.navigateTo({
          url: toUrl
        })
      }
    }


  }
})