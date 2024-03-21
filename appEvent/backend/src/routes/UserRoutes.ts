import express from "express";
import userController from './../controller/UserController';

const router = express.Router();

router.post('/createUser', userController.createUser);
router.get('/getAllUsers', userController.getAllUsers);

export = router;