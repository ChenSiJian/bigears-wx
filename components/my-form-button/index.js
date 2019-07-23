// components/image-button/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true 
  },
  properties: {
    formType: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    submitInfo: function (e) {
      let formId = e.detail.formId
      this.triggerEvent('mysubmit',{
        formId:formId
      },{})
    }
  }
})
