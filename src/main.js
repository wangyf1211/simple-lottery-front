import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { DatePicker, Form, FormItem, Input } from "element-ui";
import YDUI from "vue-ydui"; /* 相当于import YDUI from 'vue-ydui/ydui.rem.js' */
import "vue-ydui/dist/ydui.px.css";
import "element-ui/lib/theme-chalk/index.css";

Vue.prototype.$dialog = {
  confirm: YDUI.confirm,
  alert: YDUI.alert,
  toast: YDUI.toast,
  notify: YDUI.notify,
  loading: YDUI.loading
};

Vue.use(YDUI);
Vue.use(DatePicker);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
