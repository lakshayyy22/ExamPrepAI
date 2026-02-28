const pool = require("../config/db");
const {setUser} = require("../services/auth")
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

async function loginLocally(req, res){
    const email = req.body.email;
    const password = req.body.password;
    let result = await pool.query(
        "SELECT * FROM users WHERE email = $1",[email]
    );
    if(result.rows.length === 0){
        return res.redirect("login?msg=failed");
    }
    const user = result.rows[0];
    if(!user.password_hash){
        return res.redirect("login?msg=failed");
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if(!isMatch){
        return res.redirect("login?msg=failed");
    }
    const token = setUser(user);
    res.cookie("S_id", token);
    if(user.role === 'admin'){
        return res.redirect("/admin");
    }
    return res.redirect("/dashboard");
}

async function signupLocally(req, res){
    const {email, username, password } = req.body;
    let exists = await pool.query(
        "SELECT * FROM users WHERE email = $1", [email]
    );
    if(exists.rows.length !== 0){
        res.redirect("/login?msg=failed");
    }
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    let user = await pool.query(
        "INSERT INTO users(username, email, password_hash) VALUES($1, $2, $3)",[username, email, hash]
    );
    const token = setUser(user);
    res.cookie("S_id", token);
    return res.redirect("/dashboard");
}

module.exports = {
    loginLocally,
    signupLocally
}