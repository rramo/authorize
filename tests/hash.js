const argon2 = require("argon2");

const pwd = "coucou";

argon2
  .hash(pwd)
  .then(h => {
    console.log("hashed password:", h);
    console.log(": ", h.p);
    return argon2.verify(h, "coucou");
  })
  .then(r => console.log("login successful ?", r));
