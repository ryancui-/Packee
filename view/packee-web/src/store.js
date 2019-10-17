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
    projects: [],
    taskRunning: [],
    runningMsg: ''
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
    setEditingProject(state) {
      state.isEditingProject = true
    },
    setNotEditingProject(state) {
      state.isEditingProject = false
    },
    setCurrentProject(state, project) {
      state.isEditingProject = false
      state.runningMsg = ''
      state.currentProject = project
    },
    runTask(state, task) {
      state.runningMsg = ''
      state.taskRunning.push(task)
    },
    appendRunningMessage(state, newMessage) {
      state.runningMsg += newMessage
    }
  },
  getters: {
    // 当前项目是否运行中
    currentProjectRunning(state) {
      return state.currentProject && state.taskRunning.find(_ => _.projectId === state.currentProject.id)
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
