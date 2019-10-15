<template>
  <div class="home">
    <auth v-if="!isLogin" @authSucceed="onAuthSuccess" />
    <div class="home__user">
      <span>你好呀，{{ userInfo.name }}！</span>
    </div>
    <div class="home__operation">
      <div class="btn-group" role="group">
        <button
          v-for="project in projectList"
          :key="project.id"
          type="button"
          class="btn btn-primary">
          {{ project.name }}
        </button>
      </div>
      <button type="button" class="btn btn-primary" @click="onCreateProject">New Project</button>
    </div>
    <project-detail
      v-if="editProject"
      :project="currentProject"
      @finish="onProjectFinish"
    />
  </div>
</template>

<script>
import Auth from '../components/Auth'
import ProjectDetail from '../components/ProjectDetail'

export default {
  name: 'Home',
  components: {
    Auth,
    ProjectDetail
  },
  data() {
    return {
      isLogin: true,
      userInfo: {},
      editProject: false,
      currentProject: null,
      projectList: []
    }
  },
  async created() {
    await this.checkLogin()
    if (this.isLogin) {
      await this.listProject()
    }
  },
  methods: {
    async checkLogin() {
      const { errno, data } = await this.$http({
        url: '/api/checkLogin'
      })
      if (errno === 0) {
        this.userInfo = data
        return true
      } else {
        this.isLogin = false
        return false
      }
    },
    async listProject() {
      const { errno, data } = await this.$http({
        url: '/api/listProject'
      })
      if (errno === 0) {
        this.projectList = data
      }
    },
    onAuthSuccess(userInfo) {
      this.isLogin = true
      this.userInfo = userInfo
    },
    onCreateProject() {
      this.editProject = true
      this.currentProject = null
    },
    onProjectFinish() {
      this.editProject = false
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
}
</style>
