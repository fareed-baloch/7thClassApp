
require('dotenv').config()
const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const Users = require('../models/users');


passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done) {
        //db create user 
        let result = await Users.getSingle(profile.id);
        console.log(result.data);
        if(result.data != ''){
            console.log('User Found')
            return done(null, profile);
        }
        else{
          console.log('No user Found')
            let Uservalues = {
            googleid: profile.id,
            name: profile.displayName,
        };

       let result = await Users.create(Uservalues)
        console.log(result);
          return done(null, profile);

        }


      //   let Uservalues = {
      //     googleid: profile.id,
      //     name: profile.displayName,
      //   };

      //  let result = await Users.create(Uservalues)
      //   console.log(result);

    //return done(null, profile);

      //make a function for users and getOne {
      //   if (err) { return done(err,null); }
      // if (!user) { return done(null, false); create a user else{ return done(null, profile);} }
      // if (!user.verifyPassword(password)) { return done(null, false); }
      // return done(null, user); }
      //profile.id
      //progile.displayName

     // return done(null, profile);
  }
));

passport.serializeUser(function(user,done){
    return done(null,user)
})

passport.deserializeUser(function(user,done){
    return done(null,user)
})