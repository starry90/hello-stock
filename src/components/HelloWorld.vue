<template>
  <div class="hello">

    <div class="title-search flex-row-norap">
      <h3 class="title-description ml20">{{ msg }} 业绩预告一览</h3>
      <input class="search-key ml20 mr20" @input="onSearch($event)" placeholder="输入股票/基金代码、简称或关键字">
      <button class="button ml20" @click="testAxios" type="button" v-if="false">测试</button>
      <el-button @click="getAllNotice" type="warning">获取预告</el-button>
    </div>

    <el-table
        v-if="false"
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

    <div id="main" style="width: 100%;height:100%;"></div>

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
      stockYAxisData: ['ten',
        'nine',
        'eight',
        'seven',
        'six',
        'five',
        'four',
        'three',
        'two',
        'one'],
      stockSeriesData: [
        -0.07,
        -0.09,
        -0.2,
        0.44,
        -0.23,
        0.08,
        -0.17,
        0.47,
        -0.36,
        0.18
      ]
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
          this.showBarChart()
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
    },

    showBarChart() {
      this.stockYAxisData = []
      this.stockSeriesData = []
      this.stockTableShowList.forEach((stockItem) => {
        this.stockYAxisData.push(`${stockItem[1]}  ${stockItem[2]}  ${stockItem[3]}`)
        this.stockSeriesData.push(stockItem[5])
      })
      //动态设置高度
      var chartHeight = this.stockYAxisData.length * 50 + 50

      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('main'));
      // const labelRight = {
      //   position: 'right'
      // };

      var option = {
        title: {
          text: '业绩预告柱状图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: 80,
          bottom: 30
        },
        xAxis: {
          //限制x轴最大值
          max: 100,
          //限制x轴最小值
          min: -100,
          type: 'value',
          position: 'top',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        yAxis: {
          type: 'category',
          axisLine: {show: false},
          axisLabel: {show: false},
          axisTick: {show: false},
          splitLine: {show: false},
          data: this.stockYAxisData
        },
        series: [
          {
            name: '净利润变动幅度（%）',
            type: 'bar',
            stack: 'Total',
            label: {
              show: true,
              formatter: '{b}'
            },
            data: this.stockSeriesData
          }
        ]
      };
      myChart.resize({height: chartHeight})
      myChart.setOption(option)
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.width100p {
  width: 100%;
}

.ml20 {
  margin-left: 20px;
}

.mr20 {
  margin-right: 20px;
}

.flex-row-norap {
  display: flex;
  flex-flow: row nowrap;
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

.title-search {
  align-items: center;
  height: 50px;
  width: 100%;
  background: steelblue;
}

.title-description {
  color: white;
}

.search-key {
  height: 35px;
  width: 300px;
}

.button {
  height: 35px;
}

</style>
