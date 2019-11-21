<template>
  <div class="publish-lottery">
    <img alt="logo" src="../assets/logo.png" />
    <h3>发布抽奖</h3>
    <yd-cell-group>
      <yd-cell-item>
        <span slot="left">奖品名称</span>
        <yd-input
          slot="right"
          required
          v-model="award.name"
          max="20"
          placeholder="请输入奖品名称"
        ></yd-input>
      </yd-cell-item>
      <yd-cell-item>
        <span slot="left">奖品份数</span>
        <yd-input
          required
          slot="right"
          v-model="award.number"
          regex="^\d{1,2}$"
          placeholder="请输入奖品份数[0-99]"
        ></yd-input>
      </yd-cell-item>
      <div class="time">
        <label>开奖时间</label>
        <el-date-picker
          v-model="award.time"
          prefix-icon=""
          type="datetime"
          placeholder="选择日期时间"
          required
        >
        </el-date-picker>
      </div>
    </yd-cell-group>
    <yd-button size="large" type="primary">提交</yd-button>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      award: {
        name: "",
        number: "",
        time: ""
      }
    };
  }
};
</script>
<style lang="less" scoped>
.publish-lottery {
  padding: 50px 0;
  h3 {
    font-size: 1.5rem;
  }
  img {
    width: 100px;
    height: 100px;
  }
  .yd-cell-box {
    margin: 30px 0 50px 0;
  }
  /deep/ .yd-input input {
    text-align: right;
  }
  .time {
    display: flex;
    position: relative;
    padding-left: 12px;
    overflow: hidden;
    align-items: center;
    height: 50px;
    /deep/ .el-input {
      color: #555 !important;
      position: absolute;
      right: 0;
      > input {
        border: none;
        text-align: right;
        color: #555;
      }
    }
    /deep/ .el-input--prefix .el-input__inner {
      padding-left: 10px;
    }
    /deep/ span.el-input__prefix {
      display: none;
    }
  }
  label {
    color: #555;
    font-size: 14.000000000000002px;
    white-space: nowrap;
  }
}
</style>
