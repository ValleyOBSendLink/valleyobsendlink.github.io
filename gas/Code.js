function doPost(e) {
  try {
    let action = e.parameter.route;
    let token = e.parameter.token;

    let content = e.postData?.contents ?? {};

    if (typeof content === "string") {
      content = JSON.parse(content);
    }

    if (!action) throw new Error("route is required!");

    let functionName = ACTIONS[action];

    if (!functionName) throw new Error("route is not valid");

    if (
      !action.includes("/login") &&
      !action.includes("/verify") &&
      !action.includes("/admin/forget-password") &&
      !token
    )
      throw new Error("token is required!");

    let userInfo = {};
    if (
      !action.includes("/login") &&
      !action.includes("/verify") &&
      !action.includes("/admin/forget-password")
    )
      userInfo = parseJwt_(token);

    let result = functionName(content, userInfo);

    return ContentService.createTextOutput(
      JSON.stringify({
        status: true,
        data: result,
      })
    );
  } catch (err) {
    if (e.parameter.insertLogs) {
      insertErrorLogs_({ e, err });
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        status: false,
        error: err.message,
        stack: e.parameter.debug == 1 ? err.stack : undefined,
      })
    );
  }
}

function insertErrorLogs_({ e, err }) {
  try {
    let body = e;

    if (typeof body != "object") {
      body = JSON.parse(body);
    }

    let payload = body?.postData?.contents;

    if (typeof payload == "object") {
      payload = JSON.stringify(payload);
    }

    delete body?.postData?.contents;
    body = JSON.stringify(body);

    console.log({
      body,
      err: {
        message: err.message,
        stack: err.stack,
      },
    });

    let logSheet = SpreadsheetApp.openByUrl(
      "https://docs.google.com/spreadsheets/d/1L4MpBwDxRctTiZ_6kWxEFaxuA2PEPeF3G7rzz9paVOk/edit#gid=0"
    );

    let sheet = logSheet.getSheetByName("error");
    sheet.appendRow([
      new Date().toISOString(),
      body,
      payload?.substring(0, 45000),
      err.message,
      err.stack,
    ]);
  } catch (e) {}
}

function forAuth_() {
  DriveApp.getFolders();
  SpreadsheetApp.openById();
  UrlFetchApp.fetch();
}
