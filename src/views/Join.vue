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
      <button>参与抽奖</button>
      <span>目前已有{{ joinNum }}人参与</span>
    </div>
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
      joinNum: 19999
    };
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
