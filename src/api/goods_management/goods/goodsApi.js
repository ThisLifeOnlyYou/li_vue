import { ajaxGet } from "@/assets/js/common"

const apiPrefix = "/goods_management/goods";

/*查询商品信息*/
export function queryGoodsById(data) {
    return ajaxGet(apiPrefix + "/queryGoodsById", data)
}