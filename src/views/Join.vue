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
      <button @click="submitWait">待开奖</button>
      <span>-目前已有{{ lottery.joinNum }}人参与-</span>
    </div>
    <div class="lottery-end"
         v-if="lottery.status == 1">
      <div class="result">
        <div v-if="user.award != null">
          <h3>恭喜你中奖啦！</h3>
          <h4>{{ dealAwardName }}：{{ user.award.name }}</h4>
          <span>请及时联系发起人领取奖品～</span>
        </div>
        <div v-else>
          <h3 style="color:#111;">很遗憾，你未中奖</h3>
          <span>再接再厉，中奖也许会迟到</span>
        </div>
        <div style="font-size:0.95rem;">
          ———— 中奖者名单 ————
        </div>
        <div class="winner-list">
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
                      v-model="user.name"
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
                      v-model="user.phone"
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
        joinNum: 19999,
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
      user: {
        name: "",
        phone: "",
        joinFlag: false,
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
      priceMap: new Map()
    };
  },
  computed: {
    dealAwardName() {
      return !this.user.award.price ? "奖品" : this.user.award.price;
    }
  },
  created() {
    this.priceMap
      .set(1, "一等奖")
      .set(2, "二等奖")
      .set(3, "三等奖");
    let lotteryId = this.$route.params.lotteryId;
    this.getLotteryInfo(lotteryId);
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
    },
    getLotteryInfo(id) {
      http
        .fetchGet("/api/lottery/getInfo", {
          lotteryId: id
        })
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.lottery.startTime = res.data.startTime;
            this.lottery.description = res.data.description;
            this.lottery.status = res.data.status;
            this.awardList = this.dealPrice(res.data.awardList);
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
