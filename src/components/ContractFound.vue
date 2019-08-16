<template>
    <div class="logFund" style="width: 100%;">
         <el-dialog
            :title="dialog.title"
            :visible.sync="dialog.show"
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            :modal-append-to-body="false"
            @open="openInfo">
            <div class="form">
                <el-steps :active=steps.active finish-status="success" align-center>
                    <el-step title="添加合同信息"></el-step>
                    <el-step title="添加回款计划"></el-step>
                </el-steps>
                <el-form
                    ref="form"
                    :model="form"
                    :rules="form_rules"
                    v-show="steps.active == 0"
                    label-width="90px"
                    style="margin:10px;width:auto;">
                    <el-row>
                        <el-col :span="24"><div class="grid-content bg-purple-dark">
                            <el-form-item prop='crt_name' label="合同名称:">
                                <el-input v-model="form.crt_name" placeholder="请输入合同名称"></el-input>
                            </el-form-item>
                        </div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"><div class="grid-content bg-purple-light">
                            <el-form-item label="合同类型:" prop="crt_type">
                                <el-select v-model="form.crt_type" placeholder="合同类型" style="width: 100%">
                                    <el-option
                                            v-for="item in format_type_list"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple">
                            <el-form-item prop='crt_serialnumber' label="合同编号:">
                                <el-input v-model="form.crt_serialnumber" placeholder="请输入合同编号"></el-input>
                            </el-form-item>
                        </div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"><div class="grid-content bg-purple">
                            <el-form-item prop='crt_amt' label="合同金额:">
                                <el-input v-if="amtFomate.changetype"
                                          type="number"
                                          step="0.01"
                                          v-model="form.crt_amt"
                                          placeholder="请输入合同金额"
                                          class="input-with-select"
                                          @blur="showamt">
                                    <el-select v-model="form.crt_currency" slot="prepend" style="width: 80px">
                                        <el-option label="CNY" value="CNY"></el-option>
                                        <el-option label="USD" value="USD"></el-option>
                                    </el-select>
                                </el-input>
                                <el-input v-else
                                          type="string"
                                          v-model="amtFomate.crt_amt2"
                                          placeholder="合同金额"
                                          class="input-with-select"
                                          @focus="changeamt">
                                    <el-select v-model="form.crt_currency" slot="prepend" style="width: 80px">
                                        <el-option label="CNY" value="CNY"></el-option>
                                        <el-option label="USD" value="USD"></el-option>
                                    </el-select>
                                </el-input>
                            </el-form-item>
                        </div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">
                            <el-form-item label="客户名称:" prop="crt_customer">
                                <el-select v-model="form.crt_customer" filterable placeholder="客户名称(支持搜索)" style="width: 100%">
                                    <el-option
                                            v-for="item in customerList"
                                            :key="item.id"
                                            :label="item.customer_name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"><div class="grid-content bg-purple">
                            <el-form-item prop='crt_salesrep' label="销售代表:">
                                <el-input type="crt_salesrep" v-model="form.crt_salesrep" placeholder="请输入销售代表姓名"></el-input>
                            </el-form-item>
                        </div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">
                            <el-form-item label="销售区域:" prop="crt_salesarea">
                                <el-select v-model="form.crt_salesarea" filterable placeholder="销售区域(支持搜索)" style="width: 100%">
                                    <el-option
                                            v-for="item in cities"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        <span style="float: left">{{ item.label }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"><div class="grid-content bg-purple">
                            <el-form-item prop='crt_signeddate' label="签订日期:">
                                <el-date-picker
                                        v-model="form.crt_signeddate"
                                        align="right"
                                        type="date"
                                        placeholder="选择日期"
                                        value-format="yyyy-MM-dd"
                                        :picker-options="pickerOptions"
                                        style="width: 100%">
                                </el-date-picker>
                            </el-form-item>
                        </div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">
                            <el-form-item prop='crt_registerdate' label="登记日期:">
                                <el-date-picker
                                        v-model="form.crt_registerdate"
                                        align="right"
                                        type="date"
                                        :readonly="true"
                                        :disabled="true"
                                        placeholder="选择日期"
                                        :picker-options="pickerOptions"
                                        style="width: 100%">
                                </el-date-picker>
                            </el-form-item>
                        </div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"><div class="grid-content bg-purple">
                            <el-form-item prop='crt_start_end' label="有效日期:">
                                <el-date-picker
                                        v-model="crt_start_end"
                                        type="daterange"
                                        value-format="yyyy-MM-dd"
                                        range-separator="至"
                                        start-placeholder="起始日期"
                                        end-placeholder="结束日期"
                                        style="width: 100%"
                                        @change="changevaliddate">
                                </el-date-picker>
                            </el-form-item>
                        </div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">

                        </div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24"><div class="grid-content bg-purple-dark">
                            <el-form-item prop='crt_desc' label="合同备注:">
                                <el-input
                                        type="textarea"
                                        :rows="3"
                                        placeholder="请输入合同备注"
                                        v-model="form.crt_desc">
                                </el-input>
                            </el-form-item>
                        </div></el-col>
                    </el-row>
                    <el-form-item  class="text_right">
                        <el-button type="primary" @click="onSubmit('adduserform.vue')">提  交</el-button>
                        <el-button @click="resetForm('adduserform.vue')">取 消</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getCustomerInfo, addContractInfo, updateContractInfo } from '../api/api'
