import { useContext } from "react";
import { useSelector } from "react-redux";
import myContext from "./Context/data/myContext";
import Post from "./Post";

const Posts = () => {
  const { posts } = useSelector((store) => store.posts);
  const context = useContext(myContext);
  const { mode } = context;

  if (!Array.isArray(posts)) {
    console.error("Expected posts to be an array, but got:", posts);
    return (
      <div className="text-center text-red-500">Failed to load posts.</div>
    );
  }

  return (
    <div
      className={`w-full max-w-3xl mx-auto flex flex-col p-4 md:ml-[20%] ${
        mode === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {posts?.map((post) => (
        <div
          key={post?._id}
          className={`shadow border-r border-l border-b p-4 ${
            mode === "dark" ? "bg-black text-gray-200" : "bg-white text-black"
          }`}
        >
          <Post post={post} mode={mode} />
        </div>
      ))}
    </div>
  );
};

export default Posts;
