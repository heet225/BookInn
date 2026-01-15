if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const path = require("path");
const method_overrride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const DBURL = process.env.ATLASDB_URL;

const listingsRoutes = require("./routes/listings.js");
const reviewsRoutes = require("./routes/reviews.js");
const usersRoutes = require("./routes/users.js");

app.engine("ejs", ejsMate);
app.use(express.json());
app.use(method_overrride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

async function main() {
  await mongoose.connect(DBURL);
  console.log("MongoDB connected");
}

main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const store = new MongoStore({
  mongoUrl: DBURL,
  collectionName: "sessions",
  ttl: 7 * 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("ERROR in mongo session store", e);
});

const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});

// use listings routes
app.use("/listings", listingsRoutes);
// use reviews routes
app.use("/listings/:id/reviews", reviewsRoutes);
// use users routes
app.use("/", usersRoutes);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// error handling middleware
app.use((err, req, res, next) => {
  console.log("Error caught:", err.message);
  console.log("Request URL:", req.originalUrl);
  if (res.headersSent) {
    return next(err);
  }
  let { statuscode, message } = err;
  if (!statuscode) statuscode = 500;
  if (!message) message = "Something went wrong!";
  res.status(statuscode).render("error.ejs", { message });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
