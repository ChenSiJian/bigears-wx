// components/preview/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    classic: {
      type: Object,
      observer: function(newVal) {
        if (newVal) {
          var typeText = {
            100: "音乐",
            200: "电影",
            300: "文章",
            400: "小视频"
          }[newVal.type]
        }
        this.setData({
          typeText
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    typeText:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap:function(event){
      this.triggerEvent('tapping',{
        cid:this.properties.classic.id,
        type:this.properties.classic.type,
        index:this.properties.classic.index
      },{})
    }
  }
})