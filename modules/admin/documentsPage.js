import { d } from "../../asset/js/custom.lib.js";
import { commonLoad, searchLoad, sortingLoad } from "./common.js";

const documentsPage = `
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
                spellcheck="false"
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
            <li id="documentsBtn">
              <a href="javascript:void(0);" class="active">
                <span class="icon">
                  <img src="./asset/img/files.png" alt="file" class="iconBlack"/>
                  <img src="./asset/img/files b.png" alt="History" class="iconBlue"/>
                </span>
                <span class="txt">Files</span>
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
            <div class="user-popup-btns">
              <button id="selectAllBtn" class="custom-btn">Select all</button>
              <button id="deleteBtn" class="custom-btn checkDeleteBtn" style="display: none">
                Delete
              </button>
            </div>
            <!-- user-popup-btns -->

            <div class="file-upload-section-wrapp" style="max-width: 1200px">
              <div class="row">
                <div class="col-md-6">
                  <div id="selectFilesList" class="select-file-wrapp mt-3">
                    
                  </div>
                  <!-- select-file-wrapp -->
                </div>
                <!-- col -->

                <div class="col-md-6">
                  <div class="drag-and-drop-wrapp">
                    <div class="drop-zone">
                      <form
                        action="#"
                        name="documentUploadForm"
                        method="get"
                        class="formWrappFile"
                      >
                        <div class="file">
                          <div class="file__input" id="file__input">
                            <input
                              class="file__input--file"
                              id="customFile"
                              type="file"
                              multiple="multiple"
                              name="files[]"
                            />
                            <label
                              class="file__input--label"
                              for="customFile"
                              data-text-btn="Upload"
                            >
                              <div class="drop-zone__prompt">
                                <h3>Drag & Drop Files Here</h3>
                                <p>PDF only</p>
                                <div class="img">
                                  <img
                                    src="./asset/img/cloud-computing.png"
                                    alt="Upload"
                                    disabled
                                  />
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                        <div style="margin: 20px 0 100px" id="filesList"></div>
                        <div class="link-dv">
                          <button
                            onclick="document.querySelector('#customFile').click()"
                            type="button"
                            class="custom-btn"
                          >
                            Select Files
                          </button>
                          <button
                            type="submit"
                            class="custom-btn btnUpload"
                            style="display: none"
                          >
                            Upload
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <!-- drag-and-drop-wrapp -->
                </div>
                <!-- col -->
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

const checkedUpdate = () => {
  let selectFilesList = document.querySelectorAll("#selectFilesList input");
  let deleteBtn = document.querySelector("#deleteBtn");
  $(deleteBtn).hide();
  for (let input of selectFilesList) {
    if (input.checked == true) {
      $(deleteBtn).show();
      return;
    }
  }
};

const deleteFiles = async () => {
  const { post, GAS, database} = d;
  let selectFilesList = document.querySelectorAll("#selectFilesList input");
  let deleteBtn = document.querySelector("#deleteBtn");
  let loading = document.querySelector("#loading");
  deleteBtn.disabled = true;
  deleteBtn.innerText = "Processing..";
  const data = [];
  for (let input of selectFilesList) {
    if (input.checked == true) {
      data.push(Number(input.getAttribute("index")));
    }
  }
  loading.style.display = "block";
  let res = await post(GAS, {
    type: 9,
    data: JSON.stringify({
      lists: data.sort((a, b) => b - a),
      database: database,
    }),
  });
  res = JSON.parse(JSON.parse(res).messege);
  showData(res.data);
  searchLoad(res.data, showData, [1]);
  document.querySelector("#search").value = "";
  deleteBtn.disabled = false;
  deleteBtn.innerText = "Delete";
  $(deleteBtn).hide();
};

let selectAll = false;
const selectAllBtnClicked = () => {
  let selectFilesList = document.querySelectorAll("#selectFilesList input");
  let deleteBtn = document.querySelector("#deleteBtn");
  $(deleteBtn).hide();
  selectAll = !selectAll;
  for (let input of selectFilesList) {
    input.checked = selectAll;
  }

  if (selectAll) {
    $(deleteBtn).show();
  }
};

window.checkedUpdate = checkedUpdate;

const showData = (data, type = "") => {
  let selectFilesList = document.querySelector("#selectFilesList");
  let loading = document.querySelector("#loading");
  let result = "";
  let index = 1;
  let idList = [];
  for (let x of data) {
    const id = {
      id: index,
      file: x[2],
    };
    if (type) id.id = x[3];
    idList.push(id);
    result += `
    <div class="input-checkbox">
      <input index="${
        id.id
      }" onchange="checkedUpdate()" type="checkbox" name="" id="file_${
      id.id
    }" />
      <label for="file_${id.id}" style="color: #004a7f"
        >${x[1].substr(1)}</label
      >
    </div>
    `;
    index++;
  }

  selectFilesList.innerHTML = `
	${result}
  `;

  loading.style.display = "none";
  sortingLoad(1, data, type, showData);
};

let fileNo;
let filesListObj;
const addDocumentsLoad = (data) => {
  commonLoad();
  showData(data);
  searchLoad(data, showData, [1]);

  let button = document.querySelector(".btnUpload");
  let loading = document.querySelector("#loading");
  let selectAllBtn = document.querySelector("#selectAllBtn");
  let deleteBtn = document.querySelector("#deleteBtn");
  selectAllBtn.onclick = selectAllBtnClicked;
  selectAll = false;
  deleteBtn.onclick = deleteFiles;

  document.querySelector("#customFile").onchange = (e) => {
    fileListCreate(e.target.files);
    button.style.display = "inline";
  };

  fileNo = 0;
  filesListObj = {};
  document.forms["documentUploadForm"].onsubmit = async (e) => {
    e.preventDefault();
    button.innerText = "Processing..";
    loading.style.display = "block";

    for (let id in filesListObj) {
      let fileId = document.querySelector(`[file='${id}']`);
      fileId.scrollIntoView();
      let status = fileId.querySelector(".status");
      status.style.color = "#004a7f";
      status.innerText = "Uploading...";
      let result;
      try {
        const data = await fileUpload(filesListObj[id]);
        result = JSON.parse(JSON.parse(data).messege);
        showData(result.data);
        searchLoad(result.data, showData, [1]);
        document.querySelector("#search").value = "";
        loading.style.display = "block";
      } catch (err) {
        result = {
          result: false,
          err: err,
        };
      }
      if (result.result === true) {
        delete filesListObj[id];
        status.style.color = "green";
        status.innerText = "Uploaded";
      } else {
        console.log(result);
        status.style.color = "red";
        status.innerText = "Upload Failed!";
      }
    }

    button.innerText = "Upload";
    loading.style.display = "none";
    if (Object.values(filesListObj).length == 0) {
      button.style.display = "none";
    }
  };
};

const fileListCreate = async (files) => {
  const { readFiles } = d;
  let filesList = document.querySelector("#filesList");
  let templetete = "";
  for (let i = files.length - 1; i >= 0; i--) {
    fileNo++;
    const file = files[i];
    let error;
    let icon = "file.svg";
    if (file.type == "application/pdf") {
      icon = "pdf.svg";
      if (file.size >= 10 * 2 ** 20) {
        error = "File size > 5MB.";
      } else {
        error = "";
        filesListObj[fileNo] = {
          fileName: file.name,
          data64: (await readFiles(file))[0],
        };
      }
    } else {
      error = "File is not a PDF.";
    }
    templetete += `
    <div file="${fileNo}" style="display: flex; flex-direction: row; font-size: 16px; color: rgba(0, 0, 0, 0.3); align-items: flex-start; margin: 10px 0; justify-content: space-around;">
      <img style="width: 30px" src="./asset/img/${icon}">
      <div style="width: 100%; max-width: 100%; padding: 0 10px; text-align: left;">
       <div>${file.name}</div>
       <div class="status" style="color: red; font-size: 10px">${error}</div>
      </div>
      <div onclick="removeFileFromList(${fileNo})">x</div>
    </div>`;
  }
  filesList.innerHTML = templetete + filesList.innerHTML;
  console.log(filesListObj);
};

const removeFileFromList = (id) => {
  let fileDiv = document.querySelector(`[file='${id}']`);
  fileDiv.remove();
  delete filesListObj[id];
};

const fileUpload = (file) => {
  const { post, GAS, database } = d;
  const { fileName, data64 } = file;
  return post(GAS, {
    type: 7,
    data: JSON.stringify({
      date: "",
      fileName,
      data64,
      database,
    }),
  });
};

window.removeFileFromList = removeFileFromList;
export { documentsPage, addDocumentsLoad };
