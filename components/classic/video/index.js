var richTextParse = require('../../../utils/richTextParse/richText.js');
const emotion = require('../../../utils/emotion')
Component({
  /**
   * 组件的属性列表
   */

  properties: {
    img: String,
    content: String,
    hidden:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    contentHtml: null
  },
  pageLifetimes: {
    show: function() {
      // 页面被展示
    }
  },
  attached: function () {
    /*let contentTmp = this.properties.content
    console.info('video==========contentTmp:'+contentTmp)
    if(!contentTmp.startsWith('<p'))
      contentTmp = '<p>' + contentTmp + '</p>'
    contentTmp= emotion.default.emotionParser(contentTmp)
    contentTmp = richTextParse.go(contentTmp)
    this.setData({
      contentHtml: contentTmp
    })*/
  },
  /**
   * 组件的方法列表
   */
  methods: {
    mytouch: function () {
      this.triggerEvent('videoPlayTap',{},{})
    }
  },
  observers: {
    'content': function(content) {
      let contentTmp = content
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
