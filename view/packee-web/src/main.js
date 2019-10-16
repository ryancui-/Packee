import Vue from 'vue'
import App from './App.vue'
import { Notification } from 'at-ui'
import 'at-ui-style'
import store from './store'
import http from './http'

Vue.config.productionTip = false

Vue.prototype.$Notify = Notification
Vue.prototype.$http = http

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
