import { d } from "../../asset/js/custom.lib.js";
import {
  breakLine,
  createPdf,
  download,
  searchLoad,
  sortingLoad,
} from "../common.js";
import { historyLoad, historyPage } from "./historyPage.js";
import { homeLoad, homePage } from "./homePage.js";
import { login, loginLoad } from "./login.js";

const commonLoad = () => {
  homeLoad_();
  historyLoad_();
  logoutLoad();
};

const homeLoad_ = () => {
  const { GAS, post, $database: database } = d;
  let button = document.querySelector("#homeBtn");
  button.onclick = () => {
    document.querySelector("#root").innerHTML = homePage;
    post(GAS, {
      type: 14,
      data: JSON.stringify({
        database: database,
      }),
    })
      .then(async (res) => {
        res = JSON.parse(JSON.parse(res).messege);
        const { result, data, commonlyUsedData } = res;
        if (result) {
          homeLoad(data, commonlyUsedData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const historyLoad_ = () => {
  const { database } = d;
  let button = document.querySelector("#historyBtn");
  button.onclick = () => {
    document.querySelector("#root").innerHTML = historyPage;
    historyLoad(database);
  };
};

const logoutLoad = () => {
  let button = document.querySelector("#logoutBtn");
  button.onclick = () => {
    document.querySelector("#root").innerHTML = login;
    loginLoad();
  };
};

const inputPrevent = (e) => {
  if (e.inputType == "insertText" || e.inputType == "insertCompositionText") {
    let start = e.target.selectionStart - e.data.length;
    e.target.value =
      e.target.value.substr(0, e.target.selectionStart - e.data.length) +
      e.target.value.substr(e.target.selectionStart);
    d.setCaretPosition(e.target, start);
  }
};

window.inputPrevent = inputPrevent;

export { breakLine, commonLoad, createPdf, download, searchLoad, sortingLoad };
