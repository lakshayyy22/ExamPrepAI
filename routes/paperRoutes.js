const express = require("express");
const multer = require("multer");

const {getPapers,sendPaper,uploadPaper, getPaperStream} = require("../controllers/papers.js");

const { sessionChecker1 , homeCheck} = require("../middlewares/sessionCheck");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", homeCheck, async (req, res)=> res.render("index"));

router.get("/dashboard", sessionChecker1, async (req,res)=> res.render("dashboard", {msg: req.query.msg, user : req.user.role}));

router.get("/upload", sessionChecker1, async (req,res)=> res.render("upload"));

router.get("/papers",(req, res, next)=>{
  res.set("Cache-Control", "no-store");
  next();
}, getPapers);

router.get("/show/:id", getPaperStream); 

router.post("/upload-exam", sessionChecker1, upload.single("pdf"), uploadPaper);

router.get("/generate-ai", async (req,res)=> res.render("generate_ai"));

router.post("/generated-paper", sendPaper);

module.exports = router;