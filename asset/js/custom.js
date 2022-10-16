import { login, loginLoad } from "../../modules/admin/login.js";

console.log("ValleyOB Send Link Application.");

document.querySelector("#root").innerHTML = login;
loginLoad();
