<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>销售管理</el-breadcrumb-item>
      <el-breadcrumb-item>销售记录</el-breadcrumb-item>
    </el-breadcrumb>
    <br>
    <el-row style="text-align: center;  display: flex;align-items: center;">
      <!-- 销售编号 -->
      <el-col :span="4">
        <el-input
            style="width:130px ;text-align: center"
            placeholder="销售编号"
            v-model="searchForm.cn">
        </el-input>
      </el-col>
      <!-- 销售时间 -->
      <el-col :span="10">
        <span>销售时间：</span>
        <el-date-picker
            style="width: 140px ;"
            v-model="searchForm.startSellTime"
            type="date"
            value-format="YYYY/MM/DD"
            placeholder="起始时间"
        >
        </el-date-picker>
        -
        <el-date-picker
            v-model="searchForm.endSellTime"
            style="width: 140px"
            value-format="YYYY/MM/DD"
            type="date"
            placeholder="结束时间"
        >
        </el-date-picker>
      </el-col>
      <!--顾客类型-->
      <el-col :span="4">
        <el-select
            style="width: 120px"
            placeholder="顾客类型"
            v-model="searchForm.type"
            clearable
        >
          <el-option label="会员" value="1"></el-option>
          <el-option label="非会员顾客" value="0"></el-option>
        </el-select>
      </el-col>
      <!--支付方式-->
      <el-col :span="4">
        <el-select
            style="width: 120px"
            v-model="searchForm.sellway"
            placeholder="支付方式"
            clearable
        >
          <el-option label="微信支付" value="1"></el-option>
          <el-option label="支付宝支付" value="0"></el-option>
          <el-option label="银行卡支付" value="3"></el-option>
          <el-option label="现金支付" value="2"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <br>
    <!--搜索按钮-->
    <el-row style="text-align: center; display: flex; align-items: center; position: relative; ">
      <el-col :span="1">
        <el-button type="primary" @click="submitSearchForm" style="width:100px;height:40px ;">搜索</el-button>
      </el-col>
    </el-row>
    <br>
    <!--表格-->
    <div class="table">
      <el-table
          size="medium"
          :data="tableData"
          style="width: 100%"
          :border="true"
          :row-key="row =>  row.cn"
          empty-text="暂无数据"
      >
        <el-table-column
            label="销售编号"
            prop="cn"
            align="center"
            width="200"
        >
        </el-table-column>
        <el-table-column
            label="销售数量"
            prop="sellTotal"
            align="center"
            width="100"
        >
        </el-table-column>
        <el-table-column
            align="center"
            width="100"
            label="销售总额"
            prop="sellTotalmoney">
        </el-table-column>
        <el-table-column
            align="center"
            width="200"
            label="销售时间"
            prop="sellTime">
        </el-table-column>
        <el-table-column
            label="顾客类型"
            align="center"
            width="100"
            prop="type">
          <template v-slot="scope">
            <el-tag v-if="scope.row.type === '1'" type="success" effect="dark">会员</el-tag>
            <el-tag v-else type="warning">非会员</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            width="100"
            label="销售员"
            prop="sellby">
        </el-table-column>
        <el-table-column
            label="支付方式"
            prop="sellway"
            align="center"
            width="100"
        >
          <template v-slot="scope">
            <el-tag v-if="scope.row.sellway === '1'" effect="dark" type="success">微信</el-tag>
            <el-tag v-else-if="scope.row.sellway === '0'" effect="dark" type="warning">支付宝</el-tag>
            <el-tag v-else-if="scope.row.sellway === '3'" effect="dark" type="info">银行卡</el-tag>
            <el-tag v-else type="danger">现金支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="备注"
            :show-overflow-tooltip="true"
            prop="info">
        </el-table-column>
        <el-table-column
            label="操作"
            width="150">
          <template v-slot="scope">
            <el-button type="success" size="mini" @click="handleEdit(scope.$index)" style="height: 28px;width: 40px">
              明细
            </el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row.cn)" style="height: 28px;width: 40px">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="pagination">
      <el-pagination
          background
          :page-size="searchForm.pageSize"
          :current-page.sync="searchForm.currentPage"
          :total="searchForm.total"
          :page-sizes="[5, 10, 20]"
          layout="total,sizes, prev, pager, next,jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
      >
      </el-pagination>
    </div>
    <!--销售订单明细弹窗-->
    <el-dialog
        title="销售订单明细"

    >

    </el-dialog>
  </div>
</template>

<script>

import {popup} from "@/assets/js/common";
import {delSaleRecords, queryPageByQoSaleRecords} from "@/api/sele_management/seleRecordeApi";

export default {
  data() {
    return {
      searchForm: {
        pageSize: 5,
      },
      tableData: [],
      saleRecordForm: {
        cn: "",
        sellway: "",
        info: "",
        sellTotal: "",
        sellTotalmoney: "",
        type: "0",
        detailSaleRecords: [],
      },
    }
  },
  methods: {
    init() {
      if (this.searchForm.startSellTime > this.searchForm.endSellTime) {
        popup.error('开始时间不能大于结束时间');
        return;
      }
      // 调用接口查询数据
      queryPageByQoSaleRecords(this.searchForm).then((res) => {
        res = res.data;
        if (res.code === 200) {
          this.tableData = res.data.records
          this.searchForm.total = res.data.total
          this.searchForm.pageSize = res.data.size
          this.searchForm.currentPage = res.data.current
        }
      })
    },
    submitSearchForm() {
      this.init();
    },
    handleEdit(index) {
      console.log(index);
    },
    // 删除
    handleDelete(cn) {
      this.$confirm('此操作将永久删除该销售记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSaleRecords({cn: cn}).then(res => {
          res = res.data;
          if (res.code === 200) {
            popup("删除成功", "success")
            this.init();
          } else {
            popup("删除失败", "error")
            this.init();
          }
        })
      })
          .catch(() => {
            popup("已取消删除", "error");
          });
    },
    handleCurrentChange(val) {
      console.log(val);
      this.searchForm.currentPage = val;
      this.init();
    },
    handleSizeChange(val) {
      console.log(val);
      this.searchForm.pageSize = val;
      this.init();
    }
  },
  mounted() {
    this.init();
  }
}
</script>

<style>
.date-picker-group {
  display: flex;
  align-items: center;
}

.fixed-date-picker {
  width: 140px !important;
  margin: 0 5px;
}

.pagination {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 20px;
  margin-right: 20px;
  float: right;
}

.table {
  width: 100%;
}
</style>