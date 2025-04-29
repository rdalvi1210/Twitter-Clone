import express from "express";
import {
  addComment,
  addNewPost,
  bookMarkPost,
  deletePost,
  dislikePost,
  getAllCommentsOfPost,
  getAllPost,
  getAllPostExplore,
  getUserPost,
  likePost,
} from "../controllers/post.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router
  .route("/addpost")
  .post(isAuthenticated, upload.single("image"), addNewPost);
router.route("/getallpost").get(isAuthenticated, getAllPost);
router.route("/getallpostexplore").get(isAuthenticated, getAllPostExplore);
router.route("/userpost/all").get(isAuthenticated, getUserPost);
router.route("/:id/like").get(isAuthenticated, likePost);
router.route("/:id/dislike").get(isAuthenticated, dislikePost);
router.route("/:id/comment").post(isAuthenticated, addComment);
router.route("/:id/comment/all").post(isAuthenticated, getAllCommentsOfPost);
router.route("/delete/:id").delete(isAuthenticated, deletePost);
router.route("/:id/bookmarks").get(isAuthenticated, bookMarkPost);

export default router;
