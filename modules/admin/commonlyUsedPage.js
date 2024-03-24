import { d } from "../../asset/js/custom.lib.js";
import { commonLoad } from "./common.js";

const commonlyUsedPage = `
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

              <button id="saveBtn" class="custom-btn checkDeleteBtn" style="display: none">
                Save
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
              </div>
              <!-- row -->
            </div>
          </div>
        </div>
        <!-- container -->
      </section>
      <!-- common-sec -->
    </main>
  </section>
  <!-- wrapper -->

  <!-- Modal Thank you Success message -->
	<div class="modal fade custom-modal verifiedModalClass" id="statusModel" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close ml-auto" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>

				<div class="modal-body text-center">
					<div class="img mb-4">
						<img src="asset/img/verified.png" alt="modelImg">
					</div>
					<h3 class="modal-title text-center">Success</h3>
					<p>Please Check Your Email.</p>

				</div><!-- modal-body -->
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

const saveCommonlyUsed = async (deleteReq = false, data_) => {
  const { post, GAS, database } = d;
  let selectFilesList = document.querySelectorAll("#selectFilesList input");
  let button = document.querySelector(
    `${deleteReq ? "#deleteBtn" : "#saveBtn"}`
  );
  let loading = document.querySelector("#loading");
  button.disabled = true;
  button.innerText = "Processing..";

  const data = [];
  for (let input of selectFilesList) {
    let file = input.getAttribute("file");

    if (deleteReq && input.checked) continue;

    data.push([file]);
  }

  loading.style.display = "block";

  let res = await post(GAS, {
    type: 20,
    data: JSON.stringify({
      lists: data,
      database: database,
    }),
  });

  res = JSON.parse(JSON.parse(res).messege);

  if (res.result === true) {
    document.querySelector("#statusModel img").src = "./asset/img/verified.png";
    document.querySelector("#statusModel h3").innerText = "Success";
    document.querySelector("#statusModel p").innerText = deleteReq
      ? "Deleted successfully."
      : "Saved successfully.";
    $("#statusModel").modal("show");
  } else {
    document.querySelector("#statusModel img").src = "./asset/img/error.png";
    document.querySelector("#statusModel h3").innerText = "Error";
    document.querySelector("#statusModel p").innerText =
      "Something went wrong. Please try again.";
    $("#statusModel").modal("show");
  }
  button.disabled = false;
  button.innerText = deleteReq ? "Delete" : "Save";
  loading.style.display = "none";

  $(button).hide();

  if (deleteReq) {
    showData(data_, data);
  }
};

window.checkedUpdate = checkedUpdate;

const showData = (data, commonlyUsedData) => {
  let selectFilesList = document.querySelector("#selectFilesList");
  let loading = document.querySelector("#loading");
  let result = "";

  let index = 0;
  for (let x of commonlyUsedData) {
    let id = {
      id: index,
      file: x[0],
    };

    let name = data.find((y) => y[2] === x[0])?.[1];

    if (!name) continue;

    result += `
    <div class="input-checkbox">
      <input index="${id.id}" file="${
      id.file
    }" onchange="checkedUpdate()" type="checkbox" name="" id="file_${id.id}" />
      <label for="file_${id.id}" style="color: #004a7f"
        >${name.substr(1)}</label
      >
    </div>
    `;
    index++;
  }

  selectFilesList.innerHTML = `
	${result}
  `;

  $("#selectFilesList").sortable({
    change: function (event, ui) {
      checkedUpdate();

      let saveBtn = document.querySelector("#saveBtn");
      $(saveBtn).show();
    },
  });

  loading.style.display = "none";
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

const commonlyUsedPageLoad = (data, commonlyUsedData) => {
  commonLoad();
  showData(data, commonlyUsedData);

  let selectAllBtn = document.querySelector("#selectAllBtn");

  selectAllBtn.onclick = selectAllBtnClicked;
  selectAll = false;

  let deleteBtn = document.querySelector("#deleteBtn");
  let saveBtn = document.querySelector("#saveBtn");

  deleteBtn.onclick = () => {
    saveCommonlyUsed(true, data);
  };

  saveBtn.onclick = () => {
    saveCommonlyUsed(false, data);
  };
};

export { commonlyUsedPage, commonlyUsedPageLoad };
