<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="card">
      <el-tab-pane label="客户信息" name="1">
        <Base ref="form_base" @change-availabel="change_available"/>
      </el-tab-pane>
      <el-tab-pane :disabled="is_available" label="客户联系人信息" name="2">
        <User ref="form_user"/>
      </el-tab-pane>
      <el-tab-pane :disabled="is_available" label="开票信息" name="3">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Base from './form_base'
  import User from './form_user'
export default {
  name: 'Tab',
  components: { Base, User },
  data() {
    return {
      activeName: '1',
      is_available: true
    }
  },
  methods: {
    change_available(flage) {
      this.is_available = flage;
    }
  }
}
</script>

<style scoped>
  .tab-container{
    margin: 30px;
  }
</style>
