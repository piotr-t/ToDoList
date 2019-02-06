const axios = require("axios");
const { list } = require("./listModule");
const chalk = require("chalk"); //console style

const accessKey = "hzlvvisb";
const urlAdres = `http://api.quuu.linuxpl.eu/todo/${accessKey}`;

let respList = () => {
  return axios({
    method: "get",
    url: urlAdres
  });
};

let postList = listData => {
  return axios({
    method: "post",
    url: urlAdres,
    data: listData
  });
};

let delListRecordAxios = id => {
  axios.delete(urlAdres);
};

module.exports = {
  respList: respList,
  postList: postList,
  delListRecordAxios: delListRecordAxios
};
