import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/hashPassword.mjs";
// use to create a user session and store it 
passport.serializeUser((user,done) =>{
    console.log(`Inside SerializeUser Object`);
    console.log(user);
    done(null,user.id);// we pass user ID that are passed to deserializeUser as an argument
});

// use to retreive user using its ID from the already created session
passport.deserializeUser(async (id , done) => {
    console.log(`Inside Desiralize Object`);
    console.log(`Deserialize User Id : ${id}`);
    try {
        const findUser = await User.findById(id);
        if (!findUser) {
            throw new Error("user not found");
        }
        done(null,findUser);
    } catch (err) {
        done(err,null);
    }
});
export default passport.use(
    // {usernameField:"email"} -> strategy option, first parameter passed to Strategy object (optional)
    new Strategy(async (username , password , done) => {
        try {
            const findUser = await User.findOne({username:username});
            if (!findUser) {
                throw new Error("user not found");
            }
            // comparePassword(password,findUser.password) -> added in hashPass-09.mjs
            // findUser.password != password --> comparing normal string password
            if (!comparePassword(password,findUser.password)) {
                throw new Error("Bad Credential");
            }
            done(null,findUser);
        } catch (error) {
            done(error,null);
        }
    })
);