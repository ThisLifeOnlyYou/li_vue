`
<template xmlns="http://www.w3.org/1999/html">
  <div id="sale_cmd">
    <div class="head">
      <i style="font-size: 50px; padding-top: 10px; " class="el-icon-s-tools"></i>
      销售主页
    </div>
    <div class="cmd">
      <!--    todo: 购物商店-->
      <el-col :span="12">
        <button @click="saleBtn">
          <i style="font-size: 32px; margin-right: 10px;"></i>
          购物结账
        </button>
      </el-col>
      <!--    todo: 积分兑换-->
      <el-col :span="12">
        <button @click="handleClick">
          <i style="font-size: 32px; margin-right: 10px;"></i>
          积分兑换
        </button>
      </el-col>
      <!--    todo: 销售记录-->
      <el-col :span="12">
        <button @click="saleRecordBtn">
          <i style="font-size: 32px; margin-right: 10px;"></i>
          销售记录
        </button>
      </el-col>
      <!--    todo: 兑换记录-->
      <el-col :span="12">
        <button @click="exchangeRecordBtn">
          <i style="font-size: 32px; margin-right: 10px;"></i>
          兑换记录
        </button>
      </el-col>
    </div>
    <!--todo: 购物结账弹窗-->
    <el-dialog title="销售商品" v-model="newVisable" width="80%">
      <el-form
          :model="newForm"
          :rules="rules"
          ref="newForm"
          label-width="100px"
      >
        <!-- todo: 商品编号-->
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
        <!--todo: 支付方式-->
        <el-row>
          <el-col :span="24">
            <el-form-item
                label="支付方式"
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
        <!--todo: 顾客类型-->
        <el-row>
          <el-col :span="24">
            <el-form-item
                label="顾客类型"
                prop="type"
                style="width: 60%">
              <el-radio
                  @change="
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
                    @change="queryMemberByPhone(newForm.memberPhone)"
                    v-model="newForm.memberPhone"
                    placeholder="如：电话号码"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <el-divider/>
        <!--todo: 添加商品-->
        <el-row>
          <el-col
              :span="24"
              style="text-align: left; margin-bottom: 10px"
          >
            <el-button type="success" @click="addGoodsBtn">
              添加商品
            </el-button>
          </el-col>
          <!-- todo: 商品信息 -->
          <el-col :span="24">
            <el-table
                :data="newForm.detailSaleRecords"
                style="width: 100%"
                size="small"
                empty-text="暂无数据"
            >
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
                  label="数量"
                  prop="goodsNum"
              >
                <template v-slot="scope">
                  <el-button type="success" @click="redueGoodsNum(scope.row)">-</el-button>
                  <el-input
                      readonly
                      type="text"
                      v-model="scope.row.goodsNum"
                      style="width: 100px"
                      min="1"
                      :max="scope.row.residueNum"
                  >
                  </el-input>
                  <el-button type="success" @click="addGoodsNum(scope.row)">+</el-button>
                </template>
              </el-table-column>
              <el-table-column
                  label="商品价格"
                  prop="goodsPrice"
              >
              </el-table-column>
              <el-table-column
                  v-if="!newForm.sellTime"
                  label="操作"
              >
                <template v-slot="scope">
                  <el-button
                      @click="removedetailRecords(scope.row)"
                      type="danger"
                  >移除
                  </el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <br/>
        <!--todo: 备注-->
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：" style="width: 90%">
              <el-input
                  type="textarea"
                  v-model="newForm.info"
                  placeholder="如：订单1"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <hr/>
        <br/>
        <!-- todo: 商品支付-->
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
    <!--    todo: 添加商品弹窗-->
    <el-dialog title="添加商品" :model-value="addVisable" width="50%">
      <el-form
          :model="detailSaleRecords"
          ref="detailSaleRecords"
          label-width="100px"
          class="custom-form"
      >
        <!-- 商品下拉框 -->
        <el-form-item label="商品名称" class="center-item">

          <el-select
              v-model="detailSaleRecords.goodsId"
              placeholder="请选择商品"
              filterable
              @change="queryGoodsById"
          >
            <el-option
                v-for="item in options_saleRecordsAddGoods"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 商品数量 -->
        <el-form-item label="数量" class="center-item">
          <el-input
              type="number"
              @change="()=>{
                this.$forceUpdate()
                if (this.goodsNum_max <this.detailSaleRecords.residueNum) {
                  this.detailSaleRecords.goodsNum = this.goodsNum_max;
                  }
              }"
              min="1"
              :max="goodsNum_max"
              v-model="detailSaleRecords.goodsNum"
              :placeholder="` ${this.goodsNum_max ? '库存数量：' + this.goodsNum_max : ''}`"
          ></el-input>
        </el-form-item>
        <!-- 商品单价 -->
        <el-form-item label="商品单价" class="center-item">
          <el-input
              disabled
              v-model="detailSaleRecords.goodsPrice"
              placeholder="单价"
          ></el-input>
        </el-form-item>
        <!-- 添加按钮 -->
        <el-form-item class="center-item">
          <el-button type="success" @click="addGoods">添加</el-button>
          <el-button type="info" @click="closeAddForm">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--    todo: 积分兑换弹窗-->
    <el-dialog title="积分兑换" :model-value="exchangeVisable" width="50%"
               :show-close=false
               :close-on-click-modal=false
               :close-on-press-escape=false>
      <el-form
          :model="pointProductsForm"
          :rules="rules"
          ref="pointProductsForm"
          label-width="200px"
          label-height="80px"
          class="custom-form"
      >
        <!-- 会员账号 -->
        <el-form-item
            v-if="!confirmVisiable"
            label="会员账号"
            class="center-item"
            prop="memberId"
        >
          <el-select
              @change="queryOptionsPointProducts"
              v-model="pointProductsForm.memberId"
              placeholder="请选择会员"
              filterable
              :rules="rules"
          >
            <el-option
                v-for="item in options_member"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 积分商品 -->
        <el-form-item
            v-if="!confirmVisiable"
            label="积分商品"
            class="center-item"
            prop="goodsId"
        >
          <el-select
              @change="queryOptionsMember"
              v-model="pointProductsForm.goodsId"
              placeholder="请选择商品"
              filterable

          >
            <el-option
                v-for="item in options_exchangeGoods"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 二次兑换确认弹窗 -->
        <el-form-item
            v-if="confirmVisiable"
            label="会员账号"
            class="center-item"
        >
          <el-select
              disabled
              @change="queryPointProductByMemberId"
              v-model="pointProductsForm.memberId"
              placeholder="请选择会员"
              filterable
          >
            <el-option
                v-for="item in options_member"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
            v-if="confirmVisiable"
            label="积分商品"
            class="center-item"
        >
          <el-select
              disabled
              v-model="pointProductsForm.goodsName"
              placeholder="请选择商品"
              filterable
          >
            <el-option
                v-for="item in options_member"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
            v-if="confirmVisiable"
            label="积分数"
            class="center-item"
        >
          <el-input
              disabled
              v-model="pointProductsForm.integral"
              placeholder="积分数"
          ></el-input>
        </el-form-item>
        <!-- 兑换按钮 -->
        <el-form-item class="center-item">
          <el-button type="success" v-if="!confirmVisiable" @click="exchangePointProducts('pointProductsForm')">兑换
          </el-button>
          <el-button type="info" v-if="!confirmVisiable" @click="closeExchangeForm">关闭</el-button>
          <el-button type="success" v-if="confirmVisiable" @click="confirmExchangePointProducts('pointProductsForm')">
            确认兑换
          </el-button>
          <el-button type="info" v-if="confirmVisiable" @click="closeConfirmForm">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {popup} from "@/assets/js/common";
import {queryGoodsById} from "@/api/goods_management/goods/goodsApi"
import {queryMemberByPhone} from "@/api/member_management/member/memberAPI"
import {
  getCn,
  getOptionSaleRecordsGoods,
  saveSaleRecords
} from "@/api/sele_management/seleRecordeApi"
import {
  queryOptionsMember,
  queryOptionsPointProducts,
  queryPointProductByGoodsId,
  queryPointProductBymemberId,
  saveExchangePointProductRecords
} from "@/api/sele_management/exchange_point_products/exchangePointProductsApi";

export default {
  data() {
    return {
      newVisable: false,
      exchangeVisable: false,
      totalMoney: "",
      goodsNum_max: "",
      detailSaleRecords: {},
      newForm: {
        cn: "",
        sellway: "1",
        sellTotal: "",
        sellTotalmoney: "",
        type: "0",
        info: "",
        detailSaleRecords: [],
      },
      pointProductsForm: {
        memberId: "",
        goodsId: "",
        coverUrl: "",
        integral: "",
        goodsName: "",

      },
      rules: {
        sellway: [
          {
            required: true,
            message: "请选择支付方式",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择顾客类型",
            trigger: "blur"
          }
        ],
        memberPhone: [
          {
            required: true,
            message: "会员电话号码未填写",
            trigger: "blur"
          }
        ],
        goodsId: [
          {
            required: true,
            message: "商品名称未填写",
            trigger: "blur"
          }
        ],
        memberId: [
          {
            required: true,
            message: "会员名称未填写",
            trigger: "blur"
          }
        ],
      },
      addVisable: false,
      confirmVisiable: false,
      options_saleRecordsAddGoods: [],
      options_exchangeGoods: [],
      options_member: [],
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
    // 积分兑换
    handleClick() {
      console.log("handleClick");
      this.exchangeVisable = true;
      console.log(this.exchangeVisable, "exchangeVisable");
      this.confirmVisiable = false;
      this.queryOptionsPointProducts();
      this.queryOptionsMember();
    },
    //会员账号
    queryOptionsPointProducts() {
      console.log("queryOptionsPointProducts");
      queryOptionsPointProducts().then(res => {
        try {
          if (res) {
            res = res.data;
            if (res.code === 200) {
              this.options_exchangeGoods = res.data;
            } else {
              popup(res.msg, "error")
            }
          }
        } catch (error) {
          popup(res.msg, "error")
        }
      })
    },
    // 积分商品
    queryOptionsMember() {
      console.log("queryOptionsMember");
      queryOptionsMember().then(res => {
        try {
          if (res) {
            res = res.data;
            if (res.code === 200) {
              this.options_member = res.data;
            } else {
              popup(res.msg, "error")
            }
          }
        } catch (error) {
          popup(res.msg, "error")
        }
      })
    },
    // 关闭积分兑换弹窗
    closeExchangeForm() {
      console.log("closeExchangeForm");
      this.exchangeVisable = false;
      this.confirmVisiable = false;
      this.pointProductsForm = {
        memberId: "",
        goodsId: "",
        coverUrl: "",
        integral: "",
      };
    },
    // 二次兑换确认弹窗
    exchangePointProducts(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          queryPointProductByGoodsId({
            goodsId: this.pointProductsForm.goodsId,
          }).then((res) => {
            res = res.data;
            if (res.code == 200) {
              console.log(res, "res");
              if (!res.data) {
                this.pointProductsForm = {
                  memberId: this.pointProductsForm.memberId,
                  coverUrl: "",
                  integral: "",
                };
                return;
              }
              this.pointProductsForm.integral = res.data.integral;
              this.pointProductsForm.coverUrl = res.data.coverUrl;
              this.pointProductsForm.goodsName = res.data.goodsName;
            } else {
              popup(res.msg, "error");
            }
          });
          this.confirmVisiable = true;
        }
      })
    },
    // 查询商品
    queryPointProductByMemberId() {
      queryPointProductBymemberId({
        memberId: this.pointProductsForm.memberId,
      }).then((res) => {
        console.log(memberId, "memberId1");
        res = res.data;
        if (res.code == 200) {
          this.options_pointProducts = res.data;
          if (!this.options_pointProducts.length) {
            popup("该会员积分数无法兑换任何商品", "warning");
            this.pointProductsForm.goodsId = "";
            return;
          }
        } else {
          popup(res.msg, "error");
        }
      });
    },
    // 兑换积分商品
    confirmExchangePointProducts() {
      saveExchangePointProductRecords({
            memberId: this.pointProductsForm.memberId,
            goodsId: this.pointProductsForm.goodsId,
            integral: this.pointProductsForm.integral,
            coverUrl: this.pointProductsForm.coverUrl,
          }
      ).then(res => {
        try {
          if (res) {
            res = res.data;
            if (res.code === 200) {
              popup("兑换成功", "success");
              this.pointProductsForm = {};
              this.closeExchangeForm();
            } else {
              popup(res.msg, "error");
            }
          }
        } catch (error) {
          popup(res.msg, "error");
        }
      });
    },
    // 会员信息查询
    queryMemberByPhone(phone) {
      queryMemberByPhone({phone: phone}).then(res => {
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
      this.detailSaleRecords = {};
      this.goodsNum_max = "";
      this.addVisable = true;
      this.getOptionSaleRecordsGoods();
    },
    // 减少商品数量
    redueGoodsNum(row) {
      console.log("row", row);
      if (parseInt(row.goodsNum) === 1) {
        console.log("最小数量", row.goodsNum);
        popup("已是最小数量", "warning")
        return
      }
      row.goodsNum = parseInt(row.goodsNum) - 1;
      this.newForm.sellTotal =
          parseInt(this.newForm.sellTotal) - parseInt(row.goodsNum);
      this.totalMoney = (
          parseFloat(this.totalMoney) - parseFloat(parseInt(row.goodsNum)
              * parseFloat(row.goodsPrice))
      ).toFixed(2);
      if (this.newForm.type === "1") {
        this.newForm.sellTotalmoney =
            parseFloat(this.totalMoney) * (0.9).toFixed(2);
      } else {
        this.newForm.sellTotalmoney = parseFloat(
            this.totalMoney
        ).toFixed(2);

      }
    },
    // 增加商品数量
    addGoodsNum(row) {
      queryGoodsById({id: row.goodsId}).then((res) => {
        res = res.data;
        if (res.code == 200) {
          if (row.goodsNum >= res.data.residueNum) {
            popup(
                "货架商品数量没这么多，请联系仓库管理者",
                "warning"
            );
            return;
          } else {
            row.goodsNum = parseInt(row.goodsNum) + 1;
            this.newForm.sellTotal =
                parseInt(this.newForm.sellTotal) + 1;
            this.totalMoney = (
                parseFloat(this.totalMoney) +
                parseFloat(row.goodsPrice)
            ).toFixed(2);
            if (this.newForm.type == "1") {
              this.newForm.sellTotalmoney =
                  parseFloat(this.totalMoney) * (0.9).toFixed(2);
            } else {
              this.newForm.sellTotalmoney = parseFloat(
                  this.totalMoney
              ).toFixed(2);
            }
          }
        } else {
          popup(res.msg, "error");
          return;
        }
      });
    },
    //   提交表单
    submitNewForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.newForm.sellTotal = this.newForm.detailSaleRecords.reduce((total, item) => {
            return total + parseInt(item.goodsNum);
          }, 0);
          console.log(this.newForm.sellTotal, "ss111111111111");
          // 计算商品总价会员09折
          if (this.newForm.type === "1") {
            this.newForm.sellTotalmoney =
                (this.newForm.detailSaleRecords.reduce((total, item) => {
                  return total + parseFloat(item.goodsNum) * parseFloat(item.goodsPrice);
                }, 0) * 0.9).toFixed(2);
            console.log(this.newForm.sellTotalmoney, "ss222222222222");
          } else {
            this.newForm.sellTotalmoney = this.newForm.detailSaleRecords.reduce((total, item) => {
              return total + parseFloat(item.goodsNum) * parseFloat(item.goodsPrice);
            }, 0).toFixed(2);
          }
          console.log(this.newForm.sellTotalmoney, "sssssssssssss");
          if (this.newForm.sellTotalmoney <= 0) {
            popup("商品数量不能为0", "warning");
            return;
          }
          // 提交表单
          saveSaleRecords(this.newForm).then(res => {
            try {
              if (res) {
                res = res.data;
                if (res.code === 200) {
                  popup("支付成功", "success");
                  this.closeNewForm(formName);
                } else {
                  popup(res.msg, "error");
                }
              }
            } catch (error) {
              popup(res.msg, "error");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 关闭表单
    closeNewForm(formName) {
      this.$refs[formName].resetFields();
      this.newVisable = false;
      this.newForm = {
        cn: "",
        sellway: "1",
        sellTotal: "",
        sellTotalmoney: "",
        type: "0",
        memberPhone: "",
        detailSaleRecords: [],
        info: ""
      }
    },
    // 关闭确认弹窗
    closeConfirmForm() {
      this.confirmVisiable = false;
    },
    // 关闭添加商品弹窗
    closeAddForm() {
      this.addVisable = false;
    },
    //添加商品
    addGoods() {
      // 1. 检查商品数量
      if (!this.detailSaleRecords?.goodsNum || this.detailSaleRecords.goodsNum === '0') {
        popup("商品数量不能为0", "warning");
        return;
      }

      // 2. 确保 detailSaleRecords 存在
      if (!this.detailSaleRecords || !this.detailSaleRecords.goodsId) {
        popup("请先选择商品", "warning");
        return;
      }

      // 3. 确保 newForm.detailSaleRecords 已初始化
      if (!Array.isArray(this.newForm.detailSaleRecords)) {
        this.newForm.detailSaleRecords = [];
      }

      // 4. 检查商品是否已存在
      const existingIndex = this.newForm.detailSaleRecords.findIndex(
          item => item.goodsId === this.detailSaleRecords.goodsId
      );

      if (existingIndex >= 0) {
        // 商品已存在，更新数量
        this.newForm.detailSaleRecords[existingIndex].goodsNum =
            parseInt(this.newForm.detailSaleRecords[existingIndex].goodsNum) +
            parseInt(this.detailSaleRecords.goodsNum);
      } else {
        // 商品不存在，添加新记录
        this.newForm.detailSaleRecords.unshift({
          ...this.detailSaleRecords,
          goodsNum: parseInt(this.detailSaleRecords.goodsNum)
        });
      }

      // 5. 关闭弹窗
      this.addVisable = false;

    },
    //   查询商品信息
    getOptionSaleRecordsGoods(formName) {
      getOptionSaleRecordsGoods().then(res => {
        try {
          if (res) {
            res = res.data;
            if (res.code === 200) {
              this.options_saleRecordsAddGoods = res.data;
              if (this.options_saleRecordsAddGoods.length > 0) {
                this.addVisable = true;
              }
            } else {
              popup("目前没有可售卖的商品", "error")
            }
          }
        } catch (error) {
          popup(res.msg, "error")
        }
      })
    },
    //   查询商品库存
    queryGoodsById() {
      queryGoodsById({id: this.detailSaleRecords.goodsId}).then((res) => {
        try {
          if (res) {
            res = res.data;
            if (res.code === 200) {

              this.detailSaleRecords.goodsPrice = res.data.purchashPrice;
              this.detailSaleRecords.goodsName = res.data.name;
              this.goodsNum_max = res.data.residueNum;
            } else {
              this.$message.error(res.msg || "商品信息查询失败");
            }
          }
        } catch (error) {
          this.$message.error("商品信息查询异常");
        }
      });
    },
    //   移除商品
    removedetailRecords(row) {
      this.$confirm("确定删除这条记录？", "警示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            this.newForm.sellTotal =
                parseInt(this.newForm.sellTotal) - row.goodsNum;
            this.totalMoney = (
                parseFloat(this.totalMoney) -
                parseFloat(
                    parseInt(row.goodsNum) * parseFloat(row.goodsPrice)
                )
            ).toFixed(2);
            if (this.newForm.type === "1") {
              this.newForm.sellTotalmoney =
                  parseFloat(this.totalMoney) * (0.9).toFixed(2);
            } else {
              this.newForm.sellTotalmoney = parseFloat(
                  this.totalMoney
              ).toFixed(2);
            }
            for (var i in this.newForm.detailSaleRecords) {
              if (
                  this.newForm.detailSaleRecords[i].goodsId ===
                  row.goodsId
              ) {
                this.newForm.detailSaleRecords.splice(i, 1);
                return;
              }
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作",
            });
          });
    },
    //   销售记录
    saleRecordBtn() {
      this.$router.push({path: "/sale_management/sale_records/List"})
    },
    //   积分兑换记录
    exchangeRecordBtn() {
      this.$router.push({path: "/sale_management/exchange_point_products_records/list"})
    }
  },
}
</script>
<style>
/* 页面背景图片 */
#sale_cmd {
  background: url("@/assets/img/01.jpg") center top / cover no-repeat;
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

.el-col {
  float: left;
  width: 80%;
  margin: 0 auto;
}

.custom-form {
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
}

.center-item {
  width: 60%; /* 设置宽度 */
  text-align: center; /* 文本居中 */
}
</style>