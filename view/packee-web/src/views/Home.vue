<template>
  <div class="home">
    <auth v-if="!isLogin" />
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
import { mapState } from 'vuex'
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
      editProject: false,
      currentProject: null,
      projectList: []
    }
  },
  computed: {
    ...mapState(['isLogin', 'userInfo']),
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
        this.$store.commit('setLogin', data)
      } else {
        this.$store.commit('setNotLogin')
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
