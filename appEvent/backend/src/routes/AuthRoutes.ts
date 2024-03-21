import express from "express";
import authController from '../controller/AuthController';

const router = express.Router();

router.post('/loginUser', authController.loginUser);

export = router;