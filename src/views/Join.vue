<template>
  <div class="join">
    <div class="header">
      <img src="../assets/header.png"
           alt="图片" />
      <h2>抽奖活动</h2>
      <div class="award-info">
        <span class="strong">“</span>
        <p v-for="(item, index) in awardList"
           :key="index">
          <span class="price"
                v-if="awardList.length > 1">{{
            item.price
          }}</span>
          {{ item.name }}-{{ item.number }}份
        </p>
        <span class="time">{{ lottery.startTime }}自动开奖</span>
      </div>
    </div>
    <div class="detail">
      <h3>抽奖详情</h3>
      <div>{{ lottery.description }}</div>
    </div>
    <div class="lottery-to-join"
         v-if="lottery.status == 0 && !user.joinFlag">
      <button @click="submitJoin">参与抽奖</button>
      <span>-目前已有{{ lottery.joinNum }}人参与-</span>
    </div>
    <div class="lottery-joined"
         v-if="lottery.status == 0 && user.joinFlag">
      <button>待开奖</button>
      <span>-目前已有{{ lottery.joinNum }}人参与-</span>
    </div>
    <div class="lottery-end"
         v-if="lottery.status == 1">
      <div class="result">
        <div v-if="!user.name || !user.phone">
          <span>好久不见～确认信息先</span>
          <button @click="submitJoin">抽奖结果</button>
        </div>
        <div v-else-if="!user.joinFlag">
          <h3 style="color:#111;">您未参加本次抽奖活动</h3>
          <span>完美错过 下次活动别忘记参加～</span>
        </div>
        <div v-else-if="user.joinFlag && user.awardFlag">
          <h3>恭喜你中奖啦！</h3>
          <h4>{{ dealAwardName }}：{{ user.award.name }}</h4>
          <span>请及时联系发起人领取奖品～</span>
        </div>
        <div v-else-if="user.joinFlag && !user.awardFlag">
          <h3 style="color:#111;">很遗憾，你未中奖</h3>
          <span>再接再厉，中奖也许会迟到</span>
        </div>
        <div style="font-size:0.95rem;"
             v-if="user.name && user.phone">
          ———— 中奖者名单 ————
        </div>
        <div class="winner-list"
             v-if="user.name && user.phone">
          <div v-for="(item, index) in awardResult"
               :key="index">
            <span>奖品:{{ item.name }} x {{ item.number }}份</span>
            <ul v-for="(winner, idx) in item.winners"
                :key="idx">
              <li>{{ winner.name }}-{{ winner.phone }}</li>
            </ul>
          </div>
        </div>
        <span style="padding-bottom:2rem;">-感谢{{ lottery.joinNum }}人参与-</span>
      </div>
    </div>
    <yd-popup v-model="showFlag"
              position="center"
              width="90%">
      <div class="popup">
        <h3>登记信息</h3>
        <yd-cell-group>
          <yd-cell-item>
            <span slot="left">姓名</span>
            <yd-input slot="right"
                      required
                      v-model="userInput.name"
                      ref="name"
                      max="20"
                      placeholder="请输入姓名"></yd-input>
          </yd-cell-item>
          <p slot="bottom"
             style="color:#F00;padding: 0 .3rem;"
             v-html="nameValid"></p>
          <yd-cell-item>
            <span slot="left">手机</span>
            <yd-input required
                      slot="right"
                      v-model="userInput.phone"
                      ref="phone"
                      regex="mobile"
                      placeholder="请输入手机号"></yd-input>
          </yd-cell-item>
          <p slot="bottom"
             style="color:#F00;padding: 0 .3rem;"
             v-html="phoneValid"></p>
        </yd-cell-group>
        <p style="text-align: center;">
          <yd-button size="large"
                     @click.native="submitUserInfo">提交</yd-button>
        </p>
      </div>
    </yd-popup>
  </div>
