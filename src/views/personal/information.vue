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
          :rules="rules"
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
                <img
                v-if="imageUrl"
                :src="BaseApi + imageUrl"
                class="avatar-uploader"
                >
                <i v-else
                   class="el-icon-plus avatar-uploader-icon">
                </i>
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
                  v-model="informationForm.username"
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
                  v-model="informationForm.nickName"
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
                  v-model="informationForm.idCard"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width: 40%" label="年龄：">
              <el-input
                  type="number"
                  min="18"
                  max="70"
                  v-model="informationForm.age"
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
              <el-select
                  disabled
                  style="width: 200px"
                  v-model="selectedDeptName"
                  placeholder="请选择部门"
                  filterable
                  @change="$forceUpdate()"
                  clearable
              >
                <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width: 40%" label="住址：">
              <el-input
                  type="text"
                  v-model="informationForm.address"
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
                  v-model="informationForm.info"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width: 40%" label="性别：">
              <el-select
                  style="width: 200px"
                  v-model="informationForm.sex"
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
      </el-form>
    </i>
  </div>
</template>
<script>
import {onMounted, ref} from "vue";
import {useStore} from 'vuex'
import { popup } from "@/assets/js/common";
import {listByQo} from "@/api/personnel_management/department/deptApi"
import {queryInformation} from "@/api/personal/presonAPi";

export default {
  setup(){
    const sotre = useStore()
    const informationForm = ref({})
    const rules = ref({
      username: [
        {
          required: true,
          message: "手机号不能为空",
          trigger: "blur",
        },
      ],
      nickName: [
        {
          required: true,
          message: "姓名不能为空",
          trigger: "blur",
        },
      ],
      idCard: [
        {
          required: true,
          message: "身份证号不能为空",
          trigger: "blur",
        },
      ],
    },)

    const handleAvatarSuccess = ref({})
    const beforeAvatarUpload = ref({})
    const imageUrl = ref("")
    const BaseApi = sotre.state.BaseApi
    const options = ref([])
    const selectedDeptName = ref('')
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
          ref = ref.data
          if (ref.code === 200) {
            informationForm.value = ref.data
            console.log(informationForm.value.data)
          } else {
            popup(ref.msg, "error");
          }
        })
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      }
    }


    onMounted(() => {
      init();
      deptAll();
    });
    return {
      informationForm,
      rules,
      handleAvatarSuccess,
      beforeAvatarUpload,
      imageUrl,
      BaseApi,
      options,
      selectedDeptName
    }
  }
}
</script>