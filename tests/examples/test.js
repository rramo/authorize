const crypto = require("crypto");
const SALT = "6f16e2299f8ae9f696c7c0881f4c3c15";

crypto.pbkdf2("coucou", SALT, 10000, 64, "sha512", (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString("hex"));
  console.log("length = ", derivedKey.length);
});
