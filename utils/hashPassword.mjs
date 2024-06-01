import bcrypt from 'bcrypt';


export const hashPassword = (password) => {
    // saltRound -> number of iterations used by the bcrypt algorithm to generate the salt and hash the password.
    //The higher the number of salt rounds, the more computationally intensive the hashing process becomes, 
    // which increases the time it takes to hash a password.
    const saltRound = 10;
    const salt = bcrypt.genSaltSync(saltRound);// generate the salt 
    return bcrypt.hashSync(password,salt); // return the hashed password 
};

export const comparePassword = (password , hashedPassword) => {
    return bcrypt.compareSync(password,hashedPassword);
}