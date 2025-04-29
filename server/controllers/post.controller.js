import sharp from "sharp";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import cloudinary from "../utils/cloudinary.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!caption) {
      return res.status(400).json({
        message: "Caption is required",
        success: false,
      });
    }

    let imageUrl = null;

    if (image) {
      // If there's an image, process and upload it
      const optimizeImageBuffer = await sharp(image.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();

      const fileUri = `data:image/jpeg;base64,${optimizeImageBuffer.toString(
        "base64"
      )}`;
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      imageUrl = cloudResponse.secure_url; // Get image URL from Cloudinary
    }

    // Create the post (with or without image)
    const post = await Post.create({
      caption,
      image: imageUrl || "", // If no image, store an empty string
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New Post Added",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error, please try again later",
      success: false,
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const userId = req.id; // Ensure this is coming from authentication middleware
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    // Fetch the user's following list
    const user = await User.findById(userId).select("followings");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Combine followings and the user's own ID
    const userAndFollowings = [...user.followings, userId];

    // Get posts by authors in the combined list
    const posts = await Post.find({ author: { $in: userAndFollowings } })
      .sort({ createdAt: -1 }) // Sort posts by most recent
      .populate({ path: "author", select: "username name profilePicture" }) // Populate post authors
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } }, // Sort comments by most recent
        populate: {
          path: "author",
          select: "username name profilePicture", // Populate comment authors
        },
      });

    // Return the posts
    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username, profilePicture",
      })
      .populate({ path: "author", select: "username, profilePicture" })
      .populate({
        path: "Comment",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username, profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // like logic started
    await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
    await post.save();

    const user = await User.findById(likeKrneWalaUserKiId).select(
      "username profilePicture"
    );
    const postOwnerId = post.author.toString();
    if (postOwnerId !== likeKrneWalaUserKiId) {
      //emit notification event
      const notification = {
        type: "like",
        userId: likeKrneWalaUserKiId,
        userDetails: user,
        postId,
        message: "liked your Post",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    //implement socket io for realtime notification

    return res.status(201).json({ message: "Post Liked", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const likeKrnewalauserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "post not found", success: false });
    //like logic
    await post.updateOne({ $pull: { likes: likeKrnewalauserId } });
    await post.save();

    //implement socket io for realtime notification

    const user = await User.findById(likeKrnewalauserId).select(
      "username profilePicture"
    );
    const postOwnerId = post.author.toString();
    if (postOwnerId !== likeKrnewalauserId) {
      //emit notification event
      const notification = {
        type: "dislike",
        userId: likeKrnewalauserId,
        userDetails: user,
        postId,
        message: "dislike your Post",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    return res.status(201).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKrneWalaUserKiId = req.id;

    const { text } = req.body;

    const post = await Post.findById(postId);

    if (!text)
      return res
        .status(400)
        .json({ message: "text is required", success: false });

    const comment = await Comment.create({
      text,
      author: commentKrneWalaUserKiId,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username name profilePicture",
    });

    post.comments.push(comment?._id);
    await post.save();

    return res.status(201).json({
      message: "Comment Added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getAllCommentsOfPost = () => {
  try {
    const postId = req.params.id;
    const Comment = Post.find({ post: postId }).populate(
      "author",
      "username",
      "profilePicture"
    );
    if (!Comment) {
      return res
        .status(404)
        .json({ message: "No Comment found", success: false });
    }
    return res.status(200).json({ success: true, Comment });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    if (post.author.toString() !== authorId)
      return res.status(403).json({ message: "Unauthorized" });

    await Post.findByIdAndDelete(postId);

    // remove post id from the users post

    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    //delete associated Comment

    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "Post Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const bookMarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      // already bookmarked -> remove from the bookmark
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "Post removed from bookmark",
        success: true,
      });
    } else {
      // bookmark krna pdega
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ type: "saved", message: "Post bookmarked", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
export const getAllPostExplore = async (req, res) => {
  try {
    const currentUserId = req.id; // Correct user ID

    // Fetch posts from all users except the logged-in user
    const posts = await Post.find({ author: { $ne: currentUserId } }) // Exclude logged-in user's posts
      .sort({ createdAt: -1 }) // Sort posts by creation date in descending order
      .populate({ path: "author", select: "username name profilePicture" }) // Populate author details
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } }, // Sort comments by creation date in descending order
        populate: {
          path: "author",
          select: "username name profilePicture", // Populate comment author's details
        },
      });

    return res.status(200).json({
      success: true,
      posts, // Return the posts from other users
    });
  } catch (error) {
    console.error("Error fetching explore posts:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
