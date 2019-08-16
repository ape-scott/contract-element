<template>
  <div class="app-container">
    <!--表格渲染-->
    <div style="display: inline-block;;margin: 0px 10px 10px 10px;float: right">
      <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="toAdd">新增</el-button>
      <addUserForm ref="form" :service_types="service_types"/>
    </div>
    <el-table ref="table" :data="userdata" size="small" border style="width: 100%;">
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <div>{{ scope.$index + 1 }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="150" align="center"/>
      <el-table-column prop="jobtitle" label="职位" width="150" align="center"/>
      <el-table-column prop="mobile" label="手机号码" width="200" align="center"/>
      <el-table-column prop="telephone" label="座机号码" width="250" align="center"/>
      <el-table-column prop="email" label="电子邮箱" width="250" align="center"/>
      <el-table-column prop="fax" label="传真号码" width="250" align="center"/>
      <el-table-column label="操作" min-width="150px" align="center">
        <template slot-scope="scope">
          <el-button  size="mini" type="success" @click="toEdit(scope.row.id)" style="margin: 5px">编辑</el-button>
          <el-popover
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
<!--    <el-pagination-->
<!--      :total="total"-->
<!--      style="margin-top: 8px;"-->
<!--      layout="total, prev, pager, next, sizes"-->
<!--      @size-change="sizeChange"-->
<!--      @current-change="pageChange"/>-->
  </div>
</template>

<script>
import addUserForm from './adduserform'
import { getCustomerUserDetail, deleteCustomerUser } from '@/api/api'
export default {
  name: 'user',
  components: { addUserForm },
  data() {
    return {
      isadd: true,
      delLoading: false,
      service_types: [],
      userdata: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      getCustomerUserDetail(this.$route.query.id).then(res => {
        // console.log(res.data)
        this.userdata = res.data;
      })
    },
    toAdd() {
      this.$refs.form.is_add = true
      this.$refs.form.form = { name: '', jobtitle: '', mobile: '', telephone: '', email: '', fax: '' ,
        customer: this.$route.query.id, user: this.$store.getters.user.user_id}
      this.$refs.form.dialog = true
    },
    toEdit(id) {
      this.$refs.form.is_add = false
      getCustomerUserDetail(this.$route.query.id, id).then(res => {
        // this.$refs.form.form.id = res.id
        // // this.$refs.form.form.name = res.name
        // this.$refs.form.name = '111111'
        // this.$refs.form.form.jobtitle = res.jobtitle
        // this.$refs.form.form.mobile = res.mobile
        // this.$refs.form.form.telephone = res.telephone
        // this.$refs.form.form.email = res.email
        // this.$refs.form.form.fax = res.fax
        // this.$refs.form.form.customer = res.customer
        // this.$refs.form.form.user = res.user
        this.$refs.form.form = res.data[0];
        this.$refs.form.dialog = true;
      })
    },
    subDelete(id) {
      this.delLoading = true
      deleteCustomerUser(id).then(res => {
        this.$refs[id].doClose()
        this.init()
        this.$message({
          showClose: true,
          type: 'success',
          message: '删除成功!',
          duration: 2500
        })
      }).catch(err => {
        this.$refs[id].doClose()
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.app-container{
  margin: 0px 0px;
}
</style>
