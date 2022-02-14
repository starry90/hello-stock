module.exports = {
    devServer: {
        proxy: {
            //跨域问题
            //Access to XMLHttpRequest at 'https://www.baidu.com/' from origin 'http://localhost:8080' has been
            // blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
            '/api': {
                // 此处的写法，目的是为了 将 /api 替换成 https://www.baidu.com/
                target: 'https://www.baidu.com/',
                // 允许跨域
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/thsData':{
                target: 'http://data.10jqka.com.cn/',
                // 允许跨域
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/thsData': ''
                }
            }
        }
    }
}
