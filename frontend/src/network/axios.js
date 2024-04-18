import originAxios from "axios";
import qs from "qs";
import store from "../store/index";
export default function axios(option) {
  originAxios.defaults.withCredentials = true;
  return new Promise((resolve, reject) => {
    // 1.创建axios的实例
    const instance = originAxios.create({
      baseURL: "http://localhost:3000", //我电脑问题，你们使用改成http://127.0.0.1
      timeout: 5000,
      withCredentials: true,
    });

    // 配置请求和响应拦截
    instance.interceptors.request.use(
      (config) => {
        // console.log('来到了request拦截success中');
        // 1.当发送网络请求时, 在页面中添加一个loading组件, 作为动画

        // 2.某些请求要求用户必须登录, 判断用户是否有token, 如果没有token跳转到login页面

        // 3.对请求的参数进行序列化(看服务器是否需要序列化)
        // config.data = qs.stringify(config.data)
        // console.log(config);
        // config.withCredentials = true;
        config.headers = {
          ...config.headers,
          Authorization: store.state.token,
        };

        // 4.等等
        return config;
      },
      (err) => {
        // console.log('来到了request拦截failure中');
        return err;
      }
    );

    instance.interceptors.response.use(
      (response) => {
        // console.log('来到了response拦截success中');
        return response.data;
      },
      (err) => {
        console.log("来到了response拦截failure中");
        console.log(err);
        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              err.message = "请求错误";
              break;
            case 401:
              err.message = "未授权的访问";
              break;
          }
        }
        return err;
      }
    );

    // 2.传入对象进行网络请求
    instance(option)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// import axios from "axios";
// //后面的请求用request发
// let request = axios.create({
//   //基础设置
//   baseURL: "http://127.0.0.1",
//   timeout: 5000,
//   responseType: "json",
// });
// //请求拦截器
// request.interceptors.request.use((config) => {
//   return config;
//   //token 密钥设置
// });
// //响应拦截器
// request.interceptors.response.use(
//   (res) => {
//     //响应统一处理
//     return res.data;
//   },
//   (error) => {
//     //响应失败
//   }
// );
