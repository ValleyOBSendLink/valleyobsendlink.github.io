function myFunction() {
  let oldss = SpreadsheetApp.openByUrl(
    "https://docs.google.com/spreadsheets/d/1btLOqm73Me_C-7Hv_tLy8Io5-nUr-KiVJWvaWOpTdjg/edit#gid=1375385591"
  );
  let oldFiles = oldss.getSheetByName("documents");

  let ss = SpreadsheetApp.openByUrl(CONFIG.dbURL);
  let sheet = ss.getSheetByName("documents");

  let oldData = oldFiles
    .getDataRange()
    .getDisplayValues()
    .map((row) => {
      return [
        row[0].slice(1),
        Utilities.getUuid(),
        row[1].slice(1),
        row[2].slice(1),
      ];
    });

  sheet.getRange(2, 1, oldData.length, oldData[0].length).setValues(oldData);
}

function moveUseData() {
  let oldss = SpreadsheetApp.openByUrl(
    "https://docs.google.com/spreadsheets/d/16U71DK779oSIpDsNmMUKbLL0M0xgixulvrcp7DciWp4/edit#gid=0"
  );
  let oldFiles = oldss.getSheetByName("history");

  let ss = SpreadsheetApp.openByUrl(CONFIG.dbURL);
  let sheet = ss.getSheetByName("user@valleyobcare.com");

  let oldData = oldFiles
    .getDataRange()
    .getDisplayValues()
    .map(([ts_, ts, email, name, id]) => {
      return [
        ts.slice(1),
        Utilities.getUuid(),
        email.slice(1),
        name.slice(1),
        undefined,
        id.slice(1),
      ];
    });

  sheet.getRange(1, 1, oldData.length, oldData[0].length).setValues(oldData);
}
