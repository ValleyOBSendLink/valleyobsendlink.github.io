function myFunction() {
  let oldss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1btLOqm73Me_C-7Hv_tLy8Io5-nUr-KiVJWvaWOpTdjg/edit#gid=1375385591");
  let oldFiles = oldss.getSheetByName("documents");

  let ss = SpreadsheetApp.openByUrl(CONFIG.dbURL);
  let sheet = ss.getSheetByName("documents");

  let oldData = oldFiles.getDataRange().getDisplayValues().map(row => {
    return [row[0].slice(1),Utilities.getUuid(), row[1].slice(1), row[2].slice(1)]
  });

  sheet.getRange(2, 1, oldData.length, oldData[0].length).setValues(oldData)
}
