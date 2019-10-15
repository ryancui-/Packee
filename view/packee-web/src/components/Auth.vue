<template>
  <div class="auth-container">
    <div class="input-group input-group-lg">
      <div class="input-group-prepend">
        <span class="input-group-text">Token</span>
      </div>
      <input
        v-model="token"
        ref="input"
        type="text"
        class="form-control"
        aria-label="Sizing example input"
        aria-describedby="inputGroup-sizing-lg"
        @keypress.enter="auth"
      >
      <div class="input-group-append">
        <button class="btn btn-primary" type="button" @click="auth">Auth me</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Auth',
  data() {
    return {
      token: ''
    }
  },
  mounted() {
    this.$refs.input.focus()
  },
  methods: {
    async auth() {
      const { errno } = await this.$http({
        url: '/api/login',
        method: 'post',
        data: {
          token: this.token
        }
      })
      if (errno === 0) {
        // TODO: 记录 userInfo 并跳转到首页
      }
    }
  }
}
</script>

<style lang="less" scoped>
.auth-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  & > div {
    width: 60%;
  }
}
</style>