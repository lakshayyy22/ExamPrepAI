const express = require("express");
const passport = require("passport");
const { loginLocally, signupLocally } = require("../controllers/auth");
const { setUser } = require("../services/auth");
const {sessionChecker2} = require("../middlewares/sessionCheck")

const router = express.Router();

router.get("/login",  sessionChecker2,(req,res)=> res.render("login", {msg: req.query.msg}));
router.get("/signup",  sessionChecker2,(req,res)=> res.render("signup", {msg: req.query.msg}));

router.post("/loginauth", loginLocally);
router.post("/signupauth", signupLocally);

router.get("/auth/google/login",
    passport.authenticate("google",{ scope:["profile","email"], session:false, state:"login" })
);

router.get("/auth/google/signup",
  passport.authenticate("google",{scope:["profile", "email"], session: false, state: "signup" })
)

router.get("/auth/google/callback", (req, res, next)=>{
    passport.authenticate("google",{ session:false}, (err, user, info)=>{
        if(err) return next(err);
        if(!user){
            const state = req.query.state;
            if(state === "signup"){
            return res.redirect("/signup?msg=failed");
            }
            else{
                return res.redirect("/login?msg=failed");
            }
        }
        const token = setUser(user);
        res.cookie("S_id", token);
        res.redirect("/dashboard");
    })(req,res, next);
});

router.get("/logout", (req, res)=>{
    res.clearCookie("S_id");
    return res.redirect("/");
})

module.exports = router;