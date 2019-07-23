import {apiUrl} from '../config/api.js'
var socketApp = require('./socketApp.js')
import { ChatMsg, DataContent, FriendUserInfo } from './socketApp.js'
var userModel = require('./user.js')
var chatModel = require('./chat.js')
const emotion = require('../utils/emotion')
const app = getApp()
//let hasLogin = app.globalData.hasLogin
//let userId = ''

class Socket {

  constructor(host) {
    this.host = host
    //console.info('this.host:'+this.host)
    this.intervalTime = 5000
    this.connected = false
    this.userId = ''
    this.intervalNum = 0

    wx.connectSocket({
      url: host
    })

    // 监听连接成功
    wx.onSocketOpen((res) => {
      console.log('WebSocket连接已打开！')
      this.connected = true
      var userInfo = wx.getStorageSync('userInfo')
      this.userId = userInfo.userId
      if(this.userId != undefined && this.userId != ''){
        // 构建ChatMsg
        var chatMsg = new ChatMsg(this.userId, null, null, null, null, null);
        // 构建DataContent
        var dataContent = new DataContent(socketApp.packageEnum.CONNECT, chatMsg, null);
        // 发送websocket
        wx.sendSocketMessage({
          data: JSON.stringify(dataContent)
        })
        //获取未读信息
        //this.fetchUnReadMsg()
      }

      //心跳时间为40秒
      this.intervalNum = setInterval(this.keepalive, 40000,this)
    })

    // 监听连接断开
    wx.onSocketError((res) => {
      console.log('WebSocket连接打开失败，请检查！')
      this.connected = false

    })

    // 监听连接关闭
    wx.onSocketClose((res) => {
      console.log('WebSocket 已关闭！')
      this.connected = false
      clearInterval(this.intervalNum)
      setTimeout(this.socketConnect,this.intervalTime,this.host)
      //每次重新连接间隔时间增加5秒
      this.increaseTime(5000)
    })
  }


  socketConnect(host){
    wx.connectSocket({
      url: host
    })
  }

  keepalive(e) {
    // 构建对象
    var dataContent = new DataContent(socketApp.packageEnum.KEEPALIVE, null, null);
    // 发送心跳
    e.sendMessage(dataContent)
    // 定时执行函数
    //fetchUnReadMsg()
    //fetchContactList()
  }
  increaseTime(time){
    if(this.intervalTime > 600*1000)
      return
    this.intervalTime = this.intervalTime + time
  }

  sendMessage(data) {
    if(!this.connected){
      console.log('not connected')
      return
    }
    //console.info('JSON.stringify(data):'+JSON.stringify(data))
    wx.sendSocketMessage({
      data: JSON.stringify(data)
    })
  }



  onMessage(callback) {
    if(typeof(callback) != 'function')
      return
    // 监听服务器消息
    wx.onSocketMessage((res) => {
      //console.info('来自服务端的信息：'+res.data)
      const dataContent = JSON.parse(res.data)
      var action = dataContent.action;
      var chatMsg = dataContent.chatMsg
      if (action === socketApp.packageEnum.CHAT) {
        let msgTmp = '' + emotion.default.emotionParser(chatMsg.msg)
        socketApp.saveUserChatHistory(chatMsg.receiverId,
            chatMsg.senderId, chatMsg.chatType,
            msgTmp, chatMsg.msgTime, false);
        socketApp.saveChatSnapshotWrap(chatMsg.receiverId,chatMsg.senderId,
            chatMsg.chatType,chatMsg.msg, chatMsg.msgTime,false) //true表示已读
        /*socketApp.saveUserChatSnapshot(chatMsg.receiverId,chatMsg.senderId,friendNickName,friendAvatar,chatMsg.chatType,
            chatMsg.msg, chatMsg.msgTime,false) //true表示已读*/
        //发送签收
        socket.signMsgList(chatMsg.msgId)
      }

      callback(dataContent)
    })
  }

  signMsgList(unSignedMsgIds) {
    // 构建批量签收对象的模型
    var dataContentSign = new DataContent(socketApp.packageEnum.SIGNED,
        null,
        unSignedMsgIds);
    // 发送批量签收的请求
    this.sendMessage(dataContentSign);
  }

  /*fetchUnReadMsg() {
    chatModel.getUnReadMsg().then((res)=>{
      var unReadMsgList = res.data;
      var msgIds = ''
      // 1. 保存聊天记录到本地
      // 2. 保存聊天快照到本地
      // 3. 对这些未签收的消息，批量签收
      for (var i = 0 ; i < unReadMsgList.length ; i ++) {
        var msgObj = unReadMsgList[i];
        // 逐条存入聊天记录
        //console.info('msgObj.msg:'+msgObj.msg)

        var msgTmp = '' + emotion.default.emotionParser(msgObj.msg)
        socketApp.saveUserChatHistory(msgObj.acceptUserId,
            msgObj.sendUserId,msgObj.chatType,
            msgTmp,msgObj.createTime, false);
        // 存入聊天快照

        let friendNickName = ''
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
        }

        // 拼接批量接受的消息id字符串，逗号间隔
        msgIds += msgObj.id;
        msgIds += ",";
      }

      // 调用批量签收的方法
      this.signMsgList(msgIds);
    })
  }*/
}


let socket = null

export function newSocket() {
  //console.info('new newSocket request....')
  //&& app.globalData && app.globalData.hasLogin

  if(socket == null && app.globalData.hasLogin){
    socket = new Socket(apiUrl.WebsocketUrl)
  }
  return socket
}

module.exports = {
  newSocket: newSocket
}