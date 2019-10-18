import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import AtComponents from 'at-ui'
import 'at-ui-style'
import zhLocale from 'at-ui/dist/locale/zh-CN'
import store from './store'
import http from './http'

Vue.config.productionTip = false

Vue.use(VueI18n)
Vue.use(AtComponents)

Vue.prototype.$http = http

const i18n = new VueI18n({
  locale: 'zh',
  fallbackLocale: 'zh',
  messages: {
    'zh': { ...zhLocale }
  }
})

AtComponents.i18n((key, value) => i18n.t(key, value))

new Vue({
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
