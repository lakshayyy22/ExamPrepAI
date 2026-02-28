const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("./db");
const {setUser} = require("../services/auth");

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  passReqToCallback: true   
},
async (req, accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const name = profile.displayName;

    const mode = req.query.state;  // signup OR login

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if(mode === "signup"){

      if(result.rows.length > 0){
        return done(null, false, { message: "User already exists" });
      }

      const newUser = await pool.query(
        "INSERT INTO users(email, username) VALUES($1,$2) RETURNING *",
        [email, name]
      );

      return done(null, newUser.rows[0]);
    }

    if(mode === "login"){

      if(result.rows.length === 0){
        return done(null, false, { message: "User not registered" });
      }

      return done(null, result.rows[0]);
    }

  } catch(err){
    return done(err, null);
  }
}));