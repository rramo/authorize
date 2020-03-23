const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

const { db } = require("./services/db");
const authorization = require("./middleware/authorization");

const sendMail = require("./services/mail/sendMail").default;

const privateKey = fs.readFileSync(
  path.join(__dirname, "./services/key/private.key"),
  "utf8"
);
const publicKey = fs.readFileSync(
  path.join(__dirname, "./services/key/public.key"),
  "utf8"
);

let { debug, info } = console;

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
  if (user) {
    argon2.verify(user.password, password).then(legit => {
      if (!legit) {
        res.sendStatus(401);
        return;
      }
      if (!user.confirmed) {
        res.status(401).json({
          code: "account_not_confirmed",
          message: "account not confirmed by the email confirmation link"
        });
      }
    });
  } else {
    res.sendStatus(401);
    return;
  }

  const token = jwt.sign({ sub: user.email }, privateKey, signOptions);
  res.header("token", token);
  res.status(200).json({ code: "authorize", message: "access authorized" });
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
      `<b>Please click <a href='http://localhost:${process.env.VUE_APP_AUTH_PORT}/register/confirmation?token=${token}'>here</a> to confirm your RRAMO account</b>`
    );

    debug(
      "confirmation link:",
      `http://localhost:${process.env.VUE_APP_AUTH_PORT}/register/confirmation?token=${token}`
    );

    argon2
      .hash(password)
      .then(hashedPassword => {
        let userid = db.users.create({
          ...newUser,
          password: hashedPassword.toString()
        });
        console.log(`account n°${userid} created`);

        res.status(200).json({
          code: "confirm_link_sent",
          message: "confirmation link sent"
        });
      })
      .catch(err => res.status(500).json({ code: "error", message: err }));
  } catch (err) {
    err => res.status(500).json({ code: "error", message: err });
  }
});

app.get("/register/confirmation", (req, res) => {
  let token = req.query.token;
  console.log("confirmation with token: ", token);
  try {
    let payload = jwt.verify(token, publicKey, {
      ...signOptions,
      expiresIn: "72h"
    });
    let userToConfirm = db.users.list().find(u => u.email === payload.email);
    if (!userToConfirm) {
      res.sendFile(
        path.join(__dirname, "views/account/confirmationFailed.html")
      );
    }
    if (!userToConfirm.confirmed || userToConfirm.confirmed !== true) {
      db.users.update({ ...userToConfirm, confirmed: true });
      res.status(200).json({ code: "confirmed", message: "confirmed" });
    } else {
      res.status(200).json({ code: "already", message: "already confirmed" });
    }
  } catch (err) {
    res.status(200).json({
      code: "invalid_code",
      message: "confirmation code invalid or expired"
    });
  }
});

app.get("/details", authorization, (req, res) => {
  const user = db.users.list().find(u => u.email === req.user.email);
  res.send(`Welcome ${user.lastname}, you're authorized to see this page!`);
});

app.get("/users/email/:email", (req, res) => {
  let email = req.params.email;
  console.log("email: ", email);
  let user = db.users.list().find(u => u.email === email);
  if (user) {
    res.status(200).json(user);
  } else {
    res.sendStatus(404);
  }
});

app.listen(process.env.VUE_APP_AUTH_PORT, () =>
  console.log(
    `server running and listenning on port ${process.env.VUE_APP_AUTH_PORT}`
  )
);
