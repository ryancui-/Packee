<template>
  <div class="home">
    <auth v-if="!isLogin" @authSucceed="onAuthSuccess" />
  </div>
</template>

<script>
import Auth from '../components/Auth'

export default {
  name: 'Home',
  components: {
    Auth
  },
  data() {
    return {
      isLogin: true,
      userInfo: {}
    }
  },
  async created() {
    // 检查是否已经登录
    const { errno, data } = await this.$http({
      url: '/api/checkLogin'
    })
    if (errno === 0) {
      this.userInfo = data
    } else {
      this.isLogin = false
    }
  },
  methods: {
    onAuthSuccess(userInfo) {
      this.isLogin = true
      this.userInfo = userInfo
    }
  }
}
</script>

<style lang="less" scoped>

</style>
