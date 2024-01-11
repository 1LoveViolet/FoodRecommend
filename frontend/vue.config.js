const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
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
      },
    },
  },
  // 关闭语法检查
  lintOnSave: false,
});
