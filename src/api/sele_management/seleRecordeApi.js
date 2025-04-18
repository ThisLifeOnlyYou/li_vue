import {ajaxGet, ajaxPost,ajaxJson} from "@/assets/js/common";
const apiPrefix = "/sale_management/sale_record";
// 查询订单号
export function getCn(params) {
    return ajaxGet(apiPrefix+"/getCn", params);
}
// 查询商品库存
export function getOptionSaleRecordsGoods(params) {
    return ajaxGet(apiPrefix+"/getOptionSaleRecordsGoods", params);
}
//支付
export function saveSaleRecords(data) {
    return ajaxJson(apiPrefix + "/saveSaleRecords", data)
}
// 销售记录
export function queryPageByQoSaleRecords(data) {
    return ajaxPost(apiPrefix + "/queryPageByQoSaleRecords", data)
}
//删除销售记录
export function delSaleRecords(data) {
    return ajaxGet(apiPrefix + "/delSaleRecords", data)
}
