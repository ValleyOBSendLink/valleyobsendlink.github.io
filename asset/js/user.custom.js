import { login, loginLoad } from "../../modules/user/login.js";

console.log("ValleyOB Send Link Application for User.");

document.querySelector("#root").innerHTML = login;
loginLoad();
