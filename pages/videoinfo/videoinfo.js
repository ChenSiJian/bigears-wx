var commentModel = require('../../models/comment.js')
var classicModel = require('../../models/classic.js')
var likeModel = require('../../models/like.js')
const emotion = require('../../utils/emotion')
const mMgr = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cover: "cover",
    videoId: "",
    src: "",
    videoInfo: {},
    commentsList: [],
    placeholder: "说点什么...",
    totalPage: 1,
    page: 1,
    limit: 20,
    commentshow: false,
    danmuList: [],
    likeCount: 0,
    likeStatus: false
  },

  videoCtx: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //如果有音乐播放则先停止音乐播放
    mMgr.stop()
    this.videoCtx = wx.createVideoContext("myVideo", this);
    // 获取上一个页面传入的参数
    let dataTmp = decodeURIComponent(options.videoInfo)
    //console.info('videoInfo-dataTmp:'+dataTmp)
    var videoInfo = JSON.parse(dataTmp);
    this.getDetailInfo(videoInfo.id)
    this._getLikeStatus(videoInfo.id,videoInfo.type)

    var height = videoInfo.mediaHeight;
    var width = videoInfo.mediaWidth;
    var cover = "cover";

    if (width >= height) {
      cover = "";
    }
    //this.videoCtx.requestFullScreen(direction)

    this.setData({
      videoId: videoInfo.id,
      src: videoInfo.mediaUrl,
      videoInfo: videoInfo,
      cover: cover
    });
    let cid = this.data.videoId
    let page = this.data.page
    let pageSize = this.data.limit
    this.getMyCommentList(cid,page,pageSize)
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
    this.videoCtx.play()
  },

  videoEnded: function () {
    this.videoCtx.exitFullScreen()
  },
  videpPlay: function () {
    var height = this.data.videoInfo.mediaHeight;
    var width = this.data.videoInfo.mediaWidth;
    if (width >= height) {
      this.videoCtx.requestFullScreen()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.videoCtx.pause()
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
    var videoInfo = this.data.videoInfo;
    videoInfo = JSON.stringify(videoInfo);
    videoInfo = encodeURIComponent(videoInfo)

    return {
      title: '大耳朵一乐短视频',
      path: "pages/videoinfo/videoinfo?videoInfo=" + videoInfo
    }
  },
  leaveComment: function () {
    this.setData({
      commentshow: !this.data.commentshow
    });
  },
  saveComment: function (e) {
    let commentStr = e.detail.value;
    let cid = this.data.videoId
    commentModel.addComment(cid,commentStr).then((res)=>{
      wx.showToast({
        title: '添加评论成功!',
        icon: "none"
      })
      let page = this.data.page
      let pageSize = this.data.limit
      this.getMyCommentList(cid,page,pageSize)
    })
    this.setData({
      contentValue: ''
    })
  },
  getMyCommentList(cid,page,pageSize){
    commentModel.getMyCommentList(cid,page,pageSize).then((res)=>{
      let arr = res.data.rows
      for(let i in arr){
        var item = arr[i]
        var commentTmp = item.comment
        arr[i].comment = '' + emotion.default.emotionParser(commentTmp)
      }
      this.setData({
        commentsList: arr
      })

    })
  },
  getDetailInfo: function(cid) {
    classicModel.getDetail(cid).then((res)=>{
      let detailTmp = res.data.lyric
      let arrayTmp = []
      let danmuList = this.data.danmuList
      let timeTmp = 2
      if(detailTmp != null && detailTmp != ''){
        arrayTmp = detailTmp.split(";")
        for(var key in arrayTmp){
          let colorTmp = '#23ff0a'
          if(key%2==0){
            colorTmp = '#dcebff'
          }
          //console.info('txt:'+arrayTmp[key])
          danmuList.push({
            text: arrayTmp[key],
            color: colorTmp,
            time: timeTmp
          })
          timeTmp = timeTmp + 2
        }
        if(arrayTmp.length < 3){
          for(var key in arrayTmp){
            let colorTmp = '#35ff15'
            if(key%2==0){
              colorTmp = '#ff4477'
            }
            //console.info('txt:'+arrayTmp[key])
            danmuList.push({
              text: arrayTmp[key],
              color: colorTmp,
              time: timeTmp++
            })
            timeTmp += 2
          }
        }
        this.setData({
          danmuList: danmuList
        })
      }
    })
  },
  _getLikeStatus: function (artID, category) {
    likeModel.getClassicLikeStatus(artID, category).then((res)=>{
      this.setData({
        likeCount: res.data.favNums,
        likeStatus: res.data.likeStatus
      })
      if(this.data.likeStatus){
        classicModel.updateViewCounts(artID)
      }
    })
  },
  onLike: function (event) {
    const behavior = event.detail.behavior
    const formId = event.detail.formId
    likeModel.like(behavior, this.data.videoInfo.id,
        this.data.videoInfo.type,formId)
  }
})