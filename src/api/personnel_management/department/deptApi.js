import {ajaxGet,ajaxPost} from "@/assets/js/common";
const apiPrefix = '/personnel_management/dept'

//获取仓库信息
export function listByQo(data) {
    return ajaxGet(apiPrefix+'/list',data)
}