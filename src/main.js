import {createApp} from "vue";
import App from "@/App.vue";
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import 'element-plus/dist/index.css'
import '@/assets/css/globel.css'
import qs from 'qs';
import axios from 'axios'
import store from './store'

// 全局注册qs和axios
const app = createApp(App)
app.config.globalProperties.$qs = qs;
app.config.globalProperties.$axios = axios;

// 使用Element Plus
app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount('#app')





