import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice";

const CommentsModal = ({ closeCommentModal }) => {
  const [text, setText] = useState("");
  const { selectedPost } = useSelector((store) => store.posts); // Get selected post
  const [comment, setComment] = useState([]);
  const { posts } = useSelector((store) => store.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const eventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);
        const updatedPostData = posts.map((p) =>
          p?._id === selectedPost?._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div
      onClick={closeCommentModal}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        className={`bg-white rounded-lg overflow-hidden w-full max-w-3xl mx-4 md:mx-0 flex flex-col ${
          selectedPost?.image ? "md:flex-row" : "md:flex-col"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent modal close on click inside
      >
        {/* Image Section - Only Render if Post has an Image */}
        {selectedPost?.image && (
          <div className="w-full md:w-1/2">
            <img
              src={selectedPost?.image}
              alt="Post"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Comments Section */}
        <div
          className={`w-full ${
            selectedPost?.image ? "md:w-1/2" : "md:w-full"
          } flex flex-col`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <img
                src={
                  selectedPost?.author.profilePicture || "default-profile.png"
                }
                alt="Author"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h1 className="ml-2 font-semibold">
                  {selectedPost?.author.name || "Unknown User"}
                </h1>
                <p className="ml-2 text-gray-500">
                  @{selectedPost?.author.username || "Unknown User"}
                </p>
              </div>
            </div>
            <button
              className="text-gray-900 hover:text-gray-700 p-2 rounded-full hover:bg-gray-300"
              onClick={closeCommentModal}
            >
              <IoMdClose />
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            {comment?.map((c, index) => (
              <div key={index} className="flex items-start space-x-3">
                <img
                  src={c.author.profilePicture || "default-profile.png"}
                  alt="Commenter"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h1 className="font-semibold">{c.author.name}</h1>
                  <p className="text-gray-500">@{c.author.username}</p>
                </div>
                <p>{c?.text}</p>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <img
                src={
                  selectedPost?.author.profilePicture || "default-profile.png"
                }
                alt="Your Profile"
                className="w-10 h-10 rounded-full"
              />
              <input
                value={text}
                onChange={eventHandler}
                type="text"
                placeholder="Add a comment..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
              />
              <button
                disabled={!text.trim()}
                onClick={commentHandler}
                className="text-blue-500 font-semibold"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
