import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../database/models/user";
import bcrypt from "bcryptjs";

const createUser = async (req: Request, res: Response, next: NextFunction) => {

    const {name, email, password} = req.body;

    if(!name) {
        return res.status(422).json({ msg: 'The name is mandatory!' });
    }

    if(!email) {
        return res.status(422).json({ msg: 'The e-mail is mandatory!' });
    }

    if(!password) {
        return res.status(422).json({ msg: 'The password is mandatory!' });
    }

    // check if user exists
    const userExists = await User.findOne({ email: email });

    if(userExists) {
        return res.status(422).json({ msg: `The e-mail already exists! Please, choose other!` });
    }

    // create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        email: email,
        password: passwordHash
    });

    try{
        await user
        .save()
        .then(() => 

            res.status(201).json({
                msg: 'User created successfully!',
            }));

    }catch(error) {
        res.status(500).json({
            msg: 'Sorry, occurred an error! Try again later!'
        });
    }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try{

        return await User.find().then((user) => {
            user
            ?
            res.status(200).json({
                user
            })
            :
            res.status(404).json({
                msg: 'The list of users are empty!'
            });
        });

    }catch(error) {
        res.status(500).json({
            msg: 'Sorry, occurred an error! Try again later!'
        });
    }
};

export default { createUser, getAllUsers };