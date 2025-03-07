import {ajaxGet, ajaxPost,ajaxJson} from "@/assets/js/common";
const apiPrefix = "/member_management/member";


// 获取会员信息
export function queryMemberByPhone(data) {
    return ajaxGet(apiPrefix+"/queryMemberByPhone",data);
}