<template>
  <div class="home">
    <div>
      <h3>第一步</h3>
      <div>
        <input v-model="repoUrl" type="text">
        <button @click="initRepo">初始化</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      repoUrl: 'https://git.datatub.com/avalon/ds-avalon-front.git'
    }
  },
  methods: {
    async initRepo() {
      const data = await this.$proxy({
        url: '/api/init',
        method: 'post',
        data: {
          repo: this.repoUrl
        }
      })
      console.log(data)
    }
  }
}
</script>
