<template>
  <div class="admin">
    <img alt="logo" src="../assets/logo.png" />
    <div class="lottery-list">
      <!-- <h2>抽奖活动列表</h2> -->
      <yd-cell-group
        style="margin-bottom:3rem;"
        title="抽奖活动列表"
        v-if="!lotteryList || lotteryList.length == 0"
      >
        <yd-cell-item>
          <span slot="left">暂无，快去创建吧～</span>
        </yd-cell-item>
      </yd-cell-group>
      <yd-button size="large" type="hollow" @click.native="jumpPublish"
        >创建抽奖活动</yd-button
      >
      <yd-preview
        :buttons="btns"
        v-for="(item, index) in lotteryList"
        :key="index"
      >
        <yd-preview-header>
          <div slot="left">{{ item.startTime }}</div>
          <div slot="right">{{ statusMap.get(item.status) }}</div>
        </yd-preview-header>
        <yd-preview-item>
          <div slot="left">ID</div>
          <div slot="right">{{ item.id }}</div>
        </yd-preview-item>
        <yd-preview-item>
          <div slot="left">描述</div>
          <div slot="right">{{ item.description }}</div>
        </yd-preview-item>
        <yd-preview-item>
          <div slot="left">参与人数</div>
          <div slot="right">{{ item.joinNum }}</div>
        </yd-preview-item>
        <yd-preview-item v-for="(award, idx) in item.awardList" :key="idx">
          <div slot="left">{{ award.price }}</div>
          <div slot="right">{{ award.name }} x {{ award.number }}</div>
        </yd-preview-item>
        <div class="btn-group">
          <yd-button type="hollow" @click.native="share(item.id)"
            >分享二维码</yd-button
          >
          <yd-button type="hollow" @click.native="assign(item.id)"
            >指派用户</yd-button
          >
        </div>
      </yd-preview>
    </div>
    <yd-popup v-model="alertShow" position="bottom" height="100%">
      <h1 style="font-size:1.5rem;margin-top:30%;font-weight:400;">
        管理员验证
      </h1>
      <yd-cell-group title=" " style="margin:30% 0;">
        <yd-cell-item>
          <span slot="left">密码：</span>
          <yd-input
            slot="right"
            type="password"
            v-model="password"
            placeholder="请输入密码"
          ></yd-input>
        </yd-cell-item>
      </yd-cell-group>
      <yd-button
        size="large"
        type="primary"
        style="margin: 30px;width:80%;"
        @click.native="authenticate"
        >确认</yd-button
      >
    </yd-popup>
  </div>
</template>
<script>
import { statusMap } from "../global";
import http from "../api";
export default {
  name: "admin",
  data() {
    return {
      lotteryList: [
        {
          id: 1,
          description: "默认抽奖详情描述",
          startTime: "2019-11-26 00:00:00",
          joinNum: 2,
          status: 0,
          awardList: [
            {
              id: 1,
              name: "奖品******",
              number: 2,
              price: "一等奖"
            },
            {
              id: 2,
              name: "奖品*******",
              number: 2,
              price: "二等奖"
            }
          ]
        }
      ],
      statusMap,
      btns: [],
      alertShow: true,
      password: "",
      adminFlag: false
    };
  },
  created() {
    this.adminFlag = localStorage.getItem("authenticate");
    if (this.adminFlag) {
      this.alertShow = false;
    }
    this.getLotteryList();
  },
  methods: {
    share(id) {
      this.$router.push({ name: "share", params: { lotteryId: id } });
    },
    assign(id) {
      this.$router.push("/assign/" + id);
    },
    jumpPublish() {
      this.$router.push("/publish");
    },
    getLotteryList() {
      this.$dialog.loading.open("拼命加载中...");
      http
        .fetchGet("/api/lottery/getLotteryList")
        .then(res => {
          this.$dialog.loading.close();
          if (res.code == 200) {
            this.lotteryList = res.data;
          }
        })
        .catch(() => {
          this.$dialog.toast({
            mes: "请稍后重试",
            timeout: 1500,
            icon: "error"
          });
        });
    },
    authenticate() {
      this.$dialog.loading.open("拼命加载中...");
      http
        .fetchPost(
          "/api/admin/authenticate",
          {},
          {
            params: { password: this.password }
          }
        )
        .then(res => {
          this.$dialog.loading.close();
          if (res.code == 200) {
            this.adminFlag = true;
            localStorage.setItem("authenticate", this.adminFlag);
            this.$dialog.toast({
              mes: "通过验证",
              timeout: 1500,
              icon: "success"
            });
            this.alertShow = false;
          } else {
            this.$dialog.toast({
              mes: "验证失败",
              timeout: 1500,
              icon: "error"
            });
            this.password = "";
          }
        })
        .catch(() => {
          this.$dialog.toast({
            mes: "验证失败",
            timeout: 1500,
            icon: "error"
          });
          this.password = "";
        });
      this.$dialog.loading.close();
    }
  }
};
</script>
<style lang="less" scoped>
.admin {
  img {
    width: 100px;
    height: 100px;
    margin-top: 30px;
  }
  h2 {
    text-align: left;
    padding: 5px;
    font-size: 1rem;
    color: #555;
    font-weight: 400;
  }
  /deep/ button {
    margin-top: 15px;
  }
  .yd-preview {
    margin: 1rem 0;
  }
  .btn-group {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;

    button {
      flex: 1;
      height: inherit;
      justify-content: center;
      font-size: 0.95rem;
      padding: 10px 5px;
      border: none;
      border-top: 1px solid #ddd;
      border-right: 1px solid #ddd;
      &:last-of-type {
        border-right: none !important;
      }
    }
  }
}
</style>
