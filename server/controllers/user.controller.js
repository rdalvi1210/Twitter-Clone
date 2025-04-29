import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if required fields are present
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required (username, email, password)",
                success: false
            });
        }

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists with this email address",
                success: false
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Return success message
        return res.status(200).json({
            message: "Account created successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({
            message: "Internal server error. Please try again later.",
            success: false
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false
            });
        }

        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Incorrect Email or Password",
                success: false
            });
        }

        // Validate password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect Email or Password",
                success: false
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );

        // Populate posts
        const populatePost = user.posts && Array.isArray(user.posts)
            ? await Promise.all(
                  user.posts.map(async (postId) => {
                      const post = await Post.findById(postId);
                      if (post && post.author && post.author.equals(user._id)) {
                          return post;
                      }
                      return null;
                  })
              )
            : [];

        // Filter out null posts
        const validPosts = populatePost.filter(Boolean);

        // Prepare user object for response
        const userResponse = {
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.followings,
            posts: validPosts
        };

        // Set cookie and respond
        return res
            .cookie('token', token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            })
            .json({
                message: `Welcome back, ${user.username}!`,
                success: true,
                user: userResponse
            });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};


export const logout = async (req, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: "Logout Successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        // Fetch the user data
        const user = await User.findById(userId).populate({path:"posts", createdAt:-1}).populate('bookmarks'); // Exclude password field if stored

        // Check if user exists
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Return the user data
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred",
            success: false
        });
    }
};


export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender, name } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };
        if (bio) user.bio = bio;
        if (name) user.name = name;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};

export const getSuggestedUser = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(404).json({
                message: "Currently Don not have any users"
            })
        }
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error)
    }
}

export const followOrUnfollow = async (req, res) => {
    try {
      const followKrneWala = req.id; // The user who is performing the follow/unfollow
      const jiskoFollowKrunga = req.params.id; // The user to be followed/unfollowed

      // Check if the user is trying to follow/unfollow themselves
      if (followKrneWala === jiskoFollowKrunga) {
        return res.status(400).json({
          message: "You cannot follow/unfollow yourself",
          success: false,
        });
      }

      // Find the users in the database
      const [user, targetUser] = await Promise.all([
        User.findById(followKrneWala),
        User.findById(jiskoFollowKrunga),
      ]);

      if (!user || !targetUser) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        });
      }

      // Check if the user is already following the target user
      const isFollowing = user.followings.includes(jiskoFollowKrunga);

      if (isFollowing) {
        // Unfollow logic
        await Promise.all([
          User.updateOne(
            { _id: followKrneWala },
            { $pull: { followings: jiskoFollowKrunga } }
          ),
          User.updateOne(
            { _id: jiskoFollowKrunga },
            { $pull: { followers: followKrneWala } }
          ),
        ]);
        return res
          .status(200)
          .json({ message: "Unfollowed successfully", success: true });
      } else {
        // Follow logic
        await Promise.all([
          User.updateOne(
            { _id: followKrneWala },
            { $push: { followings: jiskoFollowKrunga } }
          ),
          User.updateOne(
            { _id: jiskoFollowKrunga },
            { $push: { followers: followKrneWala } }
          ),
        ]);
        return res
          .status(200)
          .json({ message: "Followed successfully", success: true });
      }
    } catch (error) {
      console.error("Error in followOrUnfollow function:", error);
      return res.status(500).json({
        message: "An error occurred. Please try again.",
        success: false,
      });
    }
  };













  
  export const searchUsers = async (req, res) => {
    try {
      const { search } = req.query;
      console.log("Search Query:", search); // Debugging line: log the search query

      if (!search || search.trim().length === 0) {
        return res.status(200).json({ users: [] });
      }

      // Search users based on name or username (case-insensitive)
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } }, // Search in name
          { username: { $regex: search, $options: 'i' } } // Search in username
        ]
      }).select('username name profilePicture');

      console.log("Users Found:", users); // Debugging line: log the found users

      return res.status(200).json({ users });
    } catch (error) {
      console.error("Error searching users:", error); // Log the error
      return res.status(500).json({
        message: "Server error, please try again later",
        success: false,
      });
    }
  };
