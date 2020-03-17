const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");

const { db } = require("./db");
const isAuth = require("./middleware/is-auth");

const sendMail = require("./mail/sendMail").default;

const privateKey = fs.readFileSync(
  path.join(__dirname, "./key/private.key"),
  "utf8"
);
const publicKey = fs.readFileSync(
  path.join(__dirname, "./key/public.key"),
  "utf8"
);

const signOptions = {
  algorithm: "RS256",
  expiresIn: "1h",
  issuer: process.env.ISSUER
};

app.use(express.static("dist"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/authorize", (req, res) => {
  const { email, password } = req.body;
  const user = db.users.list().find(u => u.email === email);
  if (!(user && user.password === password)) {
    res.sendStatus(401);
    return;
  }

  const token = jwt.sign({ sub: user.email }, privateKey, signOptions);
  res.header("token", token);
  res.sendStatus(200);
});

app.post("/register", async (req, res) => {
  const { lastname, firstname, email, password } = req.body;
  const newUser = { lastname, firstname, email };

  try {
    const token = jwt.sign(newUser, privateKey, {
      ...signOptions,
      expiresIn: "24h"
    });

    await sendMail(
      email,
      "RRAMO account confirmation",
      `<b>Please click <a href='http://localhost:9000/register/confirmation?token=${token}'>here</a> to confirm your RRAMO account</b>`
    );

    // Creating a unique salt for a particular user
    // const salt = crypto.randomBytes(16).toString("hex");
    // console.log("==============================================");
    // console.log("SALT password ===> ", salt);
    // console.log("==============================================");

    // Hashing user's salt and password with 1000 iterations, 64 length and sha512 digest
    const hashPassword = crypto
      .pbkdf2(password, process.env.SALT, 1000, 64, `sha512`)
      .toString(`hex`);

    console.log(
      "new user: ",
      JSON.stringify({ ...newUser, password: hashPassword })
    );
    let userid = db.users.create({ ...newUser, password: hashPassword });
    console.log(`account n°${userid} created`);

    res.sendFile("account/confirmationLinkSent.html");
  } catch (err) {
    res.sendStatus(500);
  }
});

app.get("/register/confirmation", (req, res) => {
  let token = req.params.token;
  try {
    let payload = jwt.verify(token, publicKey, {
      ...signOptions,
      expiresIn: "72h"
    });
    let userToConfirm = db.users.find(u => u.email === payload.email);
    if (!userToConfirm) {
      res.sendFile("account/confirmationFailed.html");
    }
    if (!userToConfirm.confirmed || userToConfirm.confirmed !== true) {
      db.users.update({ ...userToConfirm, confirmed: true });
      res.sendFile("account/confirmed.html");
    } else {
      res.sendFile("account/alreadyConfirmed.html");
    }
  } catch (err) {
    res.sendFile("account/confirmationCodeNotValid.html");
  }
});

app.get("/details", isAuth, (req, res) => {
  const user = db.users.list().find(u => u.email === req.user.email);
  res.send(`Welcome ${user.lastname}, you're authorized to see this page!`);
});

app.listen(process.env.PORT, () =>
  console.log(`server running and listenning on port ${process.env.PORT}`)
);
