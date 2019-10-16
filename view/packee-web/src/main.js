import Vue from 'vue'
import App from './App.vue'
import { Notification } from 'at-ui'
import 'at-ui-style'
import store from './store'

Vue.config.productionTip = false

Vue.prototype.$Notify = Notification
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
        if (data.errno === 1001) {
          store.commit('setNotLogin')
        }
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
  store,
  render: h => h(App)
}).$mount('#app')
