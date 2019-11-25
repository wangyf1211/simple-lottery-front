<template>
  <div class="assign">
    <img alt="logo" src="../assets/logo.png" />
    <yd-cell-group title="抽奖活动基本信息">
      <yd-cell-item>
        <span slot="left">开始时间</span>
        <span slot="right">{{ lottery.startTime }}</span>
      </yd-cell-item>
      <yd-cell-item>
        <span slot="left">参与人数</span>
        <span slot="right">{{ lottery.joinNum }}</span>
      </yd-cell-item>
      <yd-cell-item>
        <span slot="left">抽奖状态</span>
        <span slot="right">{{ dealStatus }}</span>
      </yd-cell-item>
      <yd-cell-item>
        <yd-textarea
          slot="right"
          placeholder="抽奖描述"
          readonly
          v-model="lottery.description"
        ></yd-textarea>
      </yd-cell-item>
    </yd-cell-group>
    <div v-if="!editFlag">
      <yd-cell-group
        :title="item.price"
        v-for="(item, index) in awardResult"
        :key="index"
      >
        <yd-cell-item v-for="(user, idx) in item.winners" :key="idx">
          <span slot="left">{{ user.name }}-{{ user.phone }}</span>
        </yd-cell-item>
      </yd-cell-group>
      <yd-cell-group
        title="中奖用户列表"
        v-if="!awardResult || awardResult.length == 0"
      >
        <yd-cell-item>
          <span slot="left">暂未指定中奖用户</span>
        </yd-cell-item>
      </yd-cell-group>
      <yd-button size="large" type="primary" @click.native="editFlag = true"
        >编辑</yd-button
      >
    </div>
    <div v-if="editFlag">
      <yd-cell-group
        v-for="(item, index) in awardList"
        :key="index"
        :title="item.price + '-' + item.number + '份'"
      >
        <yd-cell-item
          arrow
          type="label"
          v-for="(selItem, selIdx) in item.userSelect"
          :key="selIdx"
        >
          <span slot="left"></span>
          <select slot="right" v-model="item.userSelect[selIdx]">
            <option value="0">请选择用户</option>
            <option v-for="(user, idx) in userList" :key="idx" :value="user.id"
              >{{ user.name }}-{{ user.phone }}
            </option>
          </select>
        </yd-cell-item>
      </yd-cell-group>
      <yd-button size="large" type="primary" @click.native="submitAssign"
        >确认</yd-button
      >
    </div>
  </div>
</template>
<script>
import http from "../api";
import { dealPrice, statusMap } from "../global";
export default {
  name: "assign",
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
          id: 1,
          name: "*******",
          number: 1,
          price: "一等奖"
        },
        {
          id: 2,
          name: "*******",
          number: 2,
          price: "二等奖"
        },
        {
          id: 3,
          name: "*******",
          number: 1,
          price: "三等奖"
        }
      ],
      userList: [
        { id: 1, name: "张三", phone: "13412351235" },
        { id: 2, name: "李四", phone: "13412351235" }
      ],
      awardResult: [
        {
          name: "******",
          number: 2,
          price: "一等奖",
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
          price: "二等奖",
          winners: [
            {
              name: "张三",
              phone: "143****3241"
            }
          ]
        }
      ],
      lotteryId: "",
      editFlag: false
    };
  },
  created() {
    this.lotteryId = +this.$route.params.lotteryId;
    this.getAdminLotteryInfo();
    this.getLotteryUserList();
    this.getLotteryResult();
  },
  computed: {
    dealStatus() {
      return statusMap.get(this.lottery.status);
    }
  },
  methods: {
    getAdminLotteryInfo() {
      this.$dialog.loading.open("拼命加载中...");
      return new Promise(resolve => {
        http
          .fetchGet("/api/lottery/getAdminInfo", {
            lotteryId: this.lotteryId
          })
          .then(res => {
            this.$dialog.loading.close();
            console.log(res);
            if (res.code == 200) {
              this.lottery.startTime = res.data.startTime;
              this.lottery.description = res.data.description;
              this.lottery.status = res.data.status;
              this.lottery.joinNum = res.data.count;
              this.awardList = dealPrice(res.data.awardList);
              for (var item of this.awardList) {
                item.userSelect = Array(item.number).fill(0);
              }
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
        .fetchGet("/api/resultList/adminGet", {
          lotteryId: this.lotteryId
        })
        .then(res => {
          this.$dialog.loading.close();
          console.log(res);
          if (res.code == 200) {
            this.awardResult = dealPrice(
              res.data.sort((a, b) => a.price - b.price)
            );
          }
        });
    },
    getLotteryUserList() {
      this.$dialog.loading.open("拼命加载中...");
      http
        .fetchGet("/api/resultList/getUserList", {
          lotteryId: this.lotteryId
        })
        .then(res => {
          this.$dialog.loading.close();
          console.log(res);
          if (res.code == 200) {
            this.userList = res.data;
          }
        });
    },
    submitAssign() {
      var assign = [];
      for (let item of this.awardList) {
        var userIdList = [];
        for (let selItem of item.userSelect) {
          userIdList.push(selItem);
        }
        assign.push({
          awardId: item.id,
          userIdList
        });
      }
      http
        .fetchPost(
          "/api/resultList/assignUser",
          { assign },
          {
            params: {
              lotteryId: this.lotteryId
            }
          }
        )
        .then(res => {
          this.$dialog.loading.close();
          console.log(res);
          this.$dialog.toast({
            mes: "指派成功",
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
      this.editFlag = false;
    }
  }
};
</script>
<style lang="less" scoped>
.assign {
  /deep/ .yd-textarea-readonly > textarea {
    color: #555;
    font-size: 14px;
  }
  button {
    margin: 3rem 0 5rem;
  }
  img {
    width: 100px;
    height: 100px;
    margin-top: 30px;
  }
}
</style>
