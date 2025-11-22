
import {ajaxPost} from "@/assets/js/common";

const apiPrefix = '/personnel_management/employee'


// 修改
export function update(data) {
    return ajaxPost(apiPrefix + "/update", data)
}
//上传图片
export function uploadImg(data) {
    return ajaxPost(apiPrefix + "/uploadImg", data)
}