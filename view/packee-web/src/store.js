import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isLogin: true,
    userInfo: {}
  },
  mutations: {
    setLogin(state, userInfo) {
      state.isLogin = true
      state.userInfo = userInfo
    },
    setNotLogin(state) {
      state.isLogin = false
      state.userInfo = {}
    }
  },
  actions: {

  }
})

export default store
