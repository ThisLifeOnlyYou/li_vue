<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心 </el-breadcrumb-item>
      <el-breadcrumb-item>个人资料</el-breadcrumb-item>
    </el-breadcrumb>
    <i class="el-icon-circle el-icon-arrow-right" style="font-size:32px">
      <b style="font-size: 28px">完善个人资料</b>
      <br/>
      <br/>
      <el-form
          :model="informationForm"
          ref="informationForm"
          label-width="100px"
          class="demo-form-inline"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-top:20px">
              <el-upload
                  class="upload-demo"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload ="beforeAvatarUpload"
              >
                <img src="public/favicon.ico">
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
                style="width: 40%"
                label="电话号码："
                prop="username"
            >
              <el-input
                  max="11"
                  v-model="username"
                  disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
                style="width: 40%"
                label="姓名："
                prop="nickName"
            >
              <el-input
                  v-model="nickName"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
                style="width: 40%"
                label="身份证号："
                prop="idCard"
            >
              <el-input
                  v-model="idCard"
                  disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width: 40%" label="年龄：">
              <el-input
                  type="number"
                  min="18"
                  max="70"
                  v-model="age"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
                style="width: 40%"
                label="所属部门："
            >
              <el-input
                  disabled
                  style="width: 200px"
                  v-model="selectedDeptName"
                  placeholder="请选择部门"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width: 40%" label="住址：">
              <el-input
                  type="text"
                  v-model="address"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item style="width: 40%" label="备注：">
              <el-input
                 type="textarea"
                  cols="50"
                  rows="3"
                  v-model="info"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width: 40%" label="性别：">
              <el-select
                  style="width: 200px"
                  v-model="sex"
                  @change="$forceUpdate()"
                  placeholder="请选择性别"
                  clearable
              >
                <el-option label="女" value="0"></el-option>
                <el-option label="男" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
              type="primary"
              @click="submitInformationForm('informationForm')">
            提交
          </el-button>
          <el-button @click="resetForm(informationForm)">
            重制
          </el-button>
        </el-form-item>
      </el-form>
    </i>
  </div>
</template>
<script>
import {onMounted, ref} from "vue";
import {useStore} from 'vuex'
import { popup } from "@/assets/js/common";
import {listByQo} from "@/api/personnel_management/department/deptApi"
import {update} from "@/api/personnel_management/employee/empApi"
import {queryInformation} from "@/api/personal/presonAPi";
import router from "@/router";

export default {
  setup(){
    const store = useStore()
    const informationForm = ref({})
    const handleAvatarSuccess = ref({})
    const beforeAvatarUpload = ref({})
    const imageUrl = ref("")
    const BaseApi = store.state.BaseApi
    const options = ref([])
    const selectedDeptName = ref('')
    const nickName = ref('')
    const username = ref('')
    const idCard = ref('')
    const age = ref('')
    const address = ref('')
    const info = ref('')
    const sex  = ref('')
    // 获取仓库信息
    const deptAll = async () =>{
      try {
        listByQo({}).then((res)=>{
          res = res.data;
          if (res.code === 200) {
            options.value = res.data;
            selectedDeptName.value =options.value[0].name
          } else {
            popup(res.msg, "error");
          }
        })
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      }
    }
    // 获取个人信息
    const init = async () => {
      try {
        queryInformation({}).then((ref)=>{
          if (ref) {
            ref = ref.data
            if (ref.code === 200) {
              informationForm.value = ref.data
              nickName.value = informationForm.value.nickName
              username.value = informationForm.value.username
              idCard.value = informationForm.value.idCard
              age.value = informationForm.value.age
              address.value = informationForm.value.address
              info.value = informationForm.value.info
              sex.value =informationForm.value.sex
            } else {
              popup(ref.msg, "error");
            }
          } else {
            router.push("/LoginForm");
          }
        })
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      }
    }
    // 提交个人信息
    const submitInformationForm  = async () => {
      try {
        update({informationForm}).then((res)=>{
          if (res) {
            res = res.data;
            if (res.code === 200) {
              popup(res.msg, "更新成功");
            }  else {
              popup(res.msg, "更新失败");
            }
          }
        })
      } catch (error) {
        popup("error", error);
      }
    }
    // 重制个人信息
    const resetForm = () => {
      if (informationForm.value) {
        informationForm.value.resetFields();
      }
      init();
    }

    onMounted(() => {
      init();
      deptAll();
    });
    return {
      informationForm,
      submitInformationForm,
      resetForm,
      handleAvatarSuccess,
      beforeAvatarUpload,
      imageUrl,
      BaseApi,
      options,
      selectedDeptName,
      nickName,
      username,
      idCard,
      age,
      address,
      info,
      sex,
    }
  }
}
</script>