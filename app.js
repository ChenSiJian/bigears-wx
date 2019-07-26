//import {FriendUserInfo} from "./models/socketApp";
//var userModel = require('./models/user.js');
//var chatModel = require('./models/chat.js')
//var socketApp = require('./models/socketApp.js')
//const emotion = require('./utils/emotion.js')

App({
  onLaunch: function () {

  },
  globalData: {
    hasLogin: false,
    hasGotoLoginPage: false,
    //currentCid: '',
    //currentType: 0,
    currentMusicSrc: '',
    chatSnapshotList: [],
    chatHistoryList: []
  },
  onShow: function (options) {
    wx.setNavigationBarTitle({
      title: "大耳朵一乐"
    })
  },
})