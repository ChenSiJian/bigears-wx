import {
  createSong
} from '../../utils/song'
import {
  Lyric
} from '../../utils/lyric'
var likeModel = require('../../models/like.js')
var classicModel = require('../../models/classic.js')

const mMgr = wx.getBackgroundAudioManager()
var app = getApp()

const SEQUENCE_MODE = 1
const RANDOM_MOD = 2
const SINGLE_CYCLE_MOD = 3
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    classic: null,
  },

  /**
   * 组件的初始数据
   */
  data: {
    playing: false,
    isLoop: false,
    loopIcon: 'images/loopPlay.png',
    notLoopIcon: 'images/loopPlay@no.png',
    pauseSrc: 'images/player@pause.png',
    playSrc: 'images/player@play.png',
    cdCls: 'pause',
    currentLyric: null,
    playingLyric: '',
    currentLineNum: 0,
    toLineNum: -1,
    currentSong: null,
    dotsArray: new Array(2),
    currentDot: 0,
    likeCount: 0,
    likeStatus: false
  },
  attached: function () {
    //console.info('into player组件 的 attached......')
    if (mMgr.paused != 'undefined' && !mMgr.paused){
      mMgr.stop()
      mMgr.src = "test"
      mMgr.title = "test"

    }
    if(app.globalData.hasLogin){
      this._initLyric()
      this._getLikeStatus(this.properties.classic.id,this.properties.classic.type)
    }
    this._monitorSwitch()
  },
  detached: function(event) {
    // wx:if hidden
    mMgr.stop()
  },
  pageLifetimes: {
    show: function() {
      console.info('player 组件中所在的页面被展示。。。。。')
      // if(app.globalData.hasLogin){
      //   //this._initLyric()
      //   //this._getLikeStatus(this.properties.classic.id,this.properties.classic.type)
      // }
      /*if(!mMgr.paused){
        const currentTimeTmp = mMgr.currentTime
        console.info('----currentTimeTmp:'+currentTimeTmp)
        if (this.data.currentLyric) {
          console.info('into currentLyric seek.....')
          this.data.currentLyric.seek(currentTimeTmp * 1000)
        }
      }*/
    }
  },
  //组件没有onshow方法
  /*onShow: function () {
    console.info('into player onShow===================')

  },*/
  /**
   * 组件的方法列表
   */
  methods: {
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
      let toLineNum = lineNum - 5
      if (lineNum > 5 && toLineNum != this.data.toLineNum) {
        this.setData({
          toLineNum: toLineNum
        })
      }
    },
    togglePlaying: function () {
      if(!app.globalData.hasLogin){
        wx.navigateTo({
          url: '/pages/auth/login/login'
        })
        return
      }
      if (this.data.currentLyric) {
        //this.data.currentLyric.seek(0)
        this.data.currentLyric.togglePlay()
      }

      if (!this.data.playing) {
        this.setData({
          playing: true
        })

        //console.info('mMgr.src:' + mMgr.src)
        if (mMgr.src !== this.properties.classic.mediaUrl){
          //this._initLyric()
          mMgr.src = this.properties.classic.mediaUrl
          mMgr.title = this.properties.classic.title
          let that = this
          setTimeout(function () {
            that.setData({
              duration: that._formatTime(mMgr.duration)
            })
          },500)
        }else{
          mMgr.play()
        }
      } else {
        this.setData({
          playing: false
        })
        mMgr.pause()
      }
    },
    loop() {
      mMgr.src = this.properties.classic.mediaUrl
      mMgr.title = this.properties.classic.title
      if(this.data.currentLyric){
        this.data.currentLyric.seek(0)
      }
    },
    _recoverStatus: function() {
      if (mMgr.paused) {
        this.setData({
          playing: false
        })
        return
      }

      if (mMgr.paused != 'undefined' && !mMgr.paused && mMgr.src != this.properties.classic.mediaUrl) {
        this.setData({
          playing: false
        })
        return
      }
      if (mMgr.src == this.properties.classic.mediaUrl) {
        this.setData({
          playing: true
        })
      }
    },

    _monitorSwitch: function() {
      mMgr.onPlay(() => {
        this._recoverStatus()
      })
      mMgr.onPause(() => {
        this._recoverStatus()
      })
      mMgr.onStop(() => {
        this._recoverStatus()
      })
      mMgr.onTimeUpdate(() => {
        const currentTime = mMgr.currentTime
        const duration = mMgr.duration

        let percent = currentTime / duration
        this.setData({
          currentTime: this._formatTime(currentTime),
          percent: percent
        })
      })
      mMgr.onEnded(() => {
        this._recoverStatus()
        if(this.data.isLoop){
          this.loop()
        }else if(this.data.currentLyric){
          this.data.currentLyric.seek(0)
          this.data.currentLyric.togglePlay()

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
      likeModel.like(behavior, this.data.classic.id,
          this.data.classic.type,formId)
    },
    _formatTime: function (interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    /*秒前边加0*/
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    changeMod: function () {
      this.setData({
        isLoop: !this.data.isLoop
      })
    },
    changeDot: function (e) {
      //console.info('changeDot event:'+e.detail.current)
      this.setData({
        currentDot: e.detail.current
      })
    }
  }
  /*observers: {
    'playing': function() {
      //console.info('playing had change.....='+this.data.playing)
    }
  }*/
})
