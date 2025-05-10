<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>销售管理</el-breadcrumb-item>
      <el-breadcrumb-item>积分兑换记录</el-breadcrumb-item>
    </el-breadcrumb>
    <br>
    <el-row style="display: flex; align-items: center; ">
      <el-col :span="4">
        <el-input
            placeholder="兑换订单编号"
            v-model="searchForm.cn"
            style="width: 300px;text-align: center;float: left;"
        >
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-select
            v-model="searchForm.memberPhone"
            placeholder="请选择会员账号"
            style="width: 150px"
            clearable
        >
          <el-option
              v-for="item in options_memberPhone"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          >
          </el-option>
        </el-select>
      </el-col>
      <!-- 销售时间 -->
      <el-col :span="10">
        <span>销售时间：</span>
        <el-date-picker
            style="width: 140px ;"
            v-model="searchForm.startTime"
            type="date"
            value-format="YYYY/MM/DD"
            placeholder="起始时间"
        >
        </el-date-picker>
        -
        <el-date-picker
            v-model="searchForm.endTime"
            style="width: 140px"
            value-format="YYYY/MM/DD"
            type="date"
            placeholder="结束时间"
        >
        </el-date-picker>
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
      <el-table
          :data="tableData"
          style="width: 100%;"
          empty-text="暂无数据"

      >
        <el-table-column
            label="编号"
            prop="cn"
        >
        </el-table-column>
        <el-table-column
            label="商品封面"
            prop="goodsCoverUrl"
        >
          <template v-slot="scope">
            <img
                :src="BaseApi + scope.row.goodsCoverUrl"
                style="width: 50px;height: 50px;"
                alt="商品封面"
            />
          </template>
        </el-table-column>
        <el-table-column
            label="商品"
            prop="goodsName"
        >
        </el-table-column>
        <el-table-column
            label="积分"
            prop="integral"
        >
        </el-table-column>
        <el-table-column
            label="会员账号"
            width="150"
            prop="memberPhone"
        >
        </el-table-column>
        <el-table-column
            label="兑换时间"
            prop="updateTime"
        >
        </el-table-column>
        <el-table-column
            label="操作者"
            width="150"
            prop="updateby"
        >
        </el-table-column>
        <el-table-column
            label="操作"
            width="150">
          <template v-slot="scope">
            <el-button type="danger" size="mini" @click="del(scope.row.cn)" style="height: 28px;width: 40px">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    <div class="pagination">
      <el-pagination
          background
          :current-page = "searchForm.current"
          :page-sizes="[5, 10, 20]"
          :pager-count="searchForm.pages"
          :total="searchForm.total"
          :page-size-options="[5, 10, 20]"
          :page-size.sync="searchForm.pageSize"
          :current-page.sync="searchForm.currentPage"
          :next-text="'下一页'"
          :prev-text="'上一页'"
          :page-size="searchForm.pages"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="total,prev, pager, next, sizes"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {
  queryOptionsMemberPhone,
  queryPageByQoExchangePointProducts,
  delExchangePointProducts
} from '@/api/sele_management/exchange_point_products/exchangePointProductsApi'
import {popup} from "@/assets/js/common";

export default {
  data() {
    return {
      BaseApi: this.$store.state.BaseApi,
      searchForm: {
        pageSize: 5,
      },
      tableData: [],
      options_memberPhone: [],
    }
  },
  methods: {
    // 查询会员账号
    queryOptionsMemberPhone() {
      queryOptionsMemberPhone().then((res) => {
        res = res.data
        if (res.code === 200) {
          this.options_memberPhone = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 删除积分兑换记录
    del(cn) {
      this.$confirm('此操作将永久删除该积分兑换记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delExchangePointProducts({cn: cn}).then((res) => {
          res = res.data
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.init()
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 查询积分兑换记录
    init() {
      // 校验查询时间条件
      if (this.searchForm.startTime > this.searchForm.endTime) {
        console.log(this.searchForm.startTime, this.searchForm.endTime, "开始时间不能大于结束时间")
        popup("开始时间不能大于结束时间")
        return
      }
      queryPageByQoExchangePointProducts(this.searchForm).then((res) => {
        res = res.data
        if (res.code === 200) {
          this.tableData = res.data.records
          this.searchForm.total = res.data.total
          this.searchForm.pageSize = res.data.size
          this.searchForm.currentPage = res.data.current
        } else {
          this.$message.error(res.message)
        }
      })
    },
    submitSearchForm() {
      this.init()
    },
    handleCurrentChange(val) {
      this.searchForm.currentPage = val
      this.init()
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.init()
    }
    },
  mounted() {
    this.queryOptionsMemberPhone()
    this.init()
  }
}
</script>
<style >
.pagination {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 20px;
  margin-right: 20px;
  float: right;
}
.el-col {
  margin-bottom: 20px;
}
</style>