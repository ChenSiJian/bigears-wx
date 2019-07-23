var userModel = require('./user.js')
var util = require('../utils/util.js')
const app = getApp()
//let friendInfoMap = new Map()
//wx.setStorageSync('friendInfoMap',friendInfoMap)
var packageEnum = {
  /**
   * 和后端的枚举对应
   */
  CONNECT: 1, 	// 第一次(或重连)初始化连接
  CHAT: 2, 		// 聊天消息
  SIGNED: 3, 		// 消息签收
  KEEPALIVE: 4, 	// 客户端保持心跳
  PULL_FRIEND: 5,	// 重新拉取好友

  /*聊天内容类型，和后端枚举对应*/
  TEXT: 1,
  IMAGE: 2,
  VOICE: 3
}

function getFriendsInfo(userId) {
  var friendInfo = wx.getStorageSync('friendInfo-'+userId)
  if(!friendInfo){
    return null
  } else{
    return friendInfo
  }
}

function addFriendsInfo(userInfo) {
  wx.setStorageSync('friendInfo-'+userInfo.userId, userInfo);
}

class FriendUserInfo{
  constructor(userId, nickName, avatar){
    this.userId = userId
    this.nickName = nickName
    this.avatar = avatar
  }
}
/**
 * 和后端的 ChatMsg 聊天模型对象保持一致
 * @param {Object} senderId
 * @param {Object} receiverId
 * @param {Object} msg
 * @param {Object} msgId
 */
class ChatMsg {
  constructor(senderId, receiverId, chatType, msg, msgTime, msgId) {
    this.senderId = senderId
    this.receiverId = receiverId
    this.chatType = chatType
    this.msg = msg
    this.msgTime = msgTime
    this.msgId = msgId
  }
}
/**
 * 构建消息 DataContent 模型对象
 * @param {Object} action
 * @param {Object} chatMsg
 * @param {Object} extand
 */
class DataContent {
  constructor(action, chatMsg, extand) {
    this.action = action
    this.chatMsg = chatMsg
    this.extand = extand
  }
}


/**
 * 单个聊天记录的对象
 * @param {Object} myId
 * @param {Object} friendId
 * @param {Object} msg
 * @param {Object} flag
 */
class ChatHistory{
  constructor(myId, friendId, chatType, msg, msgTime, flag){
    this.myId = myId
    this.friendId = friendId
    this.chatType = chatType
    this.msg = msg
    this.voicePlay = false
    this.isMe = flag
    let saveMsgtime = msgTime
    let currentChatTimeKey = "currentChatTime-"+friendId
    let currentChatTime = wx.getStorageSync(currentChatTimeKey)
    if(currentChatTime == null || currentChatTime == undefined || currentChatTime == ''){
      currentChatTime = msgTime
      wx.setStorageSync(currentChatTimeKey,currentChatTime)
    }else{
      //如果聊天间隔超过半小时，则存入时间，用于在界面显示
      if(util.difftime(msgTime,currentChatTime) > 1800){
        currentChatTime = msgTime
        wx.setStorageSync(currentChatTimeKey,currentChatTime)
      }else{
        saveMsgtime = null
      }
    }
    this.msgTime = saveMsgtime
  }
}

/**
 * 快照对象
 * @param {Object} myId
 * @param {Object} friendId
 * @param {Object} msg
 * @param {Object} isRead    用于判断消息是否已读还是未读
 */
class ChatSnapshot{
  constructor(myId, friendId, friendNickName, friendAvatar, msg, msgTime, count, isRead){
    this.myId = myId
    this.friendId = friendId
    this.friendNickName = friendNickName
    this.friendAvatar = friendAvatar
    this.msg = msg
    this.msgTime = msgTime
    this.count = count
    this.isRead = isRead
  }
}
/**
 * 判断字符串是否为空
 * @param {Object} str
 * true：不为空
 * false：为空
 */
function isNotNull (str) {
  if (str != null && str != "" && str != undefined) {
    return true;
  }
  return false;
}
/**
 * 保存用户的聊天记录
 * @param {Object} myId
 * @param {Object} friendId
 * @param {Object} msg
 * @param {Object} flag    判断本条消息是我发送的，还是朋友发送的，true:我  false:朋友
 */
