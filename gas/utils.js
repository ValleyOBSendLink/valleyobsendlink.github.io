const fileUpload_ = (fileName, base64, moveId) => {
  let spitBase = base64.split(",");
  let type = spitBase[0].split(";")[0].replace("data", "");
  let file = Utilities.newBlob(
    Utilities.base64Decode(spitBase[1]),
    type,
    fileName
  );
  file = DriveApp.createFile(file);
  // file = Drive.Files.insert({ title: fileName, mimeType: type }, file);
  let fileId = file.getId();
  if (moveId) {
    DriveApp.getFileById(fileId).moveTo(DriveApp.getFolderById(moveId));
  }

  return fileId;
};

const sendEmail_ = (
  {
    to,
    toName,
    subject,
    message,
    html,
    bcc,
    cc,
    attachments,
    fromName,
    token,
  } = {
    to: "test@gmail.com",
    toName: "To Name",
    subject: "Subject Name",
    message: "Message",
    html: "<p>HTML</p>",
    bcc: [],
    cc: [],
    fromName: "From Name",
    attachments: [
      { name: "filename", content: "base64 encoded content or link" },
    ],
    token: "",
  }
) => {
  let body = {
    to,
    toName,
    subject,
    message,
    html,
    bcc: Array.isArray(bcc) ? bcc : [bcc],
    cc,
    attachments,
    fromName,
    token,
    username: "no-reply.links@myvalleyob.com",
  };

  // throw new Error(JSON.stringify(body));

  let res = UrlFetchApp.fetch(CONFIG.emailEndpoint, {
    method: "POST",
    contentType: "application/json",
    muteHttpExceptions: true,
    payload: JSON.stringify(body),
  });

  if (res.getResponseCode() === 500)
    throw new Error(res.getContentText() || "UnAuthorized Access!");

  let jsonResonse;

  try {
    jsonResonse = JSON.parse(res.getContentText());
  } catch (e) {
    throw new Error(
      res
        .getContentText()
        ?.replace(
          new RegExp(
            "/home/u383252242/domains/myvalleyob.com/public_html/api/sendEmail.php"
              .split("/")
              .join("|"),
            "g"
          ),
          ""
        )
    );
  }

  if (jsonResonse.status) {
    return jsonResonse.message;
  } else {
    throw new Error(jsonResonse.error);
  }
};

function arrayToCSV_(array = [[]]) {
  return array
    .map((row) => {
      return row
        .map((cell) => (/,|"/.test(cell) ? '"' + cell + '"' : cell))
        .join(",");
    })
    .join("\n");
}
