require("dotenv").config();

const express = require("express");
const passport = require("passport");
require("./config/passport");
const cookieParser = require("cookie-parser");
const {sessionChecker1, adminChecker} = require("./middlewares/sessionCheck");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const paperRoutes = require("./routes/paperRoutes");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/", paperRoutes);
app.use("/admin", sessionChecker1,adminChecker, (req, res, next)=>{
  res.set("Cache-Control", "no-store");
  next();
}, adminRoutes);

app.listen(PORT, () => console.log("Server running"));