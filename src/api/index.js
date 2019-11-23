import axios from "axios";
import qs from "qs";

export default {
  fetchPost(url, data, config = {}) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, data, config)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  fetchSimplePost(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, qs.stringify(params))
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  fetchGet(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: params
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};
