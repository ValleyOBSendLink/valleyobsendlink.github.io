import { d } from "../../asset/js/custom.lib.js";
import IDB from "../../asset/js/idb.js";

import {
  commonLoad,
  searchLoad,
  sortingLoad,
  download,
  breakLine,
  createPdf,
} from "./common.js";

const historyPage = `
<div>
  <style>
    .user-backup-table-wrapp .custom-table th:nth-child(1){min-width: 180px;}
    .user-backup-table-wrapp .custom-table th:nth-child(2){min-width: 270px;}
    .user-backup-table-wrapp .custom-table th:nth-child(3){min-width: 200px;}
    .user-backup-table-wrapp .custom-table th:nth-child(4){min-width: 200px;}
    .user-backup-table-wrapp .custom-table th:nth-child(5){min-width: 180px;}
  </style>
  <section id="wrapper">
    <header class="site-header">
      <div class="container-fluid">
        <nav class="navbar site-navigation">
          <div class="navbar-brand">
            <a href="javascript:void(0);">
              <img src="./asset/img/logo.svg" alt="Logo" />
            </a>
          </div>

          <div class="search-dv">
            <form name="search-form" id="search_form">
              <button type="submit">
                <img src="./asset/img/search-icon.png" alt="Search" />
              </button>
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search"
                autocomplete="off"
                spellchaeck="false"
              />
            </form>
            <span id="sortingBtn" class="ic-dv arrow-ic">
              <a href="javascript:void(0);">
                <img src="./asset/img/up-dwn-arr.png" alt="Icon" />
              </a>
            </span>
          </div>

          <ul class="navbar-nav">
            <li id="homeBtn">
              <a href="javascript:void(0);" class="">
                <span class="txt">Home</span>
              </a>
            </li>
            <li id="historyBtn">
              <a href="javascript:void(0);" class="active">
                <span class="icon">
                  <img
                    src="./asset/img/share-clock.png"
                    alt="History"
                    class="iconBlack"
                  />
                  <img
                    src="./asset/img/share-clock-blue.png"
                    alt="History"
                    class="iconBlue"
                  />
                </span>
                <span class="txt">History</span>
              </a>
              </li>
            <li id="logoutBtn">
              <a href="javascript:void(0);">
                <span class="icon"
                  ><img src="./asset/img/logout.png" alt="LogOut"
                /></span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <!-- container -->
    </header>

    <main class="site-main">
      <section class="user-backup-sec">
        <div class="container-fluid">
          <div class="user-backup-table-wrapp  py-5">
            <table class="custom-table"></table>
          </div>
        </div>
        <!-- container -->
      </section>
      <!-- common-sec -->
    </main>
  </section>
  <!-- wrapper -->

  <div style="" id="loading">
    <div class="spinner">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
      <div class="rect5"></div>
    </div>
  </div>
</div>
`;

const getTime = (date) => {
  let time = new Date(date);
  return (
    String(time.getHours()).padStart(2, "0") +
    ":" +
    String(time.getMinutes()).padStart(2, "0")
  );
};

const showData = (data, type = "") => {
  // console.log(data);
  data.sort((a, b) => new Date(b[0].substr(1)).getTime() - new Date(a[0].substr(1)).getTime());
  // console.log(data);
  const { dateCovert } = d;
  let table = document.querySelector(".custom-table");
  let loading = document.querySelector("#loading");
  let result = "";
  let index = 1;
  let idList = [];
  for (let x of data) {
    let id = index;
    if (type) id = x[4];
    idList.push({
      id,
      file: x[3].substr(1),
      name: x[2].substr(1),
      info: x,
    });

    const downloadBtn = `
    <button download="${id}" class="icon-btn download">
      <span class="icon">
        <img src="./asset/img/download.png" alt="Download" class="iconBlack"/>
        <img src="./asset/img/download-white.png" alt="Download" class="iconBlue">
      </span>
    </button>`;

    result += `
    <tr>
      <td>${dateCovert(x[0].substr(1)) + " - " + getTime(x[0].substr(1))}</td>
      <td>${x[1].substr(1)}</td>
      <td>${x[2].substr(1)}</td>
      <td class="text-center">
        ${downloadBtn}
      </td>
    </tr>
    `;
    index++;
  }

  table.innerHTML = `
  <tr>
    <th>Date/Time</th>
    <th>Email</th>
    <th>File Name</th>
    <th class="text-center">Download</th>
  </tr>
	${result}
  `;

  for (let x of idList) {
    //console.log(x)
    let exportBtn = document.querySelector(`[download='${x.id}']`);
    const object = {
      "Date/Time":
        dateCovert(x.info[0].substr(1)) + " - " + getTime(x.info[0].substr(1)),
      Email: x.info[1].substr(1),
      "File Name": breakLine(x.info[2].substr(1)),
    };
    if (exportBtn) {
      exportBtn.onclick = async () => {
        download(x.file, object.Email + "_" + x.name, object);
      };
    }
  }
  table.style.display = "table";
  loading.style.display = "none";

  sortingLoad(1, data, type, showData);
};

const historyLoad = async () => {
  const idb = new IDB("com.valleyobSendEmailApp");
  await idb.createDataBase(d.userEmail, {
    keyPath: "id",
  });

  let data = await idb.getAllValues("value");
  // console.log(data);
  let oldTime = data.length ? data[data.length - 1][0] : "";
  const { post, GAS, database, history } = d;
  commonLoad();
  post(GAS, {
    type: 16,
    data: JSON.stringify({
      database: database,
      history: history,
      oldLength: data.length,
      oldTime,
    }),
  })
    .then(async (res) => {
      //console.log(res);
      res = JSON.parse(JSON.parse(res).messege);
      if (res.result) {
        let resData = res.data;
        const finalData = [];
        resData.forEach((element) => {
          finalData.push({
            id: element[4],
            value: element,
          });
        });

        if (res.type != "update") {
          await idb.delete();
          await idb.createDataBase(d.userEmail, {
            keyPath: "id",
          });
        }
        if (finalData.length) await idb.add(finalData);
        data = await idb.getAllValues("value");

        const renderData = [];
        data.forEach(async (v) => {
          if (res.now - v[0] > d.history * 24 * 60 * 60 * 1000) {
            await idb.remove(v[4]);
          } else {
            renderData.push(v);
          }
        });

        // console.log(renderData);
        showData(renderData);
        searchLoad(renderData, showData, [1, 2]);
      } else {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export { historyPage, historyLoad };
