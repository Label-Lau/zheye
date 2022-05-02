import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// 替换 baseURL
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
// 下面的 icode 值是从慕课网获取的 token 值，可以在课程右侧的项目接口校验码找到
axios.interceptors.request.use((config) => {
  store.commit('setLoading', true)
  store.commit('setError', { status: false, message: '' })
  // get 请求，添加到 url 中
  config.params = { ...config.params, icode: '9A8DBB1B077B1239' }
  // 其他请求，添加到 body 中
  // 如果是上传文件，添加到 FormData 中
  if (config.data instanceof FormData) {
    config.data.append('icode', '9A8DBB1B077B1239')
  } else {
    // 普通的 body 对象，添加到 data 中
    config.data = { ...config.data, icode: '9A8DBB1B077B1239' }
  }
  return config
})
axios.interceptors.response.use(
  (config) => {
    setTimeout(() => {
      store.commit('setLoading', false)
    }, 1000)
    return config
  },
  (e) => {
    const { error } = e.response.data
    store.commit('setError', { status: true, message: error })
    store.commit('setLoading', false)
    return Promise.reject(e.response.data)
  }
)
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
