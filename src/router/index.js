// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
//登录
const LoginForm = () => import('../views/LoginForm.vue')
//首页
const indexForm = () => import('../views/indexForm.vue')
// 主页
const HomeFrom = () => import('../views/HomeFrom.vue')
//完善个人资料
const information = () => import('../views/personal/information.vue')
// 修改密码
const edit_pwd =() => import('../views/personal/Edit_pwd.vue')

const routes = [
    {
        path: '/',
        name: 'LoginForm', // 通常我们会使用大写字母开头的驼峰命名法来命名路由名称
        component: LoginForm
    },
    {
        path: '/LoginForm',
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
                path: '/personal/information',
                name: '/personal/information',
                component:information
            },
            {
                path: '/personal/edit_pwd',
                name: '/personal/edit_pwd',
                component:edit_pwd
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
