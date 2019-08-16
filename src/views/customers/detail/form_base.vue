<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="150px" style="margin: 20px 20px">
      <el-row>
        <el-col :span="12">
          <el-form-item prop='customer_name' label="客户公司名称:">
            <el-input v-model="form.customer_name" :readonly="is_Readonly" style="width: 300px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop='customer_sh_name' label="客户公司简称:">
            <el-input v-model="form.customer_sh_name" :readonly="is_Readonly" style="width: 300px;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop='customer_old_name' label="客户公司曾用名:">
            <el-input v-model="form.customer_old_name" :readonly="is_Readonly" style="width: 300px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="customer_stat" label="客户审核状态:">
            <el-select v-model="form.customer_stat" :disabled="true" style="width: 300px;" placeholder="客户审核状态">
              <el-option
                      v-for="item in customer_status"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="客户类别:" prop="customer_type">
            <el-select v-model="form.customer_type" :disabled="is_Readonly" style="width: 300px;" placeholder="客户类别">
              <el-option
                      v-for="item in format_type_list"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户级别:" prop="customer_level">
            <el-select v-model="form.customer_level" :disabled="is_Readonly" style="width: 300px;" placeholder="客户级别">
              <el-option
                      v-for="item in format_level_list"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple-dark">
          <el-form-item prop='customer_addr' label="客户地址:">
            <el-input v-model="form.customer_addr" :readonly="is_Readonly" style="width: 720px;"placeholder="请输入客户地址">
            </el-input>
          </el-form-item>
        </div></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><div class="grid-content bg-purple-dark">
          <el-form-item prop='customer_desc' label="备注:">
            <el-input
                    type="textarea"
                    :rows="4"
                    :readonly="is_Readonly"
                    style="width: 720px;"
                    placeholder="请输入备注"
                    v-model="form.customer_desc">
            </el-input>
          </el-form-item>
        </div></el-col>
      </el-row>
      <el-form-item>
        <div style="display: inline-block;margin: 20px 0px;float: left">
          <el-button v-if="button == 'edit' && form.customer_stat == '10'" type="primary" @click="edit">编辑</el-button>
          <el-button v-if="button == 'save'" type="success" @click="doSubmit">保存</el-button>
          <el-button v-if="button == 'save'" type="warning" @click="cancel">取消</el-button>
          <el-button v-if="button == 'edit'" @click="closeTag">返回</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { getCustomerDetail, updateCustomerInfo } from '@/api/api'
  import { parseTime } from '@/api/tools'
export default {
  name: 'Base',
  data() {
    return {
      format_type_list: [
        {value: 1,label: '管理性银行'},
        {value: 2,label: '政策性银行'},
        {value: 3,label: '股份制商业银行'},
        {value: 4,label: '外资银行'},
        {value: 5,label: '城市商业银行'},
        {value: 6,label: '城市信用社'},
        {value: 7,label: '农联社'},
        {value: 8,label: '村镇银行'},
        {value: 9,label: '金融监管机构'},
        {value: 10,label: '政府'},
        {value: 11,label: '企业'},
        {value: 12,label: '保险'},
        {value: 13,label: '证券'},
        {value: 14,label: '合作伙伴'},
        {value: 15,label: '竞争对手'},
        {value: 99,label: '其他'}
      ],
      format_level_list: [{value: 1,label: 'VIP客户'},
        {value: 2, label: '战略客户'},
        {value: 3, label: '潜力客户'},
        {value: 4, label: '核心客户'},
        {value: 5, label: '重要客户'},
        {value: 6, label: '一般客户'},
        {value: 7, label: '合作伙伴'}],
      customer_status: [
        {value: '00',label: '待审核'},
        // {value: '01',label: '修改待审核'},
        // {value: '02',label: '删除待审核'},
        {value: '10',label: '正常'},
        {value: '20',label: '已删除'},
      ],
      loading: false,
      button: 'edit',
      form: {

      },
      is_Readonly: true,
      rules: {

      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  computed: {
    watchstatue(){
      return this.form.customer_stat;
    }
  },
  watch: {
    watchstatue(val) {
      if(val == '10'){
        this.$emit('change-availabel', false)
      }
    }
  },
  methods: {
    init() {
      getCustomerDetail(this.$route.query.id).then(res => {
        this.form = res.data;
        this.form.add_time = parseTime(this.form.add_time);
        this.form.modify_time = parseTime(this.form.modify_time);
      })
    },
    closeTag() {
      this.$router.go(-1)
    },
    cancel() {
      this.button = 'edit'
      this.is_Readonly = true
    },
    edit() {
      this.button = 'save'
      this.is_Readonly = false
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          updateCustomerInfo(this.form.id, this.form).then(res => {
            // 操作成功
            this.$message({
              message: "修改成功！",
              type: "success",
              duration: 2500
            });
            this.resetForm()
            this.loading = false
            this.is_Readonly = true
            this.button = 'edit'
            this.init()
          }).catch(error => {
            this.loading = false
            this.is_Readonly = true
            this.button = 'edit'
            this.init()
            this.$message({
              message: "修改失败！",
              type: "error",
              duration: 2500
            });
          })
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style>
  .el-select__tags-text {
    color: #409EFF;
  }
  .el-input.is-disabled .el-input__inner {
    color: #606266;
  }
</style>
