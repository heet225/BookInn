const User = require("../models/user.js");
const passport = require("passport");
const listings = require("../models/listing.js");

// new user registration form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// handle user registration
module.exports.Signup = async (req, res) => {
    try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to BookInn!");
        res.redirect("/listings");
    });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// handle user login
module.exports.Login =  (req, res) => {
    req.flash("success", "Welcome back to BookInn!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// handle user logout
module.exports.Logout = (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash("success", "Goodbye!");
        res.redirect("/listings");
    });
};