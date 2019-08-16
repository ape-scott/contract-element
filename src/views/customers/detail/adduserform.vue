<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="is_add ? '新增联系人' : '编辑联系人'" width="550px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="职位" prop="jobtitle">
        <el-input v-model="form.jobtitle" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="form.mobile" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="座机号码" prop="telephone">
        <el-input v-model="form.telephone" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="form.email" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="传真号码" prop="fax">
        <el-input v-model="form.fax" style="width: 370px;"/>
      </el-form-item>
<!--      <el-form-item label="企业用户id" prop="fax">-->
<!--        <el-input v-model="form.customer" style="width: 370px;"/>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="用户id" prop="fax">-->
<!--        <el-input v-model="form.user" style="width: 370px;"/>-->
<!--      </el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { addCustomerUser, updateCustomerUser } from '@/api/api'
export default {
  props: {
    service_types: {
      type: Array,
      default: null
    }
  },
  data() {
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    return {
      is_add: true,
      loading: false,
      dialog: false,
      form: {},
      rules: {
        name: [
          { required: true, message: "联系人姓名必填！", trigger: "blur" }
        ],
        mobile: [
          { required: true, pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: "email必填！", trigger: "blur" },
          { validator: checkEmail, trigger: "blur"  }

        ]

      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.is_add) {
            this.doAdd()
          } else this.doEdit()
        } else {
          return false
        }
      })
    },
    doAdd() {
      console.log(this.form)
      console.log(this.$refs.id)
      addCustomerUser(this.form).then(res => {
        this.resetForm()
        this.$message({
          showClose: true,
          type: 'success',
          message: '添加成功!',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    doEdit() {
      updateCustomerUser(this.form.id, this.form).then(res => {
        this.resetForm()
        this.$message({
          showClose: true,
          type: 'success',
          message: '修改成功!',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { name: '', jobtitle: '', mobile: '', telephone: '', email: '', fax: '' }
    }
  }
}
</script>

<style scoped>

</style>
