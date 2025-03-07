import {ajaxGet, ajaxPost,ajaxJson} from "@/assets/js/common";
const apiPrefix = "/sale_management/sale_record";
// 查询订单号
export function getCn(params) {
    return ajaxGet(apiPrefix+"/getCn", params);
}
