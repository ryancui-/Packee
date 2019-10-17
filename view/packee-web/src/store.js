import Vue from 'vue'
import Vuex from 'vuex'
import http from './http'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isLogin: true,
    isEditingProject: false,
    currentProjectId: null,
    userInfo: {},
    projects: [],
    runningTasks: [],
    historyTasks: [],
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
    setCurrentProject(state, projectId) {
      state.isEditingProject = false
      state.runningMsg = ''
      state.currentProjectId = projectId
    },
    // 运行一个 task
    runTask(state, task) {
      state.runningMsg = ''
      state.runningTasks.push(task)
    },
    // 停止当前项目下的 task
    stopTask(state) {
      const currentrunningTaskIndex = state.runningTasks.findIndex(_ => _.projectId === state.currentProjectId)
      if (currentrunningTaskIndex !== -1) {
        state.runningTasks.splice(currentrunningTaskIndex, 1)
      }
    },
    appendRunningMessage(state, newMessage) {
      state.runningMsg += newMessage
    },
    setHistoryTasks(state, payload) {
      state.historyTasks = payload
    }
  },
  getters: {
    // 当前项目是否运行中
    currentProjectRunning(state) {
      return state.currentProjectId && state.runningTasks.find(_ => _.projectId === state.currentProjectId)
    },
    currentProject(state) {
      return state.projects.find(_ => _.id === state.currentProjectId)
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
    },
    async fetchHistoryTasks({ commit, state }) {
      const { errno, data } = await http({
        url: '/api/historyTasks',
        data: {
          projectId: state.currentProjectId
        }
      })
      errno === 0 ? commit('setHistoryTasks', data) : ''
    }
  }
})

export default store
