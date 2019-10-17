<template>
  <div class="auth-container">
    <div class="input-group input-group-lg">
      <input
        v-model="token"
        ref="input"
        type="text"
        class="form-control"
        aria-label="Sizing example input"
        aria-describedby="inputGroup-sizing-lg"
        :placeholder="placeholder"
        @keypress.enter="auth"
      >
      <div class="input-group-append">
        <button class="btn btn-primary" type="button" @click="auth">乖啦</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Auth',
  data() {
    return {
      token: '',
      placeholders: [
        '谁是小可爱？',
        '错了，再想想谁是小可爱〜？',
        '还是不对，这次要想清楚了',
        '怎么可能！你是不是傻！'
      ],
      placeholderIndex: 0
    }
  },
  computed: {
    placeholder() {
      return this.placeholderIndex >= this.placeholders.length
        ? this.placeholders[this.placeholders.length - 1]
        : this.placeholders[this.placeholderIndex]
    }
  },
  mounted() {
    this.$refs.input.focus()
  },
  methods: {
    async auth() {
      if (!this.token) {
        return
      }

      const { errno, data } = await this.$http({
        url: '/api/login',
        method: 'post',
        data: {
          token: this.token
        }
      })
      if (errno === 0) {
        this.$store.commit('setLogin', data)
        this.$emit('auth')
      } else {
        this.token = ''
        this.placeholderIndex++
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
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100000;
  & > div {
    width: 60%;
  }
}
</style>