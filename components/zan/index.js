// components/zan/index.js
var commentModel = require('../../models/comment.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentId:{
      type:Number
    },
    count:{
      type:Number
    },
    readOnly:{
      type:Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    yesSrc: 'images/zan.png',
    noSrc: 'images/zan@dis.png',
    zan: false
  },
  attached: function () {
    this._getZanStatus(this.properties.commentId)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onZan: function (event) {
      // 自定义事件
      if(this.properties.readOnly){
        return
      }
      let zan = this.data.zan
      let count = this.properties.count

      count = zan?count-1:count+1
      this.setData({
        count:count,
        zan:!zan
      })
      // 激活
      let behavior = this.properties.zan?'zan':'cancel'
      this.triggerEvent('zan',{
        behavior:behavior,
        commentId:this.properties.commentId
      },{})
    },
    _getZanStatus: function(commentId){
      commentModel.getZanStatus(commentId).then((res)=>{
        this.setData({
          zan: res.data.zanStatus
        })
      })
    }
  }
})
