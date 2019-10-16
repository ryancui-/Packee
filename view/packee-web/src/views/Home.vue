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
    </div>
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
  computed: {
    ...mapState(['isLogin', 'userInfo', 'isEditingProject', 'currentProject', 'projects']),
  },
  async created() {
    await this.$store.dispatch('checkLogin')
    if (this.isLogin) {
      await this.$store.dispatch('fetchProjects')
    }
  },
  methods: {
    onSelectProject(project) {
      this.$store.commit('setCurrentProject', project)
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
