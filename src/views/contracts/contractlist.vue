<template>
    <div class="fillcontain">
        <div>
            <el-form
                    :inline="true"
                    ref="search_data"
                    :model='search_data' >
                <el-form-item prop='crt_name' label="合同名称:">
                    <el-input type="crt_name"
                              placeholder="请输入名称-支持模糊查询"
                              prefix-icon="el-icon-search"
                              v-model="search_data.crt_name" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size ="small" icon="search" @click='getTableDetail()'>搜索</el-button>
                </el-form-item>
                <el-form-item class="btnRight">
                    <el-button type="primary" size ="small" icon="view" @click='onAddContract()'>添加合同</el-button>
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
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="crt_name"
                        label="合同名称"
                        align='center'
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="crt_fileno"
                        label="档案编号"
                        align='center'
                        width="170">
                </el-table-column>
                <el-table-column
                        prop="crt_serialnumber"
                        label="合同编号"
                        align='center'
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="crt_customer.customer_name"
                        label="客户名称"
                        align='center'
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="crt_type"
                        label="合同类型"
                        align='center'
                        width="80">
                    <template slot-scope='scope'>
                        <span> {{ maptype[scope.row.crt_type] }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="crt_amt"
                        label="合同金额"
                        align='center'
                        width="170">
                    <template slot-scope="scope">
                        <span> {{ scope.row.crt_amt }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="crt_prostate"
                        label="执行状态"
                        align='center'
                        width="80">
                    <template slot-scope='scope'>
                        <span> {{ mapprostate[scope.row.crt_prostate] }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="crt_signedstate"
                        label="签订状态"
                        align='center'
                        width="80">
                    <template slot-scope='scope'>
                        <span> {{ mapsingstate[scope.row.crt_signedstate] }}</span>
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
                                type="warning"
                                icon='edit'
                                size="small"
                                @click='onEditContract(scope.row)'
                        >编辑</el-button>
                        <el-button
                                type="danger"
                                icon='delete'
                                size="small"
                                @click='onDeleteContract(scope.row)'
                        >删除</el-button>
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
        <ContractFound :dialog='dialog' :form='constractForm' @update="getTableDetail"></ContractFound>
    </div>
</template>

<script>
    import ContractFound from "@/components/ContractFound";
    import { getContractInfo, deleteContractInfo, } from '@/api/api'

    export default {
        name: "contractlist",
        data() {
            return {
                maptype: {
                    1:'软件开发',
                    2:'销售代理',
                    3:'自有产品',
                    4:'系统集成',
                    5:'人员外包'} ,
                mapprostate: {
                    '00':'未开始',
                    2:'销售代理',
                    3:'自有产品',
                    4:'系统集成',
                    5:'人员外包'} ,
                mapsingstate: {
                    '00':'未签订',
                    2:'销售代理',
                    3:'自有产品',
                    4:'系统集成',
                    5:'人员外包'} ,
                tableData: [],
                allTableData: [],
                filterTableData: [],
                dialog: {
                    show: false,
                    title: "",
                    option: "edit",
                    id: -1
                },
              constractForm: {

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
                    crt_name: '',
                },
                filter_data: {
                  customer_stat: '00',
                }
            };
        },
        components: {
            ContractFound
        },
        created() {
            this.getTableDetail();
        },
        methods: {
            getTableDetail() {
                getContractInfo(this.search_data).then(res => {
                    this.allTableData = res.data;
                    this.filterTableData = res.data;
                    // 设置分页数据
                    this.setPaginations();
                })
            },
            onAddContract() {
                // 添加
                this.dialog = {
                    show: true,
                    title: "添加合同信息",
                    option: "addContract"
                };
                this.constractForm = {
                  crt_name: "",
                  crt_serialnumber: "",
                  crt_type: "",
                  crt_amt: 0.00,
                  crt_currency: "CNY",
                  crt_salesrep:"",
                  crt_salesarea: "",
                  crt_signeddate: "",
                  crt_registerdate: Date.now(),
                  crt_effectivedate: "",
                  crt_enddate: "",
                  crt_desc: "",
                  crt_customer: ""
                };
            },
            onEditContract(row) {
              this.dialog = {
                show: true,
                title: "编辑合同信息",
                option: "editContract",
                id: row.id
              };
              this.constractForm = {
                crt_name:row.crt_name,
                crt_serialnumber:row.crt_serialnumber,
                crt_type:row.crt_type,
                crt_amt:row.crt_amt,
                crt_currency:row.crt_currency,
                crt_salesrep:row.crt_salesrep,
                crt_salesarea:row.crt_salesarea,
                crt_signeddate:row.crt_signeddate,
                crt_registerdate:row.crt_registerdate,
                crt_effectivedate:row.crt_effectivedate,
                crt_enddate:row.crt_enddate,
                crt_desc:row.crt_desc,
                crt_customer: row.crt_customer.id
              };
            },
            onDeleteContract(row) {
              this.$confirm('此操作将永久删除合同记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                deleteContractInfo(row.id).then(res => {
                  this.$message({
                    type: 'success',
                    message: '删除合同成功!'
                  });
                  this.getTableDetail();
                });
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                });
              });
              // deleteContractInfo(row.id).then(res => {
              //   this.$message("删除合同成功");
              //   this.getTableDetail();
              // });
            },
            onShowInfo(row) {
              this.$message({
                message: "查看页面正在开发中,请耐心等候！",
                type: "info"
              });
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
