import {request} from '../utils/http'
import {apiUrl} from '../config/api'


function getLatest(sCallback) {
    //console.info('apiUrl.ClassicGetLatest:' + apiUrl.ClassicGetLatest)
    return new Promise(function (resolve, reject) {
        request({url: apiUrl.ClassicGetLatest}).then((res)=>{
            _setLatestIndex(res.data.index)
            let key = _getKey(res.data.index)
            wx.setStorageSync(key, res.data)
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
    })

}

function getClassic(index, nextOrPrevious, sCallback)
{
    return new Promise(function (resolve, reject) {
        // 缓存中寻找 or API 写入到缓存中
        // key 确定key
        let key = nextOrPrevious == 'next' ?
            _getKey(index + 1) : _getKey(index - 1)
        let classic = wx.getStorageSync(key)
        if (!classic) {
            request({url: apiUrl.GetClassic + `${index}/${nextOrPrevious}`}).then((res)=>{
                if(res.data != null){
                  wx.setStorageSync(_getKey(res.data.index), res.data)
                  resolve(res.data)
                }else{
                  reject(false)
                }

            }).catch((err) => {
                reject(err)
            })
        } else {
            resolve(classic)
        }
    })

}

function getLyric(mid, sCallback) {
    return new Promise(function (resolve, reject) {
        request({url: apiUrl.GetLyric + `${mid}`}).then((res)=>{
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
    })

}

function getDetail(cid, sCallback) {
  return new Promise(function (resolve, reject) {
    request({url: apiUrl.GetLyric + `${cid}`}).then((res)=>{
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })

}


function isFirst(index)
{
    return index == 1 ? true : false
}

function isLatest(index)
{
    let latestIndex = _getLatestIndex()
    return latestIndex == index ? true : false
}


function getMyFavor(page,pageSize) {
    return new Promise(function (resolve, reject) {
        request({
          url: apiUrl.GetMyFavor,
          data:{
            page:page,
            pageSize:pageSize
          }}).then((res)=>{
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
    })
}

function getById(cid, type) {
    //console.info('apiUrl.GetClassicById:' + apiUrl.ClassicGetLatest)
    return new Promise(function (resolve, reject) {
        request({url: apiUrl.GetClassicById + `${type}/${cid}`}).then((res)=>{
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
    })
}

function getClassicList(type,page,pageSize){
  return new Promise(function (resolve, reject) {
    request({
      url: apiUrl.ClassicList,
      data:{
        type: type,
        page:page,
        pageSize:pageSize
      } }).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

function getCategoryList(){
  return new Promise(function (resolve, reject) {
    request({ url: apiUrl.ClassicCategory }).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

function search(keyword,page,pageSize){
  return new Promise(function (resolve, reject) {
    request({
      url: apiUrl.ClassicSearch,
      data:{
        searchWord: keyword,
        page:page,
        pageSize:pageSize
      } }).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

function updateViewCounts(cid){
  let url = apiUrl.UpdateViewCounts
  request({
    url: url,
    method: 'POST',
    data: {
      cid: cid
    }
  })
}

function _setLatestIndex(index)
{
    wx.setStorageSync('latest', index)
}

function _getLatestIndex()
{
    let index = wx.getStorageSync('latest')
    if(!index || index == ''){
      getLatest().then((res)=>{
        index = wx.getStorageSync('latest')
        return index
      })
    }else{
      return index
    }
}

function _getKey(index)
{
    const key = 'classic-' + index
    return key
}


export {
    getLatest,
    getClassic,
    getLyric,
    getDetail,
    isFirst,
    isLatest,
    getMyFavor,
    getById,
    getCategoryList,
    getClassicList,
    search,
    updateViewCounts
}