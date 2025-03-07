<template>
  <el-container class="layout-container-demo" style="height:100vb">
    <el-header style="text-align: right; font-size: 12px;height: 80px" class="el_header" >
      <div class="toolbar">
        <div style="font-size: 26px; color: white; text-align: center ;position: absolute;left: 10px">
          <el-icon><HomeFilled />
          </el-icon>
          <span style="font-size: 26px; text-align: center; ">
            超市管理系统
          </span>
        </div>
        <el-dropdown>
          <el-icon style="margin-right: 8px; margin-top: 1px;width:50px;height:50px;">
            <el-avatar
                :size="50"
                shape="square"
                :src="BaseApi + circleUrl"
            >
            </el-avatar>
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="informationBtn('个人资料完善')">个人资料完善</el-dropdown-item>
              <el-dropdown-item @click="empExit('退出')">退出</el-dropdown-item>
              <el-dropdown-item @click="logoutVisable('注销')">注销</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <b
            style="
            font-size: 24px;
            color: white;
         "
        >
          {{isAdmin ? "管理员 " : "用户 "}}
          {{ loginName }}</b
        >
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px" style="height:100vb ;background-color: #6495ED">
        <el-scrollbar>
          <el-menu   background-color="#6495ED"
                     text-color="white"
                     :router="true"
                     :unique-opened="true"
                     active-text-color="#FFDEAD">
            <el-sub-menu
                v-for="item in menu_catalogs"
                :key = "item.id"
                :index = "item.id + ''"
            >
              <template v-slot:title>
                <i
                    :class="item.icon"
                    style="font-size: 26px; color: white"
                >
                  <b style="font-size: 18px"> {{ item.label }}</b>
                </i>
              </template>
              <el-menu-item-group>
                <el-menu-item
                    v-for="c in item.children"
                    :key="c.id"
                    :index="c.purl"
                >
                  <i :class="c.icon" style="font-size: 24px"> </i>
                  <b style="font-size: 16px"> {{ c.label }}</b>
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
    <el-dialog title="注销账户" v-model="logoutVisable" width="70%">
      <el-form
          :model="logoutform"
          :rules="rules"
          ref="logoutform"
          label-width="100px"
          class="demo-ruleForm"
      >
        <el-form-item label="内容" prop="content">
          <el-input
              v-model="logoutform.content"
              placeholder="请填写“本人确定注销”"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              @click="logoutSubmit('logoutform')"
          >确 定</el-button
          >
          <el-button @click="logoutCel('logoutform')"
          >取 消</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>
<script>
import {ref,onMounted} from 'vue';
import {useStore} from 'vuex'
import { ajaxGet, ajaxPost, popup } from "@/assets/js/common";
import {loginEmp,clearCookie} from "@/assets/js/auth";
import { useRouter } from 'vue-router';
import {ElMessageBox} from "element-plus";
import {HomeFilled} from "@element-plus/icons-vue";

export default {
  components: {HomeFilled},

  setup() {
    const sotre = useStore()
    const BaseApi = sotre.state.BaseApi
    const logoutVisable = ref(false)
    const logoutform = ref({})
    const menu_catalogs = ref([])
    const isAdmin = ref('');
    const loginName = ref('');
    const circleUrl = loginEmp().headImg;
    const router = useRouter()
    const rules = {
      content: [
        {
          required: true,
          message: '内容不能为空',
          trigger: 'blur',
        },
      ],
    };
    // 初始化函数
    const init = async () => {
      isAdmin.value = loginEmp().isAdmin;
      loginName.value = loginEmp().nickName;
      try {
          ajaxGet('/empMenu', {}).then((res1) =>{
            if (res1) {
              const res = res1.data
              if (res?.code === 200) {
                menu_catalogs.value = res.data;
              } else {
                console.error("获取菜单失败，状态码：",res?.data.code);
              }
            } else {
              router.push("/LoginForm");
            }
        })
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      }
    };
    // 个人资料
    const informationBtn = async () => {
      await router.push("/personal/information");
      popup("请完善个人的资料");
    };
    // 退出
    const empExit = async () => {
      try {
        await ElMessageBox.confirm("确定退出吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await ajaxGet('/exit',{}).then(res => {
          const res1 = res.data
          if (res1.code === 200) {
            popup("退出成功，请重新登录",);
            clearCookie("token");
            clearCookie("employee");
            router.push("/LoginForm");
          } else {
            popup("退出失败，请重试");
          }
        })
      }).catch(()=>{
        ElMessageBox.close();
      })
      } catch (error) {
        popup("退出失败，请重试");
      }
    };

    // 注销
    const logoutSubmit = async (formName) => {
      await ajaxPost('/logout', { content: logoutform.value.content }).then(
        (res) => {
          if (res.code === 200) {
            popup("注销成功，请重新登录");
            router.push("/LoginForm");
          } else {
            popup("注销失败，请重试");
          }
        }
      );
    };
    const logoutCel = (formName) => {
      logoutVisable.value = false;
      };
    onMounted(() => {
      init();
    });
    return{
      ajaxGet,
      ajaxPost,
      popup,
      BaseApi,
      logoutVisable,
      logoutform,
      menu_catalogs,
      rules,
      isAdmin,
      loginName,
      circleUrl,
      informationBtn,
      empExit,
      logoutSubmit,
      logoutCel,
    }
  }
}
</script>
<style scoped>
.layout-container-demo  {
  position: relative;
  background-color: #6495ED;
  color: var(--el-text-color-primary);
}
.layout-container-demo  {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo  {
  border-right: none;
}
.layout-container-demo  {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
/*修改*/
.el_header {
  color: #333;
  border-bottom: 1px black solid;
  height: 50px;
}
</style>
