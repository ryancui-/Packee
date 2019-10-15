import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

Vue.prototype.$http = function(ajaxParams) {
  return new Promise((res, req) => {
    ajaxParams = Object.assign({
      url: '',
      dataType: 'json',
      type: 'get',
      data: {},
      xhrFields: {
        withCredentials: true
      },
      success: data => {
        res(data)
      },
      error: (data) => {
        req(data)
      }
    }, ajaxParams)
    $.ajax(ajaxParams)
  })
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
