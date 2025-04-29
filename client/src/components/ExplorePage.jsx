import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Avatar from "react-avatar";
import { BsBookmark } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { FiHeart, FiMessageCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setselectedPost } from "../redux/postSlice";
import CommentsModal from "./CommentsModal";
import myContext from "./Context/data/myContext";

const ExplorePage = () => {
  const [isModalComment, setIsModalComment] = useState(false);
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.posts);
  const { userProfile } = useSelector((store) => store.auth);
  const context = useContext(myContext);
  const { mode } = context;

  const openCommentModal = () => setIsModalComment(true);
  const closeCommentModal = () => setIsModalComment(false);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/post/getallpostexplore",
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setPosts(res.data.posts));
      }
    } catch (error) {
      console.error("Failed to load posts.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      {isModalComment && (
        <CommentsModal closeCommentModal={closeCommentModal} />
      )}
      {posts?.map((post) => (
        <div
          key={post._id}
          className={`max-w-xl mx-auto p-4 rounded-lg shadow-md mb-8 ${
            mode === "dark" ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          <div className="flex items-start">
            <Avatar
              src={post.author?.profilePicture}
              size="40"
              round
              className="mr-4"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold">{post.author?.name}</span>
                  <span className="text-gray-500">
                    @{post.author?.username}
                  </span>
                  <span className="text-gray-500"> · 2h</span>
                </div>
              </div>
              <p className="mt-2">{post.caption}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="mt-2 rounded-lg w-full h-auto"
                />
              )}
              <div className="flex justify-between items-center mt-4 text-gray-500">
                <div className="flex items-center">
                  {post.likes.includes(userProfile?._id) ? (
                    <FaHeart color="red" className="mr-2" />
                  ) : (
                    <FiHeart className="mr-2" />
                  )}
                  <span>{post.likes.length}</span>
                </div>
                <button
                  onClick={() => {
                    dispatch(setselectedPost(post));
                    openCommentModal();
                  }}
                  className="flex items-center"
                >
                  <FiMessageCircle className="mr-2" size={20} />
                  <span>{post.comments?.length || 0}</span>
                </button>
                <div className="flex items-center">
                  <BsBookmark className="mr-2" size={20} />
                </div>
              </div>

              <div
                className="mt-4 text-sm text-gray-500 cursor-pointer hover:underline"
                onClick={() => {
                  dispatch(setselectedPost(post));
                  openCommentModal();
                }}
              >
                View all {post.comments?.length || 0} comments
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ExplorePage;
