const passport = require('passport');
let GoogleStrategy = require('passport-google-oauth2').Strategy;
require("dotenv").config()


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:9001/auth/google/callback",
  scope: ["profile", "email"],
},

  async (request, accessToken, refreshToken, profile, done) => {

    console.log(profile ,"profile     profile");
    //get the user data from google 

    // const newUser = {
    //   googleId: profile.id,
    //   username: profile.displayName,
    //   profile: profile.photos[0].value,
    //   email: profile.emails[0].value,
    //   role: (profile.emails[0].value === "shashanksharma1235999@gmail.com" || profile.emails[0].value === "aman.kumar2k15@gmail.com") ? "super-admin" : null
    // }

    // let user = await UserModelDashboard.findOne({ googleId: profile.id })
    // if (user) {
    //   done(null, user)
    // } else {
    //   // if user is not preset in our database save user data to database.
    //   user = await new UserModelDashboard(newUser);
    //   user.save()
    //   done(null, user)
    // }
    return   done(null, profile)
  }
));

// Serialize user to store in the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser(async (user, done) => {
    done(null, user);
});
