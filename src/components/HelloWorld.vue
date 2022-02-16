<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <input class="search-input width100p" @input="onSearch($event)">

    <button @click="testAxios" class="button" type="button" v-if="false">测试</button>
    <button @click="getAllNotice" class="button" type="button">获取预告</button>

    <el-table
        class="width100p"
        :data="stockTableShowList"
        :row-style="{height:'55px'}"
        :cell-style="stockCellStyle"
    >
      <el-table-column
          v-for="(headItem,position) in stockTableHead"
          :key="position"
          :label="headItem"
      >
        <!--   scope.row代表stockTable数组中的元素     -->
        <template slot-scope="scope">
          <span v-if="position!==5&&position!==6">{{ scope.row[position] }}</span>
          <span v-else-if="position===5&&scope.row[position].indexOf('-')!==-1"
                class="green-color">{{ scope.row[position] }}</span>
          <span v-else-if="position===5"
                class="red-color">{{ scope.row[position] }}</span>
          <span v-else-if="position===6&&scope.row[position].indexOf('-')!==-1"
                class="green-color">{{ scope.row[position] }}</span>
          <span v-else-if="position===6"
                class="red-color">{{ scope.row[position] }}</span>
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
      stockTableShowList: [],
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
      this.$axios.get('/thsData/financial/yjyg/').then(response => {
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
          this.stockTableShowList = this.stockTable
          // console.log(this.stockTable)
        }
      }).catch(error => {
        console.log(error)
      })
    },

    //单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。
    //Function({row, column, rowIndex, columnIndex})/Object
    //示例如下：
    //column: {…}
    //columnIndex: 1
    //row: (8) ['50', '603157', '*ST拉夏', '预计减亏', '净利润-90000万元至-60000万元', '67.38', '-18.41亿', '2022-01-26', __ob__: Observer]
    //rowIndex: 49

    stockCellStyle(cellInfo) {
      // console.log(cellInfo)
      //斑马纹风格
      let styleBackground
      if (cellInfo.rowIndex % 2 === 0) {
        styleBackground = 'background: floralwhite;'
      } else {
        styleBackground = 'background: oldlace;'
      }

      if (cellInfo.columnIndex === 4) {
        return `${styleBackground} text-align: left`
      } else {
        return `${styleBackground} text-align: center`
      }
    },

    onSearch(inputEvent) {
      let inputContent = inputEvent.target.value.trim();
      if (inputContent === "" || inputContent === null) {
        this.stockTableShowList = this.stockTable
        console.log("输入内容为空")
        return
      }

      let tempStock = []
      console.log(this.stockTable)
      this.stockTable.forEach((stockItem) => {
        //['19', '000069', '华侨城A', '业绩大幅下降', '净利润318848.72万元至413227.94万元,下降幅度为74.86%至67.42%', '-74.86', '126.85亿', '2022-01-29', __ob__: Observer]
        //比对序号
        if (stockItem[0].search(inputContent) !== -1) {
          tempStock.push(stockItem)
          return
        }
        //比对股票代码
        if (stockItem[1].search(inputContent) !== -1) {
          tempStock.push(stockItem)
          return
        }
        //比对股票名称
        if (stockItem[2].search(inputContent) !== -1) {
          tempStock.push(stockItem)
        }

      })
      this.stockTableShowList = tempStock
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.width100p {
  width: 100%;
}

.red-color {
  color: red;
  border: 1px solid red;
  padding-left: 5px;
  padding-right: 5px;
}

.green-color {
  color: green;
  border: 1px solid green;
  padding-left: 5px;
  padding-right: 5px;
}

.search-input {
  height: 35px;
}

.button {
  height: 35px;
  margin: 10px;
}

</style>
