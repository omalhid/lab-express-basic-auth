const { Router } = require("express");
const router = new Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");
const { isLoggedIn } = require("../middleware/route.guard");

//GET route to display the signup form
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

// POST route to process form data
router.post("/signup", (req, res, next) => {
  console.log("Signup form data", req.body);

  const { username, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      //   console.log(`Pssword hash: ${hashedPassword}`)
      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      //   console.log('Newly created user is:', userFromDB)
      res.redirect("/private");
    })
    .catch((error) => next(error));
});

//GET route for displaying the login form
router.get("/login", (req, res) => {
  res.render("auth/login");
});

//POST route for processing login form data
router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        console.log("Username not registered");
        res.render("auth/login", {
          errorMessage: "User not found and/or incorrect password.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.render("user/private", { user });
      } else {
        console.log("Incorrect password.");
        res.render("auth/login", {
          errorMessage: "User not found and/or incorrect password.",
        });
      }
    })
    .catch((error) => next(error));
});

//GET route for private page
router.get("/private", isLoggedIn, (req, res) => {
  res.render("user/private", { user: req.session.currentUser });
});

//GET route for main page
router.get("/main", (req, res) => {
  res.render("user/main");
});

//POST route for logginout
router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/main");
  });
});

module.exports = router;