</template>
<script>
import http from "../api";
export default {
  name: "join",
  data() {
    return {
      lottery: {
        description: "默认抽奖详情描述",
        startTime: "11月24日 00:00",
        joinNum: 2,
        status: 0
      },
      awardList: [
        {
          name: "*******",
          number: 1,
          price: "一等奖"
        },
        {
          name: "*******",
          number: 2,
          price: "二等奖"
        },
        {
          name: "*******",
          number: 1,
          price: "三等奖"
        }
      ],
      userInput: {
        name: "",
        phone: ""
      },
      user: {
        name: "",
        phone: "",
        joinFlag: false,
        awardFlag: false,
        // award: {
        //   name: "***********",
        //   price: ""
        // },
        award: null
      },
      //popup显示标识位
      showFlag: false,
      nameValid: "",
      phoneValid: "",
      awardResult: [
        {
          name: "******",
          number: 2,
          winners: [
            {
              name: "张三",
              phone: "143****3241"
            },
            {
              name: "李四",
              phone: "143****3241"
            }
          ]
        },
        {
          name: "******",
          number: 2,
          winners: [
            {
              name: "张三",
              phone: "143****3241"
            },
            {
              name: "李四",
              phone: "143****3241"
            }
          ]
        }
      ],
      priceMap: new Map(),
      lotteryId: ""
    };
  },
  computed: {
    dealAwardName() {
      return !this.user.award.price
        ? "奖品"
        : this.priceMap.get(this.user.award.price);
    }
  },
  created() {
    this.priceMap
      .set(1, "一等奖")
      .set(2, "二等奖")
      .set(3, "三等奖");
    this.lotteryId = +this.$route.params.lotteryId;
    let userLocal = JSON.parse(window.localStorage.getItem("user"));
    if (userLocal != null) {
      this.user = Object.assign({}, userLocal);
    }
    this.getLottery();
  },
  methods: {
    getLottery() {
      this.getLotteryInfo(this.lotteryId).then(() => {
        if (this.lottery.status == 1) {
          this.getLotteryResult();
        }
      });
    },
    submitJoin() {
      // 第一次需要登陆，之后尝试使用localStorage来记录
      if (!this.user.name || !this.user.phone) {
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
        this.$dialog.loading.open("拼命加载中...");
        if (this.lottery.status == 0) {
          this.registerUser();
        } else {
          this.confirmUser();
        }
        this.showFlag = false;
      }
    },
    registerUser() {
      http
        .fetchPost(
          "/api/user/register",
          {
            name: this.userInput.name,
            phone: this.userInput.phone
          },
          {
            params: {
              lotteryId: this.lotteryId
            }
          }
        )
        .then(res => {
          this.$dialog.loading.close();
          console.log(res);
          if (res.code == 200) {
            this.user.name = res.data.name;
            this.user.phone = res.data.phone;
            this.user.joinFlag = res.data.joinFlag;
            window.localStorage.setItem("user", JSON.stringify(this.user));
            this.$dialog.toast({
              mes: "登记信息成功",
              timeout: 1500,
              icon: "success"
            });
          } else {
            this.$dialog.toast({
              mes: "请稍后重试",
              timeout: 1500,
              icon: "error"
            });
          }
        })
        .catch(() => {
          this.$dialog.loading.close();
          this.$dialog.toast({
            mes: "请稍后重试",
            timeout: 1500,
            icon: "error"
          });
        });
    },
    confirmUser() {
      http
        .fetchPost(
          "/api/user/confirm",
          {
            name: this.userInput.name,
            phone: this.userInput.phone
          },
          {
            params: {
              lotteryId: this.lotteryId
            }
          }
        )
        .then(res => {
          this.$dialog.loading.close();
          console.log(res);
          this.user.name = res.data.name;
          this.user.phone = res.data.phone;
          this.user.joinFlag = res.data.joinFlag;
          this.user.awardFlag = res.data.awardFlag;
          this.user.award = Object.assign({}, res.data.award);
          window.localStorage.setItem("user", JSON.stringify(this.user));
          this.$dialog.toast({
            mes: "登记信息成功",
            timeout: 1500,
            icon: "success"
          });
        })
        .catch(() => {
          this.$dialog.loading.close();
          this.$dialog.toast({
            mes: "请稍后重试",
            timeout: 1500,
            icon: "error"
          });
        });
    },
    getLotteryInfo(id) {
      this.$dialog.loading.open("拼命加载中...");
      return new Promise(resolve => {
        http
          .fetchGet("/api/lottery/getInfo", {
            lotteryId: id
          })
          .then(res => {
            this.$dialog.loading.close();
            console.log(res);
            if (res.code == 200) {
              this.lottery.startTime = res.data.startTime;
              this.lottery.description = res.data.description;
              this.lottery.status = res.data.status;
              this.lottery.joinNum = res.data.count;
              this.awardList = this.dealPrice(res.data.awardList);
              resolve();
            }
          })
          .catch(() => {
            this.$dialog.toast({
              mes: "请稍后重试",
              timeout: 1500,
              icon: "error"
            });
          });
      });
    },
    getLotteryResult() {
      this.$dialog.loading.open("拼命加载中...");
      http
        .fetchGet("/api/resultList/get", {
          lotteryId: this.lotteryId
        })
        .then(res => {
          this.$dialog.loading.close();
          console.log(res);
          if (res.code == 200) {
            this.awardResult = res.data;
          }
        });
    },
    dealPrice(awardList) {
      for (let item of awardList) {
        item.price = this.priceMap.get(item.price);
      }
      return awardList;
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
  height: 51vh;
  border-radius: 0 0 30px 30px;
  img {
    max-width: 75%;
    margin: 2vh auto 0;
  }
  h2 {
    font-size: 1.8rem;
    margin: 10px 0;
  }
  span.strong {
    font-size: 5rem;
    max-height: 4rem;
    display: block;
    font-family: "Rokkitt";
  }
  p {
    font-size: 1.2rem;
    font-family: "Rokkitt";
  }
  div.award-info {
    width: 80%;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.3);
    padding: 10px;
    border-radius: 10px;
    p {
      font-size: 1rem;
      margin-bottom: 5px;
    }
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

[class|="lottery"] {
  button {
    display: block;
    margin: 50px auto 20px;
    padding: 20px;
    font-size: 1rem;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    color: #fff;
    border-color: transparent;
  }
}
.lottery-to-join {
  button {
    background: #ce5041;
    animation: scale 1.5s ease infinite;
  }
}
.lottery-joined {
  button {
    background: #ea7b76;
  }
}
.lottery-end {
  button {
    background: #ce5041;
    animation: scale 1.5s ease infinite;
    margin: 20px auto;
  }
  color: #555;
  .result {
    h3 {
      font-family: "Noto Sans SC", sans-serif;
      font-size: 1.8rem;
      color: red;
      margin: 2rem auto 0.4rem;
    }
    h4 {
      font-family: "Noto Sans SC", sans-serif;
      color: red;
      font-size: 1rem;
    }
    > div > span {
      display: block;
      margin: 0.6rem auto 1.5rem;
    }
    .winner-list {
      width: 95%;
      margin: 1rem auto;
      font-size: 0.9rem;
      > div {
        border: 1px solid #ddd;
        margin: 0.4rem auto;
        > span {
          display: block;
          padding: 0.4rem;
          background: #eee;
        }
        > ul {
          padding: 10px;
        }
      }
    }
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
