<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <input class="search-input width100p">

    <button @click="testAxios" class="button" type="button">测试</button>
    <button @click="getAllNotice" class="button" type="button">获取预告</button>

  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },

  methods: {
    testAxios() {
      // 由于 main.js 里全局定义的 axios,此处直接使用 $axios 即可。
      // 经过 vue.config.js 配置文件的代理设置，会自动转为 https://www.baidu.com/，从而解决跨域问题
      this.$axios.get('/api').then(response => {
        if (response.data) {
          console.log(response.data)
        }
      }).catch(error => {
        console.log(error)
      })
    },

    getAllNotice() {
      console.log("获取预告")
      this.$axios.get('/yjyg').then(response => {
        if (response.data) {
          console.log(response.data)
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.width100p {
  width: 100%;
}

.search-input {
  height: 35px;
}

.button {
  height: 35px;
  margin: 10px;
}

</style>
