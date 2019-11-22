<template>
  <div class="publish-lottery">
    <img alt="logo" src="../assets/logo.png" />
    <h3>发布抽奖</h3>
    <yd-cell-group v-for="(item, index) in lottery.awardList" :key="index">
      <yd-cell-item>
        <span slot="left">
          <yd-icon
            class="remove"
            v-if="index > 0"
            name="delete"
            @click.native="removeAward"
          ></yd-icon
          >{{ item.label }}
        </span>
        <yd-input
          slot="right"
          ref="name"
          required
          v-model="item.name"
          max="20"
          placeholder="请输入奖品名称"
        ></yd-input>
      </yd-cell-item>
      <yd-cell-item>
        <span slot="left">奖品份数</span>
        <yd-input
          required
          ref="number"
          slot="right"
          v-model="item.number"
          regex="^\d{1,2}$"
          placeholder="请输入奖品份数[0-99]"
        ></yd-input>
      </yd-cell-item>
      <yd-button
        size="large"
        type="hollow"
        class="add-btn"
        @click.native="addAward"
        v-if="index + 1 == lottery.awardList.length"
        >+添加奖品</yd-button
      >
    </yd-cell-group>
    <yd-cell-group>
      <yd-cell-item>
        <yd-textarea
          slot="right"
          ref="description"
          placeholder="请输入奖品详情描述"
          v-model="lottery.description"
          maxlength="100"
        ></yd-textarea>
      </yd-cell-item>
      <div class="time">
        <label>开奖时间</label>
        <el-date-picker
          v-model="lottery.time"
          ref="datetime"
          prefix-icon=""
          type="datetime"
          placeholder="选择日期时间"
          required
        >
        </el-date-picker>
      </div>
      <p
        slot="bottom"
        style="color:#F00;padding: 0 .3rem;"
        v-html="validResult"
      ></p>
    </yd-cell-group>
    <yd-button size="large" type="primary" @click.native="submitPublish()"
      >提交</yd-button
    >
  </div>
</template>

<script>
export default {
  name: "publish",
  data() {
    return {
      lottery: {
        time: "",
        description: "",
        awardList: [
          {
            label: "奖品名称",
            name: "",
            number: ""
          }
        ]
      },
      validResult: "",
      labelMap: new Map()
    };
  },
  created() {
    this.labelMap.set(2, "二等奖名称").set(3, "三等奖名称");
  },
  methods: {
    addAward() {
      let len = this.lottery.awardList.length;
      if (len === 3) {
        this.$dialog.toast({
          mes: "最多添加三个奖品",
          timeout: 1500,
          icon: "error"
        });
        return;
      }
      this.lottery.awardList.splice(0, 1, {
        label: "一等奖名称",
        name: this.lottery.awardList[0].name,
        number: this.lottery.awardList[0].number
      });
      this.lottery.awardList.push({
        label: this.labelMap.get(len + 1),
        name: "",
        number: ""
      });
    },
    removeAward() {
      let len = this.lottery.awardList.length;
      if (len == 1) {
        return;
      }
      if (len == 2) {
        this.lottery.awardList.splice(0, 1, {
          label: "奖品名称",
          name: this.lottery.awardList[0].name,
          number: this.lottery.awardList[0].number
        });
      }
      this.lottery.awardList.pop();
    },
    submitPublish() {
      //先验证
      console.log(this.award);
      const name = this.$refs.name;
      const number = this.$refs.number;
      const time = this.$refs.datetime;
      this.validResult = name.valid ? "" : "奖品名称" + name.errorMsg;
      this.validResult += number.valid ? "" : "\n奖品数量" + number.errorMsg;
      console.log("time", time);
      let timeValid = false;
      if (!time.value) {
        this.validResult += "\n抽奖时间不能为空";
      } else if (time.value - Date.now() <= 0) {
        this.validResult += "\n抽奖时间不能早于现在";
      } else {
        timeValid = true;
      }
      if (name.valid && number.valid && timeValid) {
        // 将数据发送到后端
        this.$dialog.toast({
          mes: "提交成功",
          timeout: 1500,
          icon: "success"
        });
      }
    }
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
  .remove {
    font-size: 1rem;
    margin-right: 5px;
    color: red;
  }
  .yd-cell-box {
    margin: 30px 0 50px 0;
  }
  /deep/ .yd-input input {
    text-align: right;
  }
  /deep/ .yd-textarea > textarea {
    font-size: 14px;
  }
  .add-btn {
    margin: 5px 0;
    border: none;
    color: #0e68ff;
    font-size: 0.3rem;
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
