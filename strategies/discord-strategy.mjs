import passport from "passport";
import { Strategy } from "passport-discord";
import {DiscordUser} from '../mongoose/schemas/discord-user.mjs'

passport.serializeUser((user,done) =>{
    return done(null,user.id);// we pass user ID that are passed to deserializeUser as an argument
});

// use to retreive user using its ID from the already created session
passport.deserializeUser(async (id , done) => {
    try {
        const findUser = await DiscordUser.findById(id);
        if (!findUser) {
            throw new Error("user not found");
        }
        return done(null,findUser);
    } catch (err) {
        done(err,null);
    }
});


export default passport.use(new Strategy({
    clientID : '1246725955310059550',
    clientSecret : 'szx4cst7ChyoJpUiZ1QN9b7WQcFcmz81',
    callbackURL: 'http://localhost:3000/api/auth/discord/redirect',
    scope : ["identify" , "email" , "guilds"]
}, 
async (accessToken,refreshToken,profile,done) =>{
    let findUser;

    try{
        findUser = await DiscordUser.findOne({DiscordID : profile.id});
    } catch (err) {
        return done(err,null);
    }

    try{
        if (!findUser) {
            const newUser = new DiscordUser({
                username : profile.username,
                DiscordID : profile.id,
                email : profile.email
            });
            const savedUser = await newUser.save();
            return done(null , savedUser);
        }
        return done(null , findUser);
    
    } catch (err) {
        console.log(err)
        return done(err,null);
    }
    
}));