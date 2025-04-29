import React, { useContext, useState } from "react";
import Avatar from "react-avatar";
import { useGetuserProfile } from "../hooks/useGetuserProfile";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiHeart, FiMessageCircle } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";
import { setuserProfile } from "../redux/authSlice";
import myContext from "./Context/data/myContext";

const Profile = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const userId = params.id;
  useGetuserProfile(userId);
  const { userProfile, user } = useSelector((store) => store.auth);
  const { mode } = useContext(myContext);

  const isLoginUser  = user?._id === userProfile?._id;
  const isFollowing = Array.isArray(userProfile?.followers) && userProfile?.followers.includes(user?._id);
  const [activeTab, setActiveTab] = useState("POSTS");
  const displayPosts = activeTab === "POSTS" ? userProfile?.posts : userProfile?.bookmarks;

  const followUnfollow = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/followOrUnfollow/${userId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedProfile = {
          ...userProfile,
          followers: isFollowing
            ? userProfile.followers.filter((id) => id !== user?._id)
            : [...userProfile.followers, user?._id],
        };

        dispatch(setuserProfile(updatedProfile));
        toast.success(res.data.message);
      } else {
        toast.error("Action failed. Please try again.");
      }
    } catch (error) {
      console.error("Error in followUnfollow function:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className={`min-h-screen flex justify-center ${mode === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className={`w-full max-w-3xl border-x ${mode === 'dark' ? 'border-gray-700' : 'border-gray-300'} p-3`}>
        {/* Profile Header */}
        <div className="relative">
          <img
            src="https://placehold.co/600x200"
            alt="A scenic landscape with mountains"
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-0 left-0 ml-4 mb-4">
            <Avatar
              src={userProfile?.profilePicture}
              size="150"
              round={true}
              name={userProfile?.username}
              className="border-4 border-white"
            />
          </div>
          <div className="absolute bottom-0 right-0 mb-4 mr-4">
            {isLoginUser  ? (
              <Link
                to="/profile/edit"
                className={`px-4 py-2 rounded-full shadow hover:bg-gray-400 ${mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-800'}`}
              >
                Edit Profile
              </Link>
            ) : (
              <button
                onClick={followUnfollow}
                className={`px-4 py-2 rounded-full shadow hover:bg-blue-600 ${mode === 'dark' ? 'bg-blue-800' : 'bg-blue-500 text-white'}`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <h1 className="text-3xl font-bold">{userProfile?.name}</h1>
          <p className="text-gray-500">@{userProfile?.username}</p>

          <div className="flex gap-8 text-center mb-4 mt-4">
            <div>
              <p className="text-xl font-bold">{userProfile?.posts?.length || 0}</p>
              <p className="text-gray-500">Posts</p>
            </div>
            <div>
              <p className="text-xl font-bold">{userProfile?.followers?.length || 0}</p> <p className="text-gray-500">Followers</p>
            </div>
            <div>
              <p className="text-xl font-bold">{userProfile?.followings?.length || 0}</p>
              <p className="text-gray-500">Following</p>
            </div>
          </div>

          <p className="text-gray-600">{userProfile?.bio || "No bio available."}</p>
        </div>

        {/* Tabs Section */}
        <div className="mt-8">
          {/* Toggle Tabs */}
          <div className="flex justify-center gap-8 border-b pb-4 text-gray-500">
            {["POSTS", "BOOKMARKS"].map((tab) => (
              <p
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer font-semibold transition-colors duration-200 ${activeTab === tab ? `${mode === 'dark' ? 'text-white border-b-2 border-white' : 'text-black border-b-2 border-black'}` : `${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}`}
              >
                {tab}
              </p>
            ))}
          </div>

          {/* Display Posts */}
          <div className="">
            {displayPosts?.length > 0 ? (
              displayPosts.map((post) => (
                <div key={post?._id} className="bg-white shadow-md p-4 max-w-2xl mx-auto border-b border-r border-l border-gray-300">
                  <div className="flex items-center space-x-3">
                    {/* User Avatar */}
                    <Avatar src={userProfile?.profilePicture} round={true} size={40}/>
                    {/* Username and time */}
                    <div>
                      <p className="font-semibold text-gray-900">@{userProfile?.username}</p>
                      <p className="text-sm text-gray-500">2m ago</p>
                    </div>
                  </div>
                  <p className="text-gray-800 mt-2">{post?.content}</p>

                  {/* Post Image or Caption */}
                  <div className="mt-4">
                    {post?.image ? (
                      <img
                        src={post?.image || "https://placehold.co/600x400"}
                        alt="Post image"
                        className="rounded-lg w-full h-64 object-cover"
                      />
                    ) : (
                      <p>{post?.caption}</p>
                    )}
                  </div>

                  {/* Interaction Buttons */}
                  <div className="flex items-center mt-4 text-gray-500">
                    <button className="flex items-center mr-4">
                      <FiMessageCircle />
                      <span className="ml-1">{post?.comments?.length || 0}</span>
                    </button>
                    <button className="flex items-center mr-4">
                      <FiHeart />
                      <span className="ml-1">{post?.likes?.length || 0}</span>
                    </button>
                    <button className="flex items-center">
                      <span className="ml-1">{post?.views || 0} Views</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No {activeTab.toLowerCase()} available.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;