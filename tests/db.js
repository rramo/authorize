const { db } = require("../src/services/db");
let u = db.users.list().find(u => u.email === "omar.djelassi@gmail.com");
console.log(u);
