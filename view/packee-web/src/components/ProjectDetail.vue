<template>
  <div class="project-detail">
    <form>
      <div class="form-group">
        <label for="name">项目名称</label>
        <input
          v-model="projectCopied.name"
          :readonly="!!projectCopied.id"
          type="text"
          class="form-control"
          id="name"
          placeholder="Project name"
        >
        <small class="form-text text-muted">唯一的项目名称</small>
      </div>
      <div class="form-group">
        <label for="shell">Bash 脚本</label>
        <textarea
          v-model="projectCopied.shell"
          type="text"
          class="form-control shell-textarea"
          id="shell"
          placeholder="Shell"
        />
      </div>
      <div class="form-group">
        <label for="args">参数列表</label>
        <input
          v-model="projectCopied.args"
          type="text"
          class="form-control"
          id="args"
          placeholder="Shell args"
        >
      </div>
      <button type="button" class="btn btn-primary" @click="submitForm">
        {{ submitText }}
      </button>
    </form>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ProjectDetail',
  data() {
    return {
      projectCopied: {
        id: '',
        name: '',
        shell: '',
        args: ''
      }
    }
  },
  computed: {
    ...mapGetters(['currentProject']),
    submitText() {
      return this.currentProject ? '修改' : '新建'
    }
  },
  created() {
    if (this.currentProject) {
      this.projectCopied = Object.assign({}, this.currentProject)
    }
  },
  methods: {
    async submitForm() {
      if (!this.projectCopied.name || !this.projectCopied.shell) {
        this.$Notify.error({ title: '注意', message: '还有东西没填' })
        return
      }

      const url = this.projectCopied.id ? '/api/updateProject' : '/api/createProject'
      const { errno } = await this.$http({
        url,
        method: 'post',
        data: this.projectCopied
      })
      if (errno === 0) {
        this.$store.commit('setNotEditingProject')
        await this.$store.dispatch('fetchProjects')
      } else {
        this.$Notify.error({ title: '出错了', message: '项目名重复了' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.project-detail {
  .shell-textarea {
    font-family: Monaco, monospace;
    height: 200px;
  }
}
</style>