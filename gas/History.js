function History_({ uid, historyTime }) {
  let ss = SpreadsheetApp.openByUrl(CONFIG.dbURL);
  let allSheets = ss.getSheets();

  let history = [];

  for (let sheet of allSheets) {
    if (uid) sheet = ss.getSheetByName(uid);

    let sheetName = sheet.getName();

    if (sheetName.includes("@")) {
      let data_ = sheet.getDataRange().getDisplayValues();

      data_.forEach(([ts, id, email, fileName, fileId, linkId]) => {
        if (id) {
          if (
            historyTime != undefined &&
            new Date() - new Date(ts) > historyTime * 24 * 60 * 60 * 1000
          )
            return;

          history.push({
            ts,
            id,
            email,
            fileName,
            downLoadUrl: `https://drive.google.com/uc?export=download&id=${linkId}`,
            username: historyTime == undefined ? sheetName : undefined,
          });
        }
      });
    }

    if (uid) break;
  }

  history.sort((a, b) => new Date(b.ts) - new Date(a.ts));

  return history;
}

function UserHistory_(payload, { username, history }) {
  return History_({ uid: username, historyTime: history || 0 });
}

ACTIONS["/admin/get-history"] = AdminCheck_(History_);

ACTIONS["/user/get-history"] = UserCheck_(UserHistory_);