function saveUserChatHistory(myId, friendId, chatType, msg, msgTime, flag) {
  let me = this
  let chatListKey = 'chatHistoryList-' + friendId
  let chatHistoryList = wx.getStorageSync(chatListKey)
  //console.info('chatHistoryList:'+chatHistoryList)

  if (chatHistoryList == null || chatHistoryList == undefined || chatHistoryList == '') {
    // 如果为空，赋一个空的list
    chatHistoryList = []
  }
  /*let saveMsgtime = msgTime
  let currentChatTimeKey = "currentChatTime-"+friendId
  let currentChatTime = wx.getStorageSync(currentChatTimeKey)
  if(currentChatTime == null || currentChatTime == undefined || currentChatTime == ''){
    console.info('===================currentChatTime is null')
    currentChatTime = msgTime
  }else{
    //如果聊天间隔超过半小时，则存入时间，用于在界面显示
    if(util.difftime(msgTime,currentChatTime) > 1800){
      currentChatTime = msgTime
    }else{
      saveMsgtime = null
    }
  }
  wx.setStorageSync(currentChatTimeKey,currentChatTime)*/

  // 构建聊天记录对象
  let singleMsg = new ChatHistory(myId, friendId, chatType, msg, msgTime, flag)

  //console.info('构建了一个singleMsg。。。')

  // 向list中追加msg对象
  chatHistoryList.push(singleMsg)
  wx.setStorageSync(chatListKey, chatHistoryList)
  //app.globalData.chatHistoryList = chatHistoryList
}
/**
 * 聊天记录的快照，仅仅保存每次和朋友聊天的最后一条消息
 * @param {Object} myId
 * @param {Object} friendId
 * @param {Object} msg
 * @param {Object} isRead
 */
function saveUserChatSnapshot (myId, friendId, friendNickName, friendAvatar, chatType, msg, msgTime, isRead) {
  var me = this;
  var count = 0

  let msgStr = msg
  if (chatType === packageEnum.IMAGE) {
    msgStr = '图片'
  } else if (chatType === packageEnum.VOICE) {
    msgStr = '声音'
  }
  if(msgStr.length>15){
    msgStr = msgStr.substr(0,15) + '...'
  }

  // 从本地缓存获取聊天快照的list
  var chatSnapshotList = wx.getStorageSync('chatSnapshotList')
  if (chatSnapshotList != null && chatSnapshotList != undefined && chatSnapshotList != '') {
    // 循环快照list，并且判断每个元素是否包含（匹配）friendId，如果匹配，则删除
    for (var i = 0; i < chatSnapshotList.length; i++) {
      if (chatSnapshotList[i].friendId == friendId) {
        // 删除已经存在的friendId所对应的快照对象
        count = chatSnapshotList[i].count
        chatSnapshotList.splice(i, 1)
        break;
      }
    }
  } else {
    // 如果为空，赋一个空的list
    chatSnapshotList = []
  }

  // 构建聊天快照对象
  var singleMsg = new ChatSnapshot(myId, friendId, friendNickName, friendAvatar, msgStr, msgTime, count + 1, isRead)

  // 向list中追加快照对象
  chatSnapshotList.unshift(singleMsg)

  wx.setStorageSync('chatSnapshotList', chatSnapshotList)
  //app.globalData.chatSnapshotList = chatSnapshotList
}

function saveChatSnapshotWrap(myId, friendId, chatType, msg, msgTime, isRead) {
  let friendNickName = ''
  let friendAvatar = ''
  var friendInfo = getFriendsInfo(friendId)
  if (friendInfo != null && friendInfo != undefined) {
    friendNickName = friendInfo.nickName
    friendAvatar = friendInfo.avatar
  } else {
    userModel.getUserInfo(friendId).then((res) => {
      friendNickName = res.data.nickName
      friendAvatar = res.data.avatar

      var friendUserInfo = new FriendUserInfo(friendId, friendNickName, friendAvatar)
      addFriendsInfo(friendUserInfo)
      saveUserChatSnapshot(myId,
          friendId,friendNickName,friendAvatar,chatType,
          msg, msgTime, isRead);
    })

  }
  if(friendNickName != '' && friendAvatar != ''){
    saveUserChatSnapshot(myId,friendId,friendNickName,friendAvatar,chatType,
        msg,msgTime,isRead);
  }
}

function updateUserChatSnapshotCount(friendId) {
  var chatSnapshotList = wx.getStorageSync('chatSnapshotList')
  if (chatSnapshotList != null && chatSnapshotList != undefined && chatSnapshotList != '') {
    // 循环快照list，并且判断每个元素是否包含（匹配）friendId，如果匹配，则删除
    for (var i = 0; i < chatSnapshotList.length; i++) {
      if (chatSnapshotList[i].friendId == friendId) {
        chatSnapshotList[i].count = 0
        break;
      }
    }

    wx.setStorageSync('chatSnapshotList', chatSnapshotList)
  }
}


module.exports = {
  packageEnum,
  getFriendsInfo,
  addFriendsInfo,
  FriendUserInfo,
  ChatMsg,
  DataContent,
  ChatHistory,
  saveUserChatHistory,
  saveUserChatSnapshot,
  saveChatSnapshotWrap,
  updateUserChatSnapshotCount
}