function Login_({ username, password, type, loginIp }, userInfo) {
  if (!username) throw new Error("User name is required!");

  if (!password) throw new Error("Password is required!");

  if (!type) throw new Error("Type is required!");

  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(username)) {
    throw new Error("Please enter valid username!");
  }

  if (type != "admin" && type != "user") {
    throw new Error("Type is invalid!");
  }

  if (type == "user" && !loginIp) {
    throw new Error("Ip is required!");
  }

  let ss = SpreadsheetApp.openByUrl(CONFIG.dbURL);

  let sheet = ss.getSheetByName(CONFIG.userDB);

  let data = sheet.getDataRange().getDisplayValues().slice(1);
  let isValid = false;
  let userData = {};

  for (let i = 0; i < data.length; i++) {
    const [username_, password_, role, history, ip, folderId, backup] = data[i];

    if (username == username_ && role == type) {
      if (password != password_) {
        throw new Error("Password is not correct");
      }

      if (
        type == "user" &&
        ip &&
        ip.toString().split("\n").indexOf(loginIp) == -1
      ) {
        throw new Error("Unauthorized Access. Contact System Administrator.");
      }

      isValid = true;

      userData = {
        role: type,
        id: i + 2,
        history: type == "user" ? history : undefined,
        folderId: type == "user" ? folderId : undefined,
        uid:
          type == "user" ? ss.getSheetByName(username).getSheetId() : undefined,
        username,
      };
    }
  }

  if (!isValid) throw new Error("Username is not found!");

  return {
    token: generateAccessToken_(userData),
  };
}

ACTIONS["/login"] = Login_;
