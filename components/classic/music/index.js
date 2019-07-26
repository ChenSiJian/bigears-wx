import {
  createSong
} from '../../../utils/song'
import {
  Lyric
} from '../../../utils/lyric'
var richTextParse = require('../../../utils/richTextParse/richText.js');
const emotion = require('../../../utils/emotion')
var mMgr = wx.getBackgroundAudioManager()

var app = getApp()
Component({
  /**
   * 组件的属性列, 动画
   * 动画API CSS3 canvas 游戏
   * 现成
   */
  properties: {
    img: String,
    content: String,
    hidden: Boolean,
    src: String,
    title: String,
    classic: null,
    userInfo: null
  },

  /**
   * 组件的初始数据
   * 播放音乐API 老版API 新版API
   */
  data: {
    playing: false,
    pauseSrc: 'images/player@pause.png',
    playSrc: 'images/player@play.png',
    currentSong: null,
    currentLyric: null,
    currentLineNum: 0,
    playingLyric: '',
    isShowLyric:false,
    contentHtml: null
  },

  // hidden ready created
  //onShow

  attached(event) {
    // 跳转页面 当前 切换
    //console.info('into music  组件--attached。。。。。')
    //this._recoverStatus()
    //this._monitorSwitch()
  },

  detached: function(event) {
    // wx:if hidden
    // mMgr.stop()
  },

  pageLifetimes: {
    show: function() {
      // 页面被展示
      this._recoverStatus()
      this._monitorSwitch()
    },
    hide: function () {
      //console.info('music组件所在的页面被yincang时执行...')
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //初始化
    _initLyric: function() {
      if (this.data.currentLyric) {
        this.data.currentLyric.stop()
        this.setData({
          playingLyric: '',
          currentLineNum: 0
        })
      }
      let currentSong = createSong(this.properties.classic)
      this.setData({
        currentSong: currentSong
      })
      this._getLyric(currentSong)
    },
    _getLyric: function(currentSong) {
      currentSong.getLyric().then((lyric) => {
        //console.info('lyric:'+lyric)
        if (this.data.currentSong.lyric !== lyric) {
          return
        }
        //console.info('=========lyric:'+lyric)
        if (lyric !== null && lyric !== undefined && lyric.trim().length > 0) {
          let currentLyric = new Lyric(lyric, this.handleLyric, this)

          this.setData({
            currentLyric: currentLyric
          })

          if (this.data.playing) {
            this.data.currentLyric.play()
          }
        } else {
          this.setData({
            currentLyric: null
          })
        }
      }).catch((err) => {
        //console.info('my-err:'+err)
        this.setData({
          currentLyric: null,
          playingLyric: '',
          currentLineNum: 0
        })
      })

    },
    handleLyric: function({
      lineNum,
      txt
    }) {
      this.setData({
        currentLineNum: lineNum,
        playingLyric: txt
      })
      //console.info('handleLyric-txt::'+this.data.playingLyric)
    },
    onPlay: function(event) {
      if(!app.globalData.hasLogin){
        wx.navigateTo({
          url: '/pages/auth/login/login'
        })
        return
      }
      //console.info('=======mMgr.duration:'+mMgr.duration)
      if (this.data.currentLyric) {
        this.data.currentLyric.togglePlay()
      }
      
      if (!this.data.playing) {
        this.setData({
          playing: true
        })
        if (mMgr.src !== this.properties.src){
          this._initLyric()
          mMgr.src = this.properties.src
          mMgr.title = this.properties.title
          app.globalData.currentMusicSrc = this.properties.src
        }else{
          mMgr.play()
        }
        this.triggerEvent('clickPlay',{},{})
      } else {
        this.setData({
          playing: false
        })
        mMgr.pause()
      }
    },
    loop() {
      mMgr.src = app.globalData.currentMusicSrc
      mMgr.title = 'gallop 很酷！'
      if(this.data.currentLyric){
        this.data.currentLyric.seek(0)
      }
    },
    _recoverStatus: function() {
      if (mMgr.paused) {
        this.setData({
          playing: false
        })
        if (mMgr.src != this.properties.src) {
          this.setData({
            isShowLyric: false
          })
        }else {
          this.setData({
            isShowLyric: true
          })
        }
        return
      }

      //mMgr.paused != 'undefined' && !mMgr.paused &&
      if (mMgr.src != this.properties.src) {
        this.setData({
          playing: false,
          isShowLyric: false
        })
        return
      }
      if (mMgr.src == this.properties.src) {
        this.setData({
          playing: true,
          isShowLyric:true
        })
      }
    },

    _monitorSwitch: function() {
      mMgr.onPlay(() => {
        //console.info('music组件onPlay事件发生。。。。')
        this._recoverStatus()
      })
      mMgr.onPause(() => {
        //console.info('music组件onPause事件发生。。。。')
        this._recoverStatus()
      })
      mMgr.onStop(() => {
        //console.info('music组件onStop事件发生。。。。')
        this._recoverStatus()
      })
      mMgr.onEnded(() => {
        this._recoverStatus()
        this.loop()
      })
    }
  },
  observers: {
    'classic': function() {
      //console.info('classic had change.....')
      this._recoverStatus()
      this._monitorSwitch()
    },
    'content': function() {
      let contentTmp = this.properties.content
      if(!contentTmp.startsWith('<p'))
        contentTmp = '<p>' + contentTmp + '</p>'
      contentTmp= emotion.default.emotionParser(contentTmp)
      contentTmp = richTextParse.go(contentTmp)
      /*for(var i in contentTmp){
        var tmp = contentTmp[i];
        console.info(tmp)
      }*/
      this.setData({
        contentHtml: contentTmp
      })
    }
  }
})