import {ajaxGet, ajaxPost} from "@/assets/js/common";
const apiPrefix = '/personal'

// 个人信息
export function queryInformation() {
    return ajaxGet(apiPrefix+'/information')
}
// 修改个人信息
export function updateInformation(data) {
    return ajaxPost(apiPrefix+'/edit_pwd', data)
}
