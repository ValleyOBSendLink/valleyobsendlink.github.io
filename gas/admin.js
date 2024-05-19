function AdminCheck_(CallBack) {
  return (payload, userData) => {
    if (userData.role !== "admin") {
      throw new Error("Unauthorize Access!");
    }

    return CallBack(payload, userData);
  };
}

function AddUser_(
  { email, password, history: userHistory, ip: userIp },
  { role, id, history, folderId }
) {
  if (!email) throw new Error("User Email is required!");

  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    throw new Error("Please enter valid User Email!");
  }

  if (!password) throw new Error("Password is required!");

  if (userHistory == undefined) {
    throw new Error("History is required!");
  }

  if (![0, 7, 30, 90, 180, 365].includes(Number(userHistory))) {
    throw new Error(`History must be ${[0, 7, 30, 90, 180, 365].join(" or ")}`);
  }

  let ss = SpreadsheetApp.openByUrl(CONFIG.dbURL);
  let sheet = ss.getSheetByName(CONFIG.userDB);

  let data = sheet.getDataRange().getValues().slice(1);

  let isExist = false;

  for (let [username, password, role] of data) {
    if (username == email && role == "user") {
      isExist = true;
      break;
    }
  }

  if (isExist) throw new Error("User already exist!");

  sheet.appendRow([
    email,
    password,
    "user",
    userHistory,
    userIp,
    Utilities.getUuid(),
  ]);

  ss.insertSheet(email);
}

ACTIONS["/admin/add-user"] = AdminCheck_(AddUser_);

function GetUsers_(payload, { role, id, history, folderId }) {
  let ss = SpreadsheetApp.openByUrl(CONFIG.dbURL);
  let sheet = ss.getSheetByName(CONFIG.userDB);

  let data = sheet.getDataRange().getValues().slice(1);

  let finalData = [];

  for ([username, password, role, history, ip, userId] of data) {
    if (role == "user") {
      finalData.push({
        email: username,
        password,
        history,
        ip,
        id: userId,
      });
    }
  }

  return finalData;
}

ACTIONS["/admin/get-users"] = AdminCheck_(GetUsers_);

function GetBackUpEmail_() {
  let props = PropertiesService.getScriptProperties();
  let email_ = props.getProperty(BACKUP_EMAIL_PROPS);

  return email_ || "";

  let link = "https://api.valleyobreceipt.workers.dev/admin/get-backup";

  let res = UrlFetchApp.fetch(link, {
    method: "POST",
    payload: JSON.stringify({
      token: generateAccessToken_({
        role: "admin",
      }),
    }),
  });

  let json = JSON.parse(res.getContentText());

  if (!json.status) {
    throw new Error(json.error);
  }

  let email = json.data || "";

  return email;
}

ACTIONS["/admin/get-backup"] = AdminCheck_(GetBackUpEmail_);

function SetBackUpEmail_({ email }) {
  // if (!email) throw new Error("Backup Email is required!");

  if (email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    throw new Error("Please enter valid User Email!");
  }

  let props = PropertiesService.getScriptProperties();
  props.setProperty(BACKUP_EMAIL_PROPS, email || "");

  return "success";
}

ACTIONS["/admin/set-backup"] = AdminCheck_(SetBackUpEmail_);

function ForgetPassword_() {
  let ss = SpreadsheetApp.openByUrl(CONFIG.dbURL);

  let sheet = ss.getSheetByName(CONFIG.userDB);

  let data = sheet.getDataRange().getDisplayValues().slice(1);

  let email = GetBackUpEmail_();

  if (!email) {
    throw new Error("BackUp Email Not Found!");
  }

  for ([username, password, role, history, ip, folderId] of data) {
    if (role == "admin") {
      sendEmail_({
        to: email,
        subject: "ValleyOb Send Link Admin Password.",
        html: `<span
          style="
            font-size: 12pt;
            font-family: Arial, sans-serif;
            color: rgb(34, 34, 34);
            background-color: transparent;
            font-variant-numeric: normal;
            font-variant-east-asian: normal;
            vertical-align: baseline;
          "
          >Password: ${password}</span>`,
        token: generateAccessToken_({}),
      });
      break;
    }
  }

  return true;
}

ACTIONS["/admin/forget-password"] = ForgetPassword_;

function ChangePassword_({ currentPassword, newPassword }) {
  if (!currentPassword) {
    throw new Error("Current Password is required!");
  }

  if (!newPassword) {
    throw new Error("New Password is required!");
  }

  if (newPassword.length <= 5) {
    throw new Error("New Password should be minimum 6 length!");
  }

  let ss = SpreadsheetApp.openByUrl(CONFIG.dbURL);

  let sheet = ss.getSheetByName(CONFIG.userDB);

  let data = sheet.getDataRange().getDisplayValues().slice(1);

  for (let i = 0; i < data.length; i++) {
    const [username, password, role, history, ip, folderId] = data[i];
    if (role == "admin") {
      if (currentPassword != password) {
        throw new Error("Current Password is not match!");
      }

      sheet.getRange(`B${i + 2}`).setValue(newPassword);
      return true;
    }
  }
}

ACTIONS["/admin/change-password"] = AdminCheck_(ChangePassword_);

