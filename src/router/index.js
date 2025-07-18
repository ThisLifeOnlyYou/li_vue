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
//销售主页
const sale_home = () => import('../views/sale_management/sale_cmd/List.vue')
// 销售记录
const sale_record = () => import('../views/sale_management/sale_records/List.vue')
// 积分兑换记录
const exchange_point_products_records = () => import('../views/sale_management/exchange_point_products_records/List.vue')
// 部门管理
const department_management = () => import('../views/personnel_management/dept/List.vue')
const routes = [
    {
        path: '/',
        name: '/',
        component: LoginForm
    },
    {
        path: '/LoginForm',
        name: 'LoginForm',
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
            },
            {
                path: '/sale_management/sale_cmd/list',
                name: '/sale_management/sale_cmd/list',
                component:sale_home
            },
            {
                path: '/sale_management/sale_records/list',
                name: '/sale_management/sale_records/list',
                component:sale_record
            },
            {
                path: '/sale_management/exchange_point_products_records/list',
                name: '/sale_management/exchange_point_products_records/list',
                component:exchange_point_products_records
            },
            {
                path: '/personnel_management/dept/list',
                name: '/personnel_management/dept/list',
                component:department_management
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
