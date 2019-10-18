<template>
  <div class="home">
    <auth v-if="!isLogin" @auth="init" />

    <div class="home__operation">
      <div class="btn-group" role="group">
        <button
          v-for="project in projects"
          :key="project.id"
          type="button"
          :class="{
            'btn': true,
            'btn-primary': currentProject && project.id === currentProject.id,
            'btn-outline-primary': !currentProject || project.id !== currentProject.id
          }"
          @click="onSelectProject(project)"
        >
          {{ project.name }}
        </button>
      </div>
    </div>

    <div v-if="currentProject" class="home__project-container">
      <button
        v-if="!isEditingProject"
        type="button"
        class="btn btn-primary"
        @click="$store.commit('setEditingProject')"
      >
        编辑
      </button>
      <button
        v-if="isEditingProject"
        type="button"
        class="btn btn-primary"
        @click="$store.commit('setNotEditingProject')"
      >
        返回
      </button>
      <project-detail v-if="isEditingProject" />
      <div class="home__task-running">
        <div class="home__task-running-btns">
          <button
            v-if="!currentProjectRunning"
            type="button"
            class="btn btn-success"
            @click="run"
          >
            运行
          </button>
          <button
            v-if="currentProjectRunning"
            type="button"
            class="btn btn-danger"
            @click="stop"
          >
            停止
          </button>
          <div v-if="false" class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                 style="width: 100%;"></div>
          </div>
        </div>
        <div class="home__task-running-msg">
          <pre v-html="messageHTML" />
        </div>
      </div>
      <div class="home__task-history">
        <div class="home__task-history-item home__task-history-header">
          <span>序号</span>
          <span>创建时间</span>
          <span>耗时</span>
        </div>
        <div
          v-for="(task, index) in historyTasks"
          :key="task.taskId"
          class="home__task-history-item"
          @click="loadHistoryMessage(task)"
        >
          <span>#{{ index + 1 }}</span>
          <span>{{ task.createTime }}</span>
          <span>{{ task.duration }} ms</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Auth from '../components/Auth'
import ProjectDetail from '../components/ProjectDetail'
import ansiToHTML from '../util/ansi'

export default {
  name: 'Home',
  components: {
    Auth,
    ProjectDetail
  },
  data() {
    return {
      messageHTML: ''
    }
  },
  computed: {
    ...mapState([
      'isLogin',
      'userInfo',
      'isEditingProject',
      'projects',
      'runningMsg',
      'historyTasks'
    ]),
    ...mapGetters([
      'currentProject',
      'currentProjectRunning',
      'currentTask'
    ])
  },
  async created() {
    await this.$store.dispatch('checkLogin')
    if (this.isLogin) {
      await this.init()
    }
  },
  methods: {
    // 初始化系统
    async init() {
      await this.$store.dispatch('fetchProjects')
      this.connectSocket()
    },
    onSelectProject(project) {
      this.$store.commit('setCurrentProject', project.id)
      this.$store.dispatch('fetchProjectRunningTask')
      this.$store.dispatch('fetchProjectHistoryTasks')
      this.messageHTML = ''
    },
    connectSocket() {
      this.socket = io('/')
      this.socket.on('task:done', () => {
        this.$store.commit('stopTask')
        this.$store.dispatch('fetchProjectHistoryTasks')
      })
      this.socket.on('task:msg', ({ projectId, msg }) => {
        if (this.currentProject && projectId === this.currentProject.id) {
          this.$store.commit('appendRunningMessage', msg)
          this.renderMessage(msg)
        }
      })
    },
    async run() {
      const { errno, data, msg } = await this.$http({
        url: '/api/runTask',
        method: 'post',
        data: {
          projectId: this.currentProject.id
        }
      })
      if (errno === 0) {
        this.$store.commit('runTask', {
          projectId: this.currentProject.id,
          taskId: data,
          msg: ''
        })
        this.messageHTML = ''
      } else {
        this.$Notify.error({ title: '出错了', message: msg })
      }
    },
    stop() {
      // TODO: 停下来
    },
    loadHistoryMessage(task) {
      this.$store.commit('reviewHistoryTask', task)
      this.renderMessage(task.msg, true)
    },
    renderMessage(messageSource, replace = false) {
      if (replace) {
        this.messageHTML = ''
      }
      this.messageHTML += ansiToHTML(messageSource)
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 50px;

  &__user {
    font-size: 15px;
  }

  &__task-running {
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid #e2e2e2;
    border-radius: 4px;
  }

  &__task-running-msg {
    margin-top: 10px;
    & > pre {
      width: 100%;
      height: 500px;
      box-sizing: border-box;
      border: 1px solid #e2e2e2;
      border-radius: 4px;
      padding: 10px;
      font-family: Menlo, Monaco, Consolas, Courier, monospace;
      font-size: 13px;
      background-color: #f9f9f9;
      color: #000;
      line-height: 1.8;
      overflow: auto;
    }
  }

  &__task-history {
    margin-top: 10px;
    box-sizing: border-box;
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    padding: 10px;
  }
  &__task-history-item {
    display: flex;
    align-items: center;
    height: 30px;
    font-size: 13px;
    border-radius: 4px;
    padding: 0 20px;
    & > span {
      flex: 1;
    }
    &:hover {
      background-color: #dff1f9;
      cursor: pointer;
    }
  }
  &__task-history-header {
    font-weight: bold;
    color: #000;
    &:hover {
      background-color: unset;
      cursor: unset;
    }
  }
}
</style>
