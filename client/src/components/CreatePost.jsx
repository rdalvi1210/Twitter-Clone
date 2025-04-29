import axios from "axios";
import React, { useState } from "react";
import Avatar from "react-avatar";
import toast from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai"; // Add Camera icon from react-icons
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice";
import { readFileAsDataURL } from "../utils/utils";

const CreatePost = ({ setOpenPost }) => {
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false); // State for loading spinner
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.posts);
  const dispatch = useDispatch();

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const imageURL = await readFileAsDataURL(file);
      setImagePreview(imageURL);
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true); // Show spinner
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) {
      formData.append("image", image);
    }
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
      }
      setOpenPost(false); // Close the modal after submission
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post.");
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  return (
    <div
      onClick={() => setOpenPost(false)} // Close modal when clicking outside
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {/* Avatar */}
            <Avatar src={user?.profilePicture} size="40" round={true} />
            {/* Username */}
            <span className="text-lg font-semibold">{user.username}</span>
          </div>
          <button
            onClick={() => setOpenPost(false)} // Close modal on button click
            className="text-gray-500 hover:text-black"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Image Upload (using icon instead of label) */}
        <div className="mb-4 relative">
          {/* Camera Icon */}
          <label
            htmlFor="imageUpload"
            className="absolute inset-0 flex justify-center items-center cursor-pointer"
          >
            <AiOutlineCamera size={40} className="text-gray-400" />
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          {imagePreview && (
            <div className="relative mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  setImage("");
                  setImagePreview("");
                }}
                className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1"
              >
                <FaTimes size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Caption Input */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        ></textarea>

        {/* Submit Button with Spinner */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            "Post"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
