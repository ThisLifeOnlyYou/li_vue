import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function loginEmp() {
  let str = Cookies.get("employee");

  // 检查 str 是否存在且不为 null 或空字符串（根据需要添加空字符串检查）
  if (!str) {
    // 返回一个包含错误信息的对象
    return {
      success: false,
      message: "Employee cookie not found or is invalid."
    };
  }

  try {
    // 尝试解析 JSON 字符串
    let employee = JSON.parse(str);
    console.log(employee);
    return employee;
  } catch (e) {
    // 如果解析失败，返回一个包含错误信息的对象
    return {
      success: false,
      message: "Failed to parse employee cookie as JSON: " + e.message
    };
  }
}
// 清除cookie
export function clearCookie(name) {
  Cookies.remove(name)
}
