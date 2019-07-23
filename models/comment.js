import {request} from '../utils/http'
import {apiUrl} from '../config/api'

function getCommentList(cid,page,pageSize){
  return new Promise(function (resolve, reject) {
    request({
      url: apiUrl.CommentsList,
      data:{
        cid: cid,
        page:page,
        pageSize:pageSize
      } }).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

function getZanStatus(commentId){
  return new Promise(function (resolve, reject) {
    request({
      url: apiUrl.CommentZanStatus + commentId + '/zan'
    }).then((res)=>{
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

function zanAction(behavior, commentId){
  let url = behavior == 'zan' ? apiUrl.CommentZan : apiUrl.CommentUnZan
  request({
    url: url,
    method: 'POST',
    data: {
      commentId: commentId
    }
  })
}

function addComment(cid, comment){
  return new Promise(function (resolve, reject) {
    request({
      url: apiUrl.AddComment,
      method: 'POST',
      data:{
        cid: cid,
        comment: comment
      } }).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}
function getMyCommentList(cid,page,pageSize){
  return new Promise(function (resolve, reject) {
    request({
      url: apiUrl.MyCommentsList,
      data:{
        cid: cid,
        page:page,
        pageSize:pageSize
      } }).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

function delComment(commentId){
  return new Promise(function (resolve, reject) {
    request({
      url: apiUrl.DelComment + commentId + '/del'
    }).then((res)=>{
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

export {
  getCommentList,
  getZanStatus,
  zanAction,
  addComment,
  getMyCommentList,
  delComment
}