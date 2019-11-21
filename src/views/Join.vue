<template>
  <div class="join">
    <div class="header">
      <img src="../assets/header.png" alt="图片" />
      <h2>抽奖活动</h2>
      <span class="strong">“</span>
      <p>{{ award.name }}</p>
    </div>
    <div class="detail">
      <h3>抽奖详情</h3>
      <div>{{ award.description }}</div>
    </div>
    <div class="lottery">
      <button @click="submitJoin">参与抽奖</button>
      <span>-目前已有{{ joinNum }}人参与-</span>
    </div>
    <yd-popup v-model="showFlag" position="center" width="90%">
      <div class="popup">
        <h3>登记信息</h3>
        <yd-cell-group>
          <yd-cell-item>
            <span slot="left">姓名</span>
            <yd-input
              slot="right"
              required
              v-model="user.name"
              ref="name"
              max="20"
              placeholder="请输入姓名"
            ></yd-input>
          </yd-cell-item>
          <p
            slot="bottom"
            style="color:#F00;padding: 0 .3rem;"
            v-html="nameValid"
          ></p>
          <yd-cell-item>
            <span slot="left">手机</span>
            <yd-input
              required
              slot="right"
              v-model="user.phone"
              ref="phone"
              regex="mobile"
              placeholder="请输入手机号"
            ></yd-input>
          </yd-cell-item>
          <p
            slot="bottom"
            style="color:#F00;padding: 0 .3rem;"
            v-html="phoneValid"
          ></p>
        </yd-cell-group>
        <p style="text-align: center;">
          <yd-button size="large" @click.native="submitUserInfo"
            >提交</yd-button
          >
        </p>
      </div>
    </yd-popup>
  </div>
</template>
<script>
export default {
  name: "join",
  data() {
    return {
      award: {
        name: "奖品XX",
        number: 1,
        description: "默认抽奖详情描述"
      },
      joinNum: 19999,
      user: {
        name: "",
        phone: ""
      },
      showFlag: false,
      nameValid: "",
      phoneValid: ""
    };
  },
  methods: {
    submitJoin() {
      // 第一次需要登陆，之后尝试使用localStorage来记录
      if (!this.user.name || !this.user.phone) {
        console.log("no user info");
        this.showFlag = true;
      }
    },
    submitUserInfo() {
      // 先验证
      const name = this.$refs.name;
      const phone = this.$refs.phone;
      this.nameValid = name.valid ? "" : `姓名${name.errorMsg}`;
      this.phoneValid = phone.valid ? "" : `手机${phone.errorMsg}`;
      if (name.valid && phone.valid) {
        //处理用户信息，发送后端
        this.$dialog.toast({
          mes: "提交成功",
          timeout: 1500,
          icon: "success"
        });
        this.showFlag = false;
      }
    }
  }
};
</script>
<style lang="less" scoped>
@font-face {
  font-family: Rokkitt;
  src: url("../assets/Rokkitt.ttf");
}
.header {
  color: #111;
  background: #f4acb7;
  height: 50vh;
  border-radius: 0 0 30px 30px;
  img {
    max-width: 80%;
    margin: 2vh auto 0;
  }
  h2 {
    font-size: 1.8rem;
    margin: 10px 0;
  }
  span.strong {
    font-size: 6rem;
    max-height: 5rem;
    display: block;
    font-family: "Rokkitt";
    border-radius: 10px 10px 0 0;
  }
  p {
    font-size: 1.2rem;
    font-family: "Rokkitt";
    border-radius: 0 0 10px 10px;
  }
  span.strong,
  p {
    width: 80%;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.3);
    padding: 10px;
  }
}
.detail {
  max-height: 20vh;
  font-size: 1rem;
  margin-top: 1rem;
  h3 {
    font-size: 1.2rem;
    margin: 5px 0;
  }
  span {
    display: block;
  }
}
.lottery {
  button {
    display: block;
    margin: 50px auto 20px;
    padding: 20px;
    font-size: 1rem;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    background: #ce5041;
    color: #fff;
    animation: scale 1.5s ease infinite;
    border-color: #ce5041;
  }
}
.popup {
  background: #fff;
  h3 {
    font-size: 1rem;
  }
  padding: 20px 10px;
  /deep/ .yd-input > input {
    text-align: right;
  }
}
@keyframes scale {
  from,
  to {
    // box-shadow: 0 0 10px #f6d2cd;
  }
  50% {
    box-shadow: 0 0 1px 8px #f9c4bc;
  }
}
</style>
