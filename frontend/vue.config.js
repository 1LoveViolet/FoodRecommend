const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        components: "@/components",
        network: "@/network",
        views: "@/views",
        pages: "@/pages",
        store: "@/store",
        router: "@/router",
      },
    },
  },
  // 关闭语法检查
  lintOnSave: false,
});
