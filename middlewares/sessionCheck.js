const {getUser} = require("../services/auth");

async function sessionChecker1(req, res, next){
    const s_id = req.cookies?.S_id;
    if(!s_id){
        return res.redirect("/login");
    }
    try{
        const user = getUser(s_id);
        if(!user){
            return res.redirect("/login");
        }
        req.user = user;
        next();
    } catch(err){
        return res.redirect("/login");
    }
}
async function sessionChecker2(req, res, next){
    const s_id = req.cookies?.S_id;
    if(!s_id){
        return next();
    }
    try{
        const user = getUser(s_id);
        if(!user){
            return next();
        }
        req.user = user;
        if(user.role === 'admin'){
            return res.redirect("/admin");
        }
        return res.redirect("/dashboard");
    } catch(err){
        return res.redirect("/login");
    }
}

async function adminChecker(req, res, next){
    if(req.user.role === "admin"){
        return next();
    }
    return res.redirect("/dashboard");
}

async function homeCheck(req, res, next){
    const s_id = req.cookies?.S_id;
    if(!s_id){
        return next();
    }
    try{
        const user = getUser(s_id);
        if(!user){
            return next();
        }
        req.user = user;
        return res.redirect("/dashboard");
    } catch(err){
        return next();
    }
}

module.exports = {
    sessionChecker1,
    sessionChecker2,
    adminChecker,
    homeCheck
};