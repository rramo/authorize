const axios = require("axios");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const publicKey = fs.readFileSync("../src/services/key/public.key", "utf8");

const lastname = "test";
const firstname = "f1";
const email = "test@test.fr";
const password = "bibi";

axios({
  method: "post",
  url: `http://localhost:9000/register`,
  data: {
    lastname,
    firstname,
    email,
    password
  }
}).then(data => {
  console.log(data);
  console.log("-----------------------------");
  let token = data.token;
  console.log("verify: ", jwt.verify(token, publicKey, { algorithm: "RS256" }));
  console.log("-----------------------------");
  let decoded = jwt.decode(token, { complete: true });
  console.log("header: ", decoded.header);
});
