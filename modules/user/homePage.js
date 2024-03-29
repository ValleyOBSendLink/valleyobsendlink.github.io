import { d } from "../../asset/js/custom.lib.js";
import { commonLoad, searchLoad, sortingLoad } from "./common.js";

const homePage = `
<div>
  <section id="wrapper">
    <header class="site-header">
      <div class="container-fluid">
        <nav class="navbar site-navigation">
          <div class="navbar-brand">
            <a href="javascript:void(0);">
              <img src="./asset/img/logo.svg" alt="Logo" />
            </a>
          </div>

          <div class="search-dv" style="max-width: 850px">
            <form action="#" name="search-form" id="search_form">
              <button type="submit">
                <img src="./asset/img/search-icon.png" alt="Search" />
              </button>
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search"
                spellchaeck="false"
                onfocus="this.autocomplete='on'"
                list="favoriteLists"
              />
              <datalist id="favoriteLists"></datalist>
            </form>
            <span id="sortingBtn" class="ic-dv arrow-ic">
              <a href="javascript:void(0);">
                <img src="asset/img/up-dwn-arr.png" alt="Icon" />
              </a>
            </span>

            <div class="file-email-send-bx">
              <form id="sendEmailForm">
                <input
                  type="text"
                  name=""
                  id="Email"
                  class="form-control"
                  autocomplete="off"
                  required=""
                  placeholder="Copy & Paste Email"
                  oninput="inputPrevent(event)"
                  spellcheck="false"
                  onfocus="this.autocomplete='on'"
                />
                <button type="submit" id="emailSendBtn" class="custom-btn sendBtn">Send</button>
                <div
                  style="
                    color: red;
                    text-align: center;
                    font-size: 14px;
                    margin-top: 10px;
                    margin-bottom: 15px;
                    display: none;
                    position: absolute;
                  "
                  id="error"
                >
                  Something is wrong. Please try again.
                </div>
              </form>
            </div>
          </div>

          <ul class="navbar-nav">
            <li id="homeBtn">
              <a href="javascript:void(0);" class="active">
                <span class="txt">Home</span>
              </a>
            </li>
            <li id="historyBtn">
              <a href="javascript:void(0);">
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
          <div class="user-backup-table-wrapp">
            <div style="position: absolute; left: -120px;">
              <span style="display: none" id="sortValue">Sort By Name</span>
              <img id="sortValueBtn" style="width: 50px; cursor: pointer;" src="./asset/img/imgpsh_fullsize_anim.png" alt="Icon" />
            </div>

            <div id="selectFilesListDiv" class="file-upload-section-wrapp">
              <div class="row">
                <div class="col-md-6">
                  <div id="selectFilesList" class="select-file-wrapp" style="margin-top: 67px">
                    
                  </div>
                  <!-- select-file-wrapp -->
                </div>
                <!-- col -->

                <div class="col-md-6">
                  <div id="commonUsedFiles" class="select-file-wrapp" style="margin-top: 67px">
                    
                  </div>
                  <!-- common-file-wrapp -->
                </div>
              </div>
              
              <!-- row -->
            </div>
            <!-- file-upload-section-wrapp -->
          </div>
        </div>
        <!-- container -->
      </section>
      <!-- common-sec -->
    </main>
  </section>

  <!-- Modal Thank you Success message -->
      <div
        class="modal fade custom-modal success-modal"
        id="sentEmailModal"
        tabindex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div
          class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
          role="document"
        >
          <div class="modal-content">
            <div class="modal-header">
              <button
                type="button"
                class="close ml-auto"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body text-center">
              <div class="img mb-4">
                <img src="./asset/img/verified.png" alt="Success" />
              </div>
              <h3 class="modal-title text-center">Thank You!</h3>
              <p>Successfully Sent.</p>
            </div>
            <!-- modal-body -->
          </div>
        </div>
      </div>
      <!-- modal -->

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

let data__;
let type__;
const showData = (data, type = "") => {
  let selectFilesList = document.querySelector("#selectFilesList");
  let loading = document.querySelector("#loading");
  let result = "";
  let index = 1;
  let idList = [];
  for (let x of data) {
    const id = {
      id: index,
      file: x[1],
    };
    if (type) id.id = x[2];
    idList.push(id);
    result += `
    <div class="input-checkbox">
      <input fileName="${x[0].substr(1)}" fileId="${x[1].substr(1)}" index="${
      id.id
    }" type="checkbox" name="" id="file_${id.id}" />
      <label style="color: #004a7f"
        ><a href="https://drive.google.com/uc?export=view&id=${x[1].substr(1)}"
        target="_blank">${x[0].substr(1)}</a></label
      >
    </div>
    `;
    index++;
  }

  selectFilesList.innerHTML = `
	${result}
  `;

  loading.style.display = "none";
  sortingLoad(
    0,
    data,
    type,
    showData,
    undefined,
    document.querySelector("#sortValue")
  );
  data__ = data;
  type__ = type;
};

const showCommonUsedData = (data, commonlyUsedData) => {
  let selectFilesList = document.querySelector("#commonUsedFiles");
  let loading = document.querySelector("#loading");
  let result = "";

  let index = 0;
  for (let x of commonlyUsedData) {
    let id = {
      id: index,
      file: x[0],
    };

    let name = data.find((y) => y[1] === x[0])?.[0];

    if (!name) continue;

    result += `
    <div class="input-checkbox">
      <input fileName="${name.substr(1)}" fileId="${x[0].substr(1)}" index="${
      id.id
    }" type="checkbox" name="" id="common_file_${id.id}" />
      <label style="color: #004a7f"
        ><a href="https://drive.google.com/uc?export=view&id=${x[0].substr(1)}"
        target="_blank">${name.substr(1)}</a></label
      >
    </div>
    `;
    index++;
  }

  selectFilesList.innerHTML = `
	${result}
  `;

  loading.style.display = "none";
};

const homeLoad = async (data, commonlyUsedData) => {
  const { post, GAS, database, favorite, userEmail } = d;

  let sortValueBtn = document.querySelector("#sortValueBtn");
  let sortValue = document.querySelector("#sortValue");
  let sortingBtn = document.querySelector("#sortingBtn");

  sortValue.innerText = "Sort By Name";

  sortValueBtn.onclick = () => {
    if (sortValue.innerText == "Sort By Name") {
      sortValue.innerText = "Sort By Number";
    } else {
      sortValue.innerText = "Sort By Name";
    }

    sortingLoad(
      0,
      data__,
      type__,
      showData,
      undefined,
      document.querySelector("#sortValue")
    );
    sortingBtn.click();
  };
  // const idb = new IDB("com.valleyobSendEmailApp");
  // await idb.createDataBase(userEmail + "_commonUsed", {
  //   keyPath: "id",
  // });

  commonLoad();
  showData(data);

  // let commonUsedDataAll = await idb.getAllValues("id");

  // let allDataObj = {};
  // for (let x of data) {
  //   allDataObj[x[1].substr(1)] = x;
  // }

  // for (let x of commonUsedDataAll) {
  //   if (!allDataObj[x]) {
  //     await idb.remove(x);
  //   }
  // }

  // let commonUsedData = await idb.getAll();
  // commonUsedData.sort((a, b) => b.used - a.used);
  // showCommonUsedData(commonUsedData.map((x) => x.value));

  showCommonUsedData(data, commonlyUsedData);
  searchLoad(data, showData, [0], null, String(favorite).split("\n"));
  let favoriteLists = document.querySelector("#favoriteLists");

  favoriteLists.innerHTML =
    "<option>" +
    String(favorite).split("\n").join("</option><option>") +
    "</option>";

  // for (let x of dropdownMenuAll) {
  //   x.onclick = () => {
  //     sortValue.innerText = x.innerText;
  //     sortingLoad(
  //       0,
  //       data__,
  //       type__,
  //       showData,
  //       undefined,
  //       document.querySelector("#sortValue")
  //     );
  //     sortingBtn.click();
  //   };
  // }
  let emailForm = document.querySelector("#sendEmailForm");
  let email = document.querySelector("#Email");
  let button = document.querySelector("#emailSendBtn");
  let error = document.querySelector("#error");
  let loading = document.querySelector("#loading");
  emailForm.onsubmit = async (e) => {
    let selectFilesList = document.querySelectorAll(
      "#selectFilesListDiv input"
    );

    e.preventDefault();

    error.style.display = "none";
    if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value) == false
    ) {
      error.innerText = "Please paste valid email.";
      error.style.display = "block";
      return;
    }

    loading.style.display = "block";
    button.innerText = "Sending..";
    let data = [];
    for (let input of selectFilesList) {
      if (input.checked == true) {
        data.push({
          id: input.getAttribute("fileId"),
          name: input.getAttribute("fileName"),
        });

        // let isExistOnCommonUsed = await idb.get(input.getAttribute("fileId"));

        // if (!isExistOnCommonUsed) {
        //   await idb.add({
        //     id: input.getAttribute("fileId"),
        //     value: [
        //       "x" + input.getAttribute("fileName"),
        //       "x" + input.getAttribute("fileId"),
        //     ],
        //     used: 1,
        //     ts: new Date().getTime(),
        //   });
        // } else {
        //   await idb.put(input.getAttribute("fileId"), {
        //     used: isExistOnCommonUsed.used + 1,
        //     ts: new Date().getTime(),
        //   });
        // }
      }
    }

    // let commonUsedData = await idb.getAll();
    // commonUsedData.sort((a, b) => b.used - a.used);
    // showCommonUsedData(commonUsedData.map((x) => x.value));

    if (data.length == 0) {
      error.innerText = "Please select a files.";
      loading.style.display = "none";
      button.innerText = "Send";
      error.style.display = "block";
      return;
    }

    post(GAS, {
      type: 15,
      data: JSON.stringify({
        time: "",
        email: email.value,
        data: data,
        database: database,
      }),
    })
      .then(async (res) => {
        res = JSON.parse(JSON.parse(res).messege);
        const { result } = res;
        if (result) {
          e.target.reset();
          for (let input of selectFilesList) {
            input.checked = false;
          }
          button.innerText = "Send";
          loading.style.display = "none";
          $("#sentEmailModal").modal("show");
        } else {
          console.log(res);
          error.style.display = "block";
          error.innerText = "Something is wrong. Please try again.";
          button.innerText = "Send";
          loading.style.display = "none";
        }
      })
      .catch((err) => {
        console.log(err);
        error.style.display = "block";
        error.innerText = "Something is wrong. Please try again.";
        button.innerText = "Send";
        loading.style.display = "none";
      });
  };
};

export { homeLoad, homePage };
