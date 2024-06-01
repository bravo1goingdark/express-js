import bcrypt from 'bcrypt';


export const hashPassword = (password) => {
    const saltRound = 10;
    const salt = bcrypt.genSaltSync(saltRound);
    return bcrypt.hashSync(password,salt);
};

export const comparePassword = (password , hashedPassword) => {
    return bcrypt.compareSync(password,hashedPassword);
}