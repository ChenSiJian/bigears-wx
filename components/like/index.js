// components/like/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    like:{
      type: Boolean,
    },
    count:{
      type:Number
    },
    readOnly:{
      type:Boolean
    },
    isVideo:{
      type:Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 数据绑定
    // 三元表达式
    //封装性 开放性
    // 封装在内部 ，开放出来的
    // 粒度
    // 非常简单的功能   非常复杂的功能
    yesSrc: 'images/like.png',
    noSrc: 'images/like@dis.png',
    imgWidth: 52,
    imgHeight: 45
  },

  attached: function () {
    //console.info('into v-like created.......')
    if(this.properties.isVideo){
      this.setData({
        yesSrc: 'images/like@video.png',
        noSrc: 'images/unlike@video.png',
        imgWidth: 70,
        imgHeight: 70
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    submitInfo: function (event) {
      const formId = event.detail.formId

      // 自定义事件
      if(this.properties.readOnly){
        return
      }
      let like = this.properties.like
      let count = this.properties.count

      count = like?count-1:count+1
      this.setData({
        count:count,
        like:!like
      })
      // 激活
      let behavior = this.properties.like?'like':'cancel'
      this.triggerEvent('like',{
        behavior:behavior,
        formId:formId
      },{})
    }
  }
})
