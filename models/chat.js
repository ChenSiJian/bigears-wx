import {request, requestFileUpload} from '../utils/http.js'
import {apiUrl} from '../config/api.js'
import {FriendUserInfo} from "./socketApp";

var userModel = require('./user.js');
var socketApp = require('./socketApp.js')
const emotion = require('../utils/emotion.js')


function getUnReadMsg() {
  return new Promise(function (resolve, reject) {
    request({
      url: apiUrl.UnReadMsg
    }).then(res => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}
function signMsg(unSignedMsgIds) {
  return new Promise(function (resolve, reject) {
    request({
      url: apiUrl.SignMsg,
      method: 'POST',
      data: {
        msgIds: unSignedMsgIds
      }
    }).then(res => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

function fileUpload(filePath, name,data = {}) {
  return new Promise(function (resolve, reject) {
    requestFileUpload({
      url: apiUrl.ChatFileUpload,
      filePath: filePath,
      name: name,
      data: data
    }).then(res => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

function  fetchUnReadMsg() {
  if(!wx.getStorageSync('chatSnapshotList')){
    let userInfo = wx.getStorageSync('userInfo')
    socketApp.saveChatSnapshotWrap(userInfo.userId,'9527',socketApp.packageEnum.TEXT,
        '', '', true)
  }
  getUnReadMsg().then((res)=>{
    var unReadMsgList = res.data;
    var msgIds = ''
    // 1. 保存聊天记录到本地
    // 2. 保存聊天快照到本地
    // 3. 对这些未签收的消息，批量签收
    for (var i = 0 ; i < unReadMsgList.length ; i ++) {
      var msgObj = unReadMsgList[i];
      // 逐条存入聊天记录

      var msgTmp = '' + emotion.default.emotionParser(msgObj.msg)
      socketApp.saveUserChatHistory(msgObj.acceptUserId,
          msgObj.sendUserId,msgObj.chatType,
          msgTmp,msgObj.createTime, false);
      // 存入聊天快照
      socketApp.saveChatSnapshotWrap(msgObj.acceptUserId,msgObj.sendUserId,msgObj.chatType,
          msgObj.msg, msgObj.createTime, false) //true表示已读
      /*let friendNickName = ''
      let friendAvatar = ''
      var friendInfo = socketApp.getFriendsInfo(msgObj.sendUserId)
      if (friendInfo != null && friendInfo != undefined) {
        friendNickName = friendInfo.nickName
        friendAvatar = friendInfo.avatar
      } else {
        userModel.getUserInfo(msgObj.sendUserId).then((res) => {
          friendNickName = res.data.nickName
          friendAvatar = res.data.avatar

          var friendUserInfo = new FriendUserInfo(msgObj.sendUserId, friendNickName, friendAvatar)
          socketApp.addFriendsInfo(friendUserInfo)
          socketApp.saveUserChatSnapshot(msgObj.acceptUserId,
              msgObj.sendUserId,friendNickName,friendAvatar,msgObj.chatType,
              msgObj.msg, msgObj.createTime, false);
        })

      }
      if(friendNickName != '' && friendAvatar != ''){
        socketApp.saveUserChatSnapshot(msgObj.acceptUserId,
            msgObj.sendUserId,friendNickName,friendAvatar,msgObj.chatType,
            msgObj.msg, msgObj.createTime, false);
      }*/

      // 拼接批量接受的消息id字符串，逗号间隔
      msgIds += msgObj.id;
      msgIds += ",";
    }

    // 调用批量签收的方法
    if(msgIds != ''){
      signMsg(msgIds)
    }
  })
}


export {
  getUnReadMsg,
  fileUpload,
  signMsg,
  fetchUnReadMsg
}