// pages/search/search.js

var classicModel = require('../../models/classic.js')
var keywordModel = require('../../models/keyword.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataArray: [],
    total: null,
    noneResult: false,
    loading:false,
    historyWords: [],
    searchWord: '',
    loading: false,
    loadingCenter: false,
    totalPage: 1,
    page: 1,
    limit: 8
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

    this.setData({
      historyWords: keywordModel.getHistory()
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      searchWord: ''
    })
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
        title: '没有更多数据啦~~',
        icon: "none"
      })
      return;
    }

    var page = currentPage + 1;

    this.searchBykeyword(this.data.searchWord,page,this.data.limit)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onCancel(event) {
    this.initialize()
    wx.switchTab({
      url: '/pages/category/category'
    })
  },

  onDelete(event) {
    this.initialize()
    this.setData({
      searchWord: ''
    })
  },

  onConfirm(event) {
    this._showLoadingCenter()
    // this.initialize()
    const searchWord = event.detail.value || event.detail.text
    //console.info('searchWord:'+searchWord)
    this.setData({
      searchWord
    })
    this.searchBykeyword(searchWord,this.data.page,this.data.limit)
  },
  searchBykeyword(searchWord,page,limit){

    classicModel.search(searchWord,page,limit)
        .then(res => {
          this.setMoreData(res.data.rows)
          this.setTotal(res.data.records)
          keywordModel.addToHistory(searchWord)
          this._hideLoadingCenter()
        })
  },

  _showLoadingCenter() {
    this.setData({
      loadingCenter: true
    })
  },

  _hideLoadingCenter() {
    this.setData({
      loadingCenter: false
    })
  },

  setMoreData: function(dataArray) {
    const tempArray =
        this.data.dataArray.concat(dataArray)
    this.setData({
      dataArray: tempArray
    })
  },

  getCurrentStart: function() {
    return this.data.dataArray.length
  },

  setTotal: function(total) {
    this.data.total = total
    if (total == 0) {
      this.setData({
        noneResult: true
      })
    }
  },

  hasMore: function() {
    if (this.data.dataArray.length >= this.data.total) {
      return false
    } else {
      return true
    }
  },
  initialize: function() {
    this.setData({
      dataArray: [],
      noneResult: false,
      loading:false
    })
    this.data.total = null
  },

  isLocked: function() {
    return this.data.loading ? true : false
  },

  locked: function() {
    this.setData({
      loading: true
    })
  },

  unLocked: function() {
    this.setData({
      loading: false
    })
  },
  onJumpToDetail(event){
    const cid = event.detail.cid
    const type = event.detail.type
    const classicIndex = event.detail.index
    let toUrl = ''
    if(type === 400){
      let index = event.currentTarget.dataset.index
      let classic = this.data.dataArray[index]
      var videoInfo = JSON.stringify(classic);
      videoInfo = encodeURIComponent(videoInfo)
      let toUrl = '/pages/videoinfo/videoinfo?videoInfo=' + videoInfo
      wx.navigateTo({
        url: toUrl
      })
    }else if(classicIndex >0 ){
      //app.globalData.currentCid = cid
      //app.globalData.currentType = type
      toUrl = `/pages/classic/classic?cid=${cid}&type=${type}`
      wx.reLaunch({
        url: toUrl
      })
    }else{
      toUrl = `/pages/classic-detail/classic-detail?cid=${cid}&type=${type}`
      wx.navigateTo({
        url: toUrl
      })
    }
  }
})