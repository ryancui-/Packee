import Vue from 'vue'
import Vuex from 'vuex'
import http from './http'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isLogin: true,
    isEditingProject: false,
    currentProject: null,
    userInfo: {},
    projects: []
  },
  mutations: {
    setLogin(state, userInfo) {
      state.isLogin = true
      state.userInfo = userInfo
    },
    setNotLogin(state) {
      state.isLogin = false
      state.userInfo = {}
    },
    setProjects(state, payload) {
      state.projects = payload
    },
    setEditingProject(state, project) {
      state.isEditingProject = true
      state.currentProject = project
    },
    setNotEditingProject(state) {
      state.isEditingProject = false
      state.currentProject = null
    }
  },
  actions: {
    async checkLogin({ commit }) {
      const { errno, data } = await http({
        url: '/api/checkLogin'
      })
      errno === 0 ? commit('setLogin', data) : commit('setNotLogin')
    },
    async fetchProjects({ commit }) {
      const { data } = await http({
        url: '/api/listProject'
      })
      commit('setProjects', data)
    }
  }
})

export default store
