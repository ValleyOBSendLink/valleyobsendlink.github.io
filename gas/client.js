function VerifyDOB_({ id = "", dob }) {
  if (!id) throw new Error("Link is expired or is not valid! (code: 1)");

  if (!dob) throw new Error("Date of Birth is required!");

  if (!/^(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])\-\d{4}$/.test(dob)) {
    throw new Error("Invalid Date of Birth. It should be MM-DD-YYYY");
  }

  let [messageId, sheetId] = id.toString().split(".");

  if (!messageId) {
    throw new Error("Link is expired or is not valid! (code: 2)");
  }

  if (!sheetId) {
    throw new Error("Link is expired or is not valid! (code: 3)");
  }

  let ss = SpreadsheetApp.openByUrl(CONFIG.dbURL);
  let sheets = ss.getSheets();

  for (let i = 0; i < sheets.length; i++) {
    let sheet = sheets[i];

    // console.log(sheet.getSheetId());

    // console.log(sheetId);
    if (sheet.getSheetId() != sheetId) continue;

    let data = sheet.getRange(`A1:I${sheet.getLastRow()}`).getDisplayValues();

    // console.log(data);

    let findRow = null;

    for (let i = 0; i < data.length; i++) {
      let [date, id__, id_, status, fildId, fileName, name, email, dob_] =
        data[i];

      if (new Date(date) - new Date() > 30 * 24 * 60 * 60 * 1000) continue;

      // console.log(`'${id}' || '${id_}'`)

      if (id != id_) continue;

      // console.log(id);

      if (status != "sent") {
        throw new Error("Link is expired or is not valid! (code: 4)");
      }

      if (dob != dob_) {
        throw new Error("Please enter correct Date of Birth!");
      }

      findRow = i + 1;

      let newMessageId = Utilities.getUuid() + "." + sheetId;

      sendEmail_({
        to: email,
        toName: name,
        subject: "Valley OBGYN Secure Message",
        html: secureMessageTemplate_(),
        bcc: GetBackUpEmail_() || undefined,
        token: generateAccessToken_({}),
        attachments: [
          {
            name: fileName,
            content: `https://drive.google.com/uc?export=download&id=${fildId}`,
          },
        ],
      });

      sheet
        .getRange(`A${findRow}:D${findRow}`)
        .setValues([
          [new Date().toISOString(), id__, newMessageId, "verified"],
        ]);

      return "success";
    }

    if (findRow == null) {
      throw new Error("Link is expired or is not valid! (code: 5)");
    }
  }

  throw new Error("Link is expired or is not valid! (code: 6)");
}

ACTIONS["/verify"] = VerifyDOB_;
