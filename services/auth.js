const jwt = require("jsonwebtoken");

function setUser(user){
    return jwt.sign({id : user.id, email: user.email, role: user.role}, process.env.JWT_KEY);
}

function getUser(token){
    if(!token) return null;
    return jwt.verify(token, process.env.JWT_KEY);
}

module.exports={
    setUser,
    getUser
}