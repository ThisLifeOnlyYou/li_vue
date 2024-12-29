<template>
    <div>
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>个人中心</el-breadcrumb-item>
        <el-breadcrumb-item>密码修改</el-breadcrumb-item>
        </el-breadcrumb>
      <br>
      <div id = "edit_pwd">
        <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
        >
          <div style="display: flex; justify-content: center; align-items: center;">
            <el-icon style="font-size: 30px; margin-right: 10px;">
              <Edit/>
            </el-icon>
            <b style="font-size: 24px;">密码修改</b>
          </div>
          <br>
          <br>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username" disabled></el-input>
            </el-form-item>
          <el-form-item label="旧密码" prop="old_pwd">
            <el-input type="password" v-model="ruleForm.old_pwd"></el-input>
            </el-form-item>
          <el-form-item label="新密码" prop="new_pwd">
            <el-input type="password" v-model="ruleForm.new_pwd"></el-input>
            </el-form-item>
          <el-form-item label="确认密码" prop="confirm_pwd">
            <el-input type="password" v-model="ruleForm.confirm_pwd"></el-input>
            </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
      </div>
    </div>
</template>
<script>
import {Edit} from "@element-plus/icons-vue";
import {removeToken} from "@/assets/js/auth";
import  {loginEmp} from "@/assets/js/auth";
import {popup} from "@/assets/js/common";
import Cookies from "js-cookie";
import {updateInformation} from "@/api/personal/presonAPi"


export default {
  components: {Edit},
  data() {
    return {
      ruleForm: {
        username: "",
        old_pwd: "",
        new_pwd: "",
      },
      rules: {
        old_pwd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度在6到16个字符', trigger: 'blur' }
        ],
        new_pwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度在6到16个字符', trigger: 'blur' }
        ],
        confirm_pwd: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度在6到16个字符', trigger: 'blur' },
          { validator: this.validateConfirmPwd, trigger: 'blur' }
        ]
      },
  }
},
  methods: {
    // 调用接口修改密码
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const formData ={
            username: this.ruleForm.username,
            old_pwd: this.ruleForm.old_pwd,
            new_pwd: this.ruleForm.new_pwd,
          }
          this.$confirm('确认修改密码吗?',"提示",{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updateInformation(formData).then(
                (res) => {
                  try {
                    if (res.code === 200) {
                      popup("修改密码成功，请重新登录", "info");
                      this.ruleForm = {
                        username: this.ruleForm.username
                      };
                      Cookies.remove("token");
                      removeToken();
                      this.$router.push("/loginForm");
                    }
                    else {
                      popup("修改失败", "error");
                    }
                  } catch (error) {
                  }
                }
                )
          }).catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            })
          })
        } else {
          popup("修改失败,请检查输入信息", "error",)
        }
      });
      },
    // 重置表单

    resetForm() {
        this.$refs.ruleForm.resetFields();
      },
    // 验证确认密码
    validateConfirmPwd(rule, value, callback) {
        if (value !== this.ruleForm.new_pwd) {
          callback(new Error('两次输入的密码不一致!'));
        } else {
          callback();
        }
      },
    // 初始化数据
    init() {
      this.ruleForm.username = loginEmp().data.username;
    }
},
  created() {
    this.init();
  }
}
</script>
<style>
#edit_pwd {
  width: 50%;
  margin: 50px auto;
  background-color: #ffffff;
  padding: 20px;
}
</style>
