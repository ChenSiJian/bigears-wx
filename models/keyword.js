let key = 'q'
let maxLength = 10
function getHistory(){
  const words = wx.getStorageSync(key)
  if(!words){
    return []
  }
  return words
}


function addToHistory(keyword){
  let words = this.getHistory()
  const has = words.includes(keyword)
  // 队列 栈
  if(!has){
    // 数组末尾 删除 ， keyword 数组第一位
    const length = words.length
    if (length >= maxLength){
      words.pop()
    }
    words.unshift(keyword)
    wx.setStorageSync(key, words)
  }
}

export {
  getHistory,
  addToHistory
}