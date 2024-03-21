import { NextFunction, Request, Response } from "express";
import User from "../database/models/user";
import bcrypt from "bcryptjs";

const loginUser = async (req: Request, res: Response, next: NextFunction) => {

    const {email, password} = req.body;

    if(!email) {
        return res.status(422).json({ msg: 'The e-mail is mandatory!' });
    }

    if(!password) {
        return res.status(422).json({ msg: 'The password is mandatory!' });
    }

    // check if user exists
    const userExists = await User.findOne({ email: email });

    if(!userExists) {
        return res.status(404).json({ msg: `User not found!` });
    }

    // check password
    const checkPassword = await bcrypt.compare(password, userExists.password);

    if(!checkPassword) {
        return res.status(422).json({ msg: 'Passwords do not match!'})
    }

    try{
        await res.status(200).json({
            msg: 'Sucessfully login!',
            data: {
                _id: userExists.id.toString(),
                name: userExists.name,
                email: userExists.email,
            }
        });
    }catch(error) {
        res.status(500).json({
            msg: 'Sorry, occurred an error! Try again later!'
        });
    }
};

export default { loginUser };