<template>
    <div class="logFund" style="width: 75%;">
         <el-dialog
            :title="dialog.title"
            :visible.sync="dialog.show"
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            :modal-append-to-body="false">
            <div class="form">
                <el-form
                    ref="form"
                    :model="form"
                    :rules="form_rules"
                    label-width="120px"
                    style="margin:10px;width:auto;">

                    <el-form-item prop='customer_name' label="客户公司名称:">
                        <el-input :readonly="is_readonly" v-model="form.customer_name"></el-input>
                    </el-form-item>
                    <el-form-item prop='customer_sh_name' label="客户公司简称:">
                        <el-input :readonly="is_readonly" v-model="form.customer_sh_name"></el-input>
                    </el-form-item>
                    <el-form-item prop='customer_old_name' label="客户公司曾用名:">
                        <el-input :readonly="is_readonly" v-model="form.customer_old_name"></el-input>
                    </el-form-item>

                    <el-form-item label="客户类别:" prop="customer_type">
                        <el-select :disabled="is_readonly" v-model="form.customer_type" placeholder="客户类别">
                            <el-option
                                    v-for="item in format_type_list"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="客户级别:" prop="customer_level">
                        <el-select :disabled="is_readonly" v-model="form.customer_level" placeholder="客户级别">
                            <el-option
                                    v-for="item in format_level_list"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop='customer_addr' label="客户公司地址:">
                        <el-input :readonly="is_readonly" v-model="form.customer_addr"></el-input>
                    </el-form-item>

                     <el-form-item label="备注:" prop="customer_desc">
                        <el-input :readonly="is_readonly" type="textarea" v-model="form.customer_desc"></el-input>
                    </el-form-item>

                    <el-form-item  class="text_right">
                        <el-button v-if="dialog.option == 'infoCustomer'||dialog.option == 'checkCustomer'" @click="resetForm('ruleForm')">返 回</el-button>
                        <el-button v-if="dialog.option == 'addCustomer'" @click="resetForm('ruleForm')">取 消</el-button>
                        <el-button v-if="dialog.option == 'addCustomer'" type="primary" @click="onSubmit('adduserform.vue')">提  交</el-button>
                        <el-button v-if="dialog.option == 'checkCustomer'" type="success" @click="onSubmit('adduserform.vue')">审 核</el-button>

                    </el-form-item>

                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { addCustomerInfo, updateCustomerInfo } from '../api/api'
export default {
  name: "logfound",
  props: {
    dialog: Object,
    form: Object
  },
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
      is_readonly: true,
        form_rules: {
            customer_name: [
                { required: true, message: "客户公司名称不能为空！", trigger: "blur" }
            ],
            customer_addr: [
                { required: true, message: "客户公司地址不能为空！", trigger: "blur" }
            ],
            customer_type: [
                { required: true, message: "请选择客户类别！", trigger: "change" },
            ],
            customer_level: [
                { required: true, message: "请选择客户级别！", trigger: "change" }
            ]
        }
    };
  },
  computed: {
    isReadOnly() {
      return this.dialog.option;
    }
  },
  watch: {
    isReadOnly(val) {
      if(val == 'addCustomer'){
        this.is_readonly = false;
      } else {
        this.is_readonly = true;
      }
    }
  },
  methods: {
    onSubmit(form) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          //表单数据验证完成之后，提交数据;
          if(this.dialog.option == "addCustomer"){
              addCustomerInfo(this.form).then(res => {
                  // 操作成功
                  this.$message({
                      message: "提交成功！",
                      type: "success"
                  });
                  this.dialog.show = false;
                  this.$refs.form.resetFields();
                  this.$emit("update");
              }).catch(error => {
                  console.log(error)
                  console.log(error.toString())
              })
          } else {
            this.$confirm('是否确认审核该客户信息，是否继续？', '提示', {
              confirmButtonText: '确认审核',
              cancelButtonText: '取消审核',
              type: 'warning'
            }).then(() => {
              this.form.customer_stat = '10';
              updateCustomerInfo(this.dialog.id, this.form).then(res => {
                // 操作成功
                this.$message({
                  message: "审核成功！",
                  type: "success"
                });
                this.dialog.show = false;
                this.$refs.form.resetFields();
                this.$emit("update");
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消审核'
              });
              this.resetForm(form);
            });
          }
        } else {
          this.$message({
            message: "表单验证失败，请确认内容！",
            type: "error"
          });
          return false;
        }
      });
    },
    resetForm(form) {
      this.dialog.show = false;
      this.$refs.form.resetFields();
    }
  }
};
</script>

