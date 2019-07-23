var commentModel = require('../../models/comment.js')
const emotion = require('../../utils/emotion')
var emojiFn = require('../../utils/template/emoj.js');
var richTextParse = require('../../utils/richTextParse/richText.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    cid: '',
    commentStr: '',
    //htmlStr: '',
    emotionList: null,
    //emojiMsg: null,
    emotions1: [],
    emotions2: [],
    emotions3: [],
    emotions4: [],
    emotionBox: false,
    focus: false,
    isClear: false,
    animation: {},
    dotsArray: new Array(4),
    currentDot: 0,
    myCommentList: [],
    page: 1,
    limit: 20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      title: options.title,
      cid: options.cid
    })
    var emotionsList = ["[微信]", "[撇嘴]", "[色]", "[发呆]", "[得意]", "[流泪]", "[害羞]",
      "[闭嘴]", "[睡]", "[大哭]", "[尴尬]", "[发怒]", "[调皮]", "[呲牙]", "[惊讶]", "[难过]",
      "[酷]", "[冷汗]", "[抓狂]", "[吐]", "[偷笑]", "[愉快]", "[白眼]", "[傲慢]", "[饥饿]",
      "[困]", "[惊恐]", "[流汗]", "[憨笑]", "[悠闲]", "[奋斗]", "[咒骂]", "[疑问]", "[嘘]",
      "[晕]", "[疯了]", "[哀]", "[骷髅]", "[敲打]", "[再见]", "[擦汗]", "[抠鼻]", "[鼓掌]",
      "[糗大了]", "[坏笑]", "[左哼哼]", "[右哼哼]", "[哈欠]", "[鄙视]", "[委屈]", "[快哭了]",
      "[阴险]", "[亲亲]", "[吓]", "[可怜]", "[菜刀]", "[西瓜]", "[啤酒]", "[篮球]", "[乒乓]",
      "[咖啡]", "[饭]", "[猪头]", "瑰][玫", "[凋谢]", "[嘴唇]", "[爱心]", "[心碎]", "[蛋糕]",
      "[闪电]", "[炸弹]", "[刀]", "[足球]", "[瓢虫]", "[便便]", "[月亮]", "[太阳]", "[礼物]",
      "[拥抱]", "[强]", "[弱]", "[握手]", "[胜利]", "[抱拳]", "[勾引]", "[拳头]", "[差劲]",
      "[爱你]", "[NO]", "[OK]", "[爱情]", "[飞吻]", "[跳跳]", "[发抖]", "[怄火]", "[转圈]",
      "[磕头]", "[回头]", "[跳绳]", "[投降]", "[激动]", "[乱舞]", "[献吻]", "[左太极]", "[右太极]"]
    let emotions1 = []
    let emotions2 = []
    let emotions3 = []
    let emotions4 = []
    for (let i = 0; i < emotionsList.length; i++) {
      if (i < 30) {
        emotions1.push({
          src: '../../images/qqface/' + i + '.png',
          id: i,
          name: emotionsList[i]
        })
      } else if (i < 60) {
        emotions2.push({
          src: '../../images/qqface/' + i + '.png',
          id: i,
          name: emotionsList[i]
        })
      } else if (i < 90) {
        emotions3.push({
          src: '../../images/qqface/' + i + '.png',
          id: i,
          name: emotionsList[i]
        })
      } else {
        emotions4.push({
          src: '../../images/qqface/' + i + '.png',
          id: i,
          name: emotionsList[i]
        })
      }
    }
    this.setData({
      emotions1,
      emotions2,
      emotions3,
      emotions4
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    /*this.setData({
      emotionList: emojiFn.emojiAnalysis(list)
    })*/
    //console.info('this.data.emotionList.length='+this.data.emotionList.length)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMyCommentList(this.data.cid,this.data.page,this.data.limit)


   /* let str = emotion.default.emotionParser('He [得意]')
    console.info('str=' + str)
    str = '<p>' + str + '</p>'
    let htmlStr = '["哈<img src="../../images/qqface/0.png" />"]'
    htmlStr='["内容评论，赞2个"]'
    //console.info('htmlStr='+htmlStr)
    emojiFn
    this.setData({
      htmlStr: htmlStr,
      emojiMsg: emojiFn.emojiAnalysis('He [得意]')
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

  },
  bindTextAreaBlur: function (e) {

  },
  sendMessage: function (e) {
    if(this.data.focus){
      this.setData({
        commentStr: e.detail.value
      });
    }
  },
  inputFocus: function () {
    this.setData({
      isClear: false,
      focus: true
    });
  },
  inputBlur: function (e) {
    if(this.data.isClear){
      this.setData({
        commentStr: '',
        isClear: false,
        focus: false
      });
    }
  },
  bindSubmit: function () {
    this.addComment(this.data.cid,this.data.commentStr)
    this.setData({
      isClear: true,
      commentStr: ''
    });
    //console.info('commentStr:' + this.data.commentStr)

  },
  chooseEmotion(e) {
    this.setData({
      focus: false,
      commentStr: this.data.commentStr + e.target.dataset.name
    })
  },
  emotionBtn() {
    this.setData({
      emotionBox: !this.data.emotionBox
    })
  },
  changeDot: function (e) {
    this.setData({
      currentDot: e.detail.current
    })
  },
  addComment:function (cid,commentStr) {
    commentModel.addComment(cid,commentStr).then((res)=>{
      wx.showToast({
        title: '添加评论成功!',
        icon: "none"
      })
      let page = this.data.page
      let pageSize = this.data.limit
      this.getMyCommentList(cid,page,pageSize)
    })
  },
  getMyCommentList(cid,page,pageSize){
    commentModel.getMyCommentList(cid,page,pageSize).then((res)=>{
      let arr = res.data.rows
      for(let i in arr){
        //console.info('comment:'+arr[i].comment)
        var item = arr[i]
        var commentTmp = item.comment
        //arr[i].comment = '' + emojiFn.emojiAnalysis(commentTmp)
        arr[i].comment = '' + emotion.default.emotionParser(commentTmp)
        //console.info('item.comment:'+item.comment)
      }
      this.setData({
        myCommentList: arr
      })

    })
  },
  delComment: function (event) {
    let commentId = event.currentTarget.dataset.id
    //console.info('commentId='+commentId)
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除此评论吗？',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          commentModel.delComment(commentId).then((res)=>{
            let cid = that.data.cid
            let page = that.data.page
            let pageSize = that.data.limit
            that.getMyCommentList(cid,page,pageSize)
          })
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  }

})