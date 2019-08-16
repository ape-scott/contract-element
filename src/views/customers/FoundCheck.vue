<template>
    <div class="fillcontain">
        <div>
            <el-form
                :inline="true"
                ref="search_data"
                :model='search_data' >
<!--                <el-form-item label="创建时间筛选:">-->
<!--                    <el-date-picker-->
<!--                        v-model="search_data.startTime"-->
<!--                        type="datetime"-->
<!--                        placeholder="选择开始时间">-->
<!--                    </el-date-picker> &#45;&#45;-->
<!--                    <el-date-picker-->
<!--                        v-model="search_data.endTime"-->
<!--                        type="datetime"-->
<!--                        placeholder="选择结束时间">-->
<!--                    </el-date-picker>-->
<!--                </el-form-item>-->
                <el-form-item prop='customer_name' label="客户公司名称:">
                    <el-input type="customer_name"
                              placeholder="请输入名称-支持模糊查询"
                              prefix-icon="el-icon-search"
                              v-model="search_data.customer_name" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size ="small" icon="search" @click='getProfile()'>搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                :data='tableData'
                empty-text="暂无相关数据"
                max-height="758"
                border
                :default-sort = "{prop: 'date', order: 'descending'}"
                style="width: 100%">
                <el-table-column
                        type="index"
                        label="序号"
                        align='center'
                        width="70">
                </el-table-column>
                <el-table-column
                        prop="add_time"
                        label="创建时间"
                        align='center'
                        width="250"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px">{{ scope.row.add_time }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="customer_name"
                        label="客户名称"
                        align='center'
                        width="300">
                </el-table-column>
                <el-table-column
                        prop="customer_type"
                        label="客户类型"
                        align='center'
                        width="180">
                    <template slot-scope="scope">
                        <span> {{ maptype[scope.row.customer_type] }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="customer_level"
                        label="客户级别"
                        align='center'
                        width="180">
                    <template slot-scope="scope">
                        <span> {{ maplevel[scope.row.customer_level] }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="customer_addr"
                        label="客户地址"
                        align='center'
                        width="440">
                </el-table-column>
                <el-table-column
                        prop="customer_stat"
                        label="状态"
                        align='center'
                        width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.customer_stat == '00'" style="color:#FFAA00">待审核</span>
                        <span v-else-if="scope.row.customer_stat == '10'" style="color:#00CC00">正常</span>
                        <span v-else style="color:red">已删除</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="operation"
                    align='center'
                    label="操作"
                    fixed="right"
                    width="280">
                    <template slot-scope='scope'>
                        <el-button
                                type="info"
                                icon='edit'
                                size="small"
                                @click='onShowInfo(scope.row)'
                        >查看</el-button>
                        <el-button
                            type="success"
                            icon='edit'
                            size="small"
                            @click='onCheckCustomer(scope.row)'
                        >审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
             <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                            v-if='paginations.total > 0'
                            :page-sizes="paginations.page_sizes"
                            :page-size="paginations.page_size"
                            :layout="paginations.layout"
                            :total="paginations.total"
                            :current-page.sync='paginations.page_index'
                            @current-change='handleCurrentChange'
                            @size-change='handleSizeChange'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 弹框页面 -->
        <DialogFound :dialog='dialog' :form='customerForm' @update="getProfile"></DialogFound>
    </div>
</template>

<script>
import DialogFound from "@/components/DialogFound";
import { getCustomerInfo, deleteCustomerInfo } from '@/api/api';
import { formatDate } from '@/api/tools';

export default {
  name: "fundlist",
  data() {
    return {
      maplevel: {
          1:'VIP客户',
          2:'战略客户',
          3:'潜力客户',
          4:'核心客户',
          5:'重要客户',
          6:'一般客户',
          7:'合作伙伴'} ,
      maptype: {
          1:"管理性银行",
          2:"政策性银行",
          3:"股份制商业银行",
          4:"外资银行",
          5:"城市商业银行",
          6:"城市信用社",
          7:"农联社",
          8:"村镇银行",
          9:"金融监管机构",
          10:"政府",
          11:"企业",
          12:"保险",
          13:"证券",
          14:"合作伙伴",
          15:"竞争对手",
          99:"其他"
      },
      tableData: [],
      allTableData: [],
      filterTableData: [],
      dialog: {
        show: false,
        title: "",
        option: "edit",
          id: -1
      },
      customerForm: {
        customer_name: "",
        customer_sh_name: "",
        customer_old_name: "",
        customer_addr: "",
        customer_type: "",
        customer_level: "",
        customer_desc: ""
      },
      //需要给分页组件传的信息
      paginations: {
        page_index: 1, // 当前位于哪页
        total: 0, // 总数
        page_size: 5, // 1页显示多少条
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      },
      search_data: {
        customer_name: "",
        customer_type: "",
        customer_level:"",
        customer_stat: '00'
      }
    };
  },
    components: {
    DialogFound
    },
  created() {
    this.getProfile();
  },
  methods: {
    getProfile() {
      // 获取表格数据
        getCustomerInfo(this.search_data).then(res => {
        // this.tableData = res.data;
        this.allTableData = res.data;
        this.filterTableData = res.data;
        // 设置分页数据
        this.setPaginations();
      });
    },
    onCheckCustomer(row) {
      // 编辑
      this.dialog = {
        show: true,
        title: "审核客户信息",
        option: "checkCustomer",
          id: row.id
      };
        this.customerForm = {
            customer_name: row.customer_name,
            customer_sh_name: row.customer_sh_name,
            customer_old_name: row.customer_old_name,
            customer_addr: row.customer_addr,
            customer_type: row.customer_type,
            customer_level: row.customer_level,
            customer_desc: row.customer_desc,
          customer_stat: row.customer_stat
        };
    },
    onDeleteCustomer(row) {
      // 删除
      this.$confirm('此操作将永久删除客户记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCustomerInfo(row.id).then(res => {
          this.$message({
            type: 'success',
            message: '删除客户信息成功!'
          });
          this.getProfile();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    onShowInfo(row) {
      this.dialog = {
        show: true,
        title: "查看客户信息",
        option: "infoCustomer",
        id: row.id
      };
      this.customerForm = {
        customer_name: row.customer_name,
        customer_sh_name: row.customer_sh_name,
        customer_old_name: row.customer_old_name,
        customer_addr: row.customer_addr,
        customer_type: row.customer_type,
        customer_level: row.customer_level,
        customer_desc: row.customer_desc,
        customer_stat: row.customer_stat
      };
    },
    onAddCustomer() {
      // 添加
      this.dialog = {
        show: true,
        title: "添加客户信息",
        option: "addCustomer"
      };
      this.customerForm = {
          customer_name: "",
          customer_sh_name: "",
          customer_old_name: "",
          customer_addr: "",
          customer_type: "",
          customer_level: "",
          customer_desc: ""
      };
    },
    handleCurrentChange(page) {
      // 当前页
      let sortnum = this.paginations.page_size * (page - 1);
      let table = this.allTableData.filter((item, index) => {
        return index >= sortnum;
      });
      // 设置默认分页数据
      this.tableData = table.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    handleSizeChange(page_size) {
      // 切换size
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    setPaginations() {
      // 总页数
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 10;
      // 设置默认分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    onScreeoutMoney() {
      // 筛选
      if (!this.search_data.startTime || !this.search_data.endTime) {
        this.$message({
          type: "warning",
          message: "请选择时间区间"
        });
        this.getProfile();
        return;
      }
      const stime = this.search_data.startTime.getTime();
      const etime = this.search_data.endTime.getTime();
      this.allTableData = this.filterTableData.filter(item => {
        let date = new Date(item.date);
        let time = date.getTime();
        return time >= stime && time <= etime;
      });
      // 分页数据
      this.setPaginations();
    }
  }
};
</script>
<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>