import { formatMoney } from '../api/tools';
import { checkAmt } from "../../rules";

export default {
  name: "Contractfound",
  props: {
    dialog: Object,
    form: Object
  },
  data() {
    return {
        format_type_list: [
            {value: 1,label: '软件开发'},
            {value: 2,label: '销售代理'},
            {value: 3,label: '自有产品'},
            {value: 4,label: '系统集成'},
            {value: 5,label: '人员外包'},
            {value: 6,label: '维护合同'}
            ],
      cities: [{
        value: 'Beijing',
        label: '北京'
      }, {
        value: 'Shanghai',
        label: '上海'
      }, {
        value: 'Nanjing',
        label: '南京'
      }, {
        value: 'Chengdu',
        label: '成都'
      }, {
        value: 'Shenzhen',
        label: '深圳'
      }, {
        value: 'Guangzhou',
        label: '广州'
      }],
      customerList: [],
      crt_start_end: '',
      steps: {
          active: 1,
      },
      amtFomate: {
        crt_amt2: '0.00',
        changetype: true
      },
        form_rules: {
            crt_name: [
                { required: true, message: "合同名称不能为空！", trigger: "blur" }
            ],
            crt_amt: [
                {required: true, message: "合同金额不能为空", trigger: "blur" },
                {validator:checkAmt, trigger: "blur,change" }
            ],
            crt_type: [
            {  required: true, message: "请选择合同类型!", trigger: "change" }
            ],
          crt_customer: [
            {  required: true, message: "请选择合同客户!", trigger: "change" }
          ]
        },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }]
      },
    };
  },
  created() {
    this.getCustomerInfo();
  },
  computed: {

  },
  methods: {
    openInfo() {
      if(this.dialog.option == "editContract") {
        this.steps.active = 0;
        this.form.crt_amt = typeof this.form.crt_amt == "string"?parseFloat(this.form.crt_amt):this.form.crt_amt//判断是否是字符串如果是字符串转成数字
        this.form.crt_amt = this.form.crt_amt.toFixed(2);//保留两位
        this.form.crt_amt = parseFloat(this.form.crt_amt);//转成数字
        this.amtFomate.changetype = false;
        this.amtFomate.crt_amt2= formatMoney(this.form.crt_amt);
      } else if(this.dialog.option == "addContract") {
        this.steps.active = 0;
      }
    },
    getCustomerInfo() {
      // 获取表格数据
      getCustomerInfo(this.search_data).then(res => {
        this.customerList = res.data;
      });
    },
    onSubmit(form) {
        this.$refs.form.validate(valid => {
          if (valid) {
              //表单数据验证完成之后，提交数据;
              if(this.dialog.option == "addContract"){
                  addContractInfo(this.form).then(res => {
                      // 操作成功
                      this.$message({
                          message: "保存成功！",
                          type: "success"
                      });
                      this.dialog.id = res.data.id;
                      console.log(this.dialog.id)
                      this.dialog.show = false;
                      this.$emit("update");
                      // this.steps.active = 1;
                  }).catch(error => {

                  })
              } else {
                  updateContractInfo(this.dialog.id, this.form).then(res => {
                      // 操作成功
                      this.$message({
                          message: "更新成功！",
                          type: "success"
                      });
                      this.dialog.show = false;
                      this.$emit("update");
                  }).catch(error => {

                  })
              }
          } else {
            this.$message({
              message: "表单提交失败！",
              type: "error"
            });
            return false;
          }
        });
    },
    showamt() {
      this.form.crt_amt = typeof this.form.crt_amt == "string"?parseFloat(this.form.crt_amt):this.form.crt_amt//判断是否是字符串如果是字符串转成数字
      this.form.crt_amt = this.form.crt_amt.toFixed(2);//保留两位
      this.form.crt_amt = parseFloat(this.form.crt_amt);//转成数字
        this.amtFomate.changetype = !this.amtFomate.changetype;
        this.amtFomate.crt_amt2= formatMoney(this.form.crt_amt);
    },
    changeamt() {
      this.amtFomate.changetype = !this.amtFomate.changetype;
    },
    changevaliddate() {
      if(this.crt_start_end.length == 2) {
        this.form.crt_effectivedate = this.crt_start_end[0];
        this.form.crt_enddate = this.crt_start_end[1];
      } else {
        this.form.crt_effectivedate = '';
      }
    },
  resetForm(form) {
    this.dialog.show = false;
    this.$refs.form.resetFields();
  }
  }
};
</script>

