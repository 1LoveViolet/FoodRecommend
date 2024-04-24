const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  devServer: {
    client: {
      overlay: false,
    },
  },
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        components: "@/components",
        assets: "@/assets",
        network: "@/network",
        views: "@/views",
        pages: "@/pages",
        store: "@/store",
        router: "@/router",
        api: "@/api",
        unti: "@/unti",
      },
    },
  },
  // 关闭语法检查
  lintOnSave: false,
  devServer: {
    client: {
      overlay: false,
    },
    proxy: {
      "/geo": {
        // 请求的代称，写在Axios里的BaseUrl
        target: "https://geo.datav.aliyun.com/areas_v3/bound/", // 真实请求URl
        ws: true,
        changeOrigin: true, // 允许跨域
        pathRewrite: {
          //替换，通配/api的替换成对应字符
          //     /* 重写路径，当我们在浏览器中看到请求的地址为：http://localhost:8080/api/core/getData/userInfo 时
          //       实际上访问的地址是：http://localhost:8088/spring/core/getData/userInfo,因为重写了 /api
          //      */
          "^/geo": "", //当你的接口中没有/api字眼时，采用这种，直接替换成空即可
          //     '^/api': '/api'   //当你的接口中刚好有/api 时，采用这种方式
        },
      },
    },
    // proxy: {
    //   "/api": {
    //     // 请求的代称，写在Axios里的BaseUrl
    //     target: "http://127.0.0.1:3000", // 真实请求URl
    //     ws: true,
    //     changeOrigin: true, // 允许跨域
    //     pathRewrite: {
    //       "^/api": "", //当你的接口中没有/api字眼时，采用这种，直接替换成空即可
    //     },
    //   },
    // },
  },
});
