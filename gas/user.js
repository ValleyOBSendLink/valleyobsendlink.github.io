function UserCheck_(CallBack) {
  return (payload, userData) => {
    if (userData.role !== "user") {
      throw new Error("Unauthorize Access!");
    }

    let sheet = SpreadsheetApp.openByUrl(CONFIG.dbURL).getSheetByName(
      userData.username
    );

    if (!sheet) {
      throw new Error("Unauthorize Access!");
    }

    return CallBack(payload, userData);
  };
}

function GetHomeInfo_() {
  let ss = SpreadsheetApp.openByUrl(CONFIG.dbURL);
  let fileSheet = ss.getSheetByName(CONFIG.filesDB);
  let moseUsedSheet = ss.getSheetByName(CONFIG.commonlyUsedDB);

  let files = fileSheet.getDataRange().getDisplayValues().slice(1);
  let data = moseUsedSheet.getDataRange().getDisplayValues().slice(1);

  let fileObj = {};
  let filesArr = [];
  files.forEach(([ts, id, name, fileId]) => {
    let obj = {
      name,
      id,
      link: `https://drive.google.com/file/d/${fileId}`,
    };
    fileObj[id] = obj;
    filesArr.push(obj);
  });

  let mostlyUsedArr = [];

  let mostCommonUsedCurrentIndex = -1;

  data.forEach(([ts, id, fileId]) => {
    let currentId = mostlyUsedArr[mostCommonUsedCurrentIndex]?.id;

    if (id != currentId) {
      mostlyUsedArr.push({
        id,
        files: [],
      });
      mostCommonUsedCurrentIndex++;
    }

    let file = fileObj[fileId];

    if (!file) return;

    mostlyUsedArr[mostCommonUsedCurrentIndex].files.push(file);
  });

  return {
    files: filesArr,
    mostUsed: mostlyUsedArr,
  };
}

ACTIONS["/user/get-home-info"] = UserCheck_(GetHomeInfo_);

function SendLink_({ email, files }, { username }) {
  if (!email) throw new Error("Email is required!");

  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    throw new Error("Please enter valid User Email!");
  }

  if (!files) {
    throw new Error("Files are required!");
  }

  if (!Array.isArray(files)) {
    throw new Error("Files are must be array!");
  }

  let ss = SpreadsheetApp.openByUrl(CONFIG.dbURL);
  let fileSheet = ss.getSheetByName(CONFIG.filesDB);
  let sheet = ss.getSheetByName(username);

  let filesData = fileSheet.getDataRange().getDisplayValues().slice(1);

  let filesArr = [];
  let fileObj = {};
  filesData.forEach(([ts, id, name, fileId]) => {
    let obj = {
      name,
      id,
      fileId,
      link: `https://drive.google.com/uc?export=download&id=${fileId}`,
    };

    fileObj[id] = obj;
  });

  files.forEach((id) => {
    if (fileObj[id]) {
      filesArr.push(fileObj[id]);
    }
  });

  if (filesArr.length == 0) {
    throw new Error("Files need to select at least one.");
  }

  sendEmail_({
    to: email,
    subject: "Valley OBGYN Secure Message",
    html: secureMessageTemplate_(filesArr),
    bcc: GetBackUpEmail_() || undefined,
    token: generateAccessToken_({}),
  });

  let ts = new Date().toISOString();

  filesArr.forEach((file) => {
    sheet.appendRow([
      ts,
      Utilities.getUuid(),
      email,
      file.name,
      file.id,
      file.fileId,
    ]);
  });

  return "success";
}

ACTIONS["/user/send"] = UserCheck_(SendLink_);
