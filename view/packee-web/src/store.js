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
      state.currentProjectId = projectId
    },
    // 运行一个 task
    runTask(state, task) {
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
      const task = state.runningTasks.find(_ => _.projectId === state.currentProjectId)
      task.msg += newMessage
    },
    setHistoryTasks(state, payload) {
      state.historyTasks = payload
    },
    // 重温一下历史任务的数据，但是当前项目的 runningTask 依然是在接收数据的
    reviewHistoryTask() {
    },
    // 回到当前运行中的 task
    reviewRunningTask() {

    }
  },
  getters: {
    // 当前项目是否运行中
    currentProjectRunning(state) {
      return state.currentProjectId && state.runningTasks.find(_ => _.projectId === state.currentProjectId)
    },
    currentProject(state) {
      return state.projects.find(_ => _.id === state.currentProjectId)
    },
    currentTask(state) {
      return state.runningTasks.findIndex(_ => _.projectId === state.currentProjectId)
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
    // 获取当前项目是否有正在 running 的 task
    async fetchProjectRunningTask({ state }) {
      const { errno, data } = await http({
        url: '/api/runningTask',
        data: {
          projectId: state.currentProjectId
        }
      })
      if (errno === 0) {
        const runningTaskIndex = state.runningTasks.findIndex(_ => _.projectId === state.currentProjectId)
        if (data) {
          // 仍然在跑任务
          if (runningTaskIndex === -1) {
            state.runningTasks.push(data)
          } else {
            const task = state.runningTasks[runningTaskIndex]
            if (task.taskId !== data.taskId) {
              console.log('Ooz...impossible')
              return
            }
            task.msg = data.msg
          }
        } else {
          // 任务已经跑完啦
          if (runningTaskIndex !== -1) {
            state.runningTasks.splice(runningTaskIndex, 1)
          }
        }
      }
    },
    async fetchProjectHistoryTasks({ commit, state }) {
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
