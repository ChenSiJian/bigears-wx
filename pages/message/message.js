import { newSocket } from '../../models/socket'
//import {socketApp} from "../../models/socketApp";
var socketApp = require('../../models/socketApp.js')
var chatModel = require('../../models/chat.js')
var userModel = require('../../models/user.js')
var util = require('../../utils/util.js')
const emotion = require('../../utils/emotion')

var recorder = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext() //获取播放对象
let socket
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messages:[],
    userInfo:{},
    meNickName: '',
    meAvatar: '',
    friendId: '',
    friendNickName: '',
    friendAvatar: '',
    emotions1: [],
    emotions2: [],
    emotions3: [],
    emotions4: [],
    emotionBox: false,
    moreBox:false,
    focus: false,
    isClear: false,
    sendBtnStatus: false,
    voice_show: false,
    tap: "tapOff",
    animation: {},
    animation_2: {},
    dotsArray: new Array(4),
    currentDot: 0,
    height: 0,
    msg: '',
    toView: 'msg-0',
    toView1: 'red',
    arrayTimeoutId: [],
    voiceOrkeyboardImg: 'images/voice.png',
    voicePalyImg_right: 'images/yuyin@right.png',
    currentMsgVoidPlayIndex: 0,
    voicePalyImg_left: 'images/yuyin@left.png',
    scrollTop: 100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var emotionsList = ["[微笑]", "[撇嘴]", "[色]", "[发呆]", "[得意]", "[流泪]", "[害羞]",
      "[闭嘴]", "[睡]", "[大哭]", "[尴尬]", "[发怒]", "[调皮]", "[呲牙]", "[惊讶]", "[难过]",
      "[酷]", "[冷汗]", "[抓狂]", "[吐]", "[偷笑]", "[愉快]", "[白眼]", "[傲慢]", "[饥饿]",
      "[困]", "[惊恐]", "[流汗]", "[憨笑]", "[悠闲]", "[奋斗]", "[咒骂]", "[疑问]", "[嘘]",
      "[晕]", "[疯了]", "[哀]", "[骷髅]", "[敲打]", "[再见]", "[擦汗]", "[抠鼻]", "[鼓掌]",
      "[糗大了]", "[坏笑]", "[左哼哼]", "[右哼哼]", "[哈欠]", "[鄙视]", "[委屈]", "[快哭了]",
      "[阴险]", "[亲亲]", "[吓]", "[可怜]", "[菜刀]", "[西瓜]", "[啤酒]", "[篮球]", "[乒乓]",
      "[咖啡]", "[饭]", "[猪头]", "[玫瑰]", "[凋谢]", "[嘴唇]", "[爱心]", "[心碎]", "[蛋糕]",
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
      emotions4,
      userInfo: wx.getStorageSync('userInfo'),
      meNickName: wx.getStorageSync('userInfo').nickName,
      meAvatar: wx.getStorageSync('userInfo').avatarUrl,
      friendId: options.friendId,
      friendNickName: options.nickName,
      friendAvatar: options.avatar,
      messages: wx.getStorageSync('chatHistoryList-'+options.friendId)
    })

    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })

    let friendNickName = this.data.friendNickName
    let friendAvatar = this.data.friendAvatar
    socket = newSocket()
    socket.onMessage((data)=>{
      var dataContent = data;
      var action = dataContent.action;
      var chatMsg = dataContent.chatMsg
      if (action === socketApp.packageEnum.CHAT && chatMsg.senderId===this.data.friendId) {
        let msgTmp = '' + emotion.default.emotionParser(chatMsg.msg)
        let chatHistory = new socketApp.ChatHistory(chatMsg.receiverId, chatMsg.senderId, chatMsg.chatType,
            msgTmp, chatMsg.msgTime, false)
        let m = this.data.messages
        m.push(chatHistory)
        this.setData({
          messages: m
        })
        //刷新滚动到最新的聊天记录
        this.reflashViewto()
      }

      /*this.setData({
        messages: wx.getStorageSync('chatHistoryList-'+this.data.friendId)
      })*/

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.friendNickName
    })
    this.setData({
      msg: '',
      //sendBtnStatus: true
    })
    this.animation = wx.createAnimation()
    this.animation_2 = wx.createAnimation()
    this.on_recorder()//录音监控状态
    //this.on_innerAudioContext()//语音监控播放状态

    this.reflashViewto()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: this.data.friendNickName
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
  * 刷新 viewto 使聊天页面保持滚动到最新的聊天
  **/
  reflashViewto: function () {
    let msgLength = this.data.messages.length-1
    this.setData({
      toView: 'msg' + msgLength.toString()
    })
  },
  createAndSendChatMsg: function (chatType,msg) {
    // 构建ChatMsg
    let userInfo = this.data.userInfo
    let sendId = userInfo.userId
    let receiverId = this.data.friendId
    //let chatType = socketApp.packageEnum.VOICE
    let sendMsg = msg
    let msgTime = util.formatTime(new Date())
    let chatMsg = new socketApp.ChatMsg(sendId, receiverId, chatType, sendMsg, msgTime, null);
    // 构建DataContent
    let dataContent = new socketApp.DataContent(socketApp.packageEnum.CHAT, chatMsg, null);
    socket.sendMessage(dataContent)

    if(chatType == socketApp.packageEnum.TEXT){
      sendMsg = '' + emotion.default.emotionParser(sendMsg)
    }
    socketApp.saveUserChatHistory(sendId,receiverId,chatType, sendMsg, msgTime, true); //true 表示自己

    let chatHistory = new socketApp.ChatHistory(sendId, receiverId, chatType, sendMsg, msgTime, true)
    let m = this.data.messages
    m.push(chatHistory)
    this.setData({
      messages: m
    })
  },
  chooseEmotion(e) {
    //console.log('emotion:' + e.target.dataset.name)
    this.setData({
      msg: this.data.msg + e.target.dataset.name,
    })
    this.setData({
      sendBtnStatus: this.data.msg != ''?true:false,
      focus: false
    })
  },
  chooseImg(){
    let that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        //console.info('tempFilePaths:'+tempFilePaths[0])
        let fileName = 'fileName'

        chatModel.fileUpload(tempFilePaths[0],fileName).then((res)=>{
          let imgUrl = res.data.url
          //console.info('======imgUrl:'+imgUrl)

          that.createAndSendChatMsg(socketApp.packageEnum.IMAGE,imgUrl)
          //刷新滚动到最新的聊天记录
          that.reflashViewto()
        }).catch((e) => {
          console.info('error:'+e)
        })

        that.animation_2.height(that.data.height-50).step();
        that.setData({ animation_2: that.animation_2.export() })
        that.setData({
          tap: "tapOff",
          moreBox: false
        })
      }
    })
  },
  getlocat(){
    wx.showToast({
      title: '该功能还未开发，不要点啦~~',
      icon: "none"
    })
    /*let that = this
    userModel.getAuthorizeLocation().then((res)=>{
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: (res) => {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,

            markers: [{
              latitude: res.latitude,
              longitude: res.longitude,
              name: '时代一号',
              desc: '现在的位置'
            }],

            covers: [{
              latitude: res.latitude,
              longitude: res.longitude,
              //iconPath: '/images/green_tri.png',
              rotate: 10
            }]
          })
          var t = that.data.messages;
          t.push({
            img:that.data.userInfo.avatarUrl,
            isMe:true,
            map:true
          })
          that.setData({
            messages:t
          })
        }})
    })*/
  },
  voice_click: function () {
    this.setData({
      voice_show: !this.data.voice_show
    })
    var imgTmp = 'images/voice.png'
    if(this.data.voice_show){
      imgTmp = 'images/keyboard.png'
    }
    this.setData({
      voiceOrkeyboardImg: imgTmp
    })

  },
  // 点击录音事件
  my_audio_click: function(e) {
    //console.log('my_audio_click执行了:'+e.currentTarget.dataset.url)
    var audioUrl = e.currentTarget.dataset.url
    let key = e.currentTarget.dataset.key
    if(audioUrl != null && audioUrl != ''){
      innerAudioContext.src = audioUrl
      innerAudioContext.seek(0)
      innerAudioContext.play()
      let messagesArr = this.data.messages
      messagesArr[key].voicePlay = true
      this.setData({
        //currentMsgVoidPlayIndex: key,
        messages: messagesArr
      })
      /*if(leftOrRight === 'right'){
        this.setData({
          voicePalyImg_right: 'images/yuyin-play@right.gif'
        })
      }else {
        this.setData({
          voicePalyImg_left: 'images/yuyin-play@left.gif'
        })
      }*/
      innerAudioContext.onEnded((res)=>{
        messagesArr[key].voicePlay = false;
        this.setData({
          messages: messagesArr
        })
      })
    }
  },
  // 语音播放监听事件
  on_innerAudioContext:function () {

  },
  // 手指点击录音
  voice_ing_start: function() {
    var that = this;
    this.setData({
      voice_ing_start_date: new Date().getTime(), //记录开始点击的时间
      isShowTocast: true
    })

    wx.showToast({
      title: '录音中。。',
      image: '/images/luyin.png',
      duration: 10000
    })
    let durationTmp = 10000
    let arrayTimeoutId = this.data.arrayTimeoutId
    for(let i=0; i < 6; i++){
      let timeId = setTimeout(function () {
        wx.showToast({
          title: '录音中。。',
          image: '/images/luyin.png',
          duration: 10000,
        })
      },durationTmp)
      arrayTimeoutId.push(timeId)
      durationTmp += 10000
    }
    this.setData({
      arrayTimeoutId: arrayTimeoutId
    })


    const options = {
      //duration: 10000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 24000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
    }
    recorder.start(options) //开始录音

    /*this.animation = wx.createAnimation({
      duration: 1200,
    }) //播放按钮动画
    that.animation.scale(0.8, 0.8); //还原
    that.setData({
      spreakingAnimation: that.animation.export()
    })*/
  },
  // 手指松开录音
  voice_ing_end: function() {
    var that = this;

    let arrayTimeoutId = this.data.arrayTimeoutId
    arrayTimeoutId.forEach(id=>{
      clearTimeout(id)
    })
    wx.hideToast()
    that.setData({
      spreakingAnimation: {},
      arrayTimeoutId: []
    })
    //this.animation = "";
    var x = new Date().getTime() - this.data.voice_ing_start_date
    if (x < 1000) {
      console.log('录音停止，说话小于1秒！')
      wx.showModal({
        title: '提示',
        content: '说话要大于1秒！',
      })
      recorder.stop();
    } else if(x > 65000){
      wx.showModal({
        title: '提示',
        content: '说话不能大于1分钟！',
      })
      recorder.stop();
    }else {
      // 录音停止，开始上传
      recorder.stop();
    }
  },
  // 录音监听事件
  on_recorder: function() {
    var that = this;
    recorder.onStart((res) => {
      console.log('开始录音');
    })
    recorder.onStop((res) => {
      console.log('停止录音,临时路径', res.tempFilePath);
      // _tempFilePath = res.tempFilePath;
      var x = new Date().getTime() - this.data.voice_ing_start_date
      if (x > 1000 && x < 66000) {
        /*var t = that.data.messages;
        t.push({
          isMe:true,
          audio: res.tempFilePath,
          length: x / 1000
        })
        that.setData({
          messages:t
        })*/

        let fileName = 'fileName'

        chatModel.fileUpload(res.tempFilePath,fileName).then((res)=>{
          let audioUrl = res.data.url

          that.createAndSendChatMsg(socketApp.packageEnum.VOICE,audioUrl)
          //刷新滚动到当前聊天信息
          that.reflashViewto()
        }).catch((e) => {
          console.info('error:'+e)
        })
      }
    })
  },
  bindKeyInput(e) {
    if(this.data.focus){
      this.setData({
        msg: e.detail.value
        //more: (e.detail.value)?'ion-ios-send':'ion-ios-plus-outline'
      })
    }
    /*let status = false
    if(this.data.msg != ''){
      status = true
    }*/
    this.setData({
      sendBtnStatus: this.data.msg != ''?true:false
    })
  },
  emotionBtn() {
    this.setData({
      moreBox: false,
      emotionBox: !this.data.emotionBox
    })

    if (this.data.tap == "tapOff") {
      this.animation_2.height(this.data.height - 370).step();
      this.setData({
        animation_2: this.animation_2.export(),
        tap: "tapOn"
      })
    } else {
      if(!this.data.emotionBox){
        this.animation_2.height(this.data.height - 50).step();
        this.setData({
          animation_2: this.animation_2.export(),
          tap: "tapOff"
        })
      }

    }
  },
  moreBtn:function(){
    this.setData({
      emotionBox: false,
      moreBox: !this.data.moreBox
    })

    if(this.data.tap=="tapOff"){
      this.animation_2.height(this.data.height-370).step();
      this.setData({ animation_2: this.animation_2.export() })
      this.setData({
        tap:"tapOn"
      })
    }else{
      if(!this.data.moreBox){
        this.animation_2.height(this.data.height-50).step();
        this.setData({ animation_2: this.animation_2.export() })
        this.setData({
          tap:"tapOff"
        })
      }
    }
  },
  tapscroll: function(e) {
    this.setData({
      emotionBox:false,
      moreBox: false
    })

    this.animation_2.height(this.data.height-50).step();
    this.setData({ animation_2: this.animation_2.export() })
    this.setData({
      tap:"tapOff"
    })
  },
  inputFocus: function () {
    this.setData({
      animation_2: {},
      emotionBox: false,
      moreBox: false,
      //tap: "tapOn",
      focus: true,
      isClear: false
    })

  },
  inputBlur: function () {
    //当先获取焦点再点表情图标时，此时emotionBox 为true，需要判断一下，否则无法显示表情界面
    if(!this.data.emotionBox && !this.data.moreBox){
      this.animation_2.height(this.data.height - 50).step();
      this.setData({
        animation_2: this.animation_2.export(),
        tap: "tapOff"
      })
    }
    if(this.data.isClear){
      this.setData({
        msg: '',
        isClear: false,
        focus: false
      });
    }

  },
  msgSubmit: function () {
    let sendMsg = this.data.msg
    this.createAndSendChatMsg(socketApp.packageEnum.TEXT,sendMsg)

    this.setData({
      msg: '',
      isClear: true,
      //messages: wx.getStorageSync('chatHistoryList-'+receiverId),
      focus: true
    })
    this.setData({
      sendBtnStatus: this.data.msg != ''?true:false
    })
    this.reflashViewto()
  },
  changeDot: function (e) {
    //console.info('changeDot event:' + e.detail.current)
    this.setData({
      currentDot: e.detail.current
    })
  },
  previewImg:function(e){
    console.log(e.currentTarget.dataset.index)
    var url = e.currentTarget.dataset.url
    var imgArr = []
    imgArr.push(url)
    wx.previewImage({
      current: imgArr[0],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})