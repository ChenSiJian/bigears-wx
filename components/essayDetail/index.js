
//var WxParse = require('../../lib/wxParse/wxParse.js');
var richTextParse = require('../../utils/richTextParse/richText.js');
const emotion = require('../../utils/emotion')
var classicModel = require('../../models/classic.js')
var likeModel = require('../../models/like.js')
var commentModel = require('../../models/comment.js')

var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    classic: null,
    userInfo: null
  },

  /**
   * 组件的初始数据
   */
  data: {
    htmlStr: null,
    pubtimeStr: '',
    commentsList: [],
    page: 1,
    limit: 20,
    height: 0,
    likeCount: 0,
    likeStatus: false
  },
  attached: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
    if(app.globalData.hasLogin){
      this._getLikeStatus(this.properties.classic.id,this.properties.classic.type)
      this.getDetailInfo()
      this.setData({
        pubtimeStr: this.properties.classic.pubtime.substr(0,10)
      })
      this.getCommentList(this.properties.classic.id,this.data.page,this.data.limit)
    }else{
      wx.navigateTo({
        url: '/pages/auth/login/login'
      })
    }

  },

  pageLifetimes: {
    show: function () {
      this._getLikeStatus(this.properties.classic.id,this.properties.classic.type)
      this.getDetailInfo()
      this.setData({
        pubtimeStr: this.properties.classic.pubtime.substr(0,10)
      })
      this.getCommentList(this.properties.classic.id,this.data.page,this.data.limit)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getDetailInfo: function() {
      classicModel.getDetail(this.properties.classic.id).then((res)=>{
        //console.info('content:'+res.data.lyric)
        //let htmlParseTmp = richTextParse.go(res.data.lyric)
        //console.info('htmlParseTmp==='+htmlParseTmp)
        this.setData({
          htmlStr: richTextParse.go(res.data.lyric)
        })
        //WxParse.wxParse('essayDetail', 'html', res.data.lyric, that);
      })
    },
    getCommentList: function (cid,page,pageSize) {
      commentModel.getCommentList(cid,page,pageSize).then((res)=>{
        let arr = res.data.rows
        for(let i in arr){
          //console.info('comment:'+arr[i].comment)
          var item = arr[i]
          var commentTmp = item.comment

          arr[i].comment = '' + emotion.default.emotionParser(commentTmp)
          if(item.reply && item.reply != ''){
            var replyTmp = item.reply
            arr[i].reply = '' + emotion.default.emotionParser(replyTmp)
          }

          //console.info('item.comment:'+item.comment)
        }
        this.setData({
          commentsList: arr,
          page: page
        })
      })
    },
    onZan: function (event) {
      const behavior = event.detail.behavior
      const commentId = event.detail.commentId
      commentModel.zanAction(behavior, commentId)
    },
    onJumpToAddComment(){
      let title = this.properties.classic.title
      let cid = this.properties.classic.id
      let toUrl = `/pages/addComment/addComment?title=${title}&cid=${cid}`
      wx.navigateTo({
        url: toUrl
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
      likeModel.like(behavior, this.data.classic.id,
          this.data.classic.type,formId)
    }
  }
})
