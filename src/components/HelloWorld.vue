<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <input class="search-input width100p">

    <button @click="testAxios" class="button" type="button">测试</button>
    <button @click="getAllNotice" class="button" type="button">获取预告</button>

    <el-table
        :data="stockTable"
        style="width: 100%">
      <el-table-column
          v-for="(headItem,position) in stockTableHead"
          :key="position"
          :label="headItem"
      >
        <!--   scope.row代表stockTable数组中的元素     -->
        <template slot-scope="scope">
          <span>{{ scope.row[position] }}</span>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script>
export default {
  name: 'HelloWorld',

  //子组件中的data数据，不是通过父组件传递的是子组件私有的，是可读可写的。
  //子组件中的所有 props中的数据，都是通过父组件传递给子组件的，是只读的。
  props: {
    msg: String
  },

  data: function () {
    return {
      stockTableHead: ['序号', '股票代码', '股票简称', '业绩预告类型', '业绩预告摘要', '净利润变动幅度(%)', '上年同期净利润(元)', '公告日期'],
      stockTable: [],
      // stockItem: {
      //   type: Object,
      //   default: () => {
      //   }
      // }
    };
  },

  computed: {},

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
          // console.log(response.data)
          const cheerio = require('cheerio');
          const $ = cheerio.load(response.data);
          let tbody = $('table > tbody > tr');
          tbody.each((index, item) => {
            let stockItem = []
            //循环必须带下标
            $('td', item).each((index2, tdItem) => {
              stockItem.push($(tdItem).text().trim())
            })
            console.log(stockItem)
            this.stockTable.push(stockItem)
          })
          // console.log(this.stockTable)
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