function DeleteHistory_({
  uid,
  id: messageId,
  deleteAll,
  isPermanent = false,
}) {
  let ss = SpreadsheetApp.openByUrl(CONFIG.dbURL);

  if (deleteAll) {
    let userSheet = ss.getSheetByName(CONFIG.userDB);

    let userData = userSheet.getDataRange().getValues().slice(1);

    for (let i = 0; i < userData.length; i++) {
      const [username, password, role, history, ip] = userData[i];

      if ((uid ? username == uid : true) && role == "user") {
        let sheet = ss.getSheetByName(username);
        sheet.clear();

        if (isPermanent) {
          ss.deleteSheet(sheet);
          userSheet.deleteRow(i + 2);
        }

        if (uid) return true;
      }
    }

    return true;
  }

  if (!uid) throw new Error("User ID is required!");

  let sheet = ss.getSheetByName(uid);
  let data = sheet.getDataRange().getDisplayValues();

  for (let i = 0; i < data.length; i++) {
    const [ts, id, id_, status, fildId] = data[i];

    if (messageId == id) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
}

ACTIONS["/admin/delete-history"] = AdminCheck_(DeleteHistory_);

function GetDocuments_() {
  let ss = SpreadsheetApp.openByUrl(CONFIG.dbURL);
  let sheet = ss.getSheetByName(CONFIG.filesDB);

  let data = sheet.getDataRange().getDisplayValues().slice(1);

  return data.map((row) => {
    return {
      id: row[1],
      name: row[2],
    };
  });
}

ACTIONS["/admin/get-files"] = AdminCheck_(GetDocuments_);

function AddDocument_({ base64, name }) {
  if (!name) {
    throw new Error("File name is required!");
  }

  if (!base64) {
    throw new Error("File base64 is required");
  }

  let id = fileUpload_(
    new Date().getTime() + " " + name,
    base64,
    CONFIG.filesFolderId
  );

  if (!id) {
    throw new Error("Failed to upload file!");
  }

  let ss = SpreadsheetApp.openByUrl(CONFIG.dbURL);
  let sheet = ss.getSheetByName(CONFIG.filesDB);
  sheet.appendRow([new Date().toISOString(), Utilities.getUuid(), name, id]);

  return "success";
}

ACTIONS["/admin/add-file"] = AdminCheck_(AddDocument_);

function DeleteDocuments_({ ids }) {
  if (!ids) {
    throw new Error("Ids are required!");
  }

  if (!Array.isArray(ids)) {
    throw new Error("Ids are must be Array.");
  }

  let ss = SpreadsheetApp.openByUrl(CONFIG.dbURL);
  let sheet = ss.getSheetByName(CONFIG.filesDB);

  let data = sheet.getDataRange().getDisplayValues().slice(1);

  let index = 0;
  data.forEach((row) => {
    let rowNum = index + 2;
    let fileId = row[3];
    let id = row[1];
    index++;

    if (ids.includes(id)) {
      try {
        Drive.Files.remove(fileId);
      } catch (err) {}
      sheet.deleteRow(rowNum);
      index--;
    }
  });

  return "success";
}

ACTIONS["/admin/delete-files"] = AdminCheck_(DeleteDocuments_);

function AddToMostUsed_({ ids }) {
  if (!ids) {
    throw new Error("Ids are required!");
  }

  if (!Array.isArray(ids)) {
    throw new Error("Ids are must be Array.");
  }

  let ss = SpreadsheetApp.openByUrl(CONFIG.dbURL);
  let sheet = ss.getSheetByName(CONFIG.commonlyUsedDB);
  let data = ss
    .getSheetByName(CONFIG.filesDB)
    .getDataRange()
    .getValues()
    .slice(1)
    .map((v) => v[1]);

  let id = Utilities.getUuid();
  let ts = new Date().toISOString();

  ids.forEach((v) => {
    if (data.includes(v)) {
      sheet.appendRow([ts, id, v]);
    }
  });

  return "success";
}

ACTIONS["/admin/add-to-most-used"] = AdminCheck_(AddToMostUsed_);

function GetMostUsed_() {
  let ss = SpreadsheetApp.openByUrl(CONFIG.dbURL);
  let fileSheet = ss.getSheetByName(CONFIG.filesDB);
  let moseUsedSheet = ss.getSheetByName(CONFIG.commonlyUsedDB);

  let files = fileSheet.getDataRange().getDisplayValues().slice(1);
  let data = moseUsedSheet.getDataRange().getDisplayValues().slice(1);

  let fileObj = {};
  files.forEach(([ts, id, name, fileId]) => {
    fileObj[id] = {
      name,
      id,
    };
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

  return mostlyUsedArr;
}

ACTIONS["/admin/get-most-used"] = AdminCheck_(GetMostUsed_);

function RemoveMostUsed_({ ids }) {
  if (!ids) {
    throw new Error("Ids are required!");
  }

  if (!Array.isArray(ids)) {
    throw new Error("Ids are must be Array.");
  }

  let ss = SpreadsheetApp.openByUrl(CONFIG.dbURL);
  let sheet = ss.getSheetByName(CONFIG.commonlyUsedDB);

  let data = sheet.getDataRange().getDisplayValues().slice(1);

  let index = 0;
  data.forEach((row) => {
    let rowNum = index + 2;
    let fileId = row[2];
    let id = row[1];

    let finalId = `${id}_${fileId}`;
    index++;

    if (ids.includes(finalId)) {
      sheet.deleteRow(rowNum);
      index--;
    }
  });

  return "success";
}

ACTIONS["/admin/remove-most-used"] = AdminCheck_(RemoveMostUsed_);
