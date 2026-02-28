const express = require("express");
const adminRouter = express.Router();
const {getPendingPapers, approvePaper, rejectPaper, getApproved} = require("../controllers/adminRoles");

adminRouter.get("/", async(req, res)=>{
    return res.render("admin_dashboard");
})

adminRouter.get("/pending", getPendingPapers);

adminRouter.post("/approve/:id", approvePaper);

adminRouter.post("/reject/:id", rejectPaper);

adminRouter.get("/approved", getApproved);

module.exports = adminRouter
