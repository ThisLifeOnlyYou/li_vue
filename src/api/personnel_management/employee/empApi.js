
import {ajaxPost} from "@/assets/js/common";

const apiPrefix = '/personnel_management/employee'


// 修改
export function update(data) {
    return ajaxPost(apiPrefix + "/update", data)
}