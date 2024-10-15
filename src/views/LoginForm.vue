<template>
  <div id="login">
    <div class="loginForm">
      <el-form :model="loginForm" ref="loginForm" class="demo-ruleForm">
        <br />
        <i class="iconfont icon-r-building" style="font-size: 36px">
          <b style="font-size: 28px"> 超市管理系统 </b> </i
        ><br /><br />
        <el-form-item prop="username">
          <el-row>
            <el-col :span="5" style="text-align: right">
              <i
                  class="iconfont icon-r-user1"
                  style="font-size: 28px; color: grey"
              >
              </i>
            </el-col>
            <el-col
                :span="19"
                style="text-align: left; padding-left: 10px"
            >
              <el-input
                  v-model="loginForm.username"
                  placeholder="账号"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item prop="password">
          <el-row>
            <el-col :span="5" style="text-align: right">
              <i
                  class="iconfont icon-r-lock"
                  style="font-size: 28px; color: grey"
              >
              </i>
            </el-col>
            <el-col
                :span="19"
                style="text-align: left; padding-left: 10px"
            >
              <el-input
                  type="password"
                  v-model="loginForm.password"
                  placeholder="密码"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
              style="font-size: 18px"
              type="primary"
              @click="submitForm('loginForm')"
          >
            <i class="iconfont icon-r-yes" style="font-size: 18px">
            </i>
            登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style>
#login {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  overflow-y: hidden;
  height: 100%;
  background: url("../assets/img/01.jpg") center top / cover no-repeat;
}

.loginForm {
  justify-content: center;
  background-color: white;
  width: 400px;
  height: 280px;
  margin: 150px auto;
  text-align: center;
  padding: 10px;
  border-color: #555555;
  border-style: solid;
  border-radius: 15px;
}

.loginForm input {
  width: 260px;
}

h3 {
  margin: 10px 0;
}

.loginForm button {
  margin: auto;
  width: 100px;
  height: 40px;
}
</style>
<script>
import { ajaxPost, popup } from "@/assets/js/common";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
          {
            min: 6,
            max: 8,
            message: "密码长度为5-8位",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 检查账号和密码是否非空
          if (!this.loginForm.username || !this.loginForm.password) {
            popup("账号或密码不能为空！", "error");
            return; // 停止执行后续代码
          }
          // 如果账号和密码都非空，则发送请求
          ajaxPost("/login", this.loginForm)
              .then((res) => {
                res = res.data;
                if (res.code === 200) {
                  // 设置 token 和 employee cookie
                  const expiresDays = 2;
                  Cookies.set("token", res.data.token, { expires: expiresDays / 24 * 60 * 60 * 1000 }); // 注意：js-cookie 的 expires 需要毫秒数
                  // Cookies.set("employee", JSON.stringify(res.data.employee), { expires: expiresDays / 24 * 60 * 60 * 1000 });
                  console.log("")
                  popup("登录成功，请稍等...");
                  this.$router.push("/index");
                } else {
                  popup(res.msg, "warning");
                }
              })
              .catch((error) => {
                // 处理请求错误
                popup("登录失败: " + error.message, "error");
              });
        } else {
          popup("账号或密码格式不正确！", "error");
        }
      });
    },
  },
};
</script>
