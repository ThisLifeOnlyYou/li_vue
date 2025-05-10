import {ajaxGet, ajaxJson, ajaxPost} from "@/assets/js/common";

const apiPrefix = '/sale_management/exchange_point_products_records'

//会员账号
export function queryOptionsPointProducts() {
    return ajaxGet(apiPrefix + "/queryOptionsPointProducts", {})
}
// 积分商品
export function queryOptionsMember() {
    return ajaxGet(apiPrefix + "/queryOptionsMember", {})
}
// 查询积分商品详情
export function queryPointProductByGoodsId(data) {
    return ajaxGet(apiPrefix + "/queryPointProductByGoodsId", data)
}
//查询会员商品
export function queryPointProductBymemberId(data) {
    return ajaxGet(apiPrefix + "/queryPointProductBymemberId", data)
}
//兑换积分商品
export function saveExchangePointProductRecords(data) {
    return ajaxPost(apiPrefix + "/saveExchangePointProductRecords", data)
}
//查询会员手机号
export function queryOptionsMemberPhone() {
    return ajaxGet(apiPrefix + "/queryOptionsMemberPhone", {})
}
//查询会员兑换记录
export function queryPageByQoExchangePointProducts(data) {
    return ajaxPost(apiPrefix + "/queryPageByQoExchangePointProducts", data)
}

// 删除兑换记录
export function delExchangePointProducts(data) {
    return ajaxGet(apiPrefix + "/delExchangePointProducts", data)
}

