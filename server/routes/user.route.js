import express from "express";
import { register, login, logout, getProfile, editProfile, getSuggestedUser, followOrUnfollow, searchUsers } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(register);    
router.route("/login").post(login);    
router.route("/logout").get(logout);    
router.route("/:id/profile").get(isAuthenticated, getProfile);    
router.route("/profile/edit").post(isAuthenticated, upload.single('profilePhoto'), editProfile);    
router.route("/suggestedusers").get(isAuthenticated, getSuggestedUser);    
router.route("/followOrUnfollow/:id").get(isAuthenticated, followOrUnfollow);    
router.route("/search").get(isAuthenticated, searchUsers);
 

export default router;