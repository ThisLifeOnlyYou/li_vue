<template xmlns="http://www.w3.org/1999/html">
<div id="sale_cmd">
    <div class="head">
      <i style="font-size: 50px; padding-top: 10px; " class="el-icon-s-tools"></i>
      销售主页
    </div>
  <div class="cmd">
    <el-col :span="12">
      <button  @click="saleBtn">
        <i style="font-size: 32px; margin-right: 10px;"></i>
        购物结账
      </button>
    </el-col>
    <el-col :span="12" >
      <button  @click="handleClick">
        <i style="font-size: 32px; margin-right: 10px;"></i>
        积分兑换
      </button>
    </el-col>
    <el-col :span="12">
      <button @click="handleClick">
        <i style="font-size: 32px; margin-right: 10px;"></i>
        购物结账
      </button>
    </el-col>
    <el-col :span="12">
      <button  @click="handleClick">
        <i style="font-size: 32px; margin-right: 10px;"></i>
        积分兑换
      </button>
    </el-col>
  </div>
  <el-dialog title="销售商品" v-model="newVisable" width="80%">
    <el-form
        :model="newForm"
        :rules="rules"
        ref="newForm"
        label-width="100px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="销售编号" style="width: 60%">
            <el-input
                v-model="newForm.cn"
                placeholder="如：销售编号"
                disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
              label ="支付方式"
              prop="sellway"
          >
            <el-radio
            type="radio"
            v-model="newForm.sellway"
            label="0">
              支付宝
            </el-radio>
            <el-radio
                type="radio"
                v-model="newForm.sellway"
                label="1">
              微信
            </el-radio>
            <el-radio
                type="radio"
                v-model="newForm.sellway"
                label="2">
              银行卡
            </el-radio>
            <el-radio
                type="radio"
                v-model="newForm.sellway"
                label="3">
              现金
            </el-radio>
          </el-form-item>
          </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
              label="顾客类型"
              prop="type"
              style="width: 60%">
            <el-radio
                @change = "
                () =>{
                    if(this.newForm.type === '1'){
                      this.newForm.sellTotalmoney = (
                        this.totalMoney * 0.9
                      ).toFixed(2)
                    } else {
                      console.log(this.newForm.type);
                      this.newForm.sellTotalmoney =
                        this.totalMoney.toFixed(2)
                    }
                }"
            type="radio"
            v-model="newForm.type"
            label="1">
              会员
            </el-radio>
            <el-radio
                type="radio"
                v-model="newForm.type"
                label="0">
              非会员
            </el-radio>
          </el-form-item>
          <el-col :span="12" v-if="newForm.type === '1'">
            <el-form-item label="会员账号" prop="memberPhone">
              <el-input
                  @change = "queryMemberByPhone(newForm.memberPhone)"
                  v-model="newForm.memberPhone"
                  placeholder="如：电话号码"
              ></el-input>
            </el-form-item>
          </el-col>
          </el-col>
      </el-row>
      <el-divider />
      <el-row>
        <el-col
            :span="24"
            style="text-align: left; margin-bottom: 10px"
        >
          <el-button type="success" @click="addGoodsBtn">
            添加商品
          </el-button>
        </el-col>
        <el-col :span="24">
          <el-table>
            <el-table-column
                label="商品编号"
                prop="goodsId"
            >
            </el-table-column>
            <el-table-column
                label="商品名称"
                prop="goodsName"
            >
            </el-table-column>
            <el-table-column
                label="商品数量"
                prop="goodsNum"
            >
              <template slot="scope">
                <el-button @click="redueGoodsNum()"></el-button>
                <el-input></el-input>
                <el-button @click="addGoodsNum()"></el-button>
              </template>
            </el-table-column>
            <el-table-column
                label="商品单价"
                prop="goodsPrice"
            >
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <br/>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注：" style="width: 90%">
            <el-input
                type="textarea"
                v-model="newForm.init"
                placeholder="如：订单1"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div v-if="newForm.detailSaleRecords.length > 0">
          </div>
          </el-col>
        </el-row>
      <hr/>
      <br/>
      <el-row>
        <el-col :span="24">
          <el-form-item>
            <el-button type="success" @click="submitNewForm('newForm')">
              支付
            </el-button>
            <el-button type="info" @click="closeNewForm('newForm')">
              关闭
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </el-dialog>

</div>
</template>
<script>
import {popup} from "@/assets/js/common";
import { queryMemberByPhone } from "@/api/member_management/member/memberAPI"
import {
  getCn
} from "@/api/sele_management/seleRecordeApi"
export default {
  data(){
    return {
      newVisable:false,
      totalMoney:"",
      newForm:{
        cn:"",
        sellway:"1",
        sellTotal:"",
        sellTotalmoney:"",
        type:"0",
        memberPhone:"",
        detailSaleRecords:[],
        init:""
      },
      rules:{
        sellway:[
          {
            required: true,
            message: "请选择支付方式",
            trigger: "blur"
          }
        ],
        type:[
          {
            required: true,
            message: "请选择顾客类型",
            trigger: "blur"
          }
        ],
        memberPhone:[
          {
            required: true,
            message: "会员电话号码未填写",
            trigger: "blur"
          }
        ]
      }
    }
    },
    methods: {
      // 查询销售编号
      saleBtn() {
        getCn().then(res => {
          res = res.data;
          if (res.code === 200) {
            this.newForm.cn = res.data;
            this.newVisable = true;
          } else {
            popup(res.msg, "error")
          }
        })
      },
      // 会员信息查询
      queryMemberByPhone(phone) {
        queryMemberByPhone({phone: phone}).then(res=> {
          try {
            if (res) {
              res = res.data;
              if (res.code !== 200) {
                popup(res.msg, "error")
                this.newForm.memberPhone = ""
              } else {
                popup("会员信息查询成功", "success")
              }
            } else {
              this.newForm.memberPhone = ""
            }
          } catch (error) {
            popup(res.msg, "error")
          }
        })
      },
      // 添加商品
      addGoodsBtn() {
        console.log("添加商品");
      },
    // 减少商品数量
      redueGoodsNum(row) {
        console.log(row,"减少商品数量");
      },
      // 增加商品数量
      addGoodsNum(row) {
        console.log(row,"增加商品数量");
      },
    //   提交表单
      submitNewForm(formName) {
        console.log(formName,"提交表单");
      },
      // 关闭表单
      closeNewForm(formName) {
        this.$refs[formName].resetFields();
        this.newVisable = false;
        this.newForm = {
          cn:"",
          sellway:"1",
          sellTotal:"",
          sellTotalmoney:"",
          type:"0",
          memberPhone:"",
          detailSaleRecords:[],
          init:""
        }
      }
    }
}
</script>
<style>

/* 页面背景图片 */
#sale_cmd {
  background: url("@/assets/img/01.jpg")center top / cover no-repeat;
  top: 0;
  left: 0;
  width: 100%;
  overflow-y: auto;
  height: 90vh;
  margin: 0 auto;
}
/* 头部 */
#sale_cmd .head {
  height: 100px;
  font-size: 42px;
  font-weight: bolder;
  margin-top: 50px;
  color: black;
}
#sale_cmd .cmd {
  width: 80%;
  margin: 0 auto;
}
#sale_cmd .cmd button {
  width: 85%;
  height: 100px;
  margin: 2%;
  border-radius: 3px;
  font-size: 32px;
  cursor: pointer;
  font-weight: 600;
  color: black;
}
#sale_cmd .cmd button:hover {
  background-color: #093fe1;
}
.el-col{
  float: left;
  width: 80%;
  margin: 0 auto;
}

</style>