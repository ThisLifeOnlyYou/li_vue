// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
//登录
const LoginForm = () => import('../views/LoginForm.vue')
//首页
const indexForm = () => import('../views/indexForm.vue')
// 主页
const HomeFrom = () => import('../views/HomeFrom.vue')
//完善个人资料
const informationFrom = () => import('../views/personal/information.vue')

const routes = [
    {
        path: '/',
        name: 'LoginForm', // 通常我们会使用大写字母开头的驼峰命名法来命名路由名称
        component: LoginForm
    },
    {
        path: '/index',
        name: 'indexForm',
        redirect:'/home',
        component:indexForm,
        children:[
            {
                path: '/home',
                name: '/home',
                component:HomeFrom
            },
            {
                path: '/personal/informationFrom',
                name: '/personal/informationFrom',
                component:informationFrom
            }
        ]
    }
]
// 创建router实例，这里使用createWebHistory代替mode: 'history'
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
