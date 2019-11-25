<template>
  <div class="share">
    <h2>分享二维码</h2>
    <img :src="imgSrc" alt="qrcode" />
  </div>
</template>
<script>
import QRCode from "qrcode";
export default {
  name: "share",
  data() {
    return {
      imgSrc: ""
    };
  },
  mounted() {
    this.renderQrcode();
  },
  methods: {
    renderQrcode() {
      QRCode.toDataURL(this.$route.fullPath).then(url => {
        this.imgSrc = url;
      });
    }
  }
};
</script>
<style scoped>
.share {
  position: relative;
}
img {
  width: 10rem;
  height: 10rem;
  position: absolute;
  clip: rect(1rem, 9rem, 9rem, 1rem);
  top: 35vh;
  left: 50%;
  margin: 0 auto;
  display: block;
  transform: translateX(-50%);
}
h2 {
  position: relative;
  top: 30vh;
  font-size: 1.4rem;
}
</style>
