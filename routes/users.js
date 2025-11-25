const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveredirectUrl } = require("../middleware.js");

// new user registration form
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// handle user registration
router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      console.log(registeredUser);

      req.login(registeredUser, (err) => {
        if (err) {
          console.error("Login error:", err);
          req.flash("error", "Error logging in after registration");
          return res.redirect("/signup");
        }
        req.flash("success", "Welcome to BookInn!");
        res.redirect("/listings");
      });
    } catch (e) {
      console.error("Registration error:", e);
      console.error("Stack:\n", e.stack);
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

// user login form
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// handle user login
router.post(
  "/login",
  saveredirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back to BookInn!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/listings");
  });
});

module.exports = router;
