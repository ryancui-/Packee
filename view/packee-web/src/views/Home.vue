<template>
  <div class="home">
    <auth v-if="!isLogin" />
    <div class="home__user">
      <span>你好呀，{{ userInfo.name }}！</span>
    </div>
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
        </div>
        <div class="home__task-running-msg">
          <textarea :value="runningMsg" readonly />
        </div>
      </div>
      <div class="home__task-history">
        TODO: Task history
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Auth from '../components/Auth'
import ProjectDetail from '../components/ProjectDetail'

export default {
  name: 'Home',
  components: {
    Auth,
    ProjectDetail
  },
  computed: {
    ...mapState([
      'isLogin',
      'userInfo',
      'isEditingProject',
      'currentProject',
      'projects',
      'runningMsg'
    ]),
    ...mapGetters(['currentProjectRunning'])
  },
  async created() {
    await this.$store.dispatch('checkLogin')
    if (this.isLogin) {
      await this.$store.dispatch('fetchProjects')
      this.connectSocket()
    }
  },
  methods: {
    onSelectProject(project) {
      this.$store.commit('setCurrentProject', project)
    },
    connectSocket() {
      this.socket = io('/')
      this.socket.on('task:done', () => {
        console.log('Done!')
        this.$store.commit('stopTask')
        // TODO: 历史 task 中需要 append 一个新的，暂时可以直接全量拉一遍 history tasks
      })
      this.socket.on('task:msg', ({ projectId, msg }) => {
        if (this.currentProject && projectId === this.currentProject.id) {
          this.$store.commit('appendRunningMessage', msg)
        }
      })
    },
    async run() {
      const { errno, data } = await this.$http({
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
      }
    },
    stop() {
      // TODO: 停下来
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
  }

  &__task-running-msg {
    margin-top: 10px;
    textarea {
      width: 100%;
      height: 500px;
      outline: 0;
      resize: none;
      box-sizing: border-box;
      border: 1px solid #e2e2e2;
      border-radius: 4px;
      padding: 10px;
      font-family: Menlo, Monaco, Consolas, Courier, monospace;
      font-size: 13px;
      background-color: #f9f9f9;
      color: #000;
      line-height: 1.8;
    }
  }
}
</style>
